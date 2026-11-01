"use client";

import { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import ZoneCard from "@/components/ZoneCard";
import BottomNav from "@/components/BottomNav";
import { FILTERS, isOfrendaActive } from "@/lib/theme";
import Pill from "@/components/Pill";
import Link from "next/link";
import { OFRENDA_LEVELS } from "@/lib/ofrendaLevels";

export default function ExploreView({ zones }) {
  const { t } = useTheme();
  const [filter, setFilter] = useState("all");
  const shown = filter === "all" ? zones : zones.filter((z) => z.skill === filter);

  return (
    <>
      <div className="px-5 pb-10 pt-6">
        <h1 className="font-black text-xl font-display" style={{ color: t.ink }}>
          ✨ Explore
        </h1>
        <p className="text-xs mt-1 mb-4 opacity-70 font-semibold" style={{ color: t.ink }}>
          Filter zones by the skill they train.
        </p>
        <div className="flex gap-2 flex-wrap mb-4">
          {FILTERS.map((f) => (
            <Pill key={f.key} active={filter === f.key} onClick={() => setFilter(f.key)}>
              {f.label}
            </Pill>
          ))}
        </div>
        {isOfrendaActive() && filter === "all" && <Link href="/zone/ofrenda-track" className="ofrenda-explore-card col-span-2 p-4 rounded-3xl mb-2">
          <div className="flex items-center justify-between"><span className="ofrenda-skull-pill">💀 EVENT TRACK</span><span className="ofrenda-end-pill">Ends Nov 2</span></div>
          <div className="flex items-center gap-3 mt-2"><div className="ofrenda-art"><span>🕯️</span><span>💀</span><span>🌼</span></div><div><h2 className="font-black text-white">Ofrenda Track</h2><p className="text-xs text-violet-100/80">20 haunted prompt challenges</p></div></div>
        </Link>}
        {isOfrendaActive() && filter === "all" && <div className="col-span-2 grid grid-cols-3 gap-2 mb-2">
          {[OFRENDA_LEVELS[0], OFRENDA_LEVELS[2], OFRENDA_LEVELS[8]].map((level, i) => <Link key={level.id} href={`/zone/ofrenda-track/challenge/${level.id}`} className="ofrenda-mini-card">
            <span className="text-2xl">{["👻", "🌼", "🐈‍⬛"][i]}</span><span className="text-[10px] font-black text-white leading-tight">{["Graveyard hello", "La Catrina", "Potion cat"][i]}</span><span className="text-[9px] font-bold text-amber-300">{["25 pts", "45 pts", "45 pts"][i]}</span>
          </Link>)}
        </div>}
        <div className="grid grid-cols-2 gap-3">
          {shown.map((z) => (
            <ZoneCard key={z.id} zone={z} t={t} tag={z.skill} />
          ))}
        </div>
        {shown.length === 0 && (
          <p className="text-sm mt-6 opacity-60 font-semibold text-center" style={{ color: t.ink }}>
            No zones train that skill yet.
          </p>
        )}
      </div>
      <BottomNav />
    </>
  );
}
