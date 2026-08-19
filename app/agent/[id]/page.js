import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AgentDetailView from "@/components/AgentDetailView";

export default async function AgentPage({ params }) {
  const supabase = createClient();

  const { data: agent } = await supabase.from("ai_agents").select("*").eq("id", params.id).single();
  if (!agent) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  let stats = null;
  if (user) {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    profile = data;

    const { data: subs } = await supabase
      .from("submissions")
      .select("total_score")
      .eq("user_id", user.id)
      .eq("ai_agent_id", params.id);

    if (subs && subs.length > 0) {
      const avg = subs.reduce((sum, s) => sum + Number(s.total_score || 0), 0) / subs.length;
      stats = { attempts: subs.length, avgScore: Math.round(avg) };
    }
  }

  return <AgentDetailView agent={agent} profile={profile} stats={stats} />;
}
