import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PROGRAMS } from "../content/icen";
import SEO from "../components/SEO";

export default function Programs() {
  return (
    <div className="pt-[120px] pb-24 bg-icen-ivory" data-testid="programs-page">
      <SEO title="Programs" description="Instruments of consequence — Summit, Accelerator, Policy Lab, Fellows, Capital Bridge, and Observatory." path="/programs" />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="icen-overline mb-6">Programs</div>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl text-icen-ink leading-[1.04] tracking-tight max-w-4xl">
          Instruments of <em className="italic text-icen-blue">consequence.</em>
        </h1>
        <p className="mt-8 text-lg text-icen-inkSoft max-w-2xl leading-relaxed">
          Our programs are the mechanism through which the council acts — convening, building, funding, and publishing.
        </p>

        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROGRAMS.map((p, i) => (
            <motion.div
              key={p.id}
              data-testid={`program-card-${p.id}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
              className="group relative overflow-hidden icen-card"
            >
              <div className="p-8 min-h-[320px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] uppercase tracking-[0.28em] text-icen-blue font-semibold">{p.tag}</div>
                    <ArrowUpRight className="text-icen-muted group-hover:text-icen-ink group-hover:-translate-y-1 group-hover:translate-x-1 transition-all" size={18} />
                  </div>
                  <h3 className="font-serif text-3xl md:text-4xl text-icen-ink mt-6 leading-tight">{p.title}</h3>
                </div>
                <p className="text-[14px] text-icen-inkSoft leading-relaxed mt-8">{p.desc}</p>
              </div>
              <div className="h-[2px] bg-gradient-to-r from-icen-blue via-icen-green to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
