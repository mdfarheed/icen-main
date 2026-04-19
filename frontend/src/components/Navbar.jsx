import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { ICENWordmark } from "./ICENEmblem";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/pillars", label: "Pillars" },
  { to: "/membership", label: "Membership" },
  { to: "/chapters", label: "Chapters" },
  { to: "/governance", label: "Governance" },
  { to: "/programs", label: "Programs" },
];

const INSIGHTS = [
  { to: "/blog", label: "Insights", desc: "Briefings & dispatches" },
  { to: "/research", label: "Research Library", desc: "Policy papers & indices" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [insightsOpen, setInsightsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); setInsightsOpen(false); }, [location]);

  return (
    <header
      data-testid="main-navbar"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-icen-ivory/92 backdrop-blur-xl border-b border-icen-line" : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-10 h-[72px] md:h-[80px] flex items-center justify-between">
        <Link to="/" data-testid="nav-logo" className="shrink-0">
          <ICENWordmark variant="dark" compact />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              data-testid={`nav-${n.label.toLowerCase()}`}
              className={({ isActive }) =>
                `px-3 py-2 text-[13px] tracking-wide font-medium transition-colors ${
                  isActive ? "text-icen-ink" : "text-icen-muted hover:text-icen-ink"
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
          {/* Insights dropdown */}
          <div className="relative"
            onMouseEnter={() => setInsightsOpen(true)}
            onMouseLeave={() => setInsightsOpen(false)}
          >
            <button
              data-testid="nav-insights-toggle"
              className={`px-3 py-2 text-[13px] tracking-wide font-medium flex items-center gap-1 transition-colors ${
                location.pathname.startsWith("/blog") || location.pathname.startsWith("/research") ? "text-icen-ink" : "text-icen-muted hover:text-icen-ink"
              }`}
            >
              Insights <ChevronDown size={14} className={`transition-transform ${insightsOpen ? "rotate-180" : ""}`} />
            </button>
            {insightsOpen && (
              <div className="absolute top-full right-0 pt-2 w-[280px]" data-testid="nav-insights-menu">
                <div className="bg-icen-paper border border-icen-line shadow-card">
                  {INSIGHTS.map(n => (
                    <Link key={n.to} to={n.to} className="block px-5 py-4 hover:bg-icen-ivory transition-colors border-b border-icen-line last:border-b-0">
                      <div className="font-serif text-lg text-icen-ink">{n.label}</div>
                      <div className="text-xs text-icen-muted mt-0.5">{n.desc}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link to="/apply" data-testid="nav-apply-cta" className="icen-btn-primary text-[11px] py-3 px-5">
            Apply
          </Link>
        </div>

        <button
          className="lg:hidden text-icen-ink p-2"
          onClick={() => setOpen(!open)}
          data-testid="nav-mobile-toggle"
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-icen-paper/98 backdrop-blur-xl border-t border-icen-line max-h-[calc(100vh-72px)] overflow-y-auto" data-testid="nav-mobile-panel">
          <div className="px-6 py-6 flex flex-col">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                className={({ isActive }) =>
                  `py-3 text-base tracking-wide font-medium border-b border-icen-line ${isActive ? "text-icen-ink" : "text-icen-muted"}`
                }
              >
                {n.label}
              </NavLink>
            ))}
            {INSIGHTS.map((n) => (
              <NavLink key={n.to} to={n.to} className={({isActive}) => `py-3 text-base tracking-wide font-medium border-b border-icen-line ${isActive ? "text-icen-ink":"text-icen-muted"}`}>
                {n.label}
              </NavLink>
            ))}
            <Link to="/apply" className="icen-btn-primary mt-5 justify-center">Apply for Membership</Link>
          </div>
        </div>
      )}
    </header>
  );
}
