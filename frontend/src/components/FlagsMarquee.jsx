import React from "react";

// Rotating flags marquee — continuous horizontal scroll, institutional/editorial style
// Uses flagcdn.com for consistent SVG flags
const NATIONS = [
  { code: "ng", name: "Nigeria" },
  { code: "in", name: "India" },
  { code: "br", name: "Brazil" },
  { code: "ke", name: "Kenya" },
  { code: "eg", name: "Egypt" },
  { code: "id", name: "Indonesia" },
  { code: "sa", name: "Saudi Arabia" },
  { code: "za", name: "South Africa" },
  { code: "kz", name: "Kazakhstan" },
  { code: "vn", name: "Vietnam" },
  { code: "co", name: "Colombia" },
  { code: "ma", name: "Morocco" },
  { code: "ph", name: "Philippines" },
  { code: "mx", name: "Mexico" },
  { code: "pe", name: "Peru" },
  { code: "et", name: "Ethiopia" },
  { code: "sn", name: "Senegal" },
  { code: "th", name: "Thailand" },
  { code: "ar", name: "Argentina" },
  { code: "cl", name: "Chile" },
  { code: "my", name: "Malaysia" },
  { code: "ae", name: "UAE" },
  { code: "gh", name: "Ghana" },
  { code: "rw", name: "Rwanda" },
  { code: "tz", name: "Tanzania" },
  { code: "bd", name: "Bangladesh" },
  { code: "lk", name: "Sri Lanka" },
  { code: "np", name: "Nepal" },
  { code: "uz", name: "Uzbekistan" },
  { code: "ge", name: "Georgia" },
  { code: "am", name: "Armenia" },
  { code: "az", name: "Azerbaijan" },
  { code: "pl", name: "Poland" },
  { code: "ro", name: "Romania" },
  { code: "rs", name: "Serbia" },
  { code: "md", name: "Moldova" },
  { code: "fj", name: "Fiji" },
  { code: "pg", name: "Papua New Guinea" },
  { code: "qa", name: "Qatar" },
  { code: "jo", name: "Jordan" },
  { code: "tn", name: "Tunisia" },
  { code: "om", name: "Oman" },
  { code: "sg", name: "Singapore" },
  { code: "kh", name: "Cambodia" },
  { code: "uy", name: "Uruguay" },
  { code: "mv", name: "Maldives" },
  { code: "bt", name: "Bhutan" },
  { code: "ws", name: "Samoa" },
  { code: "bh", name: "Bahrain" },
  { code: "mw", name: "Malawi" },
];

function Row({ nations, reverse = false, speed = 60 }) {
  // Duplicate the list for seamless loop
  const doubled = [...nations, ...nations];
  return (
    <div className="relative overflow-hidden marquee-mask">
      <div
        className={`flex items-center gap-10 md:gap-14 py-4 whitespace-nowrap ${reverse ? "animate-marquee-r" : "animate-marquee-l"}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {doubled.map((n, i) => (
          <div key={`${n.code}-${i}`} className="flex items-center gap-3 shrink-0 group">
            <div className="w-12 h-8 md:w-16 md:h-10 overflow-hidden border border-icen-line bg-icen-paper shadow-soft">
              <img
                src={`https://flagcdn.com/w160/${n.code}.png`}
                srcSet={`https://flagcdn.com/w160/${n.code}.png 1x, https://flagcdn.com/w320/${n.code}.png 2x`}
                alt={n.name}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-serif text-base md:text-lg text-icen-ink whitespace-nowrap tracking-tight">
              {n.name}
            </span>
            <span className="w-1.5 h-1.5 bg-icen-blue/50 rounded-full mx-2" aria-hidden />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FlagsMarquee() {
  return (
    <section className="relative bg-icen-paper border-y border-icen-line py-14 md:py-20 overflow-hidden" data-testid="flags-marquee">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 mb-10 md:mb-14">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <div>
            <div className="icen-overline mb-4">The Fifty</div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-icen-ink leading-[1.06] tracking-tight">
              Member nations of the <em className="italic text-icen-blue">rising world.</em>
            </h2>
          </div>
          <p className="max-w-sm text-icen-inkSoft text-[14.5px] leading-relaxed">
            From Jakarta to Bogotá, Nairobi to Astana — the ICEN network spans emerging economies across every habitable continent.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <Row nations={NATIONS.slice(0, 25)} speed={75} />
        <Row nations={NATIONS.slice(25)} speed={90} reverse />
      </div>
    </section>
  );
}
