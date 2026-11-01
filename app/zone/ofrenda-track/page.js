import { createClient } from "@/lib/supabase/server";
import ZoneDetailView from "@/components/ZoneDetailView";
import { PASS_SCORE, isOfrendaActive } from "@/lib/theme";
import { OFRENDA_LEVELS, OFRENDA_ZONE } from "@/lib/ofrendaTrack";
import { ofrendaChallengeUuid } from "@/lib/dbIds";
import { notFound } from "next/navigation";

export default async function OfrendaTrackPage() {
  if (!isOfrendaActive()) notFound();
  const supabase = createClient();
  const { data: zone } = await supabase.from("zones").select("*").eq("id", "ofrenda-track").maybeSingle();
  const { data: userData } = await supabase.auth.getUser();
  const levels = OFRENDA_LEVELS;
  let clearedChallengeIds = [];
  if (userData?.user) {
    const { data } = await supabase.from("submissions").select("challenge_id,total_score").eq("user_id", userData.user.id).in("challenge_id", levels.map((item) => ofrendaChallengeUuid(item.id)));
    clearedChallengeIds = [...new Set((data || []).filter((item) => Number(item.total_score) >= (levels.find((level) => ofrendaChallengeUuid(level.id) === item.challenge_id)?.pass_score || PASS_SCORE)).map((item) => levels.find((level) => ofrendaChallengeUuid(level.id) === item.challenge_id)?.id || item.challenge_id))];
  }
  const challenges = levels.map((level) => ({ ...level, zone_id: "ofrenda-track" }));
  return <ZoneDetailView zone={zone || OFRENDA_ZONE} challenges={challenges} isBuilderTrack clearedChallengeIds={clearedChallengeIds} />;
}
