import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { REGIONS } from "../content/icen";
import SEO from "../components/SEO";

export default function Chapters() {
  const [active, setActive] = useState(REGIONS[0].id);
  const current = REGIONS.find(r => r.id === active);

  return (
    <div className="pt-[120px] pb-24 bg-icen-ivory" data-testid="chapters-page">
      <SEO title="Chapters & Regions" description="Eight regional chapters. Fifty-plus countries. Explore the ICEN global network by region." path="/chapters" />
      <div className="max-w-[1300px] mx-auto px-6 lg:px-10">
        <div className="icen-overline mb-6">Chapters & Regions</div>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl text-icen-ink leading-[1.04] tracking-tight max-w-4xl">
          A network that <em className="italic text-icen-blue">reads the map differently.</em>
        </h1>
        <p className="mt-8 text-lg text-icen-inkSoft max-w-2xl leading-relaxed">
          ICEN is organized into eight regional chapters, each led by a regional chair and supported by country nodes.
        </p>

        <div className="mt-16 grid md:grid-cols-[340px_1fr] border border-icen-line bg-icen-paper">
          <div className="border-r border-icen-line">
            {REGIONS.map((r) => (
              <button
                key={r.id}
                onClick={() => setActive(r.id)}
                data-testid={`region-tab-${r.id}`}
                className={`w-full text-left px-6 py-5 border-b border-icen-line transition-colors ${
                  active === r.id ? "bg-icen-ivory text-icen-ink" : "text-icen-inkSoft hover:bg-icen-ivory/70"
                }`}
              >
                <div className="font-mono text-[10px] tracking-[0.3em] text-icen-muted">R.{r.id.toUpperCase()}</div>
                <div className="font-serif text-xl mt-1 text-icen-ink">{r.name}</div>
                <div className="text-[11px] text-icen-muted mt-1 tracking-wide">{r.chapters} chapters · {r.countries.length} countries</div>
              </button>
            ))}
          </div>

          <div className="p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
              >
                <div className="icen-overline">Regional Chapter</div>
                <h2 className="font-serif text-4xl md:text-5xl text-icen-ink mt-3 leading-tight">{current.name}</h2>
                <div className="flex items-baseline gap-8 mt-6">
                  <div>
                    <div className="font-serif text-5xl text-icen-blue font-semibold">{current.chapters}</div>
                    <div className="icen-overline icen-overline-muted mt-1">Chapters</div>
                  </div>
                  <div>
                    <div className="font-serif text-5xl text-icen-green font-semibold">{current.countries.length}</div>
                    <div className="icen-overline icen-overline-muted mt-1">Countries</div>
                  </div>
                </div>
                <div className="mt-10">
                  <div className="icen-overline icen-overline-muted mb-4">Member Countries</div>
                  <div className="flex flex-wrap gap-2">
                    {current.countries.map((c) => (
                      <span key={c} className="px-3 py-1.5 border border-icen-line text-sm text-icen-inkSoft hover:border-icen-ink hover:text-icen-ink transition-colors">{c}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
