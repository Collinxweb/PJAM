import { createClient } from "@/lib/supabase/server";
import RankView from "@/components/RankView";

export default async function RankPage() {
  const supabase = createClient();

  const { data: leaderboard } = await supabase
    .from("leaderboard")
    .select("*")
    .order("reputation", { ascending: false })
    .limit(20);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    profile = data;
  }

  return <RankView leaderboard={leaderboard || []} profile={profile} />;
}
