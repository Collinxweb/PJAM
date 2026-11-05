"use client";

import { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import ZoneCard from "@/components/ZoneCard";
import BottomNav from "@/components/BottomNav";
import { FILTERS } from "@/lib/theme";
import Pill from "@/components/Pill";

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
