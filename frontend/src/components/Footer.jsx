import React from "react";
import { Link } from "react-router-dom";
import { ICENWordmark } from "./ICENEmblem";

export default function Footer() {
  return (
    <footer className="relative bg-icen-ivory border-t border-icen-line mt-24" data-testid="main-footer">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20 grid md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <ICENWordmark variant="dark" />
          <p className="mt-6 text-[15px] text-icen-inkSoft max-w-md leading-relaxed">
            A global council where emerging nations shape the future together. Independent, non-partisan, and built for the rising world.
          </p>
          <div className="mt-8 icen-overline">Geneva · New Delhi · Nairobi · São Paulo</div>
        </div>
        <div>
          <div className="icen-overline icen-overline-muted mb-5">Institution</div>
          <ul className="space-y-3 text-sm text-icen-inkSoft">
            <li><Link className="hover:text-icen-ink transition-colors" to="/about">About ICEN</Link></li>
            <li><Link className="hover:text-icen-ink transition-colors" to="/governance">Governance</Link></li>
            <li><Link className="hover:text-icen-ink transition-colors" to="/chapters">Chapters</Link></li>
            <li><Link className="hover:text-icen-ink transition-colors" to="/programs">Programs</Link></li>
          </ul>
        </div>
        <div>
          <div className="icen-overline icen-overline-muted mb-5">Engage</div>
          <ul className="space-y-3 text-sm text-icen-inkSoft">
            <li><Link className="hover:text-icen-ink transition-colors" to="/membership">Membership</Link></li>
            <li><Link className="hover:text-icen-ink transition-colors" to="/apply">Apply</Link></li>
            <li><Link className="hover:text-icen-ink transition-colors" to="/pillars">The 12 Pillars</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-icen-line">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="text-xs text-icen-muted tracking-wide">© 2026 ICEN — International Council for Emerging Nations. All rights reserved.</div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-icen-muted">Non-state · Non-partisan · Non-aligned</div>
        </div>
      </div>
    </footer>
  );
}
