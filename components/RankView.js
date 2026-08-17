"use client";

import { useTheme } from "@/components/ThemeProvider";
import BottomNav from "@/components/BottomNav";
import { RANK_TIERS, tierForReputation } from "@/lib/theme";

export default function RankView({ leaderboard, profile }) {
  const { t } = useTheme();
  const reputation = profile?.reputation ?? 0;
  const tier = tierForReputation(reputation);
  const nextTier = RANK_TIERS[RANK_TIERS.indexOf(tier) + 1];
  const repToNext = nextTier ? Math.max(0, nextTier.min - reputation) : 0;

  return (
    <>
      <div className="px-5 pb-10 pt-6">
        <h1 className="font-black text-xl font-display" style={{ color: t.ink }}>
          🏅 Rank
        </h1>
        <p className="text-xs mt-1 mb-4 opacity-70 font-semibold" style={{ color: t.ink }}>
          Reputation = average of your best 20 challenge scores, weighted 60% accuracy, 25% efficiency, 15% style.
          Decays 2% per week of inactivity.
        </p>

        <div className="flex flex-col gap-2">
          {RANK_TIERS.map((rt) => (
            <div key={rt.name} className="rounded-2xl p-3 flex items-center justify-between" style={{ background: t.card, border: `2.5px solid ${t.ink}` }}>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ background: rt.color }} />
                <span className="font-extrabold text-sm" style={{ color: t.ink }}>
                  {rt.name}
                </span>
              </div>
              <span className="text-xs font-bold opacity-70" style={{ color: t.ink }}>
                {rt.max === Infinity ? `${rt.min.toLocaleString()}+ rep` : `${rt.min.toLocaleString()} – ${rt.max.toLocaleString()} rep`}
              </span>
            </div>
          ))}
        </div>

        {profile ? (
          <div className="mt-5 rounded-3xl p-4 text-center" style={{ background: t.accent, color: t.accentInk, border: `3px solid ${t.ink}` }}>
            <div className="text-xs font-bold opacity-80">YOUR CURRENT STANDING</div>
            <div className="text-2xl font-black mt-1">
              {reputation.toLocaleString()} rep · {tier.name}
            </div>
            {nextTier && <div className="text-xs font-bold mt-1 opacity-80">{repToNext.toLocaleString()} rep to reach {nextTier.name}</div>}
          </div>
        ) : (
          <div className="mt-5 rounded-3xl p-4 text-center text-sm font-bold opacity-70" style={{ color: t.ink }}>
            Sign in to see your standing.
          </div>
        )}

        <div className="mt-7">
          <h2 className="font-extrabold text-sm mb-2" style={{ color: t.ink }}>
            Top players
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
                </div>
                <span className="text-xs font-bold" style={{ color: t.ink }}>
                  {Number(row.reputation).toLocaleString()} rep
                </span>
              </div>
            ))}
            {leaderboard.length === 0 && (
              <p className="text-sm opacity-60 font-semibold text-center" style={{ color: t.ink }}>
                No players yet — be the first on the board.
              </p>
            )}
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
