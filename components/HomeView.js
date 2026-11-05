"use client";

import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import Mascot from "@/components/Mascot";
import AgentBadge from "@/components/AgentBadge";
import ZoneCard from "@/components/ZoneCard";
import BottomNav from "@/components/BottomNav";
import DailyRushPopup from "@/components/DailyRushPopup";
import { tierForReputation } from "@/lib/theme";

const STATS = [
  { icon: "🎯", title: "Score", sub: "on accuracy" },
  { icon: "⚡", title: "Earn", sub: "on efficiency" },
  { icon: "⭐", title: "Express", sub: "your style" },
  { icon: "📈", title: "Climb", sub: "the ranks" },
];

export default function HomeView({ zones, agents, profile, builderLevel = 0, showDailyRushPopup = false, dailyRushBrief = null }) {
  const { t } = useTheme();
  const reputation = profile?.reputation ?? 0;
  const tier = tierForReputation(reputation);
  const coins = profile?.coins ?? 0;

  // One place for the app's sticker-style surfaces, so every card matches the active theme.
  const card = { background: t.card, border: `2.5px solid ${t.ink}`, boxShadow: `4px 5px 0 ${t.ink}` };
  const gradientText = { background: `linear-gradient(90deg, ${t.accent}, ${t.accent2})`, WebkitBackgroundClip: "text", color: "transparent" };
  const primaryBtn = { background: t.accent, color: t.accentInk, border: `2.5px solid ${t.ink}`, boxShadow: `3px 4px 0 ${t.ink}` };

  return (
    <>
      <div className="px-5 md:px-10 pb-28 pt-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 flex items-center justify-center text-sm font-black"
              style={{ background: t.accent, color: t.accentInk, border: `2.5px solid ${t.ink}`, clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
            >
              P
            </div>
            <span className="font-black text-lg font-display" style={{ color: t.ink }}>PJAM</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/settings" aria-label="Settings" className="w-9 h-9 rounded-full flex items-center justify-center text-sm" style={{ background: t.card, border: `2px solid ${t.ink}` }}>⚙️</Link>
            {profile ? (
              <Link href="/profile" className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-extrabold" style={{ background: t.card, border: `2px solid ${t.ink}`, color: t.ink }}>
                <span className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center" style={{ background: t.accent }}>
                  {profile.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    "🙂"
                  )}
                </span>
                Lv.{builderLevel} · {profile.username}
              </Link>
            ) : (
              <Link href="/onboarding" className="rounded-full px-3 py-1.5 text-xs font-extrabold" style={{ ...card, boxShadow: "none", color: t.ink }}>Sign in</Link>
            )}
          </div>
        </div>

        {/* Hero: text on the left, mascot on the right on desktop */}
        <section className="mt-8 md:grid md:grid-cols-2 md:items-center md:gap-12">
          <div>
            <span className="inline-block rounded-full px-3 py-1 text-[11px] font-extrabold" style={{ background: t.card, border: `2px solid ${t.ink}`, color: t.ink }}>
              ⚡ Prompt. Play. Prove.
            </span>
            <h1 className="mt-4 font-black leading-[1.05] font-display text-[2.4rem] md:text-[3.6rem]" style={{ color: t.ink }}>
              One prompt.
              <br />
              <span style={gradientText}>One shot.</span>
              <br />
              Prove it.
            </h1>
            <p className="mt-4 text-sm md:text-base max-w-md font-semibold opacity-80" style={{ color: t.ink }}>
              Real prompt challenges, scored by a real AI judge on accuracy, efficiency, and style. Pick a zone and start climbing the ranks.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link href="/get-started" className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-extrabold" style={primaryBtn}>
                🚀 New here? Start in 30 seconds →
              </Link>
              <Link href="/get-started" className="text-xs font-bold underline underline-offset-4" style={{ color: t.ink }}>How it works</Link>
            </div>
          </div>
          <div className="hidden md:flex justify-center mt-10 md:mt-0">
            <div className="rounded-3xl p-10" style={{ ...card, background: t.card }}>
              <Mascot t={t} size={200} />
            </div>
          </div>
          <div className="flex justify-center mt-6 md:hidden">
            <Mascot t={t} size={110} />
          </div>
        </section>

        {/* Value strip */}
        <section className="mt-8 grid grid-cols-4 rounded-2xl py-4" style={card}>
          {STATS.map((s, i) => (
            <div key={s.title} className="flex flex-col items-center text-center px-1" style={{ borderLeft: i ? `1.5px solid ${t.ink}` : "none" }}>
              <span className="text-xl">{s.icon}</span>
              <span className="mt-1 text-xs font-black" style={{ color: t.ink }}>{s.title}</span>
              <span className="text-[10px] font-semibold opacity-70" style={{ color: t.ink }}>{s.sub}</span>
            </div>
          ))}
        </section>

        {/* Opponents + banner */}
        <section className="mt-6 md:grid md:grid-cols-3 md:gap-5">
          <div className="md:col-span-2 rounded-3xl p-5" style={card}>
            <div className="text-base font-black" style={{ color: t.ink }}>⚔️ Choose your AI opponent</div>
            <div className="text-xs font-semibold opacity-70 mb-4" style={{ color: t.ink }}>Pick a model and dive into the challenge.</div>
            <div className="flex justify-between md:justify-start md:gap-6">
              {agents.map((a) => (
                <AgentBadge key={a.id} agent={a} t={t} clickable />
              ))}
            </div>
          </div>
          <Link href="/tournaments" className="mt-5 md:mt-0 rounded-3xl p-5 flex flex-col justify-between" style={card}>
            <div>
              <div className="text-2xl">🏆</div>
              <div className="font-black text-base mt-2" style={{ color: t.ink }}>Compete. Improve. Win.</div>
              <div className="text-xs font-semibold opacity-70 mt-1" style={{ color: t.ink }}>Duel a friend or join a tournament of up to 8.</div>
            </div>
            <div className="text-xs font-extrabold mt-4" style={{ color: t.ink }}>Open tournaments →</div>
          </Link>
        </section>

        {/* Personal stats */}
        {profile && (
          <section className="mt-6 grid grid-cols-3 gap-3 md:gap-5">
            <div className="rounded-2xl p-4" style={card}>
              <div className="text-[10px] font-bold opacity-60" style={{ color: t.ink }}>COINS</div>
              <div className="text-lg font-black" style={{ color: t.ink }}>🪙 {coins.toLocaleString()}</div>
            </div>
            <div className="rounded-2xl p-4" style={card}>
              <div className="text-[10px] font-bold opacity-60" style={{ color: t.ink }}>LEVEL</div>
              <div className="text-lg font-black" style={{ color: t.ink }}>Lv. {builderLevel}</div>
            </div>
            <Link href="/rank" className="rounded-2xl p-4" style={card}>
              <div className="text-[10px] font-bold opacity-60" style={{ color: t.ink }}>REPUTATION</div>
              <div className="text-lg font-black" style={{ color: t.ink }}>{reputation.toLocaleString()}</div>
              <div className="text-[10px] font-extrabold" style={{ color: tier.color }}>{tier.name}</div>
            </Link>
          </section>
        )}

        {/* Zones */}
        <section className="mt-8">
          <div className="flex items-end justify-between mb-3">
            <div>
              <h2 className="font-black text-lg" style={{ color: t.ink }}>Quest zones</h2>
              <p className="text-xs font-semibold opacity-70" style={{ color: t.ink }}>Start with the Builder, Integrations, or AI Frontiers track.</p>
            </div>
            <Link href="/explore" className="text-xs font-extrabold" style={{ color: t.ink }}>See all →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {zones.map((z) => (
              <ZoneCard key={z.id} zone={z} t={t} tag={z.skill} />
            ))}
          </div>
        </section>

        {/* Shortcuts */}
        <section className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link href="/daily-rush" className="rounded-2xl p-4" style={card}>
            <div className="text-2xl">⏳</div>
            <div className="font-black text-sm mt-1" style={{ color: t.ink }}>Daily Rush</div>
            <div className="text-[11px] font-semibold opacity-70" style={{ color: t.ink }}>New challenge, first 10 win big</div>
          </Link>
          <Link href="/tournaments" className="rounded-2xl p-4" style={card}>
            <div className="text-2xl">🏆</div>
            <div className="font-black text-sm mt-1" style={{ color: t.ink }}>Tournaments</div>
            <div className="text-[11px] font-semibold opacity-70" style={{ color: t.ink }}>2–8 players, one challenge</div>
          </Link>
          <Link href="/rules" className="rounded-2xl p-4" style={card}>
            <div className="text-2xl">📜</div>
            <div className="font-black text-sm mt-1" style={{ color: t.ink }}>Game rules</div>
            <div className="text-[11px] font-semibold opacity-70" style={{ color: t.ink }}>Scoring, tiers, formats</div>
          </Link>
          <Link href="/achievements" className="rounded-2xl p-4" style={card}>
            <div className="text-2xl">🎖️</div>
            <div className="font-black text-sm mt-1" style={{ color: t.ink }}>Achievements</div>
            <div className="text-[11px] font-semibold opacity-70" style={{ color: t.ink }}>Badges you have earned</div>
          </Link>
        </section>
      </div>
      <BottomNav />
      {showDailyRushPopup && dailyRushBrief && <DailyRushPopup t={t} brief={dailyRushBrief} />}
    </>
  );
}
