"use client";

import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import BottomNav from "@/components/BottomNav";

function badgeList(stats) {
  return [
    { emoji: "🩸", name: "First Blood", desc: "Clear your first challenge.", done: stats.clears >= 1 },
    { emoji: "🔟", name: "Perfect Ten", desc: "Clear 10 challenges.", done: stats.clears >= 10 },
    { emoji: "💯", name: "Century Club", desc: "Clear 100 challenges.", done: stats.clears >= 100 },
    { emoji: "🎯", name: "All-Rounder", desc: "Beat every AI opponent at least once.", done: stats.uniqueAgentsBeaten >= 4 },
    { emoji: "🏆", name: "Tournament Champion", desc: "Win a tournament.", done: stats.tournamentWins >= 1 },
    { emoji: "🥈", name: "Silver Standing", desc: "Reach 1,000 reputation.", done: stats.reputation >= 1000 },
    { emoji: "🥇", name: "Gold Standing", desc: "Reach 2,500 reputation.", done: stats.reputation >= 2500 },
    { emoji: "👑", name: "Prompt Master", desc: "Reach 5,000 reputation.", done: stats.reputation >= 5000 },
    { emoji: "🪙", name: "Coin Collector", desc: "Earn 1,000 coins total.", done: stats.coins >= 1000 },
  ];
}

export default function AchievementsView({ signedIn, stats }) {
  const { t } = useTheme();

  if (!signedIn) {
    return (
      <>
        <div className="px-5 pb-10 pt-6">
          <h1 className="font-black text-xl font-display" style={{ color: t.ink }}>
            🎖️ Achievements
          </h1>
          <Link
            href="/onboarding"
            className="block text-center w-full mt-5 py-3 rounded-2xl font-extrabold text-sm"
            style={{ background: t.accent, color: t.accentInk, border: `3px solid ${t.ink}` }}
          >
            Sign in to start earning badges
          </Link>
        </div>
        <BottomNav />
      </>
    );
  }

  const badges = badgeList(stats);
  const earned = badges.filter((b) => b.done).length;

  return (
    <>
      <div className="px-5 pb-10 pt-6">
        <h1 className="font-black text-xl font-display" style={{ color: t.ink }}>
          🎖️ Achievements
        </h1>
        <p className="text-xs mt-1 mb-4 opacity-70 font-semibold" style={{ color: t.ink }}>
          {earned}/{badges.length} earned — real milestones from your actual play.
        </p>

        <div className="flex flex-col gap-3">
          {badges.map((b) => (
            <div
              key={b.name}
              className="rounded-2xl p-3 flex items-center gap-3"
              style={{ background: t.card, border: `2.5px solid ${t.ink}`, opacity: b.done ? 1 : 0.5 }}
            >
              <span className="text-2xl">{b.emoji}</span>
              <div>
                <div className="font-extrabold text-sm" style={{ color: t.ink }}>
                  {b.name} {b.done && "✓"}
                </div>
                <div className="text-[11px] font-bold opacity-70" style={{ color: t.ink }}>
                  {b.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </>
  );
}
