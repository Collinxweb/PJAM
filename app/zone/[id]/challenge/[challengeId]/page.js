import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ChallengeSubmitView from "@/components/ChallengeSubmitView";

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

  return (
    <Suspense fallback={null}>
      <ChallengeSubmitView challenge={challenge} agents={agents || []} defaultAgentId={profile?.selected_agent_id} />
    </Suspense>
  );
}
