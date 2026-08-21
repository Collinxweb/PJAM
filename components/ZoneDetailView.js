"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import BottomNav from "@/components/BottomNav";
import { DIFFICULTY_BANDS } from "@/lib/theme";

export default function ZoneDetailView({ zone, challenges }) {
  const { t } = useTheme();
  const [band, setBand] = useState("all");

  const shown =
    band === "all" ? challenges : challenges.filter((c) => DIFFICULTY_BANDS[band].stars.includes(c.difficulty));

  return (
    <>
      <div className="px-5 pb-10 pt-6">
        <Link href="/explore" className="text-xs font-extrabold mb-4 inline-block" style={{ color: t.ink }}>
          ← Back
        </Link>
        <div className="text-4xl">{zone.emoji}</div>
        <h1 className="font-black text-xl mt-2 font-display" style={{ color: t.ink }}>
          {zone.name}
        </h1>
        <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full mt-2" style={{ background: t.accent, color: t.accentInk }}>
          {zone.skill}
        </span>
        <p className="text-sm mt-3 opacity-80 font-semibold" style={{ color: t.ink }}>
          {zone.description}
        </p>

        <div className="mt-5">
          <div className="text-xs font-extrabold mb-2" style={{ color: t.ink }}>
            Difficulty
          </div>
          <div className="flex gap-2">
            {["all", "easy", "medium", "hard"].map((key) => (
              <button
                key={key}
                onClick={() => setBand(key)}
                className="px-3 py-1.5 rounded-full text-xs font-bold"
                style={{
                  background: band === key ? t.accent : t.card,
                  color: band === key ? t.accentInk : t.ink,
                  border: `2px solid ${t.ink}`,
                }}
              >
                {key === "all" ? "All" : DIFFICULTY_BANDS[key].label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          {shown.map((c) => (
            <Link
              key={c.id}
              href={`/zone/${zone.id}/challenge/${c.id}`}
              className="rounded-2xl p-4 block active:scale-[0.98] transition-transform"
              style={{ background: t.card, border: `2.5px solid ${t.ink}` }}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm" style={{ color: t.ink }}>
                  {c.title}
                </span>
                <span className="text-[10px] font-bold opacity-60" style={{ color: t.ink }}>
                  {"★".repeat(c.difficulty)}
                </span>
              </div>
              <p className="text-xs mt-1 opacity-70 font-semibold" style={{ color: t.ink }}>
                {c.brief}
              </p>
            </Link>
          ))}
          {shown.length === 0 && (
            <p className="text-sm mt-2 opacity-60 font-semibold text-center" style={{ color: t.ink }}>
              {challenges.length === 0
                ? "No challenges published in this zone yet — check back soon."
                : "No challenges at this difficulty yet."}
            </p>
          )}
        </div>
      </div>
      <BottomNav />
    </>
  );
}
