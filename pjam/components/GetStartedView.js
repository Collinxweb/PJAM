"use client";

import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import BottomNav from "@/components/BottomNav";

function Step({ t, num, title, children }) {
  return (
    <div className="flex gap-3 mt-5">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0"
        style={{ background: t.accent, color: t.accentInk, border: `2px solid ${t.ink}` }}
      >
        {num}
      </div>
      <div>
        <div className="font-extrabold text-sm" style={{ color: t.ink }}>
          {title}
        </div>
        <p className="text-sm font-semibold opacity-80 mt-0.5" style={{ color: t.ink }}>
          {children}
        </p>
      </div>
    </div>
  );
}

export default function GetStartedView() {
  const { t } = useTheme();

  return (
    <>
      <div className="px-5 pb-10 pt-6">
        <Link href="/" className="text-xs font-extrabold mb-4 inline-block" style={{ color: t.ink }}>
          ← Back
        </Link>
        <h1 className="font-black text-xl font-display" style={{ color: t.ink }}>
          🚀 How PJAM works
        </h1>

        <Step t={t} num="1" title="Pick your opponent.">
          Choose which AI you're prompting — Claude, ChatGPT, Grok, or Gemini. Each behaves a little differently, so your best prompt for one might not work on another.
        </Step>
        <Step t={t} num="2" title="Enter a zone.">
          Six zones, six real prompt-engineering skills — from basic instructions to multi-step reasoning. Pick one that matches what you want to get better at.
        </Step>
        <Step t={t} num="3" title="Write your prompt.">
          Every challenge has a target output you're trying to get the AI to produce. You're scored on accuracy (60%), efficiency (25%), and style (15%).
        </Step>
        <Step t={t} num="4" title="Earn and climb.">
          A good score earns coins and reputation. Score high enough (70+) and you'll see 🎉🏆 on screen.
        </Step>
        <Step t={t} num="5" title="Or go head-to-head.">
          Join or host a tournament — 4 to 8 players, one shared challenge. Highest score when the host closes it wins the pot.
        </Step>

        <Link
          href="/rules"
          className="block text-center w-full mt-7 py-3 rounded-2xl font-extrabold text-sm"
          style={{ background: t.card, color: t.ink, border: `2.5px solid ${t.ink}` }}
        >
          Full scoring breakdown →
        </Link>
        <Link
          href="/explore"
          className="block text-center w-full mt-3 py-3 rounded-2xl font-extrabold text-sm"
          style={{ background: t.accent, color: t.accentInk, border: `3px solid ${t.ink}` }}
        >
          Jump into a zone →
        </Link>
      </div>
      <BottomNav />
    </>
  );
}
