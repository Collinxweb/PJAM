"use client";

import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import Mascot from "@/components/Mascot";
import AgentBadge from "@/components/AgentBadge";
import ZoneCard from "@/components/ZoneCard";
import BottomNav from "@/components/BottomNav";
import DailyRushPopup from "@/components/DailyRushPopup";
import { tierForReputation } from "@/lib/theme";

const BG = "#0b0b14";
const CARD = "#14142a";
const LINE = "#2a2a4a";
const PURPLE = "#8b5cf6";
const CYAN = "#22d3ee";
const GRADIENT = `linear-gradient(90deg, ${PURPLE}, ${CYAN})`;

const STATS = [
  { icon: "🎯", title: "Score", sub: "on Accuracy" },
  { icon: "⚡", title: "Earn", sub: "on Efficiency" },
  { icon: "⭐", title: "Express", sub: "your Style" },
  { icon: "📈", title: "Climb", sub: "the Ranks" },
];

export default function HomeView({ zones, agents, profile, builderLevel = 0, showDailyRushPopup = false, dailyRushBrief = null }) {
  const { t } = useTheme();
  const reputation = profile?.reputation ?? 0;
  const tier = tierForReputation(reputation);
  const coins = profile?.coins ?? 0;

  return (
    <>
      <div className="px-5 pb-28 pt-5 text-white" style={{ background: BG, minHeight: "100vh" }}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-10 h-10 flex items-center justify-center text-base font-black text-white"
              style={{ background: PURPLE, clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
            >
              P
            </div>
            <span className="font-black text-lg font-display">PJAM</span>
          </div>
          {profile ? (
            <Link
              href="/profile"
              className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-extrabold"
              style={{ background: CARD, border: `1px solid ${LINE}` }}
            >
              <div className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden" style={{ background: PURPLE }}>
                {profile.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  "🙂"
                )}
              </div>
              Lv.{builderLevel} · {profile.username} ▾
            </Link>
          ) : (
            <Link
              href="/onboarding"
              className="rounded-full px-3 py-1.5 text-xs font-extrabold"
              style={{ background: CARD, border: `1px solid ${LINE}` }}
            >
              Sign in
            </Link>
          )}
        </div>

        {/* Hero */}
        <div className="relative mt-6 min-h-[300px]">
          <div className="absolute right-0 top-0 w-[46%] flex justify-center" style={{ filter: "drop-shadow(0 0 22px rgba(139,92,246,0.55))" }}>
            <Mascot t={{ ...t, mascotBody: "#c9b3ff", ink: "#1a1a2e", accent: CYAN, dark: true }} size={150} />
          </div>
          <div className="relative w-[58%]">
            <span className="inline-block rounded-full px-3 py-1 text-[11px] font-extrabold" style={{ background: CARD, border: `1px solid ${LINE}` }}>
              ⚡ Prompt. Play. Prove.
            </span>
            <h1 className="mt-4 font-black leading-[1.02] font-display text-[2.3rem]">
              One prompt.
              <br />
              <span style={{ background: GRADIENT, WebkitBackgroundClip: "text", color: "transparent" }}>One shot.</span>
              <br />
              Prove it.
            </h1>
            <p className="mt-4 text-sm text-gray-300 font-semibold">
              Real prompt challenges, scored on accuracy, efficiency, and style. Pick a zone and start climbing the ranks.
            </p>
            <Link
              href="/get-started"
              className="mt-5 flex items-center justify-between rounded-full px-5 py-3 text-sm font-extrabold text-black"
              style={{ background: GRADIENT }}
            >
              🚀 New here? Start in 30 seconds <span>›</span>
            </Link>
            <Link href="/get-started" className="mt-3 inline-block text-xs font-bold text-gray-300 underline underline-offset-4">
              ▷ Learn how it works
            </Link>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-6 grid grid-cols-4 rounded-2xl py-4" style={{ background: CARD, border: `1px solid ${LINE}` }}>
          {STATS.map((s, i) => (
            <div key={s.title} className="flex flex-col items-center text-center px-1" style={{ borderLeft: i ? `1px solid ${LINE}` : "none" }}>
              <span className="text-xl">{s.icon}</span>
              <span className="mt-1 text-xs font-black">{s.title}</span>
              <span className="text-[10px] text-gray-400 font-semibold">{s.sub}</span>
            </div>
          ))}
        </div>

        {/* AI opponents */}
        <div className="mt-5 rounded-3xl p-4" style={{ background: CARD, border: `1px solid ${LINE}` }}>
          <div className="text-base font-black">⚔️ Choose your <span style={{ color: PURPLE }}>AI</span> opponent</div>
          <div className="text-xs text-gray-400 font-semibold mb-4">Pick a model and dive into the challenge.</div>
          <div className="flex justify-between">
            {agents.map((a) => (
              <AgentBadge key={a.id} agent={a} t={{ ...t, ink: "#ffffff", card: CARD }} clickable />
            ))}
          </div>
        </div>

        {/* Compete banner */}
        <Link
          href="/tournaments"
          className="mt-5 flex items-center justify-between rounded-3xl p-4"
          style={{ background: CARD, border: `1px solid ${LINE}` }}
        >
          <div>
            <div className="font-black text-sm">🏆 Compete. Improve. Win.</div>
            <div className="text-xs text-gray-400 font-semibold">Take on challenges, track your progress, and reach the top!</div>
          </div>
          <span className="text-2xl">📈</span>
        </Link>

        {profile && (
          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-2xl p-3" style={{ background: CARD, border: `1px solid ${LINE}` }}>
              <div className="text-[10px] font-bold text-gray-400">COINS</div>
              <div className="text-base font-black">🪙 {coins.toLocaleString()}</div>
            </div>
            <div className="rounded-2xl p-3" style={{ background: CARD, border: `1px solid ${LINE}` }}>
              <div className="text-[10px] font-bold text-gray-400">LEVEL</div>
              <div className="text-base font-black">Lv. {builderLevel}</div>
            </div>
            <Link href="/rank" className="rounded-2xl p-3" style={{ background: CARD, border: `1px solid ${LINE}` }}>
              <div className="text-[10px] font-bold text-gray-400">REP</div>
              <div className="text-base font-black">{reputation.toLocaleString()}</div>
              <div className="text-[10px] font-bold" style={{ color: tier.color }}>{tier.name}</div>
            </Link>
          </div>
        )}

        {/* Zones */}
        <div className="mt-7">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-black text-lg">🗺️ Quest Zones</h2>
            <Link href="/explore" className="text-xs font-extrabold text-gray-300">See all →</Link>
          </div>
          <p className="text-xs mb-3 text-gray-400 font-semibold">Start with the Builder, Integrations, or AI Frontiers track.</p>
          <div className="grid grid-cols-2 gap-3">
            {zones.map((z) => (
              <ZoneCard key={z.id} zone={z} t={{ ...t, card: CARD, ink: "#ffffff", accent: PURPLE, accentInk: "#ffffff" }} tag={z.skill} />
            ))}
          </div>
        </div>

        {/* Shortcuts */}
        <div className="mt-7 grid grid-cols-2 gap-3">
          <Link href="/daily-rush" className="rounded-3xl p-4" style={{ background: CARD, border: `1px solid ${LINE}` }}>
            <div className="text-2xl">⏳</div>
            <div className="font-black text-sm mt-1">Daily Rush</div>
            <div className="text-[11px] text-gray-400 font-semibold">New challenge, first 10 win big</div>
          </Link>
          <Link href="/tournaments" className="rounded-3xl p-4" style={{ background: CARD, border: `1px solid ${LINE}` }}>
            <div className="text-2xl">🏆</div>
            <div className="font-black text-sm mt-1">Tournaments</div>
            <div className="text-[11px] text-gray-400 font-semibold">2–8 players, one challenge</div>
          </Link>
        </div>
        <Link href="/rules" className="mt-3 flex items-center gap-3 rounded-3xl p-4" style={{ background: CARD, border: `1px solid ${LINE}` }}>
          <span className="text-2xl">📜</span>
          <div>
            <div className="font-black text-sm">Game Rules</div>
            <div className="text-[11px] text-gray-400 font-semibold">Scoring, tiers, formats</div>
          </div>
        </Link>
        <Link href="/settings" className="mt-3 flex items-center gap-3 rounded-3xl p-4" style={{ background: CARD, border: `1px solid ${LINE}` }}>
          <span className="text-2xl">⚙️</span>
          <div>
            <div className="font-black text-sm">Settings</div>
            <div className="text-[11px] text-gray-400 font-semibold">Theme, profile, log out</div>
          </div>
        </Link>
      </div>
      <BottomNav />
      {showDailyRushPopup && dailyRushBrief && <DailyRushPopup t={t} brief={dailyRushBrief} />}
    </>
  );
}
