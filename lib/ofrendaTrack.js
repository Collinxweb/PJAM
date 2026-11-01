import { OFRENDA_LEVELS } from "@/lib/ofrendaLevels";

export const OFRENDA_ZONE = {
  id: "ofrenda-track",
  name: "Ofrenda Track",
  emoji: "🕯️",
  description: "20 prompt-crafting levels, from a ghostly hello to a complete welcome speech.",
  skill: "Prompt Engineering",
};

export function getOfrendaLevel(id) {
  return OFRENDA_LEVELS.find((level) => level.id === id) || null;
}

export function passScoreForChallenge(challenge) {
  if (challenge?.zone_id !== "ofrenda-track") return 30;
  return getOfrendaLevel(challenge.id)?.pass_score || 30;
}

export { OFRENDA_LEVELS } from "@/lib/ofrendaLevels";
