import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ArrowUpRight, Calendar } from "lucide-react";
import SEO from "../components/SEO";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const PAGE_SIZE = 9;

export default function Blog() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState("All");
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => {
    axios.get(`${API}/blog`).then(r => setItems(r.data.items || [])).finally(() => setLoading(false));
  }, []);

  const tags = useMemo(() => {
    const set = new Set();
    items.forEach(i => (i.tags || []).forEach(t => set.add(t)));
    return ["All", ...Array.from(set)];
  }, [items]);

  const filtered = useMemo(() => {
    if (activeTag === "All") return items;
    return items.filter(i => (i.tags || []).includes(activeTag));
  }, [items, activeTag]);

  useEffect(() => { setVisible(PAGE_SIZE); }, [activeTag]);

  const shown = filtered.slice(0, visible);

  return (
    <div className="pt-[120px] pb-24 bg-icen-ivory" data-testid="blog-page">
      <SEO title="Insights" description="Briefings, notes, and dispatches from the ICEN Secretariat on sovereignty, policy, and the rising world." path="/blog" />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="icen-overline mb-6">Insights</div>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl text-icen-ink leading-[1.04] tracking-tight max-w-4xl">
          Dispatches from the <em className="italic text-icen-blue">Secretariat.</em>
        </h1>
        <p className="mt-8 text-lg text-icen-inkSoft max-w-2xl leading-relaxed">
          Briefings, notes, and occasional essays from our pillars, chapters, and working groups.
        </p>

        {/* Tag filter */}
        {tags.length > 1 && (
          <div className="mt-10 flex flex-wrap gap-2" data-testid="blog-tag-filter">
            {tags.map(t => (
              <button
                key={t}
                onClick={() => setActiveTag(t)}
                data-testid={`blog-tag-${t.toLowerCase().replace(/\s+/g, "-")}`}
                className={`text-[11px] px-3 py-2 uppercase tracking-[0.2em] border transition-all ${
                  activeTag === t ? "border-icen-ink bg-icen-ink text-white" : "border-icen-line text-icen-inkSoft hover:border-icen-ink/50"
                }`}
              >{t}</button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="mt-16 text-icen-muted">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="mt-16 text-icen-muted">No posts in this tag yet.</div>
        ) : (
          <>
            <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shown.map((p) => (
                <Link key={p.id} to={`/blog/${p.slug}`} className="group icen-card overflow-hidden flex flex-col" data-testid={`blog-card-${p.slug}`}>
                  <div className="aspect-[16/10] overflow-hidden bg-icen-mist">
                    {p.cover_image && (
                      <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                    )}
                  </div>
                  <div className="p-7 flex flex-col flex-1">
                    <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-icen-muted">
                      <Calendar size={12} /> {new Date(p.published_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                      <span>·</span>
                      <span className="text-icen-blue font-semibold">{p.tags?.[0] || "Briefing"}</span>
                    </div>
                    <h3 className="font-serif text-2xl text-icen-ink mt-4 leading-tight group-hover:text-icen-blue transition-colors">{p.title}</h3>
                    <p className="mt-3 text-[14px] text-icen-inkSoft leading-relaxed flex-1">{p.excerpt}</p>
                    <div className="mt-6 flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-icen-ink">
                      Read <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filtered.length > visible && (
              <div className="mt-14 flex justify-center">
                <button
                  onClick={() => setVisible(v => v + PAGE_SIZE)}
                  data-testid="blog-load-more"
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
