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
export function coinsForSubmission(difficulty, totalScore) {
  const base = difficulty * 20;
  if (totalScore >= 90) return base;
  if (totalScore >= 70) return Math.round(base * 0.75);
  if (totalScore >= 50) return Math.round(base * 0.5);
  return Math.round(base * 0.25);
}

// XP always awarded on a scored attempt, smaller and flatter than coins,
// so level reflects play volume rather than skill (that's what Reputation is for).
export function xpForSubmission(difficulty) {
  return difficulty * 10;
}

// Simple level curve: level N requires N*100 cumulative XP.
export function levelForXp(xp) {
  let level = 1;
  let needed = 100;
  let remaining = xp;
  while (remaining >= needed) {
    remaining -= needed;
    level += 1;
    needed = level * 100;
  }
  return { level, xpIntoLevel: remaining, xpForNextLevel: needed };
}

export const AI_AGENTS = [
  { id: "claude", label: "Claude", mono: "C", color: "#D97757", makerLabel: "Anthropic" },
  { id: "chatgpt", label: "ChatGPT", mono: "G", color: "#10A37F", makerLabel: "OpenAI" },
  { id: "grok", label: "Grok", mono: "X", color: "#1A1A1A", makerLabel: "xAI" },
  { id: "gemini", label: "Gemini", mono: "G", color: "#4285F4", makerLabel: "Google" },
];
