import { PASS_SCORE } from "@/lib/theme";

// Player Level is now literally "the highest Builder Track level you've
// cleared" — not an abstract XP curve. This is intentional: Builder Track
// has exactly 50 levels, matching the Level cap, so tying them together
// directly is both simpler and far less confusing than two numbers that
// happen to share the word "Level" but mean different things.
export async function getBuilderLevel(supabase, userId) {
  if (!userId) return 0;

  const { data } = await supabase
    .from("submissions")
    .select("total_score, challenges!inner(level_number, zone_id)")
    .eq("user_id", userId)
    .eq("challenges.zone_id", "builder-track");

  let max = 0;
  for (const row of data || []) {
    const lvl = row.challenges?.level_number;
    if (lvl && Number(row.total_score) >= PASS_SCORE && lvl > max) {
      max = lvl;
    }
  }
  return max;
}
