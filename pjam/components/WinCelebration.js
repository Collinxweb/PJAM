"use client";

export default function WinCelebration({ t, result, onClose }) {
  if (!result) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xs rounded-3xl p-6 text-center"
        style={{ background: t.card, border: `3px solid ${t.ink}`, boxShadow: `6px 8px 0 ${t.ink}` }}
      >
        <div className="text-5xl">{result.won ? "🎉🏆" : "📝"}</div>
        <h2 className="font-black text-xl mt-2 font-display" style={{ color: t.ink }}>
          {result.won ? "Challenge cleared!" : "Scored, but not cleared"}
        </h2>
        <p className="text-sm font-bold mt-3" style={{ color: t.ink }}>
          {result.totalScore}/100
        </p>
        <div className="text-xs font-semibold mt-1 opacity-70 flex justify-center gap-3" style={{ color: t.ink }}>
          <span>Accuracy {result.accuracy}/60</span>
          <span>Efficiency {result.efficiency}/25</span>
          <span>Style {result.style}/15</span>
        </div>

        {result.won && (
          <div className="mt-4 rounded-2xl p-3" style={{ background: t.accent, color: t.accentInk }}>
            <div className="font-extrabold text-sm">🪙 +{result.coinsEarned} coins · +{result.xpEarned} XP</div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-5 py-3 rounded-2xl font-extrabold text-sm"
          style={{ background: t.accent, color: t.accentInk, border: `3px solid ${t.ink}` }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
