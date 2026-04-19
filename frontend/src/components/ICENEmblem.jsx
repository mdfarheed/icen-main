import React from "react";

// ICEN Emblem — refined institutional mark
export default function ICENEmblem({ size = 44, className = "", variant = "dark" }) {
  const ink = variant === "dark" ? "#0A1628" : "#FFFFFF";
  const accent = "#0057FF";
  const subtle = variant === "dark" ? "rgba(10,22,40,0.28)" : "rgba(255,255,255,0.32)";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="ICEN Emblem"
    >
      <circle cx="40" cy="40" r="38" stroke={subtle} strokeWidth="0.6" />
      <g stroke={ink} strokeWidth="0.9">
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i * 360) / 24;
          const rad = (a * Math.PI) / 180;
          const x1 = 40 + Math.cos(rad) * 34;
          const y1 = 40 + Math.sin(rad) * 34;
          const x2 = 40 + Math.cos(rad) * 36;
          const y2 = 40 + Math.sin(rad) * 36;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </g>
      <circle cx="40" cy="40" r="30" stroke={ink} strokeWidth="1.2" />
      <circle cx="40" cy="40" r="22" stroke={ink} strokeWidth="1.4" fill="none" />
      <ellipse cx="40" cy="40" rx="22" ry="8" stroke={ink} strokeWidth="0.9" />
      <ellipse cx="40" cy="40" rx="22" ry="15" stroke={ink} strokeWidth="0.7" />
      <ellipse cx="40" cy="40" rx="14" ry="22" stroke={ink} strokeWidth="0.7" />
      <line x1="40" y1="18" x2="40" y2="62" stroke={ink} strokeWidth="0.9" />
      <path d="M 40 18 A 18 22 0 0 1 40 62" stroke={accent} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M 30 46 L 40 36 L 50 46" stroke={accent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="40" cy="18" r="1.8" fill={accent} />
    </svg>
  );
}

/**
 * Wordmark — shows ICEN + full "International Council for Emerging Nations" tagline.
 * variant: "dark" (for light backgrounds) | "light" (for dark backgrounds)
 * compact: tighter form used in navbar (smaller emblem + slightly shorter tagline treatment)
 */
export function ICENWordmark({ className = "", variant = "dark", compact = false }) {
  const ink = variant === "dark" ? "text-icen-ink" : "text-white";
  const sub = variant === "dark" ? "text-icen-blue" : "text-icen-blueSoft";
  const muted = variant === "dark" ? "text-icen-muted" : "text-white/60";
  return (
    <div className={`flex items-center gap-3 md:gap-4 ${className}`} data-testid="icen-wordmark">
      <ICENEmblem size={compact ? 38 : 48} variant={variant} />
      <div className="leading-tight">
        <div className={`font-serif ${compact ? "text-[20px]" : "text-[24px]"} tracking-[0.22em] ${ink} font-semibold`}>ICEN</div>
        <div className={`${compact ? "text-[8.5px]" : "text-[9.5px]"} tracking-[0.26em] uppercase ${sub} font-sans font-semibold mt-0.5 hidden sm:block`}>
          International Council<span className={muted}> · </span>Emerging Nations
        </div>
      </div>
    </div>
  );
}
