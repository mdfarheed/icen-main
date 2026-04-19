import React from "react";
import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { PILLARS } from "../content/icen";
import SEO from "../components/SEO";

export default function Pillars() {
  return (
    <div className="pt-[120px] pb-24 bg-icen-ivory" data-testid="pillars-page">
      <SEO title="The Twelve Pillars" description="Twelve working groups. One sovereign agenda. Explore the pillars of ICEN's framework for emerging-nation power." path="/pillars" />
      <div className="max-w-[1300px] mx-auto px-6 lg:px-10">
        <div className="icen-overline mb-6">The Twelve</div>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl text-icen-ink leading-[1.04] tracking-tight max-w-4xl">
          The pillars of national power, <em className="italic text-icen-blue">reimagined.</em>
        </h1>
        <p className="mt-8 text-lg text-icen-inkSoft max-w-2xl leading-relaxed">
          Every pillar is a working group. Every working group is a blueprint. Every blueprint is intended for adoption.
        </p>

        <div className="mt-16 border border-icen-line divide-y divide-icen-line bg-icen-paper">
          {PILLARS.map((p) => {
            const Icon = Icons[p.icon] || Icons.Sparkles;
            return (
              <Link
                key={p.id}
                to={`/pillars/${p.slug}`}
                className="group grid grid-cols-[70px_1fr_auto] md:grid-cols-[160px_1fr_auto] gap-4 md:gap-6 items-center p-5 md:p-8 hover:bg-icen-ivory transition-colors"
                data-testid={`pillar-row-${p.id}`}
              >
                <div className="font-mono text-[10px] md:text-sm text-icen-muted tracking-widest">P.{String(p.id).padStart(2, '0')}</div>
                <div>
                  <h3 className="font-serif text-xl md:text-3xl text-icen-ink leading-tight group-hover:text-icen-blue transition-colors">{p.title}</h3>
                  <p className="mt-2 text-[13px] md:text-[15px] text-icen-inkSoft leading-relaxed max-w-3xl">{p.desc}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Icon className="text-icen-blue group-hover:text-icen-green transition-colors hidden md:block" size={24} strokeWidth={1.3} />
                  <ArrowUpRight className="text-icen-muted group-hover:text-icen-ink group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" size={18} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
