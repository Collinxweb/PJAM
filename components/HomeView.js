"use client";

import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import Mascot from "@/components/Mascot";
import AgentBadge from "@/components/AgentBadge";
import ZoneCard from "@/components/ZoneCard";
import BottomNav from "@/components/BottomNav";
import DailyRushPopup from "@/components/DailyRushPopup";
import { tierForReputation, isOfrendaActive, OFRENDA_ACCENT } from "@/lib/theme";
import OfrendaDecorations from "@/components/OfrendaDecorations";
import { OFRENDA_LEVELS } from "@/lib/ofrendaLevels";

export default function HomeView({ zones, agents, profile, builderLevel = 0, showDailyRushPopup = false, dailyRushBrief = null }) {
  const { t } = useTheme();
  const reputation = profile?.reputation ?? 0;
  const tier = tierForReputation(reputation);
  const coins = profile?.coins ?? 0;
  const level = builderLevel;

  return <>
    <div className={`px-5 pb-10 ${isOfrendaActive() ? "ofrenda-home" : ""}`}>
      {isOfrendaActive() && <OfrendaDecorations />}
      <div className="flex items-center justify-between pt-6 relative z-10">
        <div className="flex items-center gap-2"><div className="w-9 h-9 flex items-center justify-center text-sm font-black" style={{ background: t.accent, color: t.accentInk, border: `2.5px solid ${t.ink}`, clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>P</div><span className="font-black tracking-tight font-display" style={{ color: t.ink, fontSize: "1.15rem" }}>PJAM</span></div>
        <div className="flex items-center gap-2"><Link href="/settings" className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: t.card, border: `2px solid ${t.ink}` }} aria-label="Settings">⚙️</Link>{profile ? <Link href="/profile" className="flex items-center gap-1.5 text-xs font-extrabold" style={{ color: t.ink }}><div className="w-6 h-6 rounded-full flex items-center justify-center text-xs overflow-hidden shrink-0" style={{ background: t.accent, border: `1.5px solid ${t.ink}` }}>{profile.avatar_url ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" /> : "🙂"}</div>Lv.{level} · {profile.username}</Link> : <Link href="/onboarding" className="text-xs font-extrabold px-3 py-1.5 rounded-full" style={{ border: `2px solid ${t.ink}`, color: t.ink }}>Sign in</Link>}</div>
      </div>
      {isOfrendaActive() && <div className="ofrenda-banner mt-10 rounded-3xl p-4 flex items-center gap-3 relative z-10" role="note"><span className="text-3xl" aria-hidden="true">🕯️</span><div className="min-w-0 flex-1"><div className="font-extrabold text-sm" style={{ color: t.ink }}>Honor the Past</div><div className="text-xs font-semibold opacity-75" style={{ color: t.ink }}>A little light for the stories we carry.</div></div><span className="shrink-0 rounded-full px-2 py-1 text-[10px] font-black" style={{ background: `${OFRENDA_ACCENT}22`, color: t.ink }}>Ends Nov 2</span></div>}
      <div className={`flex flex-col items-center text-center mt-3 relative z-10 ${isOfrendaActive() ? "ofrenda-hero" : ""}`}>
        <div className="hero-mascot"><Mascot t={t} size={104} pose={isOfrendaActive() ? "ofrenda" : "wave"} /></div>
        <h1 className="font-black leading-[1.05] mt-2 font-display" style={{ color: t.ink, fontSize: "2.15rem" }}>One prompt.<br />One shot.<br />Prove it.</h1>
        <p className="mt-3 text-sm max-w-xs opacity-80 font-semibold" style={{ color: t.ink }}>Real prompt challenges, scored on accuracy, efficiency, and style. Pick a zone and start climbing the ranks.</p>
      </div>
      {isOfrendaActive() && <Link href="/zone/ofrenda-track" className="ofrenda-feature-card mt-5 relative z-10 flex items-center gap-3 rounded-3xl p-4" aria-label="Open the 20-level Ofrenda Track"><div className="ofrenda-art" aria-hidden="true"><span>🕯️</span><span>💀</span><span>🌼</span></div><div className="min-w-0 flex-1"><div className="flex items-center gap-1.5 mb-1"><span className="ofrenda-skull-pill">💀 EVENT TRACK</span><span className="ofrenda-end-pill">Ends Nov 2</span></div><div className="text-lg font-black font-display text-white">Ofrenda Track</div><div className="text-[11px] font-semibold text-violet-100/80">20 haunted hosts. One prompt at a time.</div></div><span className="text-2xl text-amber-300">›</span></Link>}
      <Link href="/get-started" className="mt-5 relative z-10 rounded-3xl p-4 flex items-center gap-3" style={{ background: t.accent, color: t.accentInk, border: `3px solid ${t.ink}`, boxShadow: `4px 5px 0 ${t.ink}` }}><span className="text-2xl">🚀</span><div><div className="font-extrabold text-sm">New here? Start in 30 seconds.</div><div className="text-xs font-semibold opacity-90">See how scoring, coins, and ranks work →</div></div></Link>
      <div className="mt-5 rounded-3xl p-4 relative z-10" style={{ background: t.card, border: `3px solid ${t.ink}`, boxShadow: `4px 5px 0 ${t.ink}` }}><div className="text-sm font-extrabold mb-3" style={{ color: t.ink }}>⚔️ Choose your AI opponent</div><div className="flex justify-between">{agents.map((a) => <AgentBadge key={a.id} agent={a} t={t} clickable />)}</div></div>
      {profile && <div className="mt-5 grid grid-cols-2 gap-3 relative z-10"><div className="rounded-2xl p-3" style={{ background: t.card, border: `2.5px solid ${t.ink}` }}><div className="text-[10px] font-bold opacity-60" style={{ color: t.ink }}>COINS</div><div className="text-lg font-black" style={{ color: t.ink }}>🪙 {coins.toLocaleString()}</div></div><div className="rounded-2xl p-3" style={{ background: t.card, border: `2.5px solid ${t.ink}` }}><div className="text-[10px] font-bold opacity-60" style={{ color: t.ink }}>LEVEL</div><div className="text-lg font-black" style={{ color: t.ink }}>Lv. {level}</div></div></div>}
      <div className="mt-7 relative z-10"><div className="flex items-center justify-between mb-1"><h2 className="font-extrabold text-lg" style={{ color: t.ink }}>🗺️ Quest Zones</h2><Link href="/explore" className="text-xs font-extrabold opacity-70" style={{ color: t.ink }}>See all →</Link></div><p className="text-xs mb-3 opacity-70 font-semibold" style={{ color: t.ink }}>Start with the Builder Track or Integrations Track. Other zones are on the way.</p><div className="grid grid-cols-2 gap-3">{zones.map((z) => <ZoneCard key={z.id} zone={z} t={t} tag={z.skill} />)}</div></div>
      {isOfrendaActive() && <section className="ofrenda-mini-levels mt-5 relative z-10" aria-label="Ofrenda challenge previews"><div className="flex items-center justify-between mb-2"><h3 className="font-extrabold text-sm text-white">Meet your first hosts</h3><span className="text-[10px] font-bold text-amber-300">LEVEL PREVIEWS</span></div><div className="grid grid-cols-3 gap-2">{[OFRENDA_LEVELS[0], OFRENDA_LEVELS[2], OFRENDA_LEVELS[8]].map((item, i) => <Link key={item.id} href={`/zone/ofrenda-track/challenge/${item.id}`} className="ofrenda-mini-card"><span className="text-2xl">{["👻", "🌼", "🐈‍⬛"][i]}</span><span className="text-[10px] font-black text-white leading-tight">{["Graveyard hello", "La Catrina", "Potion cat"][i]}</span><span className="text-[9px] font-bold text-amber-300">{["25 words", "Style", "No banned words"][i]}</span></Link>)}</div></section>}
      <div className="mt-7 grid grid-cols-2 gap-3 relative z-10"><Link href="/daily-rush" className="rounded-3xl p-4" style={{ background: t.card, border: `3px solid ${t.ink}`, boxShadow: `4px 5px 0 ${t.ink}` }}><div className="text-2xl">⏳</div><div className="font-extrabold text-sm mt-1" style={{ color: t.ink }}>Daily Rush</div><div className="text-[11px] font-semibold opacity-70" style={{ color: t.ink }}>New challenge, first 10 win big</div></Link><Link href="/tournaments" className="rounded-3xl p-4" style={{ background: t.card, border: `3px solid ${t.ink}`, boxShadow: `4px 5px 0 ${t.ink}` }}><div className="text-2xl">🏆</div><div className="font-extrabold text-sm mt-1" style={{ color: t.ink }}>Tournaments</div><div className="text-[11px] font-semibold opacity-70" style={{ color: t.ink }}>2–8 players, one challenge</div></Link></div>
      <Link href="/rules" className="mt-3 rounded-3xl p-4 flex items-center gap-3 relative z-10" style={{ background: t.card, border: `3px solid ${t.ink}`, boxShadow: `4px 5px 0 ${t.ink}` }}><span className="text-2xl">📜</span><div><div className="font-extrabold text-sm" style={{ color: t.ink }}>Game Rules</div><div className="text-[11px] font-semibold opacity-70" style={{ color: t.ink }}>Scoring, tiers, formats</div></div></Link>
      <Link href="/rank" className="mt-5 rounded-3xl p-4 flex items-center justify-between relative z-10" style={{ background: t.card, border: `3px solid ${t.ink}`, boxShadow: `4px 5px 0 ${t.ink}` }}><div><div className="text-xs font-bold opacity-60" style={{ color: t.ink }}>YOUR REPUTATION</div><div className="font-black" style={{ color: t.ink }}>{reputation.toLocaleString()} · {tier.name}</div></div><span className="text-2xl">🏅</span></Link>
    </div>
    <BottomNav />
    {showDailyRushPopup && dailyRushBrief && <DailyRushPopup brief={dailyRushBrief} />}
  </>;
}
