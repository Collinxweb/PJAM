import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DailyRushView from "@/components/DailyRushView";
import { todayRushDate, dayIndexForDate } from "@/lib/dailyRush";

export default async function DailyRushPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/onboarding");

  const rushDate = todayRushDate();
  const dayIndex = dayIndexForDate(rushDate);

  const { data: challenge } = await supabase
    .from("daily_rush_challenges")
    .select("*")
    .eq("day_index", dayIndex)
    .single();

  const { data: existingEntry } = await supabase
    .from("daily_rush_entries")
    .select("*")
    .eq("user_id", user.id)
    .eq("rush_date", rushDate)
    .maybeSingle();

  const { data: agents } = await supabase.from("ai_agents").select("*").eq("active", true);
  const { data: profile } = await supabase.from("profiles").select("selected_agent_id").eq("id", user.id).single();

  const { data: allEntries } = await supabase.rpc("get_daily_rush_leaderboard", { p_date: rushDate });
  const topSolvers = (allEntries || [])
    .filter((r) => r.solved && r.solve_rank != null)
    .sort((a, b) => a.solve_rank - b.solve_rank)
    .slice(0, 10);

  return (
    <DailyRushView
      challenge={challenge}
      existingEntry={existingEntry}
      agents={agents || []}
      defaultAgentId={profile?.selected_agent_id}
      topSolvers={topSolvers || []}
    />
  );
}
