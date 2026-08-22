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

function Callout({ t, children }) {
  return (
    <div className="mt-5 rounded-2xl p-4" style={{ background: t.card, border: `2.5px solid ${t.ink}` }}>
      <p className="text-sm font-semibold opacity-80" style={{ color: t.ink }}>
        {children}
      </p>
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
        <p className="text-sm mt-2 opacity-80 font-semibold" style={{ color: t.ink }}>
          Never written an AI prompt on purpose before? Here's everything, start to finish.
        </p>

        <Callout t={t}>
          <strong>What's a "prompt"?</strong> It's just the instruction you give an AI — the words you type before it responds. A vague prompt gets a vague answer. A sharp, specific prompt gets exactly what you asked for. PJAM is a game built entirely around getting good at writing that second kind.
        </Callout>

        <Step t={t} num="1" title="Pick your opponent.">
          Choose which AI you're prompting — Claude, ChatGPT, Grok, or Gemini. Each one "thinks" a little differently, so a prompt that works perfectly on one might flop on another. Part of the game is learning those differences.
        </Step>
        <Step t={t} num="2" title="Enter a zone, pick a difficulty.">
          Six zones, six real prompt-engineering skills — from basic instructions to multi-step reasoning. Inside a zone, choose Easy, Medium, or Hard before picking a challenge. Easy is a good place to start if this is genuinely your first time.
        </Step>
        <Step t={t} num="3" title="Read the challenge carefully.">
          Every challenge tells you exactly what output you're trying to get the AI to produce — a specific answer, format, or style. Your job is to write the prompt that gets the AI there, not to answer it yourself.
        </Step>
        <Step t={t} num="4" title="Write your prompt, submit it.">
          Type your prompt and hit submit. Behind the scenes, PJAM actually sends your prompt to the real AI you picked, gets its real response, and scores that response — nothing here is simulated.
        </Step>
        <Step t={t} num="5" title="See your score.">
          You're scored out of 100: Accuracy (60 pts, how close the output matches the target), Efficiency (25 pts, staying near the challenge's word-count target), and Style (15 pts, creativity). Score 70 or higher and you clear it — 🎉🏆 shows up, you earn coins and XP, and you can retry to improve. Score under 70 and you'll see 😞💔 with a Retry button — no penalty for trying again in normal zones.
        </Step>
        <Step t={t} num="6" title="Level up and climb the ranks.">
          Clearing a challenge (70+) earns XP toward your player Level (1 through 50) — attempts that don't clear earn no XP or coins, so leveling reflects real wins, not just tries. Separately, your Reputation — the average of your best 20 challenge scores — determines your public rank: Bronze → Silver → Gold → Prompt Master. Level shows how much you've cleared; Reputation shows how good you are.
        </Step>
        <Step t={t} num="7" title="Or skip straight to head-to-head.">
          Join or host a Tournament — 2 to 8 players (2 = 1v1 duel), one shared challenge (or a custom one the host writes themself), everyone gets exactly one attempt. When the host closes it, the highest scorer wins a coin bonus and bragging rights they can share straight to X.
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
