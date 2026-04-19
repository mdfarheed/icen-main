import React from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { geoMercator } from "d3-geo";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MEMBER_NATIONS } from "../content/nations";

const WORLD_TOPO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const CAPITALS = [
  { name: "New Delhi", coords: [77.2090, 28.6139] },
  { name: "Abuja",     coords: [7.4913, 9.0820] },
  { name: "Brasília",  coords: [-47.8825, -15.7942] },
  { name: "Nairobi",   coords: [36.8219, -1.2921] },
  { name: "Cairo",     coords: [31.2357, 30.0444] },
  { name: "Jakarta",   coords: [106.8456, -6.2088] },
  { name: "Riyadh",    coords: [46.6753, 24.7136] },
  { name: "Singapore", coords: [103.8198, 1.3521] },
  { name: "Astana",    coords: [71.4491, 51.1694] },
  { name: "Hanoi",     coords: [105.8342, 21.0278] },
  { name: "Bogotá",    coords: [-74.0721, 4.7110] },
  { name: "Rabat",     coords: [-6.8416, 34.0209] },
  { name: "Manila",    coords: [120.9842, 14.5995] },
  { name: "Mexico City", coords: [-99.1332, 19.4326] },
  { name: "Lima",      coords: [-77.0428, -12.0464] },
  { name: "Addis Ababa", coords: [38.7469, 9.1450] },
  { name: "Dakar",     coords: [-17.4676, 14.7167] },
  { name: "Cape Town", coords: [18.4241, -33.9249] },
];

const ARCS = [
  [CAPITALS[1], CAPITALS[0]],
  [CAPITALS[2], CAPITALS[5]],
  [CAPITALS[4], CAPITALS[3]],
  [CAPITALS[6], CAPITALS[9]],
  [CAPITALS[8], CAPITALS[17]],
  [CAPITALS[10], CAPITALS[11]],
  [CAPITALS[5], CAPITALS[16]],
  [CAPITALS[13], CAPITALS[15]],
  [CAPITALS[11], CAPITALS[9]],
  [CAPITALS[14], CAPITALS[0]],
];

function curvePath(proj, a, b, lift = 0.18) {
  const [ax, ay] = proj(a);
  const [bx, by] = proj(b);
  if (isNaN(ax) || isNaN(bx)) return "";
  const mx = (ax + bx) / 2, my = (ay + by) / 2;
  const dx = bx - ax, dy = by - ay;
  const len = Math.sqrt(dx * dx + dy * dy);
  const nx = -dy / (len || 1), ny = dx / (len || 1);
  const cx = mx + nx * len * lift, cy = my + ny * len * lift;
  return `M ${ax} ${ay} Q ${cx} ${cy} ${bx} ${by}`;
}

export default function WorldMap({ height = 560 }) {
  const navigate = useNavigate();
  const width = 1200;
  const projection = geoMercator().scale(175).center([20, 10]).translate([width / 2, height / 2.1]);

  return (
    <div className="relative w-full overflow-hidden" style={{ height }} data-testid="world-map">
      <ComposableMap projection={projection} width={width} height={height} style={{ width: "100%", height: "100%" }}>
        <Geographies geography={WORLD_TOPO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const member = MEMBER_NATIONS[geo.properties.name];
              const isMember = Boolean(member);
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => { if (member) navigate(`/nation/${member.slug}`); }}
                  data-testid={isMember ? `map-country-${member.slug}` : undefined}
                  style={{
                    default: {
                      fill: isMember ? "#CFD9FE" : "#E6E1D5",
                      stroke: isMember ? "#0057FF" : "#D7CFBD",
                      strokeWidth: isMember ? 0.6 : 0.4,
                      outline: "none",
                      cursor: isMember ? "pointer" : "default",
                    },
                    hover: {
                      fill: isMember ? "#0057FF" : "#D7CFBD",
                      stroke: isMember ? "#0A1628" : "#0A1628",
                      strokeWidth: 0.6,
                      outline: "none",
                      cursor: isMember ? "pointer" : "default",
                    },
                    pressed: { fill: "#0A1628", outline: "none" },
                  }}
                >
                  <title>{geo.properties.name}{isMember ? " — ICEN member" : ""}</title>
                </Geography>
              );
            })
          }
        </Geographies>

        {ARCS.map((pair, i) => {
          const d = curvePath(projection, pair[0].coords, pair[1].coords);
          if (!d) return null;
          return (
            <motion.path
              key={i}
              d={d}
              fill="none"
              stroke="#0057FF"
              strokeWidth={1.2}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.85 }}
              transition={{ duration: 2.6, delay: 0.8 + i * 0.28, ease: "easeInOut" }}
            />
          );
        })}

        {CAPITALS.map((c, i) => (
          <Marker key={c.name} coordinates={c.coords}>
            <g style={{ pointerEvents: "none" }}>
              <motion.circle r={8} fill="#0057FF"
                initial={{ opacity: 0.45, scale: 1 }}
                animate={{ opacity: 0, scale: 2.6 }}
                transition={{ duration: 2.4, delay: i * 0.12, repeat: Infinity }}
              />
              <circle r={2.6} fill="#0057FF" stroke="#FFFFFF" strokeWidth={0.8} />
            </g>
          </Marker>
        ))}
      </ComposableMap>

      <div className="pointer-events-none absolute inset-0" style={{
        background: "radial-gradient(ellipse at center, transparent 62%, rgba(247,245,239,0.88) 100%)"
      }} />
    </div>
  );
}
