import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TournamentDetailView from "@/components/TournamentDetailView";

export default async function TournamentDetailPage({ params }) {
  const supabase = createClient();

  const { data: tournament } = await supabase
    .from("tournaments")
    .select("*, challenges(id, title, zone_id, difficulty)")
    .eq("id", params.id)
    .single();
  if (!tournament) notFound();

  const { data: participants } = await supabase
    .from("tournament_participants")
    .select("user_id, profiles(username)")
    .eq("tournament_id", params.id);

  const { data: leaderboard } = await supabase
    .from("tournament_leaderboard")
    .select("*")
    .eq("tournament_id", params.id)
    .order("best_score", { ascending: false });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isHost = user?.id === tournament.host_id;
  const hasJoined = (participants || []).some((p) => p.user_id === user?.id);

  return (
    <TournamentDetailView
      tournament={tournament}
      participants={participants || []}
      leaderboard={leaderboard || []}
      isHost={isHost}
      hasJoined={hasJoined}
      signedIn={!!user}
    />
  );
}
