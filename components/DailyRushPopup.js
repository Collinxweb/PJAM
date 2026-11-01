"use client";

import { useState } from "react";
import Link from "next/link";

export default function DailyRushPopup({ t, brief }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed || !brief) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={() => setDismissed(true)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xs rounded-3xl p-6 text-center"
        style={{ background: t.card, border: `3px solid ${t.ink}`, boxShadow: `6px 8px 0 ${t.ink}` }}
      >
        <div className="text-5xl">⏳</div>
        <h2 className="font-black text-lg mt-2 font-display" style={{ color: t.ink }}>
          Today's Daily Rush
        </h2>
        <p className="text-sm font-semibold mt-2 opacity-80" style={{ color: t.ink }}>
          {brief}
        </p>
        <p className="text-xs font-bold mt-3 opacity-60" style={{ color: t.ink }}>
          First 10 solvers today get a big coin bonus. One attempt per day.
        </p>
        <Link
          href="/daily-rush"
          className="block w-full mt-5 py-3 rounded-2xl font-extrabold text-sm"
          style={{ background: t.accent, color: t.accentInk, border: `3px solid ${t.ink}` }}
        >
          Take the challenge →
        </Link>
        <button
          onClick={() => setDismissed(true)}
          className="w-full mt-2 py-2 text-xs font-bold opacity-60"
          style={{ color: t.ink }}
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
