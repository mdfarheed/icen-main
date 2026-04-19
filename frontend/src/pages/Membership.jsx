import React from "react";
import { Link } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import SEO from "../components/SEO";
import { TIERS } from "../content/icen";

export default function Membership() {
  return (
    <div className="pt-[120px] pb-24 bg-icen-ivory relative" data-testid="membership-page">
      <SEO title="Membership" description="Four tiers. One standard of rigor. Observer, Fellow, Council Member, and Founding Nation tracks — by application and nomination." path="/membership" />
      <div className="absolute inset-0 icen-grid-light opacity-60" />
      <div className="relative max-w-[1300px] mx-auto px-6 lg:px-10">
        <div className="icen-overline mb-6">Membership</div>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl text-icen-ink leading-[1.04] tracking-tight max-w-4xl">
          Not for everyone. <em className="italic text-icen-blue">By design.</em>
        </h1>
        <p className="mt-8 text-lg text-icen-inkSoft max-w-2xl leading-relaxed">
          ICEN runs on four concentric tiers of commitment. Each tier carries rights, responsibilities, and a standard of rigor.
        </p>

        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {TIERS.map((t) => (
            <div
              key={t.id}
              data-testid={`membership-tier-${t.id}`}
              className={`relative p-8 flex flex-col transition-all duration-500 ${
                t.highlight ? "icen-panel-dark border border-icen-ink" : "icen-card"
              }`}
            >
              {t.highlight ? (
                <div className="absolute -top-3 left-7 px-3 py-1 bg-icen-blue text-white text-[10px] uppercase tracking-[0.24em] font-semibold">{t.badge}</div>
              ) : (
                <div className="text-[10px] uppercase tracking-[0.24em] text-icen-muted font-semibold">{t.badge}</div>
              )}
              <h3 className={`font-serif text-3xl mt-4 ${t.highlight ? "text-white" : "text-icen-ink"}`}>{t.name}</h3>
              <div className={`text-sm mt-2 ${t.highlight ? "text-white/70" : "text-icen-muted"}`}>{t.price}</div>
              <ul className="mt-8 space-y-3 flex-1">
                {t.features.map((f) => (
                  <li key={f} className={`text-[13px] flex gap-3 items-start ${t.highlight ? "text-white/85" : "text-icen-inkSoft"}`}>
                    <Check size={14} className={t.highlight ? "text-icen-blueSoft mt-0.5 shrink-0" : "text-icen-blue mt-0.5 shrink-0"} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/apply"
                className={`mt-8 justify-center ${
                  t.highlight
                    ? "icen-btn-primary bg-white text-icen-ink border-white hover:bg-icen-blue hover:text-white hover:border-icen-blue"
                    : "icen-btn-ghost"
                }`}
              >
                Apply <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>

        <div className="icen-rule my-24" />
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { k: "Review", v: "Every applicant is reviewed by a Secretariat panel and a regional chair." },
            { k: "Standards", v: "Integrity, contribution, and sovereignty alignment are non-negotiable." },
            { k: "Renewal", v: "Membership is reviewed annually against measurable engagement." },
          ].map((b) => (
            <div key={b.k} className="icen-card p-8">
              <div className="icen-overline">{b.k}</div>
              <div className="font-serif text-2xl text-icen-ink mt-4 leading-snug">{b.v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
