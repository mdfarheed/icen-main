import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, AlertCircle } from "lucide-react";
import { TIERS, PILLARS } from "../content/icen";
import SEO from "../components/SEO";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const STEPS = ["Identity", "Profile", "Motivation", "Review"];

function Label({ children }) {
  return <label className="block text-[11px] uppercase tracking-[0.24em] text-icen-muted font-semibold mb-2">{children}</label>;
}

const inputCls = "w-full bg-icen-paper border border-icen-line px-4 py-3 text-icen-ink placeholder:text-icen-muted focus:border-icen-ink focus:outline-none transition-colors font-sans text-[15px]";

export default function Apply() {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    country: "",
    organization: "",
    role_title: "",
    membership_tier: "fellow",
    focus_pillars: [],
    motivation: "",
    linkedin: "",
  });

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const togglePillar = (title) => setForm((f) => ({
    ...f,
    focus_pillars: f.focus_pillars.includes(title)
      ? f.focus_pillars.filter((x) => x !== title)
      : f.focus_pillars.length < 4 ? [...f.focus_pillars, title] : f.focus_pillars
  }));

  const canNext = () => {
    if (step === 0) return form.full_name.length >= 2 && /.+@.+\..+/.test(form.email) && form.country.length >= 2;
    if (step === 1) return !!form.membership_tier;
    if (step === 2) return form.motivation.trim().length >= 30;
    return true;
  };

  const submit = async () => {
    setSubmitting(true); setError("");
    try {
      const { data } = await axios.post(`${API}/applications`, form);
      setSuccess({ id: data.id });
    } catch (e) {
      const detail = e?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-[120px] pb-24 bg-icen-ivory min-h-screen relative" data-testid="apply-page">
      <SEO title="Apply for Membership" description="Submit your candidacy for ICEN membership. Reviewed by the Secretariat within 7–10 business days." path="/apply" />
      <div className="absolute inset-0 icen-grid-light opacity-60" />
      <div className="relative max-w-[900px] mx-auto px-6 lg:px-10">
        <div className="icen-overline mb-6">Apply</div>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-icen-ink leading-[1.04] tracking-tight max-w-3xl">
          Submit your <em className="italic text-icen-blue">candidacy.</em>
        </h1>
        <p className="mt-6 text-lg text-icen-inkSoft max-w-xl">
          Review takes 7–10 business days. Every application is read by a member of the Secretariat.
        </p>

        {success ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-14 p-10 border border-icen-green/40 bg-white" data-testid="apply-success">
            <div className="icen-overline" style={{ color: "#008F4C" }}>Received</div>
            <h2 className="font-serif text-4xl text-icen-ink mt-3">Your application is with the Secretariat.</h2>
            <p className="mt-4 text-icen-inkSoft">A confirmation has been sent to <span className="text-icen-ink">{form.email}</span>.</p>
            <p className="text-xs text-icen-muted mt-3 font-mono">Reference: {success.id}</p>
          </motion.div>
        ) : (
          <div className="mt-14">
            <div className="flex items-center gap-3 mb-10" data-testid="apply-stepper">
              {STEPS.map((s, i) => (
                <React.Fragment key={s}>
                  <div className={`flex items-center gap-2 ${i === step ? "text-icen-ink" : i < step ? "text-icen-green" : "text-icen-muted"}`}>
                    <div className={`w-7 h-7 border flex items-center justify-center text-xs ${
                      i === step ? "border-icen-ink bg-icen-ink text-white" :
                      i < step ? "border-icen-green text-icen-green" :
                      "border-icen-line"
                    }`}>{i < step ? <Check size={13} /> : i + 1}</div>
                    <span className="text-[11px] uppercase tracking-[0.24em] hidden md:block">{s}</span>
                  </div>
                  {i < STEPS.length - 1 && <div className="flex-1 h-px bg-icen-line" />}
                </React.Fragment>
              ))}
            </div>

            <div className="bg-icen-paper border border-icen-line p-8 md:p-10">
              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.3 }}>
                  {step === 0 && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label>Full name</Label>
                        <input data-testid="apply-fullname" className={inputCls} value={form.full_name} onChange={update("full_name")} placeholder="Jane Okafor" />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <input data-testid="apply-email" type="email" className={inputCls} value={form.email} onChange={update("email")} placeholder="jane@ministry.gov" />
                      </div>
                      <div>
                        <Label>Phone (with country code)</Label>
                        <input data-testid="apply-phone" type="tel" className={inputCls} value={form.phone} onChange={update("phone")} placeholder="+234 802 000 0000" />
                      </div>
                      <div>
                        <Label>Country</Label>
                        <input data-testid="apply-country" className={inputCls} value={form.country} onChange={update("country")} placeholder="Nigeria" />
                      </div>
                      <div className="md:col-span-2">
                        <Label>LinkedIn (optional)</Label>
                        <input data-testid="apply-linkedin" className={inputCls} value={form.linkedin} onChange={update("linkedin")} placeholder="https://linkedin.com/in/..." />
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label>Organization</Label>
                          <input data-testid="apply-organization" className={inputCls} value={form.organization} onChange={update("organization")} placeholder="Ministry / Company / Institution" />
                        </div>
                        <div>
                          <Label>Role / Title</Label>
                          <input data-testid="apply-role" className={inputCls} value={form.role_title} onChange={update("role_title")} placeholder="Director of Policy" />
                        </div>
                      </div>
                      <div className="mt-8">
                        <Label>Membership Tier</Label>
                        <div className="grid md:grid-cols-2 gap-3">
                          {TIERS.map((t) => (
                            <button
                              key={t.id}
                              type="button"
                              data-testid={`apply-tier-${t.id}`}
                              onClick={() => setForm({ ...form, membership_tier: t.id })}
                              className={`text-left p-4 border transition-all ${form.membership_tier === t.id ? "border-icen-ink bg-icen-ink/5" : "border-icen-line hover:border-icen-ink/50"}`}
                            >
                              <div className="font-serif text-xl text-icen-ink">{t.name}</div>
                              <div className="text-xs text-icen-muted mt-1">{t.price}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="mt-8">
                        <Label>Focus Pillars (pick up to 4)</Label>
                        <div className="flex flex-wrap gap-2">
                          {PILLARS.map((p) => {
                            const on = form.focus_pillars.includes(p.title);
                            return (
                              <button
                                key={p.id}
                                type="button"
                                data-testid={`apply-pillar-${p.id}`}
                                onClick={() => togglePillar(p.title)}
                                className={`text-[12px] px-3 py-2 border transition-all ${on ? "border-icen-blue bg-icen-blue/10 text-icen-ink" : "border-icen-line text-icen-inkSoft hover:border-icen-ink/50"}`}
                              >{p.title}</button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div>
                      <Label>Why ICEN? (min 30 chars)</Label>
                      <textarea
                        data-testid="apply-motivation"
                        className={`${inputCls} min-h-[180px] resize-y`}
                        value={form.motivation}
                        onChange={update("motivation")}
                        placeholder="Share your motivation, your vision for emerging nations, and how you would contribute."
                      />
                      <div className="text-xs text-icen-muted mt-2">{form.motivation.length} / 2000</div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-5 text-sm">
                      <div className="icen-overline">Review</div>
                      <dl className="grid grid-cols-3 gap-y-3 gap-x-6 text-icen-inkSoft">
                        <dt className="col-span-1 text-icen-muted">Name</dt><dd className="col-span-2 text-icen-ink">{form.full_name}</dd>
                        <dt className="col-span-1 text-icen-muted">Email</dt><dd className="col-span-2 text-icen-ink">{form.email}</dd>
                        <dt className="col-span-1 text-icen-muted">Phone</dt><dd className="col-span-2 text-icen-ink">{form.phone || "—"}</dd>
                        <dt className="col-span-1 text-icen-muted">Country</dt><dd className="col-span-2 text-icen-ink">{form.country}</dd>
                        <dt className="col-span-1 text-icen-muted">Organization</dt><dd className="col-span-2 text-icen-ink">{form.organization || "—"}</dd>
                        <dt className="col-span-1 text-icen-muted">Role</dt><dd className="col-span-2 text-icen-ink">{form.role_title || "—"}</dd>
                        <dt className="col-span-1 text-icen-muted">Tier</dt><dd className="col-span-2 capitalize text-icen-ink">{form.membership_tier}</dd>
                        <dt className="col-span-1 text-icen-muted">Pillars</dt><dd className="col-span-2 text-icen-ink">{form.focus_pillars.join(", ") || "—"}</dd>
                      </dl>
                      <div>
                        <div className="icen-overline mb-2">Motivation</div>
                        <p className="text-icen-inkSoft whitespace-pre-wrap">{form.motivation}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {error && (
                <div className="mt-6 flex items-center gap-2 text-sm text-red-700 border border-red-300 bg-red-50 p-3">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <div className="mt-10 flex items-center justify-between">
                <button
                  disabled={step === 0 || submitting}
                  onClick={() => setStep((s) => s - 1)}
                  data-testid="apply-back"
                  className="text-sm text-icen-muted hover:text-icen-ink disabled:opacity-30 transition-colors"
                >← Back</button>

                {step < STEPS.length - 1 ? (
                  <button
                    disabled={!canNext()}
                    onClick={() => setStep((s) => s + 1)}
                    data-testid="apply-next"
                    className="icen-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >Continue <ArrowRight size={14} /></button>
                ) : (
                  <button
                    disabled={submitting}
                    onClick={submit}
                    data-testid="apply-submit"
                    className="icen-btn-primary disabled:opacity-60"
                  >{submitting ? "Submitting…" : "Submit Application"} <ArrowRight size={14} /></button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
