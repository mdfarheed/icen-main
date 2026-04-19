"""ICEN — International Council for Emerging Nations
FastAPI backend: applications, admin auth, admin dashboard, email, blog, research papers.
"""
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import re
import logging
import asyncio
import uuid
import base64
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Literal

import bcrypt
import jwt
import resend
from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File
from fastapi.responses import Response
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, ConfigDict, EmailStr

# ---------- Config ----------
MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALGORITHM = "HS256"
JWT_EXP_HOURS = 24

ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@icen.org")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "ICEN@Admin2026")

RESEND_API_KEY = os.environ.get("RESEND_API_KEY")
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")
ADMIN_NOTIFY_EMAIL = os.environ.get("ADMIN_NOTIFY_EMAIL")
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:3000")

if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("icen")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

app = FastAPI(title="ICEN API", version="1.1.0")
api_router = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)


# ---------- Utils ----------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def create_access_token(user_id: str, email: str, role: str) -> str:
    payload = {
        "sub": user_id, "email": email, "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXP_HOURS),
        "iat": datetime.now(timezone.utc), "type": "access",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_current_admin(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> dict:
    if not credentials or not credentials.credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.users.find_one({"id": payload.get("sub")}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Forbidden")
    return user


def slugify(s: str) -> str:
    s = (s or "").lower().strip()
    s = re.sub(r"[^a-z0-9\s-]", "", s)
    s = re.sub(r"[\s_-]+", "-", s).strip("-")
    return s or str(uuid.uuid4())[:8]


# ---------- Models ----------
MembershipTier = Literal["observer", "fellow", "council", "founding"]
AppStatus = Literal["pending", "reviewing", "approved", "rejected"]


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class ApplicationCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=40)
    country: str = Field(..., min_length=2, max_length=80)
    organization: Optional[str] = Field(None, max_length=160)
    role_title: Optional[str] = Field(None, max_length=120)
    membership_tier: MembershipTier = "fellow"
    focus_pillars: List[str] = Field(default_factory=list)
    motivation: str = Field(..., min_length=30, max_length=2000)
    linkedin: Optional[str] = Field(None, max_length=300)


class Application(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    full_name: str
    email: str
    phone: Optional[str] = None
    country: str
    organization: Optional[str] = None
    role_title: Optional[str] = None
    membership_tier: str
    focus_pillars: List[str] = []
    motivation: str
    linkedin: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime


class StatusUpdate(BaseModel):
    status: AppStatus


class BlogUpsert(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    excerpt: str = Field(..., min_length=10, max_length=400)
    body: str = Field(..., min_length=30)
    cover_image: Optional[str] = None
    author: str = Field(default="ICEN Secretariat")
    tags: List[str] = Field(default_factory=list)
    published: bool = True


class ResearchUpsert(BaseModel):
    title: str = Field(..., min_length=3, max_length=240)
    abstract: str = Field(..., min_length=20, max_length=800)
    body: str = Field(..., min_length=30)
    authors: List[str] = Field(default_factory=list)
    pillar: Optional[str] = None
    pdf_url: Optional[str] = None
    cover_image: Optional[str] = None
    published: bool = True


# ---------- Email ----------
def _send_resend_email_sync(to_email: str, subject: str, html: str) -> Optional[str]:
    if not RESEND_API_KEY:
        logger.warning("RESEND_API_KEY missing — skipping email to %s", to_email)
        return None
    try:
        res = resend.Emails.send({
            "from": f"ICEN <{SENDER_EMAIL}>",
            "to": [to_email], "subject": subject, "html": html,
        })
        return res.get("id") if isinstance(res, dict) else None
    except Exception as e:
        logger.error("Resend email failed to %s: %s", to_email, e)
        return None


async def send_email_async(to_email: str, subject: str, html: str) -> Optional[str]:
    return await asyncio.to_thread(_send_resend_email_sync, to_email, subject, html)


def build_applicant_email(app_doc: dict) -> str:
    return f"""
    <div style="font-family:-apple-system,Helvetica,Arial,sans-serif;background:#F7F5EF;padding:40px 0;color:#0A1628">
      <table width="600" align="center" cellpadding="0" cellspacing="0" style="margin:0 auto;background:#FFFFFF;border:1px solid #E6E1D5;overflow:hidden">
        <tr><td style="padding:32px 40px;border-bottom:1px solid #E6E1D5">
          <div style="font-family:Georgia,'Playfair Display',serif;font-size:22px;letter-spacing:2px;color:#0A1628">ICEN</div>
          <div style="font-size:11px;letter-spacing:3px;color:#0057FF;margin-top:4px;text-transform:uppercase">International Council for Emerging Nations</div>
        </td></tr>
        <tr><td style="padding:36px 40px">
          <h1 style="font-family:Georgia,serif;font-size:26px;color:#0A1628;margin:0 0 16px">Application Received</h1>
          <p style="font-size:15px;line-height:1.7;color:#334155;margin:0 0 16px">Dear {app_doc['full_name']},</p>
          <p style="font-size:15px;line-height:1.7;color:#334155;margin:0 0 16px">
            Thank you for applying to the International Council for Emerging Nations. Your application for the
            <strong style="color:#0A1628">{app_doc['membership_tier'].title()}</strong> track has been received and is under review by our Secretariat.
          </p>
          <p style="font-size:15px;line-height:1.7;color:#334155;margin:0 0 24px">You will hear from us within 7–10 business days.</p>
          <div style="border-left:2px solid #0057FF;padding:8px 16px;margin:24px 0;color:#334155;font-style:italic">
            "The world does not wait. Neither should you."
          </div>
          <p style="font-size:13px;color:#6B7280;margin:24px 0 0">Reference ID: {app_doc['id']}</p>
        </td></tr>
        <tr><td style="padding:20px 40px;background:#F7F5EF;font-size:12px;color:#6B7280">
          ICEN Secretariat — A Global Council Where Emerging Nations Shape the Future Together.
        </td></tr>
      </table>
    </div>
    """


def build_admin_email(app_doc: dict) -> str:
    pillars = ", ".join(app_doc.get("focus_pillars", [])) or "—"
    return f"""
    <div style="font-family:-apple-system,Helvetica,Arial,sans-serif;background:#FFFFFF;padding:24px;color:#0A1628">
      <h2 style="font-family:Georgia,serif;color:#0A1628;margin:0 0 12px">New ICEN Membership Application</h2>
      <table cellpadding="6" style="font-size:14px;color:#334155;border-collapse:collapse">
        <tr><td style="color:#6B7280">Name</td><td>{app_doc['full_name']}</td></tr>
        <tr><td style="color:#6B7280">Email</td><td>{app_doc['email']}</td></tr>
        <tr><td style="color:#6B7280">Phone</td><td>{app_doc.get('phone') or '—'}</td></tr>
        <tr><td style="color:#6B7280">Country</td><td>{app_doc['country']}</td></tr>
        <tr><td style="color:#6B7280">Organization</td><td>{app_doc.get('organization') or '—'}</td></tr>
        <tr><td style="color:#6B7280">Role</td><td>{app_doc.get('role_title') or '—'}</td></tr>
        <tr><td style="color:#6B7280">Tier</td><td>{app_doc['membership_tier']}</td></tr>
        <tr><td style="color:#6B7280">Pillars</td><td>{pillars}</td></tr>
        <tr><td style="color:#6B7280">LinkedIn</td><td>{app_doc.get('linkedin') or '—'}</td></tr>
      </table>
      <p style="margin-top:16px;color:#334155;font-size:14px"><strong>Motivation:</strong><br>{app_doc['motivation']}</p>
      <p style="margin-top:20px;font-size:12px;color:#6B7280">Reference ID: {app_doc['id']}</p>
    </div>
    """


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"service": "ICEN API", "status": "ok"}


@api_router.get("/stats")
async def public_stats():
    total = await db.applications.count_documents({})
    return {"nations": 50, "pillars": 12, "regions": 8, "members": 10000 + total}


# ---- Applications ----
@api_router.post("/applications", response_model=Application)
async def create_application(payload: ApplicationCreate):
    now = datetime.now(timezone.utc)
    doc = {
        "id": str(uuid.uuid4()),
        **payload.model_dump(),
        "status": "pending",
        "created_at": now.isoformat(),
        "updated_at": now.isoformat(),
    }
    await db.applications.insert_one(doc.copy())

    async def _notify():
        try:
            await send_email_async(doc["email"], "ICEN — Application Received", build_applicant_email(doc))
            if ADMIN_NOTIFY_EMAIL:
                await send_email_async(
                    ADMIN_NOTIFY_EMAIL,
                    f"New ICEN Application — {doc['full_name']} ({doc['country']})",
                    build_admin_email(doc),
                )
        except Exception as e:
            logger.error("Email notification failed: %s", e)

    asyncio.create_task(_notify())

    return Application(
        id=doc["id"], full_name=doc["full_name"], email=doc["email"], phone=doc.get("phone"),
        country=doc["country"], organization=doc.get("organization"), role_title=doc.get("role_title"),
        membership_tier=doc["membership_tier"], focus_pillars=doc["focus_pillars"],
        motivation=doc["motivation"], linkedin=doc.get("linkedin"),
        status=doc["status"], created_at=now, updated_at=now,
    )


# ---- Auth ----
@api_router.post("/auth/login", response_model=LoginResponse)
async def login(payload: LoginRequest):
    email = payload.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(user["id"], user["email"], user.get("role", "admin"))
    safe_user = {"id": user["id"], "email": user["email"], "name": user.get("name"), "role": user.get("role")}
    return LoginResponse(access_token=token, user=safe_user)


@api_router.get("/auth/me")
async def me(current: dict = Depends(get_current_admin)):
    return current


# ---- Admin: Applications ----
@api_router.get("/admin/applications")
async def list_applications(current: dict = Depends(get_current_admin), status_filter: Optional[str] = None):
    query = {}
    if status_filter and status_filter in ("pending", "reviewing", "approved", "rejected"):
        query["status"] = status_filter
    cursor = db.applications.find(query, {"_id": 0}).sort("created_at", -1)
    items = await cursor.to_list(length=500)
    return {"items": items, "count": len(items)}


@api_router.patch("/admin/applications/{app_id}/status")
async def update_status(app_id: str, payload: StatusUpdate, current: dict = Depends(get_current_admin)):
    now = datetime.now(timezone.utc).isoformat()
    result = await db.applications.find_one_and_update(
        {"id": app_id}, {"$set": {"status": payload.status, "updated_at": now}},
        projection={"_id": 0}, return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Application not found")
    return result


@api_router.get("/admin/stats")
async def admin_stats(current: dict = Depends(get_current_admin)):
    pipeline = [{"$group": {"_id": "$status", "count": {"$sum": 1}}}]
    agg = await db.applications.aggregate(pipeline).to_list(length=20)
    by_status = {row["_id"]: row["count"] for row in agg}
    total = await db.applications.count_documents({})
    blog_total = await db.blog.count_documents({})
    research_total = await db.research.count_documents({})
    return {
        "total": total,
        "pending": by_status.get("pending", 0),
        "reviewing": by_status.get("reviewing", 0),
        "approved": by_status.get("approved", 0),
        "rejected": by_status.get("rejected", 0),
        "blog_posts": blog_total,
        "research_papers": research_total,
    }


# ---- Media (image upload) ----
MAX_UPLOAD_BYTES = 5 * 1024 * 1024  # 5MB
ALLOWED_IMAGE_MIME = {"image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif", "image/svg+xml"}


@api_router.post("/admin/upload")
async def upload_media(file: UploadFile = File(...), current: dict = Depends(get_current_admin)):
    if file.content_type not in ALLOWED_IMAGE_MIME:
        raise HTTPException(status_code=400, detail=f"Unsupported type: {file.content_type}")
    data = await file.read()
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=400, detail="File too large (max 5MB)")
    if len(data) == 0:
        raise HTTPException(status_code=400, detail="Empty file")
    media_id = str(uuid.uuid4())
    await db.media.insert_one({
        "id": media_id,
        "content_type": file.content_type,
        "data": base64.b64encode(data).decode("ascii"),
        "size": len(data),
        "filename": file.filename,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "uploaded_by": current.get("email"),
    })
    url = f"{FRONTEND_URL.rstrip('/')}/api/media/{media_id}"
    return {"id": media_id, "url": url, "size": len(data), "content_type": file.content_type}


@api_router.get("/media/{media_id}")
async def get_media(media_id: str):
    doc = await db.media.find_one({"id": media_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Not found")
    return Response(
        content=base64.b64decode(doc["data"]),
        media_type=doc["content_type"],
        headers={"Cache-Control": "public, max-age=31536000, immutable"},
    )


# ---- Blog ----
async def _unique_slug(collection, base: str) -> str:
    s = slugify(base)
    candidate = s
    i = 2
    while await collection.find_one({"slug": candidate}):
        candidate = f"{s}-{i}"
        i += 1
    return candidate


@api_router.get("/blog")
async def list_blog(limit: int = 24):
    cursor = db.blog.find({"published": True}, {"_id": 0}).sort("published_at", -1)
    items = await cursor.to_list(length=min(limit, 100))
    return {"items": items, "count": len(items)}


@api_router.get("/blog/{slug}")
async def get_blog(slug: str):
    item = await db.blog.find_one({"slug": slug, "published": True}, {"_id": 0})
    if not item:
        raise HTTPException(status_code=404, detail="Post not found")
    return item


@api_router.post("/admin/blog")
async def create_blog(payload: BlogUpsert, current: dict = Depends(get_current_admin)):
    now = datetime.now(timezone.utc).isoformat()
    doc = {
        "id": str(uuid.uuid4()),
        "slug": await _unique_slug(db.blog, payload.title),
        **payload.model_dump(),
        "published_at": now,
        "created_at": now,
        "updated_at": now,
    }
    await db.blog.insert_one(doc.copy())
    doc.pop("_id", None)
    return doc


@api_router.get("/admin/blog")
async def admin_list_blog(current: dict = Depends(get_current_admin)):
    cursor = db.blog.find({}, {"_id": 0}).sort("created_at", -1)
    items = await cursor.to_list(length=500)
    return {"items": items, "count": len(items)}


@api_router.patch("/admin/blog/{post_id}")
async def update_blog(post_id: str, payload: BlogUpsert, current: dict = Depends(get_current_admin)):
    now = datetime.now(timezone.utc).isoformat()
    updates = {**payload.model_dump(), "updated_at": now}
    result = await db.blog.find_one_and_update({"id": post_id}, {"$set": updates}, projection={"_id": 0}, return_document=True)
    if not result:
        raise HTTPException(status_code=404, detail="Post not found")
    return result


@api_router.delete("/admin/blog/{post_id}")
async def delete_blog(post_id: str, current: dict = Depends(get_current_admin)):
    res = await db.blog.delete_one({"id": post_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"ok": True}


# ---- Research ----
@api_router.get("/research")
async def list_research(limit: int = 24):
    cursor = db.research.find({"published": True}, {"_id": 0}).sort("published_at", -1)
    items = await cursor.to_list(length=min(limit, 100))
    return {"items": items, "count": len(items)}


@api_router.get("/research/{slug}")
async def get_research(slug: str):
    item = await db.research.find_one({"slug": slug, "published": True}, {"_id": 0})
    if not item:
        raise HTTPException(status_code=404, detail="Paper not found")
    return item


@api_router.post("/admin/research")
async def create_research(payload: ResearchUpsert, current: dict = Depends(get_current_admin)):
    now = datetime.now(timezone.utc).isoformat()
    doc = {
        "id": str(uuid.uuid4()),
        "slug": await _unique_slug(db.research, payload.title),
        **payload.model_dump(),
        "published_at": now,
        "created_at": now,
        "updated_at": now,
    }
    await db.research.insert_one(doc.copy())
    doc.pop("_id", None)
    return doc


@api_router.get("/admin/research")
async def admin_list_research(current: dict = Depends(get_current_admin)):
    cursor = db.research.find({}, {"_id": 0}).sort("created_at", -1)
    items = await cursor.to_list(length=500)
    return {"items": items, "count": len(items)}


@api_router.patch("/admin/research/{paper_id}")
async def update_research(paper_id: str, payload: ResearchUpsert, current: dict = Depends(get_current_admin)):
    now = datetime.now(timezone.utc).isoformat()
    updates = {**payload.model_dump(), "updated_at": now}
    result = await db.research.find_one_and_update({"id": paper_id}, {"$set": updates}, projection={"_id": 0}, return_document=True)
    if not result:
        raise HTTPException(status_code=404, detail="Paper not found")
    return result


@api_router.delete("/admin/research/{paper_id}")
async def delete_research(paper_id: str, current: dict = Depends(get_current_admin)):
    res = await db.research.delete_one({"id": paper_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Paper not found")
    return {"ok": True}


# ---------- Seed content ----------
SEED_BLOG = [
    {
        "title": "Why the Rising World Needs Its Own Institution",
        "excerpt": "A case for ICEN as the architecture of emerging-world consensus in a decoupling century.",
        "body": "The postwar order was designed in rooms our nations did not sit in. As the center of economic and demographic gravity shifts South and East, the institutions we inherited increasingly feel like furniture from a previous century — beautiful, unmovable, wrong-sized. ICEN is not a replacement for that order. It is an invitation to co-author the next one.\n\nThe question is not whether emerging nations deserve a seat at the existing table. It is whether the table itself still describes the world. We believe it does not. And so — quietly, carefully, institutionally — we are building another.\n\nFounding nations will not be rewarded for loudness. They will be remembered for durability. The ICEN Secretariat is in Geneva. The work happens in capitals across 50 emerging states.",
        "cover_image": "https://images.unsplash.com/photo-1496715976403-7e36dc43f17b?auto=format&fit=crop&w=1600&q=80",
        "author": "ICEN Secretariat",
        "tags": ["vision", "sovereignty", "multilateralism"],
    },
    {
        "title": "Sovereign Cloud: A Procurement Blueprint",
        "excerpt": "Member states now have a reference architecture for cloud sovereignty — co-designed with ministries across four regions.",
        "body": "Over eleven months, our Technology & Sovereignty pillar convened ministers from twelve nations and engineers from nine public-cloud suppliers to produce the first ICEN Sovereign Cloud Charter. It is not a manifesto. It is a procurement document.\n\nThe Charter covers: data residency thresholds, crypto-escrow for state keys, auditability of hyperscaler access, emergency severance clauses, and a minimum-threshold for local compute capacity. The goal is not to ban foreign clouds — it is to buy them like a sovereign, not a subject.\n\nFive member states have already committed to adopting the Charter in their next procurement cycle. Two others are piloting it as the basis for a regional joint procurement.",
        "cover_image": "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1600&q=80",
        "author": "Technology & Sovereignty Pillar",
        "tags": ["technology", "cloud", "policy"],
    },
    {
        "title": "A Quiet Summit in Geneva",
        "excerpt": "Notes from three days of off-the-record conversation between heads of state, central bankers, and builders.",
        "body": "This year's ICEN Summit drew 380 delegates from 52 emerging nations into a cloistered schedule of roundtables, closed sessions, and working lunches. There were no plenary speeches. There was no press pool. The single rule: everything on the table, nothing on the record.\n\nThe themes that dominated: local-currency settlement pilots, a model framework for AI governance, the growing appetite among sovereign funds for cross-border co-investment, and — perhaps most urgently — climate finance that does not arrive as debt.\n\nThe Secretariat will publish a sanitized communiqué within thirty days. More consequentially, seventeen bilateral MoUs were signed in the margins. That is the real measure of a summit.",
        "cover_image": "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1600&q=80",
        "author": "Summit Commission",
        "tags": ["summit", "diplomacy", "geneva"],
    },
    {
        "title": "Critical Minerals and the Value-Capture Problem",
        "excerpt": "Producing the world's lithium is not the same as capturing its value. A pillar briefing on mineral sovereignty.",
        "body": "Emerging nations supply an outsized share of the world's critical minerals — and capture a miniscule share of the value created atop them. Our Climate & Energy pillar has been convening producer-state ministries to build a joint framework for processing, pricing, and downstream participation.\n\nThe physics are stubborn: refining requires electricity, capital, and time. All three are scarce. But coordination changes the math. A consortium of four producer nations, operating a shared refining facility with mutual off-take guarantees, unlocks a different financing profile entirely.\n\nThe first such facility is under design. It will not be announced loudly. It will simply, one day, be operating.",
        "cover_image": "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?auto=format&fit=crop&w=1600&q=80",
        "author": "Climate & Energy Pillar",
        "tags": ["climate", "minerals", "trade"],
    },
    {
        "title": "Youth Assembly: A Vote That Counts",
        "excerpt": "ICEN's Youth Assembly now holds a binding vote on one pillar agenda item per year.",
        "body": "At the last General Assembly, member states ratified a motion giving the Youth Assembly a binding voice on one annual agenda item. This is not tokenism. It is a concession that the demographic majority of our members is under 26 — and that future policy must be legible to them.\n\nThe first item under Youth Assembly jurisdiction will be the ICEN Future-Work Charter. We will publish progress quarterly.",
        "cover_image": "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1600&q=80",
        "author": "Secretariat",
        "tags": ["youth", "governance"],
    },
    {
        "title": "Health Sovereignty Is National Security",
        "excerpt": "Four regional biomanufacturing hubs are now operational. A year-end briefing from our Health pillar.",
        "body": "The pandemic made visible what policy had long obscured: a country that cannot manufacture its own vaccines, its own insulin, its own diagnostic reagents, is not fully sovereign. ICEN's Health & Longevity pillar has been steadily building out the regional capacity that makes health sovereignty a working proposition.\n\nFour hubs — in West Africa, South Asia, Southeast Asia, and Latin America — are now producing at commercial scale. Two more are in validation. The technology-transfer model that underpins them will be released as an open reference this quarter.",
        "cover_image": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1600&q=80",
        "author": "Health & Longevity Pillar",
        "tags": ["health", "manufacturing", "resilience"],
    },
]

SEED_RESEARCH = [
    {
        "title": "ICEN Index 2026: The State of Emerging-World Progress",
        "abstract": "Our flagship annual index ranks 50 emerging nations across 12 pillars of national power. This year's edition introduces a new composite for digital sovereignty and revises the methodology for climate-adjusted growth.",
        "body": "The ICEN Index is built from 287 indicators drawn across 12 pillars. Methodology, data sources, and per-country scorecards are included in the full paper. Key findings this year: (1) digital-sovereignty scores have risen fastest in Southeast Asia; (2) climate-adjusted growth has decoupled from headline GDP in 14 member states; (3) youth-agency indicators show widening divergence across regions.",
        "authors": ["Dr. Amina Okafor", "Prof. Ricardo Souza", "ICEN Observatory"],
        "pillar": "Observatory",
        "cover_image": "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1600&q=80",
    },
    {
        "title": "Sovereign Cloud Charter v1.0",
        "abstract": "A reference procurement framework for national cloud infrastructure — including data-residency, crypto-escrow, auditability, and minimum-capacity thresholds.",
        "body": "This Charter is the product of eleven months of convening by the Technology & Sovereignty pillar. It is intended as a practical document — a template that ministries can adapt, not a white paper that decorates a shelf. Five member states have already committed to adoption.",
        "authors": ["Technology & Sovereignty Pillar"],
        "pillar": "Technology & Sovereignty",
        "cover_image": "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1600&q=80",
    },
    {
        "title": "Local-Currency Settlement: A Framework for Intra-ICEN Trade",
        "abstract": "A technical proposal for multilateral settlement among ICEN member-state central banks, reducing dollar dependency for intra-network trade.",
        "body": "The paper describes a clearing mechanism, FX-risk allocation, and governance structure for a voluntary local-currency settlement layer. Nine central banks are reviewing the proposal; three have expressed interest in a pilot.",
        "authors": ["Trade & Capital Pillar", "Central Banks Working Group"],
        "pillar": "Trade & Capital",
        "cover_image": "https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&w=1600&q=80",
    },
    {
        "title": "Critical Minerals: Producer-State Value-Capture Architecture",
        "abstract": "An analysis of downstream participation in critical-mineral supply chains and a design proposal for a four-country refining consortium.",
        "body": "The paper documents the value-capture gap across lithium, cobalt, rare earths, and graphite, and proposes a joint refining facility co-owned by producer states with shared off-take. Economics, governance, and carbon profile are modeled under three scenarios.",
        "authors": ["Climate & Energy Pillar"],
        "pillar": "Climate & Energy",
        "cover_image": "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?auto=format&fit=crop&w=1600&q=80",
    },
    {
        "title": "The Global South Curriculum Framework",
        "abstract": "A co-designed master's-level curriculum on sovereignty, AI governance, and development — for adoption by partner universities across emerging nations.",
        "body": "The framework covers nine modules across 450 contact hours. Pilot cohorts are running in six universities in 2026. Evaluation methodology and learning outcomes are included.",
        "authors": ["Education & Talent Pillar"],
        "pillar": "Education & Talent",
        "cover_image": "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1600&q=80",
    },
]


async def _seed_content():
    # Seed blog
    for p in SEED_BLOG:
        existing = await db.blog.find_one({"title": p["title"]})
        if existing:
            continue
        now = datetime.now(timezone.utc).isoformat()
        doc = {
            "id": str(uuid.uuid4()),
            "slug": await _unique_slug(db.blog, p["title"]),
            **p,
            "published": True,
            "published_at": now,
            "created_at": now,
            "updated_at": now,
        }
        await db.blog.insert_one(doc)
    # Seed research
    for r in SEED_RESEARCH:
        existing = await db.research.find_one({"title": r["title"]})
        if existing:
            continue
        now = datetime.now(timezone.utc).isoformat()
        doc = {
            "id": str(uuid.uuid4()),
            "slug": await _unique_slug(db.research, r["title"]),
            "pdf_url": None,
            **r,
            "published": True,
            "published_at": now,
            "created_at": now,
            "updated_at": now,
        }
        await db.research.insert_one(doc)


# ---------- Startup ----------
@app.on_event("startup")
async def on_startup():
    await db.users.create_index("email", unique=True)
    await db.applications.create_index("email")
    await db.applications.create_index("created_at")
    await db.blog.create_index("slug", unique=True)
    await db.blog.create_index("published_at")
    await db.research.create_index("slug", unique=True)
    await db.research.create_index("published_at")

    existing = await db.users.find_one({"email": ADMIN_EMAIL.lower()})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()), "email": ADMIN_EMAIL.lower(),
            "password_hash": hash_password(ADMIN_PASSWORD), "name": "ICEN Admin",
            "role": "admin", "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info("Seeded admin: %s", ADMIN_EMAIL)
    elif not verify_password(ADMIN_PASSWORD, existing["password_hash"]):
        await db.users.update_one({"email": ADMIN_EMAIL.lower()}, {"$set": {"password_hash": hash_password(ADMIN_PASSWORD)}})
        logger.info("Admin password re-synced.")

    await _seed_content()
    logger.info("Content seeded — blog=%d research=%d",
                await db.blog.count_documents({}),
                await db.research.count_documents({}))


@app.on_event("shutdown")
async def on_shutdown():
    client.close()


app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)
