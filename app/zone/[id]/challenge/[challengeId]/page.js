import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ChallengeSubmitView from "@/components/ChallengeSubmitView";
import { PASS_SCORE } from "@/lib/theme";

// Kept in sync with app/zone/[id]/page.js — any zone using level_number
// gets sequential locking + "next level" navigation.
const TRACK_ZONE_IDS = ["builder-track", "integrations-track", "ai-frontiers"];

export default async function ChallengePage({ params }) {
  const supabase = createClient();

  const { data: challenge } = await supabase
    .from("challenges")
    .select("*, zones(name, emoji)")
    .eq("id", params.challengeId)
    .eq("zone_id", params.id)
    .single();
  if (!challenge) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/onboarding");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const { data: agents } = await supabase.from("ai_agents").select("*").eq("active", true);

  const isTrack = TRACK_ZONE_IDS.includes(params.id);

  // So the win screen can send the player to the next thing to do,
  // instead of leaving them stuck on the challenge they just cleared.
  let zoneQuery = supabase
    .from("challenges")
    .select("id, title, difficulty, level_number")
    .eq("zone_id", params.id)
    .eq("active", true);
  zoneQuery = isTrack
    ? zoneQuery.order("level_number", { ascending: true, nullsFirst: false })
    : zoneQuery.order("difficulty");
  const { data: zoneChallenges } = await zoneQuery;

  const { data: pastSubmissions } = await supabase
    .from("submissions")
    .select("challenge_id, total_score")
    .eq("user_id", user.id)
    .in("challenge_id", (zoneChallenges || []).map((c) => c.id));

  const clearedChallengeIds = [
    ...new Set(
      (pastSubmissions || [])
        .filter((s) => Number(s.total_score) >= PASS_SCORE)
        .map((s) => s.challenge_id)
    ),
  ];

  // Server-side lock enforcement — a player can't skip ahead in a track
  // just by guessing/typing the URL of a later level.
  if (isTrack && challenge.level_number > 1) {
    const prevLevel = (zoneChallenges || []).find((c) => c.level_number === challenge.level_number - 1);
    if (prevLevel && !clearedChallengeIds.includes(prevLevel.id)) {
      redirect(`/zone/${params.id}`);
    }
  }

  return (
    <Suspense fallback={null}>
      <ChallengeSubmitView
        challenge={challenge}
        agents={agents || []}
        defaultAgentId={profile?.selected_agent_id}
        zoneChallenges={zoneChallenges || []}
        clearedChallengeIds={clearedChallengeIds}
      />
    </Suspense>
  );
}