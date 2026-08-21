import { createClient } from "@/lib/supabase/server";
import AchievementsView from "@/components/AchievementsView";

export default async function AchievementsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <AchievementsView signedIn={false} stats={null} />;
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  const { data: submissions } = await supabase
    .from("submissions")
    .select("total_score, ai_agent_id")
    .eq("user_id", user.id);

  const clears = (submissions || []).filter((s) => Number(s.total_score) >= 70).length;
  const uniqueAgentsBeaten = new Set(
    (submissions || []).filter((s) => Number(s.total_score) >= 70).map((s) => s.ai_agent_id)
  ).size;

  const { count: tournamentWins } = await supabase
    .from("tournaments")
    .select("*", { count: "exact", head: true })
    .eq("winner_id", user.id);

  const stats = {
    totalAttempts: (submissions || []).length,
    clears,
    uniqueAgentsBeaten,
    tournamentWins: tournamentWins || 0,
    reputation: profile?.reputation || 0,
    coins: profile?.coins || 0,
  };

  return <AchievementsView signedIn={true} stats={stats} />;
}
