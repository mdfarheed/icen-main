import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Calendar, ArrowLeft } from "lucide-react";
import SEO from "../components/SEO";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    axios.get(`${API}/blog/${slug}`).then(r => setPost(r.data)).catch(() => setErr("Post not found"));
  }, [slug]);

  if (err) return (
    <div className="pt-[160px] pb-24 text-center bg-icen-ivory">
      <div className="text-icen-muted">{err}</div>
      <Link to="/blog" className="icen-btn-ghost mt-6 inline-flex">← Back to Insights</Link>
    </div>
  );
  if (!post) return <div className="pt-[160px] pb-24 text-center text-icen-muted bg-icen-ivory">Loading…</div>;

  return (
    <article className="pt-[120px] pb-24 bg-icen-ivory" data-testid="blog-detail">
      <SEO title={post.title} description={post.excerpt} image={post.cover_image} path={`/blog/${post.slug}`} type="article" />
      <div className="max-w-[820px] mx-auto px-6 lg:px-10">
        <Link to="/blog" className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-icen-muted hover:text-icen-ink mb-8">
          <ArrowLeft size={13} /> Insights
        </Link>
        <div className="icen-overline mb-5">{post.tags?.[0] || "Briefing"}</div>
        <h1 className="font-serif text-4xl md:text-6xl text-icen-ink leading-[1.05] tracking-tight">{post.title}</h1>
        <div className="flex items-center gap-4 mt-6 text-sm text-icen-muted">
          <span className="flex items-center gap-2"><Calendar size={13} /> {new Date(post.published_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</span>
          <span>·</span>
          <span>{post.author}</span>
        </div>
      </div>
      {post.cover_image && (
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 mt-12">
          <div className="aspect-[16/8] w-full overflow-hidden">
            <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        </div>
      )}
      <div className="max-w-[780px] mx-auto px-6 lg:px-10 mt-14">
        <div className="font-serif text-xl text-icen-inkSoft italic border-l-2 border-icen-blue pl-5">
          {post.excerpt}
        </div>
        <div className="mt-10 text-[17px] text-icen-ink leading-[1.85] space-y-6 whitespace-pre-wrap">
          {post.body}
        </div>
        <div className="mt-14 pt-8 border-t border-icen-line flex flex-wrap gap-2">
          {(post.tags || []).map(t => (
            <span key={t} className="px-3 py-1 text-[11px] uppercase tracking-[0.2em] border border-icen-line text-icen-inkSoft">{t}</span>
          ))}
        </div>
      </div>
    </article>
  );
}
