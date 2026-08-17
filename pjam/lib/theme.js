export const THEMES = {
  meadow: {
    label: "Meadow",
    emoji: "🌤️",
    bgFrom: "#bfe6f8",
    bgTo: "#eaf7ff",
    card: "#ffffff",
    ink: "#1b3a4b",
    accent: "#ffc72c",
    accentInk: "#5c4300",
    accent2: "#4fb8a0",
    mascotBody: "#ffd873",
    mascotCheek: "#ff9d6c",
  },
  snow: {
    label: "Snow Mountain",
    emoji: "🏔️",
    bgFrom: "#dce9f4",
    bgTo: "#f4fbff",
    card: "#ffffff",
    ink: "#1f2f45",
    accent: "#5fc9e8",
    accentInk: "#0b3a4d",
    accent2: "#a78bfa",
    mascotBody: "#eaf6ff",
    mascotCheek: "#8fd6ff",
  },
  desert: {
    label: "Desert",
    emoji: "🏜️",
    bgFrom: "#f6d9a3",
    bgTo: "#fdf0d9",
    card: "#fffaf0",
    ink: "#5a3416",
    accent: "#ff6b45",
    accentInk: "#4a1c08",
    accent2: "#e8a33d",
    mascotBody: "#ffcf87",
    mascotCheek: "#ff8a5c",
  },
  arena: {
    label: "Arena",
    emoji: "🕹️",
    bgFrom: "#0c0a12",
    bgTo: "#1a1224",
    card: "#160f20",
    ink: "#efe9ff",
    accent: "#a259ff",
    accentInk: "#1a0630",
    accent2: "#c9c9d6",
    mascotBody: "#1c1526",
    mascotCheek: "#a259ff",
    dark: true,
  },
};

export const DEFAULT_THEME_KEY = "meadow";

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
