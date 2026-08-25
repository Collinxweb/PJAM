import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ZoneDetailView from "@/components/ZoneDetailView";
import { PASS_SCORE } from "@/lib/theme";

// Any zone whose challenges use level_number is treated as a sequential
// "track" — locked levels, level names, progress count — rather than a
// flat difficulty-filtered list. This covers Builder Track, Integrations
// Track, and any future track without hardcoding each zone's ID here.
const TRACK_ZONE_IDS = ["builder-track", "integrations-track"];

export default async function ZonePage({ params }) {
  const supabase = createClient();

  const { data: zone } = await supabase.from("zones").select("*").eq("id", params.id).single();
  if (!zone) notFound();

  const isTrack = TRACK_ZONE_IDS.includes(params.id);

  let query = supabase
    .from("challenges")
    .select("id, title, brief, difficulty, par_tokens, level_number, level_name, skill")
    .eq("zone_id", params.id)
    .eq("active", true);

  query = isTrack
    ? query.order("level_number", { ascending: true, nullsFirst: false })
    : query.order("difficulty");

  const { data: challenges } = await query;

  let clearedChallengeIds = [];
  if (isTrack) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: pastSubmissions } = await supabase
        .from("submissions")
        .select("challenge_id, total_score")
        .eq("user_id", user.id)
        .in("challenge_id", (challenges || []).map((c) => c.id));
      clearedChallengeIds = [
        ...new Set(
          (pastSubmissions || [])
            .filter((s) => Number(s.total_score) >= PASS_SCORE)
            .map((s) => s.challenge_id)
        ),
      ];
    }
  }

  return (
    <ZoneDetailView
      zone={zone}
      challenges={challenges || []}
      isBuilderTrack={isTrack}
      clearedChallengeIds={clearedChallengeIds}
    />
  );
}
