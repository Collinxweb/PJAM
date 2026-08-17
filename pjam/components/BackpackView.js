"use client";

import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import BottomNav from "@/components/BottomNav";

export default function BackpackView({ unlocks, unlockedIds, signedIn }) {
  const { t } = useTheme();
  const anyUnlocked = unlockedIds.length > 0;

  return (
    <>
      <div className="px-5 pb-10 pt-6">
        <h1 className="font-black text-xl font-display" style={{ color: t.ink }}>
          🎒 Backpack
        </h1>
        <p className="text-xs mt-1 mb-4 opacity-70 font-semibold" style={{ color: t.ink }}>
          Techniques and templates you unlock by clearing challenges.
        </p>

        {!signedIn && (
          <Link
            href="/onboarding"
            className="block text-center rounded-2xl p-3 mb-4 text-sm font-extrabold"
            style={{ background: t.accent, color: t.accentInk, border: `2.5px solid ${t.ink}` }}
          >
            Sign in to start collecting →
          </Link>
        )}

        <div className="flex flex-col gap-3">
          {unlocks.map((u) => {
            const unlocked = unlockedIds.includes(u.id);
            return (
              <div
                key={u.id}
                className="rounded-2xl p-3 flex items-center gap-3"
                style={{ background: t.card, border: `2.5px solid ${t.ink}`, opacity: unlocked ? 1 : 0.55 }}
              >
                <span className="text-2xl">{u.emoji}</span>
                <div>
                  <div className="font-extrabold text-sm" style={{ color: t.ink }}>
                    {u.name}
                  </div>
                  <div className="text-[11px] font-bold opacity-70" style={{ color: t.ink }}>
                    {unlocked ? "Unlocked" : `🔒 ${u.requirement_description}`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!anyUnlocked && signedIn && (
          <p className="text-xs mt-6 opacity-60 font-semibold text-center" style={{ color: t.ink }}>
            Nothing unlocked yet — clear your first challenge to start your collection.
          </p>
        )}
      </div>
      <BottomNav />
    </>
  );
}
