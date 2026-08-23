import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ZoneDetailView from "@/components/ZoneDetailView";
import { PASS_SCORE } from "@/lib/theme";

export default async function ZonePage({ params }) {
  const supabase = createClient();

  const { data: zone } = await supabase.from("zones").select("*").eq("id", params.id).single();
  if (!zone) notFound();

  const isBuilderTrack = params.id === "builder-track";

  let query = supabase
    .from("challenges")
    .select("id, title, brief, difficulty, par_tokens, level_number, level_name, skill")
    .eq("zone_id", params.id)
    .eq("active", true);

  query = isBuilderTrack
    ? query.order("level_number", { ascending: true, nullsFirst: false })
    : query.order("difficulty");

  const { data: challenges } = await query;

  let clearedChallengeIds = [];
  if (isBuilderTrack) {
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
      isBuilderTrack={isBuilderTrack}
      clearedChallengeIds={clearedChallengeIds}
    />
  );
}
