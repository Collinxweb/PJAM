import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in to host a tournament." }, { status: 401 });

  const { challengeId, capacity } = await request.json();
  if (!challengeId || !capacity || capacity < 4 || capacity > 8) {
    return NextResponse.json({ error: "Pick a challenge and a capacity between 4 and 8." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("tournaments")
    .insert({ host_id: user.id, challenge_id: challengeId, capacity })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Host is automatically the first participant.
  await supabase.from("tournament_participants").insert({ tournament_id: data.id, user_id: user.id });

  return NextResponse.json({ tournamentId: data.id });
}
