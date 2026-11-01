export const DAILY_RUSH_TOTAL_CHALLENGES = 30;
export const DAILY_RUSH_SOLVE_THRESHOLD = 35; // creativity score out of 100 — kept beginner-friendly, same spirit as PASS_SCORE
export const DAILY_RUSH_TOP_N = 10;
export const DAILY_RUSH_TOP_N_BONUS_COINS = 200;
export const DAILY_RUSH_LATE_SOLVE_BASE_COINS = 40;

// Deterministic day -> challenge mapping, no cron/scheduled job needed.
// Cycles through the 30 seeded challenges on repeat once they're exhausted.
const EPOCH = Date.UTC(2026, 0, 1); // 2026-01-01T00:00:00Z

export function todayRushDate() {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD", UTC-based
}

export function dayIndexForDate(dateStr) {
  const d = Date.UTC(...dateStr.split("-").map((n, i) => (i === 1 ? Number(n) - 1 : Number(n))));
  const daysSince = Math.floor((d - EPOCH) / 86400000);
  const wrapped = ((daysSince % DAILY_RUSH_TOTAL_CHALLENGES) + DAILY_RUSH_TOTAL_CHALLENGES) % DAILY_RUSH_TOTAL_CHALLENGES;
  return wrapped + 1; // 1-indexed to match day_index in the DB
}

export function coinsForDailyRush(solved, solveRank, creativityScore) {
  if (!solved) return 0;
  if (solveRank && solveRank <= DAILY_RUSH_TOP_N) return DAILY_RUSH_TOP_N_BONUS_COINS;
  const scale = creativityScore >= 90 ? 1 : creativityScore >= 75 ? 0.75 : 0.5;
  return Math.round(DAILY_RUSH_LATE_SOLVE_BASE_COINS * scale);
}
