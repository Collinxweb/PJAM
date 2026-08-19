"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import BottomNav from "@/components/BottomNav";

export default function TournamentDetailView({ tournament, participants, leaderboard, isHost, hasJoined, signedIn }) {
  const { t } = useTheme();
  const [joining, setJoining] = useState(false);
  const [ending, setEnding] = useState(false);
  const [error, setError] = useState("");
  const [localJoined, setLocalJoined] = useState(hasJoined);

  const spotsLeft = tournament.capacity - participants.length;
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const tweetText = `I just started a PJAM tournament — think you can out-prompt me? "${tournament.challenges?.title}", ${tournament.capacity} players. Join here: ${shareUrl} 🧩⚔️`;
  const tweetIntent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

  async function handleJoin() {
    setJoining(true);
    setError("");
    const res = await fetch("/api/tournaments/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tournamentId: tournament.id }),
    });
    const data = await res.json();
    setJoining(false);
    if (!res.ok) {
      setError(data.error || "Could not join.");
      return;
    }
    setLocalJoined(true);
    window.location.reload();
  }

  async function handleEnd() {
    setEnding(true);
    setError("");
    const res = await fetch("/api/tournaments/finish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tournamentId: tournament.id }),
    });
    const data = await res.json();
    setEnding(false);
    if (!res.ok) {
      setError(data.error || "Could not end tournament.");
      return;
    }
    window.location.reload();
  }

  return (
    <>
      <div className="px-5 pb-10 pt-6">
        <Link href="/tournaments" className="text-xs font-extrabold mb-4 inline-block" style={{ color: t.ink }}>
          ← Back
        </Link>

        {tournament.status === "completed" && (
          <div className="rounded-2xl p-4 mb-4 text-center" style={{ background: t.accent, color: t.accentInk }}>
            <div className="text-3xl">🎉🏆</div>
            <div className="font-extrabold text-sm mt-1">
              Winner: {leaderboard[0]?.username || "—"}
            </div>
          </div>
        )}

        <h1 className="font-black text-xl font-display" style={{ color: t.ink }}>
          {tournament.challenges?.title || "Tournament"}
        </h1>
        <div className="flex gap-2 mt-2">
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: t.card, border: `2px solid ${t.ink}`, color: t.ink }}>
            {participants.length}/{tournament.capacity} players
          </span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: t.card, border: `2px solid ${t.ink}`, color: t.ink }}>
            {tournament.status}
          </span>
        </div>

        {tournament.status === "open" && !localJoined && signedIn && (
          <button
            onClick={handleJoin}
            disabled={joining || spotsLeft <= 0}
            className="w-full mt-5 py-3 rounded-2xl font-extrabold text-sm"
            style={{ background: t.accent, color: t.accentInk, border: `3px solid ${t.ink}` }}
          >
            {spotsLeft <= 0 ? "Full" : joining ? "Joining..." : `Join tournament (${spotsLeft} spots left) →`}
          </button>
        )}

        {(localJoined || tournament.status !== "open") && tournament.status !== "completed" && (
          <Link
            href={`/zone/${tournament.challenges?.zone_id}/challenge/${tournament.challenges?.id}?tournament=${tournament.id}`}
            className="block text-center w-full mt-5 py-3 rounded-2xl font-extrabold text-sm"
            style={{ background: t.accent, color: t.accentInk, border: `3px solid ${t.ink}` }}
          >
            Submit your prompt →
          </Link>
        )}

        <a
          href={tweetIntent}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full mt-3 py-3 rounded-2xl font-extrabold text-sm"
          style={{ background: "#000", color: "#fff", border: "3px solid #000" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
            <path d="M18.9 2H22l-7.6 8.7L23.3 22H16.9l-5-6.5-5.7 6.5H2.9l8.1-9.3L2 2h6.5l4.5 6 5.9-6zm-1.1 18h1.7L7.3 3.9H5.5L17.8 20z" />
          </svg>
          Invite players on X
        </a>

        {isHost && tournament.status !== "completed" && (
          <button
            onClick={handleEnd}
            disabled={ending}
            className="w-full mt-3 py-2.5 rounded-2xl font-extrabold text-sm"
            style={{ background: t.card, color: t.ink, border: `2.5px solid ${t.ink}` }}
          >
            {ending ? "Ending..." : "End tournament & reveal winner"}
          </button>
        )}

        {error && <p className="text-xs font-bold text-red-600 mt-2">{error}</p>}

        <div className="mt-7">
          <h2 className="font-extrabold text-sm mb-2" style={{ color: t.ink }}>
            Leaderboard
          </h2>
          <div className="flex flex-col gap-2">
            {leaderboard.map((row, i) => (
              <div key={row.user_id} className="rounded-2xl p-3 flex items-center justify-between" style={{ background: t.card, border: `2px solid ${t.ink}` }}>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black opacity-50" style={{ color: t.ink }}>
                    #{i + 1}
                  </span>
                  <span className="text-sm font-extrabold" style={{ color: t.ink }}>
                    {row.username || "Anonymous"}
                  </span>
                  {tournament.status === "completed" && i === 0 && <span>🏆</span>}
                </div>
                <span className="text-xs font-bold" style={{ color: t.ink }}>
                  {Number(row.best_score).toFixed(0)}/100
                </span>
              </div>
            ))}
            {leaderboard.length === 0 && (
              <p className="text-sm opacity-60 font-semibold text-center" style={{ color: t.ink }}>
                No scores submitted yet.
              </p>
            )}
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
