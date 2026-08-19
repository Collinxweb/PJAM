"use client";

import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import BottomNav from "@/components/BottomNav";

export default function ZoneDetailView({ zone, challenges }) {
  const { t } = useTheme();

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

        <div className="mt-6 flex flex-col gap-3">
          {challenges.map((c) => (
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
          {challenges.length === 0 && (
            <p className="text-sm mt-2 opacity-60 font-semibold text-center" style={{ color: t.ink }}>
              No challenges published in this zone yet — check back soon.
            </p>
          )}
        </div>
      </div>
      <BottomNav />
    </>
  );
}
