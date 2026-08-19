import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in to join." }, { status: 401 });

  const { tournamentId } = await request.json();
  if (!tournamentId) return NextResponse.json({ error: "Missing tournamentId." }, { status: 400 });

  const { data: tournament } = await supabase.from("tournaments").select("*").eq("id", tournamentId).single();
  if (!tournament) return NextResponse.json({ error: "Tournament not found." }, { status: 404 });
  if (tournament.status !== "open") return NextResponse.json({ error: "This tournament is no longer open." }, { status: 400 });

  const { count } = await supabase
    .from("tournament_participants")
    .select("*", { count: "exact", head: true })
    .eq("tournament_id", tournamentId);

  if ((count || 0) >= tournament.capacity) {
    return NextResponse.json({ error: "Tournament is full." }, { status: 400 });
  }

  const { error } = await supabase.from("tournament_participants").insert({ tournament_id: tournamentId, user_id: user.id });
  if (error) {
    if (error.code === "23505") return NextResponse.json({ ok: true, alreadyJoined: true });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // If this join filled the tournament, move it to in_progress.
  if ((count || 0) + 1 >= tournament.capacity) {
    await supabase.from("tournaments").update({ status: "in_progress" }).eq("id", tournamentId);
  }

  return NextResponse.json({ ok: true });
}
