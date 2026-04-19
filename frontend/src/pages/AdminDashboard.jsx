import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ICENWordmark } from "../components/ICENEmblem";
import { LogOut, Users, Clock, CheckCircle, XCircle, Search, ExternalLink, FileText, BookOpen, Plus, Pencil, Trash2, X, Upload } from "lucide-react";

const STATUS_COLORS = {
  pending: "border-amber-500 text-amber-700 bg-amber-50",
  reviewing: "border-icen-blue text-icen-blue bg-blue-50",
  approved: "border-icen-green text-icen-green bg-emerald-50",
  rejected: "border-red-500 text-red-700 bg-red-50",
};

const TABS = [
  { id: "applications", label: "Applications", icon: Users },
  { id: "blog", label: "Insights", icon: BookOpen },
  { id: "research", label: "Research", icon: FileText },
];

export default function AdminDashboard() {
  const { user, loading, logout, authHeader, API } = useAuth();
  const [tab, setTab] = useState("applications");

  if (!loading && !user) return <Navigate to="/admin/login" replace />;

  return (
    <div className="min-h-screen bg-icen-ivory text-icen-ink" data-testid="admin-dashboard">
      <header className="border-b border-icen-line bg-icen-paper/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-10 h-[72px] flex items-center justify-between">
          <Link to="/"><ICENWordmark variant="dark" compact /></Link>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xs text-icen-muted hover:text-icen-ink items-center gap-1 hidden md:flex">Public site <ExternalLink size={12} /></Link>
            <button onClick={logout} data-testid="admin-logout" className="icen-btn-ghost py-2 px-3 md:px-4 text-[11px]"><LogOut size={13} /> Sign out</button>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-10 py-8 md:py-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6 mb-8">
          <div>
            <div className="icen-overline mb-2">Secretariat</div>
            <h1 className="font-serif text-3xl md:text-5xl text-icen-ink">Admin</h1>
            <p className="text-icen-inkSoft text-sm mt-2">Signed in as <span className="text-icen-ink">{user?.email}</span></p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border border-icen-line bg-icen-paper p-1 mb-8 overflow-x-auto">
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                data-testid={`admin-tab-${t.id}`}
                className={`flex items-center gap-2 text-[12px] px-4 py-2.5 uppercase tracking-[0.18em] font-medium whitespace-nowrap transition-colors ${
                  tab === t.id ? "bg-icen-ink text-white" : "text-icen-muted hover:text-icen-ink"
                }`}
              >
                <Icon size={14} /> {t.label}
              </button>
            );
          })}
        </div>

        {tab === "applications" && <ApplicationsPanel authHeader={authHeader} API={API} />}
        {tab === "blog" && <ContentPanel kind="blog" authHeader={authHeader} API={API} />}
        {tab === "research" && <ContentPanel kind="research" authHeader={authHeader} API={API} />}
      </div>
    </div>
  );
}

// ======= APPLICATIONS PANEL =======
function ApplicationsPanel({ authHeader, API }) {
  const [apps, setApps] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(true);

  const reload = async () => {
    setBusy(true);
    try {
      const [a, s] = await Promise.all([
        axios.get(`${API}/admin/applications`, { headers: authHeader() }),
        axios.get(`${API}/admin/stats`, { headers: authHeader() }),
      ]);
      setApps(a.data.items || []);
      setStats(s.data);
    } finally { setBusy(false); }
  };
  useEffect(() => { reload(); /* eslint-disable-next-line */ }, []);

  const visible = useMemo(() => apps.filter((a) => {
    if (filter !== "all" && a.status !== filter) return false;
    if (q && !(a.full_name.toLowerCase().includes(q.toLowerCase()) || a.email.toLowerCase().includes(q.toLowerCase()) || a.country.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  }), [apps, filter, q]);

  const updateStatus = async (id, status) => {
    await axios.patch(`${API}/admin/applications/${id}/status`, { status }, { headers: authHeader() });
    await reload();
    if (selected && selected.id === id) setSelected({ ...selected, status });
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-8">
        <StatBox icon={Users} label="Total" value={stats?.total ?? "—"} />
        <StatBox icon={Clock} label="Pending" value={stats?.pending ?? 0} tone="amber" />
        <StatBox icon={Clock} label="Reviewing" value={stats?.reviewing ?? 0} tone="blue" />
        <StatBox icon={CheckCircle} label="Approved" value={stats?.approved ?? 0} tone="green" />
        <StatBox icon={XCircle} label="Rejected" value={stats?.rejected ?? 0} tone="red" />
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-2 border border-icen-line bg-icen-paper px-3 py-2 w-full md:w-80">
          <Search size={14} className="text-icen-muted" />
          <input
            data-testid="admin-search"
            placeholder="Search name, email, country…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="bg-transparent outline-none text-sm flex-1 text-icen-ink placeholder:text-icen-muted"
          />
        </div>
        <div className="flex gap-1 bg-icen-paper border border-icen-line p-1 overflow-x-auto">
          {["all", "pending", "reviewing", "approved", "rejected"].map(s => (
            <button key={s} onClick={() => setFilter(s)} data-testid={`filter-${s}`}
              className={`text-[11px] px-3 py-1.5 uppercase tracking-[0.16em] font-medium whitespace-nowrap transition-colors ${filter === s ? "bg-icen-ink text-white" : "text-icen-muted hover:text-icen-ink"}`}
            >{s}</button>
          ))}
        </div>
        <button onClick={reload} className="icen-btn-ghost py-2 px-3 text-[11px]">Refresh</button>
      </div>

      <div className="border border-icen-line overflow-x-auto bg-icen-paper">
        <table className="w-full text-sm min-w-[700px]" data-testid="admin-applications-table">
          <thead>
            <tr className="bg-icen-ivory border-b border-icen-line text-left">
              <th className="px-4 py-3 font-medium text-icen-muted tracking-wide text-[11px] uppercase">Applicant</th>
              <th className="px-4 py-3 font-medium text-icen-muted tracking-wide text-[11px] uppercase">Country</th>
              <th className="px-4 py-3 font-medium text-icen-muted tracking-wide text-[11px] uppercase">Tier</th>
              <th className="px-4 py-3 font-medium text-icen-muted tracking-wide text-[11px] uppercase">Date</th>
              <th className="px-4 py-3 font-medium text-icen-muted tracking-wide text-[11px] uppercase">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {busy && <tr><td colSpan={6} className="text-center text-icen-muted py-16">Loading…</td></tr>}
            {!busy && visible.length === 0 && <tr><td colSpan={6} className="text-center text-icen-muted py-16">No applications yet.</td></tr>}
            {visible.map((a) => (
              <tr key={a.id} className="border-b border-icen-line hover:bg-icen-ivory transition-colors" data-testid={`app-row-${a.id}`}>
                <td className="px-4 py-4">
                  <div className="text-icen-ink font-medium">{a.full_name}</div>
                  <div className="text-xs text-icen-muted">{a.email}</div>
                </td>
                <td className="px-4 py-4 text-icen-inkSoft">{a.country}</td>
                <td className="px-4 py-4 capitalize text-icen-inkSoft">{a.membership_tier}</td>
                <td className="px-4 py-4 text-icen-muted text-xs whitespace-nowrap">{new Date(a.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-4"><span className={`text-[10px] uppercase tracking-[0.2em] border px-2 py-1 ${STATUS_COLORS[a.status] || ""}`}>{a.status}</span></td>
                <td className="px-4 py-4 text-right"><button onClick={() => setSelected(a)} className="text-xs text-icen-blue hover:text-icen-ink" data-testid={`open-app-${a.id}`}>Open →</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <Drawer onClose={() => setSelected(null)} testid="app-drawer">
          <div className="icen-overline">Application</div>
          <div className="font-serif text-2xl text-icen-ink mt-1 mb-4">{selected.full_name}</div>
          <Detail label="Email" value={selected.email} />
          <Detail label="Phone" value={selected.phone || "—"} />
          <Detail label="Country" value={selected.country} />
          <Detail label="Organization" value={selected.organization || "—"} />
          <Detail label="Role" value={selected.role_title || "—"} />
          <Detail label="Tier" value={selected.membership_tier} cap />
          <Detail label="Pillars" value={(selected.focus_pillars || []).join(", ") || "—"} />
          <Detail label="LinkedIn" value={selected.linkedin || "—"} />
          <div>
            <div className="icen-overline mb-2">Motivation</div>
            <p className="text-icen-inkSoft whitespace-pre-wrap leading-relaxed text-sm">{selected.motivation}</p>
          </div>
          <div>
            <div className="icen-overline mb-3">Update Status</div>
            <div className="grid grid-cols-2 gap-2">
              {["pending", "reviewing", "approved", "rejected"].map((s) => (
                <button key={s} data-testid={`set-status-${s}`} onClick={() => updateStatus(selected.id, s)}
                  className={`px-3 py-2 text-[11px] uppercase tracking-[0.2em] border transition-all ${selected.status === s ? "border-icen-ink bg-icen-ink text-white" : "border-icen-line text-icen-muted hover:text-icen-ink hover:border-icen-ink/50"}`}
                >{s}</button>
              ))}
            </div>
          </div>
          <div className="text-[10px] text-icen-muted font-mono pt-4 border-t border-icen-line">ID: {selected.id}</div>
        </Drawer>
      )}
    </>
  );
}

// ======= CONTENT PANEL (blog / research) =======
function ContentPanel({ kind, authHeader, API }) {
  const endpoint = `${API}/admin/${kind}`;
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(true);
  const [editing, setEditing] = useState(null); // null | {} (new) | record
  const isResearch = kind === "research";

  const reload = async () => {
    setBusy(true);
    try {
      const { data } = await axios.get(endpoint, { headers: authHeader() });
      setItems(data.items || []);
    } finally { setBusy(false); }
  };
  useEffect(() => { reload(); /* eslint-disable-next-line */ }, [kind]);

  const save = async (payload) => {
    if (editing?.id) {
      await axios.patch(`${endpoint}/${editing.id}`, payload, { headers: authHeader() });
    } else {
      await axios.post(endpoint, payload, { headers: authHeader() });
    }
    setEditing(null);
    await reload();
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    await axios.delete(`${endpoint}/${id}`, { headers: authHeader() });
    await reload();
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-2xl text-icen-ink">{isResearch ? "Research Papers" : "Insights & Blog"}</h2>
          <p className="text-sm text-icen-muted mt-1">{items.length} {items.length === 1 ? "item" : "items"}</p>
        </div>
        <button onClick={() => setEditing({})} data-testid={`admin-${kind}-new`} className="icen-btn-primary py-2.5 px-4 text-[11px]">
          <Plus size={14} /> New {isResearch ? "Paper" : "Post"}
        </button>
      </div>

      <div className="border border-icen-line bg-icen-paper">
        {busy && <div className="p-16 text-center text-icen-muted">Loading…</div>}
        {!busy && items.length === 0 && <div className="p-16 text-center text-icen-muted">No items yet. Click "New" to create one.</div>}
        {items.map((it) => (
          <div key={it.id} className="p-5 md:p-6 border-b border-icen-line last:border-b-0 flex flex-col md:flex-row md:items-center gap-4" data-testid={`${kind}-row-${it.slug}`}>
            {it.cover_image && <img src={it.cover_image} alt="" className="w-full md:w-[120px] h-[80px] object-cover" />}
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase tracking-[0.22em] text-icen-blue font-semibold">
                {isResearch ? (it.pillar || "Observatory") : (it.tags?.[0] || "Briefing")}
              </div>
              <div className="font-serif text-lg text-icen-ink mt-1 truncate">{it.title}</div>
              <div className="text-xs text-icen-muted mt-1">/{kind}/{it.slug}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setEditing(it)} className="icen-btn-ghost py-2 px-3 text-[10px]" data-testid={`${kind}-edit-${it.slug}`}><Pencil size={12} /> Edit</button>
              <button onClick={() => remove(it.id)} className="icen-btn-ghost py-2 px-3 text-[10px] hover:border-red-500 hover:text-red-700" data-testid={`${kind}-delete-${it.slug}`}><Trash2 size={12} /> Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editing !== null && (
        <ContentEditor
          kind={kind}
          initial={editing}
          onCancel={() => setEditing(null)}
          onSave={save}
        />
      )}
    </>
  );
}

function ContentEditor({ kind, initial, onCancel, onSave }) {
  const isResearch = kind === "research";
  const { authHeader, API } = useAuth();
  const [form, setForm] = useState(() => ({
    title: initial.title || "",
    excerpt: initial.excerpt || "",
    abstract: initial.abstract || "",
    body: initial.body || "",
    cover_image: initial.cover_image || "",
    author: initial.author || "ICEN Secretariat",
    tags: (initial.tags || []).join(", "),
    authors: (initial.authors || []).join(", "),
    pillar: initial.pillar || "",
    pdf_url: initial.pdf_url || "",
    published: initial.published !== false,
  }));
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setErr("File too large (max 5MB)"); return; }
    setErr(""); setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await axios.post(`${API}/admin/upload`, fd, {
        headers: { ...authHeader() },
      });
      setForm((f) => ({ ...f, cover_image: data.url }));
    } catch (e2) {
      const d = e2?.response?.data?.detail;
      setErr(typeof d === "string" ? d : "Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setErr("");
    try {
      const payload = isResearch
        ? {
            title: form.title,
            abstract: form.abstract,
            body: form.body,
            cover_image: form.cover_image || null,
            authors: form.authors.split(",").map(s => s.trim()).filter(Boolean),
            pillar: form.pillar || null,
            pdf_url: form.pdf_url || null,
            published: form.published,
          }
        : {
            title: form.title,
            excerpt: form.excerpt,
            body: form.body,
            cover_image: form.cover_image || null,
            author: form.author || "ICEN Secretariat",
            tags: form.tags.split(",").map(s => s.trim()).filter(Boolean),
            published: form.published,
          };
      await onSave(payload);
    } catch (e) {
      const d = e?.response?.data?.detail;
      setErr(typeof d === "string" ? d : "Save failed.");
    } finally { setBusy(false); }
  };

  const input = "w-full bg-icen-paper border border-icen-line px-3 py-2.5 text-icen-ink placeholder:text-icen-muted focus:border-icen-ink focus:outline-none transition-colors text-sm";

  return (
    <Drawer onClose={onCancel} testid={`${kind}-editor`} wide>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <div className="icen-overline">{initial.id ? "Edit" : "New"} {isResearch ? "Research Paper" : "Insight"}</div>
          <div className="font-serif text-2xl text-icen-ink mt-1">{form.title || "Untitled"}</div>
        </div>

        <div>
          <Lbl>Title</Lbl>
          <input data-testid="editor-title" className={input} value={form.title} onChange={set("title")} required minLength={3} />
        </div>

        {isResearch ? (
          <>
            <div>
              <Lbl>Abstract (min 20 chars)</Lbl>
              <textarea data-testid="editor-abstract" className={`${input} min-h-[100px]`} value={form.abstract} onChange={set("abstract")} required minLength={20} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Lbl>Authors (comma-separated)</Lbl>
                <input className={input} value={form.authors} onChange={set("authors")} placeholder="Dr. Amina Okafor, ICEN Observatory" />
              </div>
              <div>
                <Lbl>Pillar</Lbl>
                <input className={input} value={form.pillar} onChange={set("pillar")} placeholder="Observatory" />
              </div>
            </div>
            <div>
              <Lbl>PDF URL (optional)</Lbl>
              <input className={input} value={form.pdf_url} onChange={set("pdf_url")} placeholder="https://..." />
            </div>
          </>
        ) : (
          <>
            <div>
              <Lbl>Excerpt (min 10 chars)</Lbl>
              <textarea data-testid="editor-excerpt" className={`${input} min-h-[80px]`} value={form.excerpt} onChange={set("excerpt")} required minLength={10} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Lbl>Author</Lbl>
                <input className={input} value={form.author} onChange={set("author")} />
              </div>
              <div>
                <Lbl>Tags (comma-separated)</Lbl>
                <input className={input} value={form.tags} onChange={set("tags")} placeholder="policy, climate" />
              </div>
            </div>
          </>
        )}

        <div>
          <Lbl>Cover image</Lbl>
          <div className="flex flex-col sm:flex-row gap-3">
            <input data-testid="editor-cover" className={`${input} flex-1`} value={form.cover_image} onChange={set("cover_image")} placeholder="Paste URL or upload a file" />
            <label className={`icen-btn-ghost py-2.5 px-4 text-[11px] cursor-pointer whitespace-nowrap ${uploading ? "opacity-60 pointer-events-none" : ""}`}>
              <Upload size={13} /> {uploading ? "Uploading…" : "Upload"}
              <input type="file" accept="image/*" onChange={handleFile} className="hidden" data-testid="editor-cover-file" />
            </label>
          </div>
          {form.cover_image && (
            <div className="mt-3 aspect-[16/8] max-w-[420px] overflow-hidden border border-icen-line bg-icen-mist">
              <img src={form.cover_image} alt="cover" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <div>
          <Lbl>Body (min 30 chars, supports line breaks)</Lbl>
          <textarea data-testid="editor-body" className={`${input} min-h-[240px] font-mono text-[13px]`} value={form.body} onChange={set("body")} required minLength={30} />
        </div>

        <label className="flex items-center gap-2 text-sm text-icen-inkSoft">
          <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
          Published
        </label>

        {err && <div className="text-sm text-red-700 border border-red-300 bg-red-50 p-2.5">{err}</div>}

        <div className="flex items-center gap-3 pt-4 border-t border-icen-line">
          <button type="submit" disabled={busy} data-testid="editor-save" className="icen-btn-primary">
            {busy ? "Saving…" : initial.id ? "Update" : "Publish"}
          </button>
          <button type="button" onClick={onCancel} className="icen-btn-ghost">Cancel</button>
        </div>
      </form>
    </Drawer>
  );
}

// ======= Shared drawer + helpers =======
function Drawer({ onClose, children, testid, wide }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose} data-testid={testid}>
      <div className="absolute inset-0 bg-black/30" />
      <div className={`relative w-full ${wide ? "max-w-[720px]" : "max-w-[560px]"} h-full bg-icen-paper border-l border-icen-line overflow-y-auto`} onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-icen-paper/95 backdrop-blur-md border-b border-icen-line p-4 md:p-6 flex items-center justify-end">
          <button onClick={onClose} className="text-icen-muted hover:text-icen-ink text-sm flex items-center gap-2"><X size={16} /> Close</button>
        </div>
        <div className="p-4 md:p-6 space-y-4">{children}</div>
      </div>
    </div>
  );
}

function StatBox({ icon: Icon, label, value, tone }) {
  const toneCls = { amber: "text-amber-700", blue: "text-icen-blue", green: "text-icen-green", red: "text-red-700" }[tone] || "text-icen-ink";
  return (
    <div className="icen-card p-5 md:p-6">
      <div className="flex items-center gap-2 text-icen-muted text-[10px] uppercase tracking-[0.24em]"><Icon size={13} /> {label}</div>
      <div className={`font-serif text-3xl md:text-4xl mt-2 ${toneCls}`}>{value}</div>
    </div>
  );
}

function Detail({ label, value, cap }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="text-icen-muted text-[11px] uppercase tracking-[0.2em] font-semibold">{label}</div>
      <div className={`col-span-2 text-icen-ink text-sm ${cap ? "capitalize" : ""}`}>{value}</div>
    </div>
  );
}

function Lbl({ children }) {
  return <label className="block text-[11px] uppercase tracking-[0.24em] text-icen-muted font-semibold mb-2">{children}</label>;
}
