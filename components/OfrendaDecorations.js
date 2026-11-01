"use client";

import { useEffect, useState } from "react";

function PapelPicado() {
  const colors = ["#ff9500", "#8b5cf6", "#e95d9d"];
  return <svg className="papel-picado" viewBox="0 0 420 64" preserveAspectRatio="none" aria-hidden="true">
    <path d="M0 5Q105 18 210 5T420 5" fill="none" stroke="#e6bd77" strokeWidth="2" />
    {Array.from({ length: 10 }, (_, i) => <g key={i} transform={`translate(${7 + i * 42} ${8 + Math.sin(i) * 2})`}>
      <path d="M0 0h34v48l-17 9L0 48z" fill={colors[i % colors.length]} opacity=".95" />
      <circle cx="17" cy="15" r="5" fill="#2b1745" />
      <path d="M9 31q8-10 16 0M11 39l3-2 3 2 3-2 3 2" fill="none" stroke="#2b1745" strokeWidth="2" strokeLinecap="round" />
    </g>)}
  </svg>;
}

function FlowerCluster() {
  return <svg viewBox="0 0 120 90" aria-hidden="true" className="ofrenda-cluster-svg">
    <circle cx="60" cy="48" r="34" fill="#ff9500" opacity=".12" filter="url(#glow)" />
    <g fill="#ff9500" stroke="#ffcf63" strokeWidth="1.5">
      {[0,1,2,3,4,5,6,7].map(n=><ellipse key={n} cx="38" cy="31" rx="5" ry="10" transform={`rotate(${n*45} 38 42)`} />)}
      {[0,1,2,3,4,5,6,7].map(n=><ellipse key={`b${n}`} cx="77" cy="50" rx="4.5" ry="9" transform={`rotate(${n*45} 77 61)`} />)}
    </g><circle cx="38" cy="42" r="5" fill="#a83e54"/><circle cx="77" cy="61" r="4" fill="#a83e54"/>
    <path d="M55 76q-5-14 4-24 9 10 4 24z" fill="#ffb64a"/><path d="M59 53q-6-11 0-17 6 6 0 17" fill="#fff1b8"/>
    <defs><filter id="glow"><feGaussianBlur stdDeviation="5"/></filter></defs>
  </svg>;
}

export default function OfrendaDecorations() {
  const [active, setActive] = useState(false);
  useEffect(() => { setActive(true); }, []);
  if (!active) return null;
  return <div className="ofrenda-scene" aria-hidden="true">
    <PapelPicado />
    <div className="ofrenda-orb orb-one"/><div className="ofrenda-orb orb-two"/>
    <div className="ofrenda-side-decor decor-left"><span>🎃</span><FlowerCluster /></div>
    <div className="ofrenda-side-decor decor-right"><span>🕯️</span><FlowerCluster /></div>
  </div>;
}
