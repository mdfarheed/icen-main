import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Download, Users } from "lucide-react";
import SEO from "../components/SEO";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ResearchDetail() {
  const { slug } = useParams();
  const [paper, setPaper] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    axios.get(`${API}/research/${slug}`).then(r => setPaper(r.data)).catch(() => setErr("Paper not found"));
  }, [slug]);

  if (err) return (
    <div className="pt-[160px] pb-24 text-center bg-icen-ivory">
      <div className="text-icen-muted">{err}</div>
      <Link to="/research" className="icen-btn-ghost mt-6 inline-flex">← Back to Library</Link>
    </div>
  );
  if (!paper) return <div className="pt-[160px] pb-24 text-center text-icen-muted bg-icen-ivory">Loading…</div>;

  return (
    <article className="pt-[120px] pb-24 bg-icen-ivory" data-testid="research-detail">
      <SEO title={paper.title} description={paper.abstract} image={paper.cover_image} path={`/research/${paper.slug}`} type="article" />
      <div className="max-w-[820px] mx-auto px-6 lg:px-10">
        <Link to="/research" className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-icen-muted hover:text-icen-ink mb-8">
          <ArrowLeft size={13} /> Research Library
        </Link>
        <div className="icen-overline mb-5">{paper.pillar || "Observatory"}</div>
        <h1 className="font-serif text-4xl md:text-6xl text-icen-ink leading-[1.05] tracking-tight">{paper.title}</h1>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-6 text-sm text-icen-muted">
          <span className="flex items-center gap-2"><Users size={13} /> {(paper.authors || []).join(", ")}</span>
          <span>·</span>
          <span>Published {new Date(paper.published_at).toLocaleDateString(undefined, { year: "numeric", month: "long" })}</span>
        </div>
      </div>
      {paper.cover_image && (
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 mt-12">
          <div className="aspect-[16/7] w-full overflow-hidden">
            <img src={paper.cover_image} alt={paper.title} className="w-full h-full object-cover" />
          </div>
        </div>
      )}
      <div className="max-w-[780px] mx-auto px-6 lg:px-10 mt-14">
        <div className="icen-overline mb-4">Abstract</div>
        <div className="font-serif text-xl text-icen-inkSoft italic border-l-2 border-icen-blue pl-5">
          {paper.abstract}
        </div>

        <div className="mt-12 text-[17px] text-icen-ink leading-[1.85] space-y-6 whitespace-pre-wrap">
          {paper.body}
        </div>

        {paper.pdf_url && (
          <a href={paper.pdf_url} target="_blank" rel="noreferrer" className="icen-btn-primary mt-12 inline-flex" data-testid="research-pdf-download">
            Download PDF <Download size={14} />
          </a>
        )}
      </div>
    </article>
  );
}
