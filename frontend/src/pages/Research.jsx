import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FileText, Download, Users } from "lucide-react";
import SEO from "../components/SEO";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const PAGE_SIZE = 8;

export default function Research() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePillar, setActivePillar] = useState("All");
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => {
    axios.get(`${API}/research`).then(r => setItems(r.data.items || [])).finally(() => setLoading(false));
  }, []);

  const pillars = useMemo(() => {
    const set = new Set();
    items.forEach(i => { if (i.pillar) set.add(i.pillar); });
    return ["All", ...Array.from(set)];
  }, [items]);

  const filtered = useMemo(() => {
    if (activePillar === "All") return items;
    return items.filter(i => i.pillar === activePillar);
  }, [items, activePillar]);

  useEffect(() => { setVisible(PAGE_SIZE); }, [activePillar]);

  const shown = filtered.slice(0, visible);

  return (
    <div className="pt-[120px] pb-24 bg-icen-ivory" data-testid="research-page">
      <SEO title="Research Library" description="Peer-reviewed research papers, policy frameworks, and indices from ICEN's twelve pillars and Observatory." path="/research" />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="icen-overline mb-6">Research Library</div>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl text-icen-ink leading-[1.04] tracking-tight max-w-4xl">
          Frameworks, indices, <em className="italic text-icen-blue">and evidence.</em>
        </h1>
        <p className="mt-8 text-lg text-icen-inkSoft max-w-2xl leading-relaxed">
          Working papers and policy frameworks from the ICEN Observatory, pillar councils, and member-state collaborations.
        </p>

        {pillars.length > 1 && (
          <div className="mt-10 flex flex-wrap gap-2" data-testid="research-pillar-filter">
            {pillars.map(p => (
              <button
                key={p}
                onClick={() => setActivePillar(p)}
                data-testid={`research-pillar-${p.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and")}`}
                className={`text-[11px] px-3 py-2 uppercase tracking-[0.2em] border transition-all ${
                  activePillar === p ? "border-icen-ink bg-icen-ink text-white" : "border-icen-line text-icen-inkSoft hover:border-icen-ink/50"
                }`}
              >{p}</button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="mt-16 text-icen-muted">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="mt-16 text-icen-muted">No papers in this pillar yet.</div>
        ) : (
          <>
            <div className="mt-12 grid md:grid-cols-2 gap-6">
              {shown.map((p) => (
                <Link key={p.id} to={`/research/${p.slug}`} className="group icen-card p-0 overflow-hidden flex flex-col md:flex-row" data-testid={`research-card-${p.slug}`}>
                  {p.cover_image && (
                    <div className="md:w-[240px] md:min-w-[240px] aspect-[3/2] md:aspect-auto overflow-hidden bg-icen-mist">
                      <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                    </div>
                  )}
                  <div className="p-7 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-icen-blue font-semibold">
                      <FileText size={12} /> {p.pillar || "Observatory"}
                    </div>
                    <h3 className="font-serif text-xl md:text-2xl text-icen-ink mt-3 leading-tight group-hover:text-icen-blue transition-colors">{p.title}</h3>
                    <p className="mt-3 text-[13.5px] text-icen-inkSoft leading-relaxed flex-1 line-clamp-4">{p.abstract}</p>
                    <div className="mt-5 flex items-center justify-between text-[11px] text-icen-muted">
                      <span className="flex items-center gap-1"><Users size={12} /> {(p.authors || []).length} author{(p.authors||[]).length===1?"":"s"}</span>
                      <span className="flex items-center gap-1 text-icen-ink uppercase tracking-[0.22em] font-semibold">Read <Download size={12} /></span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filtered.length > visible && (
              <div className="mt-14 flex justify-center">
                <button
                  onClick={() => setVisible(v => v + PAGE_SIZE)}
                  data-testid="research-load-more"
                  className="icen-btn-ghost"
                >
                  Load more ({filtered.length - visible} remaining)
                </button>
              </div>
            )}
            <div className="mt-6 text-center text-xs text-icen-muted">
              Showing {shown.length} of {filtered.length}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
