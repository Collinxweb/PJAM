import { createClient } from "@/lib/supabase/server";
import TournamentsListView from "@/components/TournamentsListView";

export default async function TournamentsPage() {
  const supabase = createClient();

  const { data: tournaments } = await supabase
    .from("tournaments")
    .select("*, challenges(title, zone_id), tournament_participants(user_id)")
    .order("created_at", { ascending: false })
    .limit(20);

  const { data: challenges } = await supabase
    .from("challenges")
    .select("id, title, zone_id")
    .eq("active", true)
    .limit(30);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <TournamentsListView tournaments={tournaments || []} challenges={challenges || []} signedIn={!!user} />;
}
