import { createClient } from "@/lib/supabase/server";
import ChallengeSubmitView from "@/components/ChallengeSubmitView";
import { notFound, redirect } from "next/navigation";
import { isOfrendaActive, PASS_SCORE } from "@/lib/theme";
import { OFRENDA_LEVELS, getOfrendaLevel } from "@/lib/ofrendaTrack";
import { ofrendaChallengeUuid } from "@/lib/dbIds";
import { Suspense } from "react";

export default async function OfrendaChallengePage({ params }) {
  if (!isOfrendaActive()) notFound();
  const supabase = createClient();
  const fallback = getOfrendaLevel(params.challengeId);
  let { data: challenge } = await supabase.from("challenges").select("*, zones(name,emoji)").eq("id", ofrendaChallengeUuid(params.challengeId)).eq("zone_id", "ofrenda-track").maybeSingle();
  if (!challenge) challenge = fallback ? { ...fallback, id: ofrendaChallengeUuid(fallback.id), zone_id: "ofrenda-track", zones: { name: "Ofrenda Track", emoji: "🕯️" } } : null;
  if (!challenge) notFound();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/onboarding");
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const { data: agents } = await supabase.from("ai_agents").select("*").eq("active", true);
  const levels = OFRENDA_LEVELS;
  const { data: submissions } = await supabase.from("submissions").select("challenge_id,total_score").eq("user_id", user.id).in("challenge_id", levels.map((item) => ofrendaChallengeUuid(item.id)));
  const cleared = [...new Set((submissions || []).filter((item) => Number(item.total_score) >= PASS_SCORE).map((item) => item.challenge_id))];
  if (challenge.level_number > 1 && !cleared.includes(ofrendaChallengeUuid(levels[challenge.level_number - 2]?.id))) redirect("/zone/ofrenda-track");
  return <Suspense fallback={null}><ChallengeSubmitView challenge={challenge} agents={agents || []} defaultAgentId={profile?.selected_agent_id} zoneChallenges={levels} clearedChallengeIds={cleared} /></Suspense>;
}
