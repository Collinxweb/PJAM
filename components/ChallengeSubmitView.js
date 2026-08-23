"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import BottomNav from "@/components/BottomNav";
import WinCelebration from "@/components/WinCelebration";
import { isAgentPlayable } from "@/lib/theme";

export default function ChallengeSubmitView({ challenge, agents, defaultAgentId, zoneChallenges = [], clearedChallengeIds = [] }) {
  const { t } = useTheme();
  const searchParams = useSearchParams();
  const tournamentId = searchParams.get("tournament");
  const [agentId, setAgentId] = useState(
    isAgentPlayable(defaultAgentId) ? defaultAgentId : agents.find((a) => isAgentPlayable(a.id))?.id || agents[0]?.id
  );
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | error
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState(null);
  const [comingSoonId, setComingSoonId] = useState(null);

  // zoneChallenges arrives pre-sorted by the server (level order for the
  // Builder Track, difficulty order elsewhere) — the first uncleared entry
  // that isn't this one is genuinely "what to do next."
  const nextChallenge = zoneChallenges.find((c) => c.id !== challenge.id && !clearedChallengeIds.includes(c.id));

  let continueHref = `/zone/${challenge.zone_id}`;
  let continueLabel = "Back to zone →";
  if (tournamentId) {
    continueHref = `/tournaments/${tournamentId}`;
    continueLabel = "Back to tournament →";
  } else if (nextChallenge) {
    continueHref = `/zone/${challenge.zone_id}/challenge/${nextChallenge.id}`;
    continueLabel = challenge.zone_id === "builder-track" ? `Next: Level ${nextChallenge.level_number} →` : "Next challenge →";
  }

  function handlePickAgent(a) {
    if (!isAgentPlayable(a.id)) {
      setComingSoonId(a.id);
      setTimeout(() => setComingSoonId(null), 1800);
      return;
    }
    setAgentId(a.id);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!prompt.trim() || status === "submitting") return;
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeId: challenge.id, agentId, promptText: prompt, tournamentId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong.");
        setStatus("idle");
        return;
      }
      setResult(data);
      setStatus("idle");
    } catch (err) {
      setErrorMsg(err.message);
      setStatus("idle");
    }
  }

  function handleLeave() {
    setResult(null);
    setPrompt("");
  }

  return (
    <>
      <div className="px-5 pb-10 pt-6">
        <Link
          href={tournamentId ? `/tournaments/${tournamentId}` : `/zone/${challenge.zone_id}`}
          className="text-xs font-extrabold mb-4 inline-block"
          style={{ color: t.ink }}
        >
          ← Back to {tournamentId ? "tournament" : challenge.zones?.name || "zone"}
        </Link>

        {tournamentId && (
          <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full mb-2" style={{ background: t.accent, color: t.accentInk }}>
            🏆 Tournament entry
          </span>
        )}

        <h1 className="font-black text-xl font-display" style={{ color: t.ink }}>
          {challenge.title}
        </h1>
        <p className="text-sm mt-2 opacity-80 font-semibold" style={{ color: t.ink }}>
          {challenge.brief}
        </p>

        <div className="mt-5">
          <div className="text-xs font-extrabold mb-2" style={{ color: t.ink }}>
            Prompting
          </div>
          <div className="flex gap-2 flex-wrap">
            {agents.map((a) => {
              const playable = isAgentPlayable(a.id);
              return (
                <button
                  key={a.id}
                  onClick={() => handlePickAgent(a)}
                  className="px-3 py-1.5 rounded-full text-xs font-bold relative"
                  style={{
                    background: agentId === a.id ? a.color_hex : t.card,
                    color: agentId === a.id ? "#fff" : t.ink,
                    border: `2px solid ${t.ink}`,
                    opacity: playable ? 1 : 0.5,
                  }}
                >
                  {a.label}
                  {!playable && comingSoonId === a.id && (
                    <span
                      className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-extrabold px-2 py-1 rounded-full"
                      style={{ background: t.ink, color: t.card }}
                    >
                      Coming soon
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={6}
            placeholder="Write your prompt here..."
            className="w-full p-4 rounded-2xl text-sm font-semibold outline-none"
            style={{ border: `2.5px solid ${t.ink}`, background: t.card, color: t.ink }}
          />
          <div className="text-[11px] font-bold opacity-60 mt-1 text-right" style={{ color: t.ink }}>
            Par: ~{challenge.par_tokens} words
          </div>
          <button
            type="submit"
            disabled={status === "submitting" || !prompt.trim()}
            className="w-full mt-3 py-3 rounded-2xl font-extrabold text-sm"
            style={{ background: t.accent, color: t.accentInk, border: `3px solid ${t.ink}` }}
          >
            {status === "submitting" ? "Scoring..." : "Submit prompt →"}
          </button>
          {errorMsg && <p className="text-xs font-bold text-red-600 mt-2">{errorMsg}</p>}
        </form>
      </div>
      <BottomNav />
      <WinCelebration
        t={t}
        result={result}
        onClose={handleLeave}
        onRetry={handleLeave}
        retryAllowed={!tournamentId}
        continueHref={continueHref}
        continueLabel={continueLabel}
      />
    </>
  );
}
