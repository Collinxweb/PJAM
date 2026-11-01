import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const { tournamentId } = await request.json();
  if (!tournamentId) return NextResponse.json({ error: "Missing tournamentId." }, { status: 400 });

  const { data: tournament } = await supabase.from("tournaments").select("*").eq("id", tournamentId).single();
  if (!tournament) return NextResponse.json({ error: "Tournament not found." }, { status: 404 });
  if (tournament.host_id !== user.id) {
    return NextResponse.json({ error: "Only the host can delete this tournament." }, { status: 403 });
  }

  const { count } = await supabase
    .from("submissions")
    .select("*", { count: "exact", head: true })
    .eq("tournament_id", tournamentId);

  if ((count || 0) > 0) {
    return NextResponse.json(
      { error: "Can't delete a tournament that already has submissions — end it instead so scores count." },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("tournaments").delete().eq("id", tournamentId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Clean up the custom challenge this tournament created, if any, as long
  // as nothing else references it.
  if (tournament.challenge_id) {
    const { data: challenge } = await supabase
      .from("challenges")
      .select("is_custom, created_by")
      .eq("id", tournament.challenge_id)
      .single();
    if (challenge?.is_custom && challenge.created_by === user.id) {
      const { count: otherUses } = await supabase
        .from("tournaments")
        .select("*", { count: "exact", head: true })
        .eq("challenge_id", tournament.challenge_id);
      if (!otherUses) {
        await supabase.from("challenges").delete().eq("id", tournament.challenge_id);
      }
    }
  }

  return NextResponse.json({ ok: true });
}
