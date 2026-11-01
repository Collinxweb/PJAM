import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PROVIDER_CALLERS, fetchWithTimeout } from "@/lib/aiProviders";
import { isAgentPlayable, JUDGE_BEGINNER_CONTEXT } from "@/lib/theme";
import {
  todayRushDate,
  dayIndexForDate,
  DAILY_RUSH_SOLVE_THRESHOLD,
  DAILY_RUSH_TOP_N,
  coinsForDailyRush,
} from "@/lib/dailyRush";

// Creativity-only judge — there's no fixed target answer for Daily Rush,
// so this grades originality, imagination, and how well the output
// fulfills the brief, not correctness against a reference.
async function judgeCreativity(brief, output) {
  const key = process.env.GOOGLE_API_KEY;
  const judgePrompt = `You are judging a creative AI-generated response for a daily creativity challenge.
${JUDGE_BEGINNER_CONTEXT}
Brief given to the player: """${brief}"""
The AI's actual output: """${output}"""

Score 0-100 on originality, imagination, and how well the output fulfills the brief. Be generous — this is a beginner-friendly game, not a professional creativity contest. A safe or simple answer that still genuinely attempts the brief should score reasonably, not near-zero. Reply with ONLY a JSON object, no other text: {"score": <number>}`;

  if (key) {
    try {
      const model = process.env.GOOGLE_JUDGE_MODEL || process.env.GOOGLE_MODEL || "gemini-2.0-flash";
      const res = await fetchWithTimeout(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: judgePrompt }] }],
            generationConfig: { temperature: 0.3, maxOutputTokens: 80 },
          }),
        },
        12000
      );
      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("\n") || "";
        const cleaned = text.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        const score = Number(parsed.score);
        if (!Number.isNaN(score)) return Math.max(0, Math.min(100, Math.round(score)));
      }
    } catch {
      // fall through to heuristic below
    }
  }

  // Heuristic fallback if no judge key is available: a rough proxy based
  // on response length and word variety, since we can't truly assess
  // creativity without an AI judge. Documented limitation, same as the
  // regular challenge heuristic fallback.
  const words = output.toLowerCase().match(/\w+/g) || [];
  const unique = new Set(words).size;
  const lengthScore = Math.min(50, words.length);
  const varietyScore = Math.min(30, unique);
  return Math.min(100, lengthScore + varietyScore + 10);
}

export async function POST(request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in to play Daily Rush." }, { status: 401 });

  const { agentId, promptText } = await request.json();
  if (!agentId || !promptText?.trim()) {
    return NextResponse.json({ error: "Missing agentId or promptText." }, { status: 400 });
  }
  if (!isAgentPlayable(agentId)) {
    return NextResponse.json({ error: "This AI opponent is coming soon — try Gemini for now." }, { status: 400 });
  }

  const rushDate = todayRushDate();

  // One shot per day — check first so we never waste an AI call on a
  // second attempt that would be rejected anyway.
  const { data: existing } = await supabase
    .from("daily_rush_entries")
    .select("*")
    .eq("user_id", user.id)
    .eq("rush_date", rushDate)
    .maybeSingle();
  if (existing) {
    return NextResponse.json({ error: "You've already taken today's Daily Rush — come back tomorrow.", alreadyPlayed: true, existing }, { status: 400 });
  }

  const dayIndex = dayIndexForDate(rushDate);
  const { data: challenge } = await supabase
    .from("daily_rush_challenges")
    .select("*")
    .eq("day_index", dayIndex)
    .single();
  if (!challenge) {
    return NextResponse.json({ error: "Today's Daily Rush challenge isn't set up yet." }, { status: 500 });
  }

  const caller = PROVIDER_CALLERS[agentId];
  let outputText;
  try {
    outputText = await caller(promptText, 400);
  } catch (err) {
    return NextResponse.json(
      { error: `Could not reach ${agentId}: ${err.message}.` },
      { status: 502 }
    );
  }

  const creativityScore = await judgeCreativity(challenge.brief, outputText);
  const solved = creativityScore >= DAILY_RUSH_SOLVE_THRESHOLD;

  // How many players have already solved today, before this entry —
  // determines whether this player lands in the first-10 bonus tier.
  // Same known limitation as tournament capacity: not perfectly race-safe
  // under simultaneous submissions, acceptable at this scale.
  let solveRank = null;
  if (solved) {
    const { count } = await supabase
      .from("daily_rush_entries")
      .select("*", { count: "exact", head: true })
      .eq("rush_date", rushDate)
      .eq("solved", true);
    const rank = (count || 0) + 1;
    if (rank <= DAILY_RUSH_TOP_N) solveRank = rank;
  }

  const coinsEarned = coinsForDailyRush(solved, solveRank, creativityScore);

  const { error: insertErr } = await supabase.from("daily_rush_entries").insert({
    challenge_id: challenge.id,
    user_id: user.id,
    rush_date: rushDate,
    ai_agent_id: agentId,
    prompt_text: promptText,
    output_text: outputText,
    creativity_score: creativityScore,
    solved,
    solve_rank: solveRank,
    coins_earned: coinsEarned,
  });
  if (insertErr) {
    return NextResponse.json({ error: insertErr.message }, { status: 500 });
  }

  if (coinsEarned > 0) {
    const { data: profile } = await supabase.from("profiles").select("coins").eq("id", user.id).single();
    await supabase
      .from("profiles")
      .update({ coins: (profile?.coins || 0) + coinsEarned })
      .eq("id", user.id);
  }

  return NextResponse.json({
    outputText,
    creativityScore,
    solved,
    solveRank,
    coinsEarned,
    brief: challenge.brief,
  });
}
