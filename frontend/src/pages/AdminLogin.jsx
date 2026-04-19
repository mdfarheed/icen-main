import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ICENWordmark } from "../components/ICENEmblem";
import { AlertCircle, Lock, ArrowRight } from "lucide-react";

export default function AdminLogin() {
  const { login, user, loading } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  if (!loading && user) return <Navigate to="/admin/dashboard" replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      await login(email, password);
      nav("/admin/dashboard");
    } catch (e) {
      const detail = e?.response?.data?.detail;
      setErr(typeof detail === "string" ? detail : "Login failed.");
    } finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen bg-icen-ivory flex items-center justify-center p-6 relative" data-testid="admin-login-page">
      <div className="absolute inset-0 icen-grid-light opacity-60" />
      <div className="relative w-full max-w-md">
        <div className="flex justify-center mb-10"><ICENWordmark variant="dark" /></div>
        <div className="bg-icen-paper border border-icen-line p-10 shadow-card">
          <div className="icen-overline mb-3 flex items-center gap-2"><Lock size={13} /> Secretariat Access</div>
          <h1 className="font-serif text-4xl text-icen-ink">Admin Login</h1>
          <p className="text-sm text-icen-inkSoft mt-2">Restricted to authorized personnel.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block text-[11px] uppercase tracking-[0.24em] text-icen-muted font-semibold mb-2">Email</label>
              <input
                data-testid="admin-login-email"
                type="email" required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-icen-paper border border-icen-line px-4 py-3 text-icen-ink placeholder:text-icen-muted focus:border-icen-ink focus:outline-none transition-colors"
                placeholder="admin@icen.org"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-[0.24em] text-icen-muted font-semibold mb-2">Password</label>
              <input
                data-testid="admin-login-password"
                type="password" required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-icen-paper border border-icen-line px-4 py-3 text-icen-ink placeholder:text-icen-muted focus:border-icen-ink focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            {err && (
              <div className="flex items-center gap-2 text-sm text-red-700 border border-red-300 bg-red-50 p-3">
                <AlertCircle size={15} /> {err}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              data-testid="admin-login-submit"
              className="icen-btn-primary w-full justify-center disabled:opacity-60"
            >{busy ? "Signing in…" : "Sign In"} <ArrowRight size={14} /></button>
          </form>
        </div>
        <p className="text-center text-xs text-icen-muted mt-6">ICEN · Secretariat Portal</p>
      </div>
    </div>
  );
}
