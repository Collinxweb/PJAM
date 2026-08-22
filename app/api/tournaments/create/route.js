import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { DIFFICULTY_BANDS } from "@/lib/theme";

export async function POST(request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in to host a tournament." }, { status: 401 });

  const { challengeId, capacity, customChallenge } = await request.json();
  if (!capacity || capacity < 2 || capacity > 8) {
    return NextResponse.json({ error: "Pick a capacity between 2 and 8 (2 = 1v1)." }, { status: 400 });
  }
  if (!challengeId && !customChallenge) {
    return NextResponse.json({ error: "Pick a challenge or write a custom one." }, { status: 400 });
  }

  let finalChallengeId = challengeId;

  if (customChallenge) {
    const { title, brief, targetOutput, difficultyBand } = customChallenge;
    if (!title?.trim() || !brief?.trim() || !targetOutput?.trim()) {
      return NextResponse.json({ error: "Custom challenge needs a title, brief, and target answer." }, { status: 400 });
    }
    const band = DIFFICULTY_BANDS[difficultyBand] || DIFFICULTY_BANDS.medium;
    const { data: created, error: createErr } = await supabase
      .from("challenges")
      .insert({
        zone_id: "custom",
        title: title.trim(),
        brief: brief.trim(),
        target_output: targetOutput.trim(),
        par_tokens: 30,
        difficulty: band.difficultyForCustom,
        is_custom: true,
        created_by: user.id,
      })
      .select("id")
      .single();
    if (createErr) return NextResponse.json({ error: createErr.message }, { status: 500 });
    finalChallengeId = created.id;
  }

  const { data, error } = await supabase
    .from("tournaments")
    .insert({ host_id: user.id, challenge_id: finalChallengeId, capacity })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Host is automatically the first participant.
  await supabase.from("tournament_participants").insert({ tournament_id: data.id, user_id: user.id });

  return NextResponse.json({ tournamentId: data.id });
}
