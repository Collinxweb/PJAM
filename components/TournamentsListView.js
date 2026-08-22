"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import BottomNav from "@/components/BottomNav";
import { DIFFICULTY_BANDS } from "@/lib/theme";

export default function TournamentsListView({ tournaments, challenges, signedIn }) {
  const { t } = useTheme();
  const [showCreate, setShowCreate] = useState(false);
  const [mode, setMode] = useState("existing"); // existing | custom
  const [challengeId, setChallengeId] = useState(challenges[0]?.id || "");
  const [capacity, setCapacity] = useState(4);
  const [customTitle, setCustomTitle] = useState("");
  const [customBrief, setCustomBrief] = useState("");
  const [customTarget, setCustomTarget] = useState("");
  const [customBand, setCustomBand] = useState("medium");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate() {
    setCreating(true);
    setError("");
    const body =
      mode === "existing"
        ? { challengeId, capacity }
        : {
            capacity,
            customChallenge: {
              title: customTitle,
              brief: customBrief,
              targetOutput: customTarget,
              difficultyBand: customBand,
            },
          };
    const res = await fetch("/api/tournaments/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setCreating(false);
    if (!res.ok) {
      setError(data.error || "Could not create tournament.");
      return;
    }
    window.location.href = `/tournaments/${data.tournamentId}`;
  }

  return (
    <>
      <div className="px-5 pb-10 pt-6">
        <h1 className="font-black text-xl font-display" style={{ color: t.ink }}>
          🏆 Tournaments
        </h1>
        <p className="text-xs mt-1 mb-4 opacity-70 font-semibold" style={{ color: t.ink }}>
          2–8 players (2 = 1v1), one shared challenge, one attempt each. Highest score wins the pot.
        </p>

        {signedIn ? (
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="w-full py-3 rounded-2xl font-extrabold text-sm mb-4"
            style={{ background: t.accent, color: t.accentInk, border: `3px solid ${t.ink}` }}
          >
            {showCreate ? "Cancel" : "+ Host a tournament"}
          </button>
        ) : (
          <Link
            href="/onboarding"
            className="block text-center w-full py-3 rounded-2xl font-extrabold text-sm mb-4"
            style={{ background: t.accent, color: t.accentInk, border: `3px solid ${t.ink}` }}
          >
            Sign in to host or join
          </Link>
        )}

        {showCreate && (
          <div className="rounded-2xl p-4 mb-5" style={{ background: t.card, border: `2.5px solid ${t.ink}` }}>
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setMode("existing")}
                className="flex-1 py-2 rounded-xl text-xs font-bold"
                style={{
                  background: mode === "existing" ? t.accent : "transparent",
                  color: mode === "existing" ? t.accentInk : t.ink,
                  border: `2px solid ${t.ink}`,
                }}
              >
                Pick a challenge
              </button>
              <button
                onClick={() => setMode("custom")}
                className="flex-1 py-2 rounded-xl text-xs font-bold"
                style={{
                  background: mode === "custom" ? t.accent : "transparent",
                  color: mode === "custom" ? t.accentInk : t.ink,
                  border: `2px solid ${t.ink}`,
                }}
              >
                Write my own
              </button>
            </div>

            {mode === "existing" ? (
              <>
                <div className="text-xs font-extrabold mb-2" style={{ color: t.ink }}>
                  Challenge
                </div>
                <select
                  value={challengeId}
                  onChange={(e) => setChallengeId(e.target.value)}
                  className="w-full p-2 rounded-xl text-sm font-semibold mb-3"
                  style={{ border: `2px solid ${t.ink}`, background: t.bgFrom, color: t.ink }}
                >
                  {challenges.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <>
                <div className="text-xs font-extrabold mb-1" style={{ color: t.ink }}>
                  Challenge title
                </div>
                <input
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. Convince a skeptic in one sentence"
                  className="w-full p-2 rounded-xl text-sm font-semibold mb-3"
                  style={{ border: `2px solid ${t.ink}`, background: t.bgFrom, color: t.ink }}
                />

                <div className="text-xs font-extrabold mb-1" style={{ color: t.ink }}>
                  What should players get the AI to do?
                </div>
                <textarea
                  value={customBrief}
                  onChange={(e) => setCustomBrief(e.target.value)}
                  rows={3}
                  placeholder="Describe exactly what the prompt needs to produce"
                  className="w-full p-2 rounded-xl text-sm font-semibold mb-3"
                  style={{ border: `2px solid ${t.ink}`, background: t.bgFrom, color: t.ink }}
                />

                <div className="text-xs font-extrabold mb-1" style={{ color: t.ink }}>
                  Target answer (used to judge every entry)
                </div>
                <textarea
                  value={customTarget}
                  onChange={(e) => setCustomTarget(e.target.value)}
                  rows={2}
                  placeholder="The ideal output you're scoring against"
                  className="w-full p-2 rounded-xl text-sm font-semibold mb-3"
                  style={{ border: `2px solid ${t.ink}`, background: t.bgFrom, color: t.ink }}
                />
              </>
            )}

            <div className="text-xs font-extrabold mb-2" style={{ color: t.ink }}>
              Difficulty
            </div>
            <div className="flex gap-2 mb-3">
              {Object.entries(DIFFICULTY_BANDS).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setCustomBand(key)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold"
                  style={{
                    background: customBand === key ? t.accent : "transparent",
                    color: customBand === key ? t.accentInk : t.ink,
                    border: `2px solid ${t.ink}`,
                  }}
                >
                  {val.label}
                </button>
              ))}
            </div>

            <div className="text-xs font-extrabold mb-2" style={{ color: t.ink }}>
              Players ({capacity}{capacity === 2 ? " — 1v1 duel" : ""})
            </div>
            <input
              type="range"
              min={2}
              max={8}
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-full mb-3"
            />

            <button
              onClick={handleCreate}
              disabled={creating || (mode === "existing" && !challengeId)}
              className="w-full py-2.5 rounded-xl font-extrabold text-sm"
              style={{ background: t.accent, color: t.accentInk, border: `2.5px solid ${t.ink}` }}
            >
              {creating ? "Creating..." : "Create tournament →"}
            </button>
            {error && <p className="text-xs font-bold text-red-600 mt-2">{error}</p>}
          </div>
        )}

        <div className="flex flex-col gap-3">
          {tournaments.map((tour) => (
            <Link
              key={tour.id}
              href={`/tournaments/${tour.id}`}
              className="rounded-2xl p-4 flex items-center justify-between"
              style={{ background: t.card, border: `2.5px solid ${t.ink}` }}
            >
              <div>
                <div className="font-extrabold text-sm" style={{ color: t.ink }}>
                  {tour.challenges?.title || "Tournament"}
                </div>
                <div className="text-[11px] font-bold opacity-60" style={{ color: t.ink }}>
                  {(tour.tournament_participants || []).length}/{tour.capacity} players · {tour.status}
                </div>
              </div>
              <span className="text-lg">
                {tour.status === "completed" ? "🏆" : tour.status === "in_progress" ? "⏳" : "⚔️"}
              </span>
            </Link>
          ))}
          {tournaments.length === 0 && (
            <p className="text-sm mt-2 opacity-60 font-semibold text-center" style={{ color: t.ink }}>
              No tournaments yet — be the first to host one.
            </p>
          )}
        </div>
      </div>
      <BottomNav />
    </>
  );
}
