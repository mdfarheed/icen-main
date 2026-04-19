# ICEN — Deployment Guide

This guide walks you through deploying the ICEN website (React frontend + FastAPI backend + MongoDB) outside the Emergent platform.

---

## 1. Tech Stack Recap

| Layer    | Tech                                       |
| -------- | ------------------------------------------ |
| Frontend | React 19 + Tailwind + react-simple-maps    |
| Backend  | FastAPI + Motor (async MongoDB)            |
| Database | MongoDB 7                                  |
| Email    | Resend API                                 |
| Auth     | JWT (HS256)                                |

---

## 2. Prerequisites

1. **MongoDB** — use [MongoDB Atlas](https://www.mongodb.com/atlas) free tier (M0) or self-host.
2. **Resend account** — get an API key from [resend.com](https://resend.com) (verify a domain for production sending).
3. **GitHub repo** containing this codebase (use the "Save to GitHub" button in Emergent chat).

---

## 3. Environment Variables

### Backend (`backend/.env`)
See `backend/.env.example` for the full template.

| Key                    | Description                                                     |
| ---------------------- | --------------------------------------------------------------- |
| `MONGO_URL`            | MongoDB connection string (e.g. `mongodb+srv://...`)            |
| `DB_NAME`              | Database name (default: `icen_database`)                        |
| `CORS_ORIGINS`         | Comma-separated allowed origins, or `*`                         |
| `JWT_SECRET`           | Random 64+ char secret for JWT signing                          |
| `ADMIN_EMAIL`          | Seeded admin email                                              |
| `ADMIN_PASSWORD`       | Seeded admin password (change before first deploy!)             |
| `RESEND_API_KEY`       | `re_...` key from Resend                                        |
| `SENDER_EMAIL`         | From-address for emails (verified domain in Resend)             |
| `ADMIN_NOTIFY_EMAIL`   | Inbox that receives new application notifications               |
| `FRONTEND_URL`         | Public URL of frontend (used in email CTAs)                     |

### Frontend (`frontend/.env`)
| Key                     | Description                                                |
| ----------------------- | ---------------------------------------------------------- |
| `REACT_APP_BACKEND_URL` | Public URL of the backend (e.g. `https://api.icen.org`)   |

> ⚠️ React embeds env vars at **build time**. If you change `REACT_APP_BACKEND_URL`, you must rebuild.

---

## 4. Deployment Options

### Option A — Docker Compose (simplest, VPS / self-hosted)

```bash
git clone <your-repo>
cd <your-repo>

# Fill in backend/.env (copy from .env.example)
cp backend/.env.example backend/.env
$EDITOR backend/.env

# Build and run
docker compose up -d --build
```

Services:
- Frontend → http://localhost:3000
- Backend  → http://localhost:8001
- MongoDB  → localhost:27017

For production: put an Nginx / Caddy reverse proxy with HTTPS in front.

---

### Option B — Vercel (frontend) + Render (backend) + MongoDB Atlas

#### B.1 — MongoDB Atlas
1. Create free M0 cluster.
2. Add IP `0.0.0.0/0` to network access (or restrict to Render IPs).
3. Create DB user, copy connection string.

#### B.2 — Backend on Render
1. Connect your GitHub repo to Render.
2. Render will detect `render.yaml` (already included). Click **"Apply Blueprint"**.
3. Fill the `sync: false` env vars in the dashboard:
   - `MONGO_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `RESEND_API_KEY`, `ADMIN_NOTIFY_EMAIL`, `FRONTEND_URL`
4. Deploy. Note the public URL — e.g. `https://icen-backend.onrender.com`.

#### B.3 — Frontend on Vercel
1. **Import** the repo in Vercel dashboard.
2. **Root Directory** → `frontend`
3. **Framework** → Create React App (auto-detected via `vercel.json`)
4. **Environment Variables** → Add `REACT_APP_BACKEND_URL` = your Render backend URL.
5. Deploy. Note the Vercel URL.
6. Go back to Render → set `FRONTEND_URL` and `CORS_ORIGINS` to your Vercel URL → redeploy.

---

### Option C — Railway (all-in-one)

1. Create a Railway project → **New → Deploy from GitHub**.
2. Add three services:
   - **MongoDB** (use Railway's MongoDB template)
   - **Backend** (root: `backend`, start command: `uvicorn server:app --host 0.0.0.0 --port $PORT`, build command: `pip install --extra-index-url https://d33sy5i8bnduwe.cloudfront.net/simple/ -r requirements.txt`)
   - **Frontend** (root: `frontend`, Dockerfile detected automatically)
3. Set env vars per service (see section 3).
4. For frontend, set build-arg `REACT_APP_BACKEND_URL` to the backend's public URL.

---

### Option D — Netlify (frontend) + Fly.io (backend)

#### Frontend on Netlify
- Base directory: `frontend`
- Build command: `yarn build`
- Publish directory: `frontend/build`
- Env var: `REACT_APP_BACKEND_URL`
- Add `_redirects` file: `/* /index.html 200` (or use `vercel.json`-like equivalent — Netlify handles SPA fallback via `public/_redirects`)

#### Backend on Fly.io
```bash
cd backend
fly launch          # generates fly.toml, detects Dockerfile
fly secrets set MONGO_URL=... JWT_SECRET=... RESEND_API_KEY=... ADMIN_EMAIL=... ADMIN_PASSWORD=... ADMIN_NOTIFY_EMAIL=... FRONTEND_URL=...
fly deploy
```

---

## 5. Post-Deploy Checklist

- [ ] Backend `/api/stats` endpoint responds (test with `curl`)
- [ ] Admin login at `https://<frontend>/admin/login` works with seeded credentials
- [ ] **Change the admin password immediately** from its seeded default
- [ ] Submit a test application → confirm email arrives in `ADMIN_NOTIFY_EMAIL` inbox
- [ ] Upload a test image in admin Blog editor — verify it displays
- [ ] Verify `CORS_ORIGINS` only allows your actual frontend origin (not `*` in production)
- [ ] Point your custom domain to Vercel/Render/Fly
- [ ] Update Resend to use a **verified sending domain** (not `onboarding@resend.dev`)
- [ ] Update `sitemap.xml` URLs in `frontend/public/sitemap.xml` to your real domain

---

## 6. Security Hardening for Production

1. **Generate a new `JWT_SECRET`** (64+ random chars). Never reuse the Emergent dev value.
2. **Restrict CORS**: set `CORS_ORIGINS="https://yourdomain.com"`.
3. **MongoDB Atlas**: lock network access to backend hosting IPs only.
4. **Resend**: verify your domain for proper deliverability and SPF/DKIM.
5. **HTTPS everywhere** — Vercel/Render/Fly provide auto-TLS; for Docker, use Caddy or Nginx + Let's Encrypt.
6. **Rate limit** the public endpoints (`/api/applications`) — consider `slowapi` or put Cloudflare in front.

---

## 7. Troubleshooting

**Frontend shows blank / 404 on refresh** → SPA fallback not configured. Verify `vercel.json` rewrite or Nginx `try_files`.

**CORS errors in browser** → Backend `CORS_ORIGINS` must include your frontend URL.

**Admin login 401** → Backend hasn't seeded admin yet. Check logs for the seed line, or hit `/api/auth/login` with the `ADMIN_EMAIL`/`ADMIN_PASSWORD` you set.

**Emails not delivered** → Resend free tier requires verified domain for external sending. Use `onboarding@resend.dev` only for testing, and only the Resend account owner's inbox can receive.

**Images not loading** → Base64 images are served via `/api/media/{id}`. Ensure backend is reachable from browser and CORS allows the frontend origin.

---

## 8. Default Admin Credentials

From `/app/memory/test_credentials.md`:

- URL: `/admin/login`
- Email: `admin@icen.org`
- Password: `ICEN@Admin2026`

**🚨 Change these immediately after first login in production.**
