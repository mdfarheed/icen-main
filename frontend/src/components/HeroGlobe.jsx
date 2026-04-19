import React, { useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";
import * as THREE from "three";
import { HERO_ARCS, HERO_POINTS } from "../content/icen";

export default function HeroGlobe({ height = 640 }) {
  const globeEl = useRef();
  const wrapRef = useRef(null);
  const [size, setSize] = useState({ w: 800, h: height });

  useEffect(() => {
    const handle = () => {
      const w = wrapRef.current ? wrapRef.current.offsetWidth : 800;
      setSize({ w, h: height });
    };
    handle();
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, [height]);

  useEffect(() => {
    if (!globeEl.current) return;
    const controls = globeEl.current.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.55;
    controls.enableZoom = false;
    controls.enablePan = false;
    globeEl.current.pointOfView({ lat: 14, lng: 40, altitude: 2.2 }, 0);
  }, []);

  return (
    <div ref={wrapRef} className="w-full relative" style={{ height }} data-testid="hero-globe">
      <Globe
        ref={globeEl}
        width={size.w}
        height={size.h}
        backgroundColor="rgba(0,0,0,0)"
        showAtmosphere={true}
        atmosphereColor="#0057FF"
        atmosphereAltitude={0.22}
        globeMaterial={new THREE.MeshPhongMaterial({ color: 0x0b1430, emissive: 0x020617, emissiveIntensity: 0.4, shininess: 12 })}
        hexPolygonsData={[]}
        arcsData={HERO_ARCS}
        arcColor={() => ["rgba(0,87,255,0.1)", "rgba(0,196,106,0.9)"]}
        arcAltitude={0.22}
        arcStroke={0.35}
        arcDashLength={0.45}
        arcDashGap={1.2}
        arcDashAnimateTime={2800}
        pointsData={HERO_POINTS}
        pointLat="lat"
        pointLng="lng"
        pointColor={() => "#00C46A"}
        pointAltitude={0.008}
        pointRadius={0.35}
        pointResolution={12}
        ringsData={HERO_POINTS}
        ringLat="lat"
        ringLng="lng"
        ringColor={() => (t) => `rgba(0,87,255,${1 - t})`}
        ringMaxRadius={3.5}
        ringPropagationSpeed={2.8}
        ringRepeatPeriod={1400}
      />
      {/* Dim edges for cinematic fade */}
      <div className="pointer-events-none absolute inset-0" style={{
        background: "radial-gradient(ellipse at center, transparent 55%, #020617 90%)",
      }}/>
    </div>
  );
}
