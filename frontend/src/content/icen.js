// ICEN premium institutional copy + data
export const PILLARS = [
  { id: 1, slug: "sovereign-economy", title: "Sovereign Economy", icon: "TrendingUp", desc: "Empower emerging nations to build resilient, diversified, and globally competitive economies on their own terms." },
  { id: 2, slug: "technology-sovereignty", title: "Technology & Sovereignty", icon: "Cpu", desc: "Advance digital infrastructure, AI, and semiconductor capacity as instruments of national sovereignty." },
  { id: 3, slug: "climate-energy", title: "Climate & Energy", icon: "Leaf", desc: "Lead the global just-transition with clean-energy corridors, critical minerals, and climate finance." },
  { id: 4, slug: "peace-security", title: "Peace & Security", icon: "Shield", desc: "A doctrine of stability — diplomacy first, deterrence when needed, intervention only with mandate." },
  { id: 5, slug: "trade-capital", title: "Trade & Capital", icon: "Coins", desc: "New corridors of trade, settlement systems, and sovereign funds aligned with the rising world." },
  { id: 6, slug: "science-research", title: "Science & Research", icon: "FlaskConical", desc: "Fund frontier science — biotech, quantum, space — and return authorship to the Global South." },
  { id: 7, slug: "education-talent", title: "Education & Talent", icon: "GraduationCap", desc: "A continental talent pipeline — universities, labs, fellowships — engineered for 2050." },
  { id: 8, slug: "health-longevity", title: "Health & Longevity", icon: "HeartPulse", desc: "Build regional manufacturing, digital health, and pandemic-grade response infrastructure." },
  { id: 9, slug: "infrastructure", title: "Infrastructure", icon: "Building2", desc: "Ports, rail, power, fiber — the quiet arithmetic of national power." },
  { id: 10, slug: "culture-soft-power", title: "Culture & Soft Power", icon: "Sparkles", desc: "Cinema, design, music, sport — the architecture of influence in a multi-polar century." },
  { id: 11, slug: "governance-rule-of-law", title: "Governance & Rule of Law", icon: "Scale", desc: "Institutions that outlast governments. Transparency, accountability, civic trust." },
  { id: 12, slug: "youth-future", title: "Youth & Future", icon: "Users", desc: "The demographic dividend is a policy choice. Make it deliberate, make it measurable." },
];

// Curated Unsplash imagery — institutional / impact visuals
export const IMPACT_IMAGES = {
  hero: "https://images.unsplash.com/photo-1496715976403-7e36dc43f17b?auto=format&fit=crop&w=2000&q=80",
  summit: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=2000&q=80",
  policy: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=2000&q=80",
  city: "https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&w=2000&q=80",
  africa: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=1600&q=80",
  infra: "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?auto=format&fit=crop&w=2000&q=80",
  youth: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1600&q=80",
  tech: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1600&q=80",
  climate: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1600&q=80",
  research: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1600&q=80",
  health: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1600&q=80",
  culture: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=1600&q=80",
  chamber: "https://images.unsplash.com/photo-1555848962-6e79363ec59f?auto=format&fit=crop&w=2000&q=80",
};

// Deep-dive per-pillar content
export const PILLAR_DETAILS = {
  "sovereign-economy": {
    summary: "Diversify, industrialize, and connect — on sovereign terms. Our Economy pillar designs blueprints for national economic resilience in a decoupling world.",
    image: IMPACT_IMAGES.infra,
    stats: [ {n:"12", l:"National strategies drafted"}, {n:"$2.4B", l:"Capital mobilized"}, {n:"46", l:"Working group members"} ],
    initiatives: [
      { title: "Industrial Policy 2.0", desc: "Model frameworks for strategic sectors: semiconductors, pharma, defense-industrial base." },
      { title: "Sovereign Capital Lab", desc: "Design of sovereign wealth and pension instruments for long-horizon national investment." },
      { title: "Economic Complexity Atlas", desc: "A public index mapping complexity and growth trajectories of all ICEN nations." },
    ],
    partners: ["UNIDO", "Regional DFIs", "Central Banks Forum"],
    question: "What does sovereignty look like when capital is borderless but industry is not?",
  },
  "technology-sovereignty": {
    summary: "Compute, data, and code as instruments of the state. This pillar equips emerging nations to govern the digital stack they depend on.",
    image: IMPACT_IMAGES.tech,
    stats: [ {n:"8", l:"Sovereign cloud initiatives"}, {n:"4", l:"AI governance papers"}, {n:"$900M", l:"Compute infra pledged"} ],
    initiatives: [
      { title: "Sovereign Cloud Charter", desc: "Reference architecture and procurement standards for national cloud infrastructure." },
      { title: "AI Governance Council", desc: "Cross-border framework for frontier AI deployment, audit, and risk." },
      { title: "Semiconductor Alliance", desc: "A member-state consortium on design, packaging, and supply-chain resilience." },
    ],
    partners: ["NASSCOM", "Smart Africa", "ASEAN Digital"],
    question: "Who should own the infrastructure that decides national destiny?",
  },
  "climate-energy": {
    summary: "A just transition designed by, and for, the world that needs it most. From critical minerals to clean-energy corridors, ICEN aligns climate ambition with sovereign interest.",
    image: IMPACT_IMAGES.climate,
    stats: [ {n:"27", l:"Energy transition plans"}, {n:"14", l:"Cross-border corridors"}, {n:"$3.2B", l:"Green finance aligned"} ],
    initiatives: [
      { title: "Critical Minerals Consortium", desc: "Coordinated processing and value-capture policies across producer nations." },
      { title: "Green-Corridor Finance", desc: "Blended finance templates for clean-energy interconnection." },
      { title: "Climate Justice Tribunal", desc: "Model dispute-resolution framework for climate-induced displacement and loss-and-damage." },
    ],
    partners: ["IRENA", "UNFCCC", "IEA emerging-markets"],
    question: "How does the Global South lead a transition it did not cause?",
  },
  "peace-security": {
    summary: "Stability is the precondition for everything else. This pillar codifies diplomacy, deterrence, and civil-military doctrine for emerging powers.",
    image: IMPACT_IMAGES.chamber,
    stats: [ {n:"6", l:"Mediation briefs"}, {n:"3", l:"Regional accords drafted"} , {n:"18", l:"Track-II dialogues"} ],
    initiatives: [
      { title: "Emerging-Powers Doctrine", desc: "A non-aligned strategic framework for security, deterrence, and restraint." },
      { title: "Track-II Mediation", desc: "Discreet back-channels between ministries in tension." },
      { title: "Maritime Commons", desc: "Freedom-of-navigation protocols for Indo-Pacific and Atlantic shipping." },
    ],
    partners: ["SIPRI", "IISS", "Regional peace councils"],
    question: "What is deterrence for nations that choose not to be aligned?",
  },
  "trade-capital": {
    summary: "New corridors, new instruments, new currencies of cooperation. Trade is the most under-used tool of sovereign power in the emerging world.",
    image: IMPACT_IMAGES.city,
    stats: [ {n:"$18B", l:"Trade flows catalyzed"}, {n:"9", l:"Settlement pilots"}, {n:"4", l:"Sovereign fund MoUs"} ],
    initiatives: [
      { title: "Local-Currency Settlement", desc: "Design of multilateral settlement layers for intra-ICEN trade." },
      { title: "Sovereign Fund Forum", desc: "A closed-door convening of the world's emerging-market wealth funds." },
      { title: "Africa-Asia Trade Corridor", desc: "Logistics, tariffs, and digital-customs blueprint." },
    ],
    partners: ["WTO emerging-markets", "AfCFTA", "ASEAN trade bodies"],
    question: "Can trade be the most quiet, most powerful instrument of diplomacy?",
  },
  "science-research": {
    summary: "Return authorship to the South. Fund frontier science from bio to quantum, and build the labs that produce Nobel-class work in our lifetime.",
    image: IMPACT_IMAGES.research,
    stats: [ {n:"62", l:"Fellowships awarded"}, {n:"11", l:"Research chairs"}, {n:"5", l:"National labs supported"} ],
    initiatives: [
      { title: "Rising Scientist Chairs", desc: "Tenured research chairs in strategic domains across emerging-nation universities." },
      { title: "Open-Science Compact", desc: "A multilateral open-data and IP-fair framework." },
      { title: "Space Nations Consortium", desc: "Shared upstream capacity and Earth-observation data." },
    ],
    partners: ["CERN observer programs", "TWAS", "Regional academies"],
    question: "What does sovereign science look like in an age of open knowledge?",
  },
  "education-talent": {
    summary: "A continental talent pipeline, engineered for 2050. The demographic dividend is a policy choice — make it deliberate.",
    image: IMPACT_IMAGES.youth,
    stats: [ {n:"14", l:"Partner universities"}, {n:"1.2K", l:"Fellows placed"}, {n:"38", l:"Curricula co-developed"} ],
    initiatives: [
      { title: "ICEN Fellowships", desc: "100 under-40 leaders placed inside governments and firms each year." },
      { title: "Global South Curriculum", desc: "Co-designed master's programs on sovereignty, AI, and development." },
      { title: "Skills Observatory", desc: "Data on labor-market signals and the future of work across member states." },
    ],
    partners: ["African Leadership Academy", "AIT", "Ashoka"],
    question: "What should a minister know in 2040 — and who is teaching them today?",
  },
  "health-longevity": {
    summary: "Regional biomanufacturing, digital health, and pandemic-grade response. Health sovereignty is national security.",
    image: IMPACT_IMAGES.health,
    stats: [ {n:"4", l:"Regional vaccine hubs"}, {n:"22", l:"Ministries supported"}, {n:"$1.1B", l:"Health-tech capital mobilized"} ],
    initiatives: [
      { title: "Vaccines & Biologics Hub", desc: "Regional mRNA and biologics manufacturing with sovereign IP pathways." },
      { title: "Pandemic Readiness Index", desc: "Annual independent scorecard of member-state preparedness." },
      { title: "Digital Public Health", desc: "Reference stacks for national health records and telemedicine." },
    ],
    partners: ["Africa CDC", "Medicines Patent Pool", "Gates Foundation partners"],
    question: "Can a country be sovereign if it cannot make its own medicines?",
  },
  "infrastructure": {
    summary: "Ports, rail, power, fiber — the quiet arithmetic of national power. Our Infrastructure pillar finances what maps prefer to hide.",
    image: IMPACT_IMAGES.infra,
    stats: [ {n:"31", l:"Priority projects shortlisted"}, {n:"$4.8B", l:"Pipeline under review"}, {n:"17", l:"PPP frameworks drafted"} ],
    initiatives: [
      { title: "Regional Grid Compact", desc: "A blueprint for continental electricity interconnection." },
      { title: "Dry-Port Corridors", desc: "Inland logistics for landlocked member states." },
      { title: "Fiber Sovereignty", desc: "Submarine-cable landings and national IXPs for digital resilience." },
    ],
    partners: ["AIIB", "AfDB", "Infrastructure Consortium for Africa"],
    question: "What do maps conceal that economies depend on?",
  },
  "culture-soft-power": {
    summary: "Cinema, design, sport, music. The architecture of influence in a multi-polar century — and one of the South's greatest unused assets.",
    image: IMPACT_IMAGES.culture,
    stats: [ {n:"52", l:"Cultural partners"}, {n:"$280M", l:"Creative-industry finance"}, {n:"8", l:"ICEN House residencies"} ],
    initiatives: [
      { title: "ICEN House", desc: "A residency network in Venice, Dakar, Lagos, São Paulo, and Delhi." },
      { title: "Sports Diplomacy Cabinet", desc: "Coordinating bids, hosting, and athlete exchange." },
      { title: "Global South Film Fund", desc: "A capital pool for auteur cinema from emerging nations." },
    ],
    partners: ["Biennale", "FIFA partners", "UNESCO cultural arm"],
    question: "What does influence look like when it is not measured in force?",
  },
  "governance-rule-of-law": {
    summary: "Institutions that outlast governments. Transparency, accountability, civic trust — the prerequisites of every other pillar.",
    image: IMPACT_IMAGES.policy,
    stats: [ {n:"19", l:"Ministerial dialogues"}, {n:"7", l:"Model statutes drafted"}, {n:"5", l:"Judicial observer missions"} ],
    initiatives: [
      { title: "Anti-Corruption Compact", desc: "Cross-border asset-recovery and beneficial-ownership transparency." },
      { title: "Civic Technology Fund", desc: "Public-interest software inside ministries and judiciaries." },
      { title: "Judicial Independence Observer", desc: "An independent scorecard for courts across member states." },
    ],
    partners: ["UNDP governance", "OECD anti-corruption", "StAR initiative"],
    question: "Which institutions will still be standing in fifty years — and who is building them?",
  },
  "youth-future": {
    summary: "Twenty-six is the median age of the emerging world. This is the policy choice that will define the century.",
    image: IMPACT_IMAGES.youth,
    stats: [ {n:"1.8B", l:"Under-25 population served"}, {n:"300", l:"Youth delegates"}, {n:"24", l:"Youth-policy frameworks"} ],
    initiatives: [
      { title: "Youth Assembly", desc: "A delegate body of under-35 leaders with voting rights at ICEN summits." },
      { title: "Civic Apprenticeships", desc: "Paid placements inside ministries for high-talent youth." },
      { title: "Future-Work Charter", desc: "A framework for the rights of platform and remote workers across the South." },
    ],
    partners: ["UN Youth", "YPO-G20", "Africa Youth Charter"],
    question: "Are we designing the future — or apologizing for it?",
  },
};

export const REGIONS = [
  { id: "africa", name: "Africa", chapters: 14, countries: ["Nigeria","Kenya","Egypt","South Africa","Ghana","Ethiopia","Morocco","Rwanda","Senegal","Tanzania"] },
  { id: "south-asia", name: "South Asia", chapters: 6, countries: ["India","Bangladesh","Sri Lanka","Nepal","Bhutan","Maldives"] },
  { id: "southeast-asia", name: "Southeast Asia", chapters: 9, countries: ["Indonesia","Vietnam","Philippines","Thailand","Malaysia","Singapore","Cambodia"] },
  { id: "mena", name: "Middle East & North Africa", chapters: 8, countries: ["UAE","Saudi Arabia","Qatar","Jordan","Tunisia","Oman","Bahrain"] },
  { id: "latam", name: "Latin America", chapters: 10, countries: ["Brazil","Mexico","Argentina","Colombia","Chile","Peru","Uruguay"] },
  { id: "central-asia", name: "Central Asia & Caucasus", chapters: 5, countries: ["Kazakhstan","Uzbekistan","Georgia","Armenia","Azerbaijan"] },
  { id: "east-europe", name: "Eastern Europe", chapters: 4, countries: ["Poland","Romania","Serbia","Moldova"] },
  { id: "pacific", name: "Pacific & Oceania", chapters: 3, countries: ["Fiji","Papua New Guinea","Samoa"] },
];

export const TIERS = [
  { id: "observer", name: "Observer", price: "Complimentary", badge: "Entry", highlight: false,
    features: ["Access to public ICEN briefings","Monthly Council newsletter","Invitations to open summits","Community directory (read-only)"] },
  { id: "fellow", name: "Fellow", price: "By invitation", badge: "Most Popular", highlight: true,
    features: ["Full Fellow voting rights","Private ICEN roundtables","Annual Summit delegate seat","Pillar working-group membership","Research library & policy briefs"] },
  { id: "council", name: "Council Member", price: "By nomination", badge: "Leadership", highlight: false,
    features: ["Seat on a Council Pillar","Voting rights on policy frameworks","Access to heads-of-state track","Co-author ICEN policy papers","Regional chapter leadership"] },
  { id: "founding", name: "Founding Nation", price: "Sovereign partners", badge: "Institutional", highlight: false,
    features: ["Country-level charter partnership","Policy lab co-development","Bilateral Secretariat access","Hosting rights for ICEN Summit","Cross-regional alliance building"] },
];

export const PROGRAMS = [
  { id: "summit", title: "ICEN Global Summit", tag: "Annual", desc: "A closed-door gathering of heads of state, ministers, and builders to set the emerging-world agenda for the year ahead." },
  { id: "accelerator", title: "Sovereign Accelerator", tag: "Rolling cohorts", desc: "A 9-month program for ventures and ministries building critical national capacity — from semiconductors to sovereign cloud." },
  { id: "policy-lab", title: "Policy Lab", tag: "Continuous", desc: "Where Council members co-draft model frameworks — digital assets, AI governance, mineral sovereignty — for adoption by member states." },
  { id: "fellowship", title: "Rising Fellows", tag: "Yearly cohort", desc: "100 under-40 leaders per year, placed inside governments, firms, and multilateral bodies across emerging regions." },
  { id: "bridge", title: "Capital Bridge", tag: "Ongoing", desc: "Matching sovereign capital, DFI, and private investors with pillar-aligned projects across the ICEN network." },
  { id: "observatory", title: "ICEN Observatory", tag: "Quarterly", desc: "A data, media, and intelligence arm — publishing the definitive index of emerging-world progress." },
];

export const GOVERNANCE = {
  root: { id: "general-assembly", label: "General Assembly", meta: "All member nations & Fellows" },
  children: [
    { id: "secretariat", label: "Secretariat", meta: "Executive office" },
    { id: "council", label: "Council of Pillars", meta: "12 Pillar chairs" },
    { id: "regional", label: "Regional Chapters", meta: "8 regions" },
  ],
  leaves: [
    { id: "policy", label: "Policy Lab", parent: "council" },
    { id: "summit", label: "Summit Commission", parent: "secretariat" },
    { id: "ethics", label: "Ethics Board", parent: "secretariat" },
    { id: "chapters", label: "Country Chapters", parent: "regional" },
    { id: "youth", label: "Youth Assembly", parent: "regional" },
  ],
};

export const HERO_ARCS = [
  { startLat: 9.0820, startLng: 8.6753, endLat: 20.5937, endLng: 78.9629 },
  { startLat: -14.2350, startLng: -51.9253, endLat: 1.3521, endLng: 103.8198 },
  { startLat: 30.0444, startLng: 31.2357, endLat: -1.2921, endLng: 36.8219 },
  { startLat: 23.8859, startLng: 45.0792, endLat: 14.0583, endLng: 108.2772 },
  { startLat: 48.0196, startLng: 66.9237, endLat: -30.5595, endLng: 22.9375 },
  { startLat: 4.5709, startLng: -74.2973, endLat: 41.8719, endLng: 12.5674 },
  { startLat: -0.7893, startLng: 113.9213, endLat: 12.8628, endLng: 30.2176 },
  { startLat: 23.6345, startLng: -102.5528, endLat: 9.145, endLng: 40.4897 },
  { startLat: 38.9637, startLng: 35.2433, endLat: -25.2744, endLng: 133.7751 },
  { startLat: 31.7917, startLng: -7.0926, endLat: 15.2000, endLng: 101.0000 },
  { startLat: 33.9391, startLng: 67.7100, endLat: -9.1900, endLng: -75.0152 },
  { startLat: 7.8731, startLng: 80.7718, endLat: -15.7942, endLng: -47.8822 },
];

export const HERO_POINTS = [
  { lat: 20.5937, lng: 78.9629, size: 0.6, label: "New Delhi" },
  { lat: 9.0820, lng: 8.6753, size: 0.5, label: "Abuja" },
  { lat: -14.2350, lng: -51.9253, size: 0.6, label: "Brasília" },
  { lat: -1.2921, lng: 36.8219, size: 0.45, label: "Nairobi" },
  { lat: 30.0444, lng: 31.2357, size: 0.5, label: "Cairo" },
  { lat: -6.2088, lng: 106.8456, size: 0.55, label: "Jakarta" },
  { lat: 23.8859, lng: 45.0792, size: 0.5, label: "Riyadh" },
  { lat: 1.3521, lng: 103.8198, size: 0.45, label: "Singapore" },
  { lat: 48.0196, lng: 66.9237, size: 0.45, label: "Astana" },
  { lat: 14.0583, lng: 108.2772, size: 0.4, label: "Hanoi" },
  { lat: 4.5709, lng: -74.2973, size: 0.4, label: "Bogotá" },
  { lat: 31.7917, lng: -7.0926, size: 0.4, label: "Rabat" },
];
