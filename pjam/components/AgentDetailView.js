"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import BottomNav from "@/components/BottomNav";

const MONOGRAMS = { claude: "C", chatgpt: "G", grok: "X", gemini: "G" };
const BLURBS = {
  claude: "Careful, thorough, and strong at following nuanced instructions. A good pick for Constraint Vault and Chain-of-Thought Hollow.",
  chatgpt: "Fast and versatile across styles. A solid all-rounder for Few-Shot Arena and Persona & Style Bay.",
  grok: "Terse and direct by default — rewards prompts that are equally tight. Good practice ground for Instruction Basics.",
  gemini: "Strong at structured, multi-step reasoning. Worth testing in Chain-of-Thought Hollow.",
};

export default function AgentDetailView({ agent, profile, stats }) {
  const { t } = useTheme();
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState(profile?.selected_agent_id === agent.id);

  async function handleSelect() {
    if (!profile) return;
    setSelecting(true);
    try {
      const res = await fetch("/api/select-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId: agent.id }),
      });
      if (res.ok) setSelected(true);
    } finally {
      setSelecting(false);
    }
  }

  return (
    <>
      <div className="px-5 pb-10 pt-6">
        <Link href="/" className="text-xs font-extrabold mb-4 inline-block" style={{ color: t.ink }}>
          ← Back
        </Link>

        <div className="flex flex-col items-center text-center">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center font-black text-4xl"
            style={{ background: agent.color_hex, color: "#fff", border: `3px solid ${t.ink}`, boxShadow: `4px 5px 0 ${t.ink}` }}
          >
            {MONOGRAMS[agent.id] || agent.label[0]}
          </div>
          <h1 className="font-black text-xl mt-3 font-display" style={{ color: t.ink }}>
            {agent.label}
          </h1>
          <p className="text-xs font-bold opacity-60 mt-1" style={{ color: t.ink }}>
            Opponent AI
          </p>
        </div>

        <p className="text-sm mt-5 opacity-80 font-semibold text-center" style={{ color: t.ink }}>
          {BLURBS[agent.id] || "A worthy opponent."}
        </p>

        {profile ? (
          <button
            onClick={handleSelect}
            disabled={selecting || selected}
            className="w-full mt-6 py-3 rounded-2xl font-extrabold text-sm"
            style={{
              background: selected ? t.card : t.accent,
              color: selected ? t.ink : t.accentInk,
              border: `3px solid ${t.ink}`,
            }}
          >
            {selected ? "✓ Your current opponent" : selecting ? "Selecting..." : `Fight ${agent.label} →`}
          </button>
        ) : (
          <Link
            href="/onboarding"
            className="block text-center w-full mt-6 py-3 rounded-2xl font-extrabold text-sm"
            style={{ background: t.accent, color: t.accentInk, border: `3px solid ${t.ink}` }}
          >
            Sign in to choose an opponent
          </Link>
        )}

        {stats && (
          <div className="mt-6 rounded-2xl p-4" style={{ background: t.card, border: `2.5px solid ${t.ink}` }}>
            <div className="text-xs font-extrabold mb-2" style={{ color: t.ink }}>
              Your record vs {agent.label}
            </div>
            <div className="flex justify-between text-sm font-bold" style={{ color: t.ink }}>
              <span>{stats.attempts} attempts</span>
              <span>{stats.avgScore}/100 avg score</span>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </>
  );
}
