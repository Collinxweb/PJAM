import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const TOURNAMENT_WINNER_BONUS_COINS = 100;

export async function POST(request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const { tournamentId } = await request.json();
  const { data: tournament } = await supabase.from("tournaments").select("*").eq("id", tournamentId).single();
  if (!tournament) return NextResponse.json({ error: "Tournament not found." }, { status: 404 });
  if (tournament.host_id !== user.id) return NextResponse.json({ error: "Only the host can end this tournament." }, { status: 403 });
  if (tournament.status === "completed") return NextResponse.json({ error: "Already completed." }, { status: 400 });

  const { data: leaderboard } = await supabase
    .from("tournament_leaderboard")
    .select("*")
    .eq("tournament_id", tournamentId)
    .order("best_score", { ascending: false })
    .limit(1);

  const winnerId = leaderboard?.[0]?.user_id || null;

  await supabase.from("tournaments").update({ status: "completed", winner_id: winnerId }).eq("id", tournamentId);

  if (winnerId) {
    const { data: winnerProfile } = await supabase.from("profiles").select("coins").eq("id", winnerId).single();
    await supabase
      .from("profiles")
      .update({ coins: (winnerProfile?.coins || 0) + TOURNAMENT_WINNER_BONUS_COINS })
      .eq("id", winnerId);
  }

  return NextResponse.json({ ok: true, winnerId });
}
