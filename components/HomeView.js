"use client";

import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import Mascot from "@/components/Mascot";
import AgentBadge from "@/components/AgentBadge";
import ZoneCard from "@/components/ZoneCard";
import BottomNav from "@/components/BottomNav";
import { tierForReputation, levelForXp } from "@/lib/theme";

export default function HomeView({ zones, agents, profile }) {
  const { t } = useTheme();
  const reputation = profile?.reputation ?? 0;
  const tier = tierForReputation(reputation);
  const coins = profile?.coins ?? 0;
  const { level } = levelForXp(profile?.xp ?? 0);

  return (
    <>
      <div className="px-5 pb-10">
        <div className="flex items-center justify-between pt-6">
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 flex items-center justify-center text-sm font-black"
              style={{
                background: t.accent,
                color: t.accentInk,
                border: `2.5px solid ${t.ink}`,
                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              }}
            >
              P
            </div>
            <span className="font-black tracking-tight font-display" style={{ color: t.ink, fontSize: "1.15rem" }}>
              PJAM
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/settings" className="text-xs font-extrabold opacity-70" style={{ color: t.ink }}>
              ⚙️
            </Link>
            {profile ? (
              <Link href="/profile" className="text-xs font-extrabold" style={{ color: t.ink }}>
                Lv.{level} · {profile.username}
              </Link>
            ) : (
              <Link
                href="/onboarding"
                className="text-xs font-extrabold px-3 py-1.5 rounded-full"
                style={{ border: `2px solid ${t.ink}`, color: t.ink }}
              >
                Sign in
              </Link>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center text-center mt-3">
          <Mascot t={t} size={104} />
          <h1 className="font-black leading-[1.05] mt-2 font-display" style={{ color: t.ink, fontSize: "2.15rem" }}>
            One prompt.
            <br />
            One shot.
            <br />
            Prove it.
          </h1>
          <p className="mt-3 text-sm max-w-xs opacity-80 font-semibold" style={{ color: t.ink }}>
            Real prompt challenges, scored on accuracy, efficiency, and style. Pick a zone and start climbing the ranks.
          </p>
        </div>

        <Link
          href="/get-started"
          className="mt-5 rounded-3xl p-4 flex items-center gap-3"
          style={{ background: t.accent, color: t.accentInk, border: `3px solid ${t.ink}`, boxShadow: `4px 5px 0 ${t.ink}` }}
        >
          <span className="text-2xl">🚀</span>
          <div>
            <div className="font-extrabold text-sm">New here? Start in 30 seconds.</div>
            <div className="text-xs font-semibold opacity-90">See how scoring, coins, and ranks work →</div>
          </div>
        </Link>

        <div className="mt-5 rounded-3xl p-4" style={{ background: t.card, border: `3px solid ${t.ink}`, boxShadow: `4px 5px 0 ${t.ink}` }}>
          <div className="text-sm font-extrabold mb-3" style={{ color: t.ink }}>
            ⚔️ Choose your AI opponent
          </div>
          <div className="flex justify-between">
            {agents.map((a) => (
              <AgentBadge key={a.id} agent={a} t={t} clickable />
            ))}
          </div>
        </div>

        {profile && (
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl p-3" style={{ background: t.card, border: `2.5px solid ${t.ink}` }}>
              <div className="text-[10px] font-bold opacity-60" style={{ color: t.ink }}>
                COINS
              </div>
              <div className="text-lg font-black" style={{ color: t.ink }}>
                🪙 {coins.toLocaleString()}
              </div>
            </div>
            <div className="rounded-2xl p-3" style={{ background: t.card, border: `2.5px solid ${t.ink}` }}>
              <div className="text-[10px] font-bold opacity-60" style={{ color: t.ink }}>
                LEVEL
              </div>
              <div className="text-lg font-black" style={{ color: t.ink }}>
                Lv. {level}
              </div>
            </div>
          </div>
        )}

        <div className="mt-7">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-extrabold text-lg" style={{ color: t.ink }}>
              🗺️ Quest Zones
            </h2>
            <Link href="/explore" className="text-xs font-extrabold opacity-70" style={{ color: t.ink }}>
              See all →
            </Link>
          </div>
          <p className="text-xs mb-3 opacity-70 font-semibold" style={{ color: t.ink }}>
            Six zones, six prompt-engineering skills. Tap one to enter.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {zones.map((z) => (
              <ZoneCard key={z.id} zone={z} t={t} tag={z.skill} />
            ))}
          </div>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3">
          <Link
            href="/tournaments"
            className="rounded-3xl p-4"
            style={{ background: t.card, border: `3px solid ${t.ink}`, boxShadow: `4px 5px 0 ${t.ink}` }}
          >
            <div className="text-2xl">🏆</div>
            <div className="font-extrabold text-sm mt-1" style={{ color: t.ink }}>
              Tournaments
            </div>
            <div className="text-[11px] font-semibold opacity-70" style={{ color: t.ink }}>
              2–8 players, one challenge
            </div>
          </Link>
          <Link
            href="/rules"
            className="rounded-3xl p-4"
            style={{ background: t.card, border: `3px solid ${t.ink}`, boxShadow: `4px 5px 0 ${t.ink}` }}
          >
            <div className="text-2xl">📜</div>
            <div className="font-extrabold text-sm mt-1" style={{ color: t.ink }}>
              Game Rules
            </div>
            <div className="text-[11px] font-semibold opacity-70" style={{ color: t.ink }}>
              Scoring, tiers, formats
            </div>
          </Link>
        </div>

        <Link
          href="/rank"
          className="mt-5 rounded-3xl p-4 flex items-center justify-between"
          style={{ background: t.card, border: `3px solid ${t.ink}`, boxShadow: `4px 5px 0 ${t.ink}` }}
        >
          <div>
            <div className="text-xs font-bold opacity-60" style={{ color: t.ink }}>
              YOUR REPUTATION
            </div>
            <div className="text-2xl font-black" style={{ color: t.ink }}>
              {reputation.toLocaleString()} <span className="text-sm font-bold opacity-60">rep</span>
            </div>
          </div>
          <div className="px-3 py-2 rounded-2xl font-extrabold text-sm" style={{ background: tier.color, color: "#fff" }}>
            {tier.name}
          </div>
        </Link>
      </div>
      <BottomNav />
    </>
  );
}
