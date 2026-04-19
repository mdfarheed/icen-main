import React from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import * as Icons from "lucide-react";
import { PILLARS, PILLAR_DETAILS } from "../content/icen";
import SEO from "../components/SEO";

export default function PillarDetail() {
  const { slug } = useParams();
  const pillar = PILLARS.find(p => p.slug === slug);
  if (!pillar) return <Navigate to="/pillars" replace />;

  const d = PILLAR_DETAILS[slug];
  const Icon = Icons[pillar.icon] || Icons.Sparkles;
  const idx = PILLARS.findIndex(p => p.slug === slug);
  const prev = PILLARS[(idx - 1 + PILLARS.length) % PILLARS.length];
  const next = PILLARS[(idx + 1) % PILLARS.length];

  return (
    <div className="pt-[120px] pb-24 bg-icen-ivory" data-testid={`pillar-detail-${slug}`}>
      <SEO title={pillar.title} description={d?.summary || pillar.desc} image={d?.image} path={`/pillars/${slug}`} />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <Link to="/pillars" className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-icen-muted hover:text-icen-ink mb-10">
          <ArrowLeft size={13} /> All Pillars
        </Link>

        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 items-start">
          <div>
            <div className="font-mono text-xs text-icen-muted tracking-widest mb-6">PILLAR {String(pillar.id).padStart(2, '0')}</div>
            <h1 className="font-serif text-5xl md:text-7xl text-icen-ink leading-[1.02] tracking-tight">
              {pillar.title}
            </h1>
            <p className="mt-8 text-xl text-icen-inkSoft leading-relaxed max-w-2xl">
              {d?.summary || pillar.desc}
            </p>
            <div className="mt-10 flex items-center gap-3">
              <Icon className="text-icen-blue" size={24} strokeWidth={1.4} />
              <span className="icen-overline">Working Group · Active</span>
            </div>
          </div>
          {d?.image && (
            <div className="aspect-[4/3] lg:aspect-auto lg:h-[520px] w-full overflow-hidden bg-icen-mist">
              <img src={d.image} alt={pillar.title} className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {d && (
          <>
            {/* Stats */}
            <div className="mt-20 grid md:grid-cols-3 gap-4">
              {d.stats.map((s, i) => (
                <div key={i} className="icen-card p-8">
                  <div className="font-serif text-5xl text-icen-blue font-semibold">{s.n}</div>
                  <div className="mt-2 text-[13px] text-icen-inkSoft">{s.l}</div>
                </div>
              ))}
            </div>

            {/* Question pull-quote */}
            <div className="mt-24 max-w-3xl">
              <div className="icen-overline mb-5">The Question We Are Asking</div>
              <blockquote className="font-serif italic text-3xl md:text-5xl text-icen-ink leading-[1.12]">
                "{d.question}"
              </blockquote>
            </div>

            {/* Initiatives */}
            <div className="mt-24">
              <div className="icen-overline mb-5">Active Initiatives</div>
              <div className="grid md:grid-cols-3 gap-4">
                {d.initiatives.map((it, i) => (
                  <div key={i} className="icen-card p-8">
                    <div className="font-mono text-[10px] text-icen-muted tracking-widest">INITIATIVE {String(i + 1).padStart(2, '0')}</div>
                    <h3 className="font-serif text-2xl text-icen-ink mt-3 leading-tight">{it.title}</h3>
                    <p className="mt-3 text-[14px] text-icen-inkSoft leading-relaxed">{it.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Partners */}
            <div className="mt-20 border-t border-icen-line pt-10">
              <div className="icen-overline mb-4">Partners & Convening Bodies</div>
              <div className="flex flex-wrap gap-3">
                {d.partners.map((p) => (
                  <span key={p} className="px-4 py-2 border border-icen-line text-icen-inkSoft text-sm hover:border-icen-ink hover:text-icen-ink transition-colors">{p}</span>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Prev / Next */}
        <div className="mt-24 grid md:grid-cols-2 gap-4 border-t border-icen-line pt-10">
          <Link to={`/pillars/${prev.slug}`} className="icen-card p-6 flex items-center gap-4 group">
            <ArrowLeft size={18} className="text-icen-muted group-hover:text-icen-ink transition-colors" />
            <div>
              <div className="text-[10px] uppercase tracking-[0.24em] text-icen-muted">Previous Pillar</div>
              <div className="font-serif text-xl text-icen-ink mt-1">{prev.title}</div>
            </div>
          </Link>
          <Link to={`/pillars/${next.slug}`} className="icen-card p-6 flex items-center justify-end gap-4 group text-right">
            <div>
              <div className="text-[10px] uppercase tracking-[0.24em] text-icen-muted">Next Pillar</div>
              <div className="font-serif text-xl text-icen-ink mt-1">{next.title}</div>
            </div>
            <ArrowRight size={18} className="text-icen-muted group-hover:text-icen-ink transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  );
}
