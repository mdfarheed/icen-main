import React from "react";
import { motion } from "framer-motion";
import { GOVERNANCE } from "../content/icen";
import SEO from "../components/SEO";

function FlowNode({ x, y, w = 220, h = 80, label, meta, accent = false, testid }) {
  return (
    <g data-testid={testid}>
      <rect x={x} y={y} width={w} height={h}
        fill={accent ? "#0A1628" : "#FFFFFF"}
        stroke={accent ? "#0A1628" : "#E6E1D5"}
        strokeWidth="1" />
      <text x={x + 16} y={y + 30} fill={accent ? "#FFFFFF" : "#0A1628"} fontFamily="Playfair Display, serif" fontSize="18" fontWeight="600">{label}</text>
      <text x={x + 16} y={y + 54} fill={accent ? "rgba(255,255,255,0.6)" : "#6B7280"} fontFamily="Manrope, sans-serif" fontSize="11" letterSpacing="1.5">{meta}</text>
    </g>
  );
}

function AnimatedLine({ d, delay = 0 }) {
  return (
    <motion.path
      d={d}
      stroke="#0057FF"
      strokeWidth="1.3"
      fill="none"
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.4, delay, ease: "easeInOut" }}
    />
  );
}

export default function Governance() {
  return (
    <div className="pt-[120px] pb-24 bg-icen-ivory" data-testid="governance-page">
      <SEO title="Councils & Governance" description="The architecture of the ICEN council — General Assembly, Secretariat, twelve Pillar Councils, and eight Regional Chapters." path="/governance" />
      <div className="max-w-[1300px] mx-auto px-6 lg:px-10">
        <div className="icen-overline mb-6">Councils & Governance</div>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl text-icen-ink leading-[1.04] tracking-tight max-w-4xl">
          Architecture of the <em className="italic text-icen-blue">council.</em>
        </h1>
        <p className="mt-8 text-lg text-icen-inkSoft max-w-2xl leading-relaxed">
          ICEN is governed by a General Assembly, served by a Secretariat, and organized through twelve Pillar Councils and eight Regional Chapters.
        </p>

        <div className="mt-16 bg-icen-paper border border-icen-line p-6 md:p-10 overflow-x-auto">
          <svg viewBox="0 0 1000 600" className="w-full min-w-[780px] h-[520px]">
            <FlowNode x={390} y={30} w={220} h={90} label={GOVERNANCE.root.label} meta={GOVERNANCE.root.meta} accent testid="gov-root" />
            <FlowNode x={60} y={220} w={230} h={80} label={GOVERNANCE.children[0].label} meta={GOVERNANCE.children[0].meta} testid="gov-secretariat" />
            <FlowNode x={385} y={220} w={230} h={80} label={GOVERNANCE.children[1].label} meta={GOVERNANCE.children[1].meta} accent testid="gov-council" />
            <FlowNode x={710} y={220} w={230} h={80} label={GOVERNANCE.children[2].label} meta={GOVERNANCE.children[2].meta} testid="gov-regional" />
            <FlowNode x={30} y={420} w={200} h={70} label="Summit Commission" meta="Annual convening" testid="gov-summit" />
            <FlowNode x={250} y={420} w={200} h={70} label="Ethics Board" meta="Independent oversight" testid="gov-ethics" />
            <FlowNode x={500} y={420} w={200} h={70} label="Policy Lab" meta="Framework design" testid="gov-policy" />
            <FlowNode x={720} y={420} w={200} h={70} label="Country Chapters" meta="Local leadership" testid="gov-chapters" />

            <AnimatedLine d="M500 120 C 500 170, 175 170, 175 220" />
            <AnimatedLine d="M500 120 L 500 220" delay={0.2} />
            <AnimatedLine d="M500 120 C 500 170, 825 170, 825 220" delay={0.4} />
            <AnimatedLine d="M175 300 C 175 360, 130 360, 130 420" delay={0.6} />
            <AnimatedLine d="M175 300 C 175 360, 350 360, 350 420" delay={0.8} />
            <AnimatedLine d="M500 300 L 500 420" delay={1.0} />
            <AnimatedLine d="M825 300 C 825 360, 820 360, 820 420" delay={1.2} />
          </svg>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-4">
          {[
            { k: "General Assembly", v: "Every member nation and Fellow has a vote. Meets annually to adopt the ICEN Agenda." },
            { k: "Secretariat", v: "A permanent executive office in Geneva. Coordinates programs, summits, and day-to-day operations." },
            { k: "Pillar Councils", v: "Twelve councils — one per pillar — chaired by elected experts. They draft the frameworks we adopt." },
          ].map((b) => (
            <div key={b.k} className="icen-card p-8">
              <div className="icen-overline">{b.k}</div>
              <div className="font-serif text-xl text-icen-ink mt-4 leading-snug">{b.v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
