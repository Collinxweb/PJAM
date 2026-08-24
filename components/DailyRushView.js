"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import BottomNav from "@/components/BottomNav";
import { isAgentPlayable } from "@/lib/theme";

function ResultPanel({ t, result, brief }) {
  const [shareUrl, setShareUrl] = useState("");
  useEffect(() => {
    setShareUrl(window.location.origin + "/daily-rush");
  }, []);

  const inTop10 = result.solveRank && result.solveRank <= 10;
  const tweetText = inTop10
    ? `Just landed #${result.solveRank} on today's PJAM Daily Rush! 🎉⚡ Scored ${result.creativityScore}/100 building: "${brief}". Think you can out-create me? ${shareUrl}`
    : result.solved
    ? `Cleared today's PJAM Daily Rush with a ${result.creativityScore}/100 on: "${brief}" 🎨 ${shareUrl}`
    : "";

  return (
    <div className="mt-5 rounded-3xl p-5 text-center" style={{ background: t.card, border: `3px solid ${t.ink}`, boxShadow: `4px 5px 0 ${t.ink}` }}>
      <div className="text-4xl">{inTop10 ? "🎉🏆" : result.solved ? "✨" : "😞💔"}</div>
      <div className="font-black text-lg mt-2" style={{ color: t.ink }}>
        {inTop10 ? `#${result.solveRank} solver today!` : result.solved ? "Solved!" : "Didn't quite land it"}
      </div>
      <div className="text-sm font-bold mt-1" style={{ color: t.ink }}>
        Creativity score: {result.creativityScore}/100
      </div>
      {result.coinsEarned > 0 && (
        <div className="mt-3 rounded-2xl p-3" style={{ background: t.accent, color: t.accentInk }}>
          <span className="font-extrabold text-sm">🪙 +{result.coinsEarned} coins</span>
        </div>
      )}
      {!result.solved && (
        <p className="text-xs font-semibold mt-3 opacity-70" style={{ color: t.ink }}>
          Come back tomorrow for a new challenge and another shot.
        </p>
      )}
      {result.solved && (
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full mt-4 py-3 rounded-2xl font-extrabold text-sm"
          style={{ background: "#000", color: "#fff", border: "3px solid #000" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
            <path d="M18.9 2H22l-7.6 8.7L23.3 22H16.9l-5-6.5-5.7 6.5H2.9l8.1-9.3L2 2h6.5l4.5 6 5.9-6zm-1.1 18h1.7L7.3 3.9H5.5L17.8 20z" />
          </svg>
          Flaunt your win on X
        </a>
      )}
    </div>
  );
}

export default function DailyRushView({ challenge, existingEntry, agents, defaultAgentId, topSolvers }) {
  const { t } = useTheme();
  const [agentId, setAgentId] = useState(
    isAgentPlayable(defaultAgentId) ? defaultAgentId : agents.find((a) => isAgentPlayable(a.id))?.id || agents[0]?.id
  );
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState(
    existingEntry
      ? {
          creativityScore: existingEntry.creativity_score,
          solved: existingEntry.solved,
          solveRank: existingEntry.solve_rank,
          coinsEarned: existingEntry.coins_earned,
        }
      : null
  );

  async function handleSubmit(e) {
    e.preventDefault();
    if (!prompt.trim() || status === "submitting") return;
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/daily-rush/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId, promptText: prompt }),
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

  if (!challenge) {
    return (
      <>
        <div className="px-5 pb-10 pt-6">
          <Link href="/" className="text-xs font-extrabold mb-4 inline-block" style={{ color: t.ink }}>
            ← Back
          </Link>
          <p className="text-sm font-semibold" style={{ color: t.ink }}>
            Today's Daily Rush isn't set up yet — check back soon.
          </p>
        </div>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <div className="px-5 pb-10 pt-6">
        <Link href="/" className="text-xs font-extrabold mb-4 inline-block" style={{ color: t.ink }}>
          ← Back
        </Link>

        <div className="text-4xl">⏳</div>
        <h1 className="font-black text-xl mt-2 font-display" style={{ color: t.ink }}>
          Today's Daily Rush
        </h1>
        <p className="text-sm mt-2 opacity-80 font-semibold" style={{ color: t.ink }}>
          {challenge.brief}
        </p>
        <p className="text-xs mt-2 font-bold opacity-60" style={{ color: t.ink }}>
          Judged on creativity, not a fixed answer. First {10} solvers today get a big coin bonus. One attempt per day.
        </p>

        {result ? (
          <ResultPanel t={t} result={result} brief={challenge.brief} />
        ) : (
          <>
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
                      onClick={() => playable && setAgentId(a.id)}
                      className="px-3 py-1.5 rounded-full text-xs font-bold"
                      style={{
                        background: agentId === a.id ? a.color_hex : t.card,
                        color: agentId === a.id ? "#fff" : t.ink,
                        border: `2px solid ${t.ink}`,
                        opacity: playable ? 1 : 0.5,
                      }}
                    >
                      {a.label}
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
              <button
                type="submit"
                disabled={status === "submitting" || !prompt.trim()}
                className="w-full mt-3 py-3 rounded-2xl font-extrabold text-sm"
                style={{ background: t.accent, color: t.accentInk, border: `3px solid ${t.ink}` }}
              >
                {status === "submitting" ? "Judging..." : "Submit today's entry →"}
              </button>
              {errorMsg && <p className="text-xs font-bold text-red-600 mt-2">{errorMsg}</p>}
            </form>
          </>
        )}

        {topSolvers.length > 0 && (
          <div className="mt-7">
            <h2 className="font-extrabold text-sm mb-2" style={{ color: t.ink }}>
              🏆 Today's top solvers
            </h2>
            <div className="flex flex-col gap-2">
              {topSolvers.map((row) => (
                <div key={row.user_id} className="rounded-2xl p-3 flex items-center justify-between" style={{ background: t.card, border: `2px solid ${t.ink}` }}>
                  <span className="text-sm font-extrabold" style={{ color: t.ink }}>
                    #{row.solve_rank} {row.username}
                  </span>
                  <span className="text-xs font-bold" style={{ color: t.ink }}>
                    {row.creativity_score}/100
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </>
  );
}
