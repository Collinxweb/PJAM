export const THEMES = {
  meadow: {
    label: "Meadow",
    emoji: "🌤️",
    bgFrom: "#bfe6f8",
    bgTo: "#eaf7ff",
    card: "#ffffff",
    ink: "#1b3a4b",
    accent: "#8b5cf6",
    accentInk: "#ffffff",
    accent2: "#4fb8a0",
    gold: "#e0b23d",
    mascotBody: "#c9b3ff",
    mascotCheek: "#ff9d6c",
  },
  snow: {
    label: "Snow Mountain",
    emoji: "🏔️",
    bgFrom: "#dce9f4",
    bgTo: "#f4fbff",
    card: "#ffffff",
    ink: "#1f2f45",
    accent: "#7c6cf0",
    accentInk: "#ffffff",
    accent2: "#5fc9e8",
    gold: "#e0b23d",
    mascotBody: "#eaf6ff",
    mascotCheek: "#a78bfa",
  },
  desert: {
    label: "Desert",
    emoji: "🏜️",
    bgFrom: "#f6d9a3",
    bgTo: "#fdf0d9",
    card: "#fffaf0",
    ink: "#5a3416",
    accent: "#8b4fd9",
    accentInk: "#ffffff",
    accent2: "#e8a33d",
    gold: "#e0b23d",
    mascotBody: "#ffcf87",
    mascotCheek: "#c9829e",
  },
  arena: {
    label: "Arena",
    emoji: "🕹️",
    bgFrom: "#0c0a12",
    bgTo: "#1a1224",
    card: "#160f20",
    ink: "#efe9ff",
    accent: "#a259ff",
    accentInk: "#ffffff",
    accent2: "#c9c9d6",
    gold: "#e0b23d",
    mascotBody: "#1c1526",
    mascotCheek: "#a259ff",
    dark: true,
  },
};

export const DEFAULT_THEME_KEY = "arena";

// Seasonal decoration only. Remove this single flag to retire the event.
export function isOfrendaActive() {
  const eventDate = new Date();
  return (eventDate.getMonth() === 9 && eventDate.getDate() === 31) ||
    (eventDate.getMonth() === 10 && eventDate.getDate() <= 2);
}
export const OFRENDA_ACCENT = "#ff9500";
export const OFRENDA_GLOW = "rgba(255, 149, 0, 0.38)";

export const RANK_TIERS = [
  { name: "Bronze", min: 0, max: 999, color: "#b08d57" },
  { name: "Silver", min: 1000, max: 2499, color: "#9aa5b1" },
  { name: "Gold", min: 2500, max: 4999, color: "#e0b23d" },
  { name: "Prompt Master", min: 5000, max: Infinity, color: "#a259ff" },
];

export function tierForReputation(rep) {
  return RANK_TIERS.find((t) => rep >= t.min && rep <= t.max) || RANK_TIERS[0];
}

export const FILTERS = [
  { key: "all", label: "All" },
  { key: "reasoning", label: "Reasoning" },
  { key: "format", label: "Format" },
  { key: "style", label: "Style" },
  { key: "speed", label: "Speed" },
];

// Coins reward formula: base = difficulty * 20, scaled by how well the
// submission scored (out of 100 total: 60 accuracy + 25 efficiency + 15 style).
// Nothing is paid below PASS_SCORE. Since PASS_SCORE is now a lenient 40,
// the reward curve is graduated across a wide passing range — barely
// scraping past 40 pays very little, so there's still real incentive to
// aim higher even though the bar to pass at all is low.
export function coinsForSubmission(difficulty, totalScore) {
  if (totalScore < PASS_SCORE) return 0;
  const base = difficulty * 20;
  if (totalScore >= 95) return base;
  if (totalScore >= 85) return Math.round(base * 0.85);
  if (totalScore >= 70) return Math.round(base * 0.65);
  if (totalScore >= 55) return Math.round(base * 0.4);
  return Math.round(base * 0.2); // a bare pass, 40-54
}

// XP is likewise only awarded on a clear (score >= PASS_SCORE) — leveling
// reflects real cleared challenges, not attempt volume.
export function xpForSubmission(difficulty, totalScore) {
  if (totalScore < PASS_SCORE) return 0;
  return difficulty * 10;
}

// Level cap: 50. Beyond that, XP still accumulates but level display
// plateaus at "Lv. 50 (MAX)" rather than climbing forever.
export const LEVEL_CAP = 50;

// NOTE: player-facing "Level" no longer uses this function — Level is now
// computed directly from Builder Track progress (see lib/progress.js), to
// avoid two different numbers both being called "Level". This XP-curve
// function is kept in case XP progress ever needs its own display later.
export function levelForXp(xp) {
  let level = 1;
  let needed = 100;
  let remaining = xp;
  while (remaining >= needed && level < LEVEL_CAP) {
    remaining -= needed;
    level += 1;
    needed = level * 100;
  }
  const maxed = level >= LEVEL_CAP;
  return { level, xpIntoLevel: remaining, xpForNextLevel: needed, maxed };
}

// The score a submission needs to count as a "clear" rather than a
// retry-required attempt. Used consistently by the win/fail screen,
// coin payout tiers, and tournament scoring. Deliberately low (30%) —
// PJAM's audience is beginners learning prompt engineering for the first
// time, not professionals, so clearing a level should feel genuinely
// achievable even on an imperfect attempt. The coin curve above is what
// rewards actually doing well, not the pass/fail bar itself.
export const PASS_SCORE = 30;

// Difficulty bands used for the Easy/Medium/Hard picker shown before a
// player enters a zone's challenge list or defines a custom tournament
// challenge. Maps onto the existing 1-5 star difficulty field.
export const DIFFICULTY_BANDS = {
  easy: { label: "Easy", stars: [1, 2], difficultyForCustom: 1 },
  medium: { label: "Medium", stars: [3], difficultyForCustom: 3 },
  hard: { label: "Hard", stars: [4, 5], difficultyForCustom: 5 },
};

export const AI_AGENTS = [
  { id: "claude", label: "Claude", mono: "C", color: "#D97757", makerLabel: "Anthropic" },
  { id: "chatgpt", label: "ChatGPT", mono: "G", color: "#10A37F", makerLabel: "OpenAI" },
  { id: "grok", label: "Grok", mono: "X", color: "#1A1A1A", makerLabel: "xAI" },
  { id: "gemini", label: "Gemini", mono: "G", color: "#4285F4", makerLabel: "Google" },
];

// Agents that are actually wired up and playable right now. Others show
// "Coming soon" throughout the app instead of being selectable — update
// this list as more provider API keys/billing get set up.
export const WORKING_AGENT_IDS = ["gemini"];

export function isAgentPlayable(agentId) {
  return WORKING_AGENT_IDS.includes(agentId);
}

// Judging strictness by difficulty tier. Easy challenges get a generous,
// lenient grader; Hard challenges get a strict, precise one. Applied to
// both the AI-judge prompt wording and the offline heuristic fallback.
export function difficultyTierFor(difficulty) {
  if (DIFFICULTY_BANDS.easy.stars.includes(difficulty)) return "easy";
  if (DIFFICULTY_BANDS.medium.stars.includes(difficulty)) return "medium";
  return "hard";
}

// A preamble sent to the judge on every single grading call, regardless of
// difficulty tier — this is the most important lever for keeping the game
// beginner-friendly, since it directly tells the judge who it's grading for.
export const JUDGE_BEGINNER_CONTEXT =
  "IMPORTANT CONTEXT: The person who wrote this prompt is a beginner learning prompt engineering for the first time — PJAM's audience is complete newcomers, not professional prompt engineers or developers. Do NOT apply expert-level or professional standards. A simple, short, or imperfectly-worded prompt that still shows a reasonable attempt at the task deserves generous credit. Grade the spirit and general direction of the attempt, not polish or sophistication. When in doubt, score higher, not lower.";

export const JUDGE_STRICTNESS_INSTRUCTIONS = {
  easy: "This is an EASY challenge, aimed at first-time players. Be extremely lenient: award full or near-full accuracy credit if the output captures even a rough, partial version of the idea, regardless of wording, missing details, or a loose interpretation. Only score low if the output is completely unrelated to the brief.",
  medium: "This is a MEDIUM challenge. Grade generously: credit the output whenever its meaning is even reasonably close to the target, including partial or incomplete attempts. Reserve low scores only for answers that are clearly off-topic or miss the point entirely.",
  hard: "This is a HARD challenge, but the player is still a beginner. Grade with real generosity: give solid credit for any good-faith attempt that's headed in the right direction, even if it's missing detail or isn't fully correct. Reserve the lowest scores only for answers that are meaningfully wrong or barely attempted, not just imperfect or incomplete.",
};

// Multiplier applied to the offline heuristic judge's word-overlap score,
// so the fallback path (used when no AI judge key is available) roughly
// mirrors the same leniency curve as the real AI judge.
export const HEURISTIC_LENIENCY_MULTIPLIER = { easy: 1.9, medium: 1.6, hard: 1.3 };
