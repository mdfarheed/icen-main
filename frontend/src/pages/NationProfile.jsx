import React from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, MapPin, Users, Building2, Target } from "lucide-react";
import SEO from "../components/SEO";
import { NATION_BY_SLUG } from "../content/nations";

export default function NationProfile() {
  const { slug } = useParams();
  const nation = NATION_BY_SLUG[slug];
  if (!nation) return <Navigate to="/chapters" replace />;

  return (
    <div className="pt-[120px] pb-24 bg-icen-ivory" data-testid={`nation-profile-${slug}`}>
      <SEO
        title={`${nation.name} — Member Nation`}
        description={`ICEN profile for ${nation.name}. Chapters, fellows, focus pillars, and engagement.`}
        image={`https://flagcdn.com/w1280/${nation.iso}.png`}
        path={`/nation/${slug}`}
      />
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-10">
        <Link to="/chapters" className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-icen-muted hover:text-icen-ink mb-8">
          <ArrowLeft size={13} /> Chapters & Regions
        </Link>

        <div className="grid md:grid-cols-[360px_1fr] gap-6 md:gap-10 items-start">
          {/* Flag panel */}
          <div className="border border-icen-line bg-icen-paper p-4 md:p-5">
            <div className="aspect-[3/2] overflow-hidden bg-icen-mist">
              <img
                src={`https://flagcdn.com/w1280/${nation.iso}.png`}
                srcSet={`https://flagcdn.com/w640/${nation.iso}.png 1x, https://flagcdn.com/w1280/${nation.iso}.png 2x`}
                alt={`Flag of ${nation.name}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-5 space-y-3 text-[13px]">
              <Row icon={MapPin} label="Capital" value={nation.capital} />
              <Row icon={Building2} label="Region" value={nation.region} />
              <Row icon={Users} label="Fellows" value={nation.fellows} />
              <Row icon={Target} label="Chapters" value={nation.chapters} />
            </div>
          </div>

          {/* Content */}
          <div>
            <div className="icen-overline mb-4">Member Nation</div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl text-icen-ink leading-[1.04] tracking-tight">
              {nation.name}
            </h1>
            <p className="mt-6 text-icen-inkSoft text-base md:text-lg leading-relaxed max-w-2xl">
              An active member of the <strong className="text-icen-ink">{nation.region}</strong> chapter
              of ICEN. The delegation participates in <strong className="text-icen-ink">{nation.focus.length}</strong> working
              groups and has <strong className="text-icen-ink">{nation.fellows}</strong> Fellows placed across the network.
            </p>

            <div className="mt-10">
              <div className="icen-overline mb-5">Focus Pillars</div>
              <div className="flex flex-wrap gap-2">
                {nation.focus.map((f) => (
                  <span key={f} className="px-4 py-2 text-sm border border-icen-line bg-icen-paper text-icen-inkSoft hover:border-icen-ink hover:text-icen-ink transition-colors">
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-12 grid sm:grid-cols-3 gap-3">
              <Stat n={nation.fellows} l="ICEN Fellows" />
              <Stat n={nation.chapters} l="National Chapters" />
              <Stat n={nation.focus.length} l="Working Groups" />
            </div>

            <div className="mt-12 border-t border-icen-line pt-10 flex flex-wrap gap-3">
              <Link to="/apply" className="icen-btn-primary">Engage with ICEN</Link>
              <Link to="/chapters" className="icen-btn-ghost">Back to Regions</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-icen-line last:border-b-0">
      <span className="flex items-center gap-2 text-icen-muted text-[11px] uppercase tracking-[0.22em] font-semibold"><Icon size={13} /> {label}</span>
      <span className="text-icen-ink">{value}</span>
    </div>
  );
}

function Stat({ n, l }) {
  return (
    <div className="icen-card p-6">
      <div className="font-serif text-4xl text-icen-blue font-semibold">{n}</div>
      <div className="mt-1 text-[12px] text-icen-inkSoft uppercase tracking-[0.2em]">{l}</div>
    </div>
  );
}
