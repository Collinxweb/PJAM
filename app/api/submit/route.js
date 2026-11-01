import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { createClient } from "@/lib/supabase/server";
import { ofrendaChallengeUuid } from "@/lib/dbIds";
import { getBuilderLevel } from "@/lib/progress";
import { fetchWithTimeout, PROVIDER_CALLERS } from "@/lib/aiProviders";
import {
  coinsForSubmission,
  xpForSubmission,
  PASS_SCORE,
  isAgentPlayable,
  difficultyTierFor,
  JUDGE_BEGINNER_CONTEXT,
  JUDGE_STRICTNESS_INSTRUCTIONS,
  HEURISTIC_LENIENCY_MULTIPLIER,
} from "@/lib/theme";

// ---- Judge --------------------------------------------------------------
// Tries Gemini first (it has a genuinely free tier), then OpenAI if that
// key happens to be set, then falls back to a simple word-overlap
// heuristic if neither is available — so the app keeps working even
// with zero paid judge access.

async function judgeWithGemini(output, target, tier) {
  const key = process.env.GOOGLE_API_KEY;
  if (!key) return null;
  const model = process.env.GOOGLE_JUDGE_MODEL || process.env.GOOGLE_MODEL || "gemini-2.0-flash";
  const judgePrompt = `You are grading how well an AI's output matches a target answer.
${JUDGE_BEGINNER_CONTEXT}
${JUDGE_STRICTNESS_INSTRUCTIONS[tier]}

Target answer:
"""${target}"""

AI's actual output:
"""${output}"""

Score the AI's output against the target on two dimensions:
- accuracy: 0-60, how closely the meaning and content match the target
- style: 0-15, quality of writing/creativity independent of correctness

Reply with ONLY strict JSON, no other text: {"accuracy": <number>, "style": <number>}`;

  try {
    const res = await fetchWithTimeout(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: judgePrompt }] }],
          // The judge only ever needs to output ~15 tokens of JSON — a tiny
          // cap here keeps this call fast regardless of how long the
          // target/output text being graded is.
          generationConfig: { temperature: 0, maxOutputTokens: 100 },
        }),
      },
      12000
    );
    if (!res.ok) return null;
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("\n") || "";
    const cleaned = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return {
      accuracy: Math.max(0, Math.min(60, Number(parsed.accuracy) || 0)),
      style: Math.max(0, Math.min(15, Number(parsed.style) || 0)),
    };
  } catch {
    return null;
  }
}

async function judgeWithOpenAI(output, target, tier) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  const model = process.env.OPENAI_JUDGE_MODEL || "gpt-4o-mini";
  const judgePrompt = `You are grading how well an AI's output matches a target answer.
${JUDGE_BEGINNER_CONTEXT}
${JUDGE_STRICTNESS_INSTRUCTIONS[tier]}

Target answer:
"""${target}"""

AI's actual output:
"""${output}"""

Score the AI's output against the target on two dimensions:
- accuracy: 0-60, how closely the meaning and content match the target
- style: 0-15, quality of writing/creativity independent of correctness

Reply with ONLY strict JSON, no other text: {"accuracy": <number>, "style": <number>}`;

  try {
    const res = await fetchWithTimeout(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: judgePrompt }],
          temperature: 0,
          max_tokens: 100,
        }),
      },
      12000
    );
    if (!res.ok) return null;
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || "";
    const cleaned = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return {
      accuracy: Math.max(0, Math.min(60, Number(parsed.accuracy) || 0)),
      style: Math.max(0, Math.min(15, Number(parsed.style) || 0)),
    };
  } catch {
    return null;
  }
}

function heuristicJudge(output, target, tier) {
  const words = (s) => new Set(s.toLowerCase().match(/\w+/g) || []);
  const a = words(output);
  const b = words(target);
  const overlap = [...a].filter((w) => b.has(w)).length;
  const union = new Set([...a, ...b]).size || 1;
  const similarity = overlap / union;
  const leniency = HEURISTIC_LENIENCY_MULTIPLIER[tier] ?? 1.0;
  const accuracy = Math.max(0, Math.min(60, Math.round(similarity * 60 * leniency)));
  return { accuracy, style: 8 };
}

function scoreEfficiency(promptText, parTokens) {
  const approxTokens = (promptText.match(/\S+/g) || []).length;
  const ratio = approxTokens / Math.max(1, parTokens);
  if (ratio <= 1) return 25;
  const penalty = Math.min(25, Math.round((ratio - 1) * 25));
  return Math.max(0, 25 - penalty);
}

// ---- Route ----------------------------------------------------------

async function submitChallenge(request, traceSpan) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in to submit." }, { status: 401 });
  }

  const { challengeId, agentId, promptText, tournamentId } = await request.json();
  traceSpan?.setAttribute("challenge.id", String(challengeId || "unknown"));
  if (!challengeId || !agentId || !promptText?.trim()) {
    return NextResponse.json({ error: "Missing challengeId, agentId, or promptText." }, { status: 400 });
  }

  const challengeLookupId =
    typeof challengeId === "string" && challengeId.startsWith("ofrenda-")
      ? ofrendaChallengeUuid(challengeId)
      : challengeId;
  const { data: challenge, error: challengeErr } = await supabase
    .from("challenges")
    .select("*")
    .eq("id", challengeLookupId)
    .single();
  if (challengeErr || !challenge) {
    return NextResponse.json({ error: "Challenge not found." }, { status: 404 });
  }

  // Tournaments are one-shot for fairness — no unlimited retries to farm
  // the leaderboard. Regular zone practice (no tournamentId) can still be
  // retried freely.
  if (tournamentId) {
    const { data: existing } = await supabase
      .from("submissions")
      .select("id")
      .eq("user_id", user.id)
      .eq("tournament_id", tournamentId)
      .maybeSingle();
    if (existing) {
      return NextResponse.json(
        { error: "You've already submitted your entry for this tournament. One attempt per player." },
        { status: 400 }
      );
    }
  }

  const caller = PROVIDER_CALLERS[agentId];
  if (!caller) {
    return NextResponse.json({ error: `Unknown agent: ${agentId}` }, { status: 400 });
  }
  if (!isAgentPlayable(agentId)) {
    return NextResponse.json({ error: "This AI opponent is coming soon — try Gemini for now." }, { status: 400 });
  }

  traceSpan?.setAttribute("user.level", Number(challenge.level_number || 0));
  // Cap how much the agent generates based on the challenge's expected
  // answer length — these are short, focused challenges, so there's no
  // reason to let a response run long and slow.
  const maxOutputTokens = Math.min(900, Math.max(200, (challenge.par_tokens || 40) * 8));

  let outputText;
  const promptTokenEstimate = (promptText.match(/\S+/g) || []).length;
  await Sentry.startSpan({ name: "prompt", op: "agent.prompt", attributes: { "challenge.id": String(challengeId), "prompt.token_estimate": promptTokenEstimate } }, async () => ({ tokenEstimate: promptTokenEstimate }));
  const aiStartedAt = Date.now();
  try {
    outputText = await Sentry.startSpan({ name: "AI call", op: "agent.call", attributes: { "agent.id": agentId, "challenge.id": String(challengeId) } }, () => caller(promptText, maxOutputTokens));
    traceSpan?.setAttribute("ai.latency_ms", Date.now() - aiStartedAt);
    traceSpan?.setAttribute("ai.retry_count", 0);
    traceSpan?.setAttribute("ai.output_token_estimate", (outputText.match(/\S+/g) || []).length);
  } catch (err) {
    return NextResponse.json(
      { error: `Could not reach ${agentId}: ${err.message}. Check that its API key is set in Vercel env vars.` },
      { status: 502 }
    );
  }

  const tier = difficultyTierFor(challenge.difficulty);
  const judged = await Sentry.startSpan({ name: "grading", op: "agent.grading", attributes: { "challenge.id": String(challengeId) } }, async () => {
    let result = await judgeWithGemini(outputText, challenge.target_output, tier);
    if (!result) result = await judgeWithOpenAI(outputText, challenge.target_output, tier);
    if (!result) result = heuristicJudge(outputText, challenge.target_output, tier);
    return result;
  });

  const efficiency = scoreEfficiency(promptText, challenge.par_tokens);
  const totalScore = judged.accuracy + efficiency + judged.style;
  const won = totalScore >= PASS_SCORE;
  traceSpan?.setAttribute("score.total", totalScore);
  traceSpan?.setAttribute("score.won", won);

  // Level is literally "highest Builder Track level cleared" — get that
  // BEFORE inserting this submission, so we can tell whether this attempt
  // actually represents new forward progress.
  const levelBefore = await getBuilderLevel(supabase, user.id);
  traceSpan?.setAttribute("user.level", Number(levelBefore || 0));

  const { error: insertErr } = await supabase.from("submissions").insert({
    user_id: user.id,
    challenge_id: challengeLookupId,
    ai_agent_id: agentId,
    prompt_text: promptText,
    output_text: outputText,
    accuracy_score: judged.accuracy,
    efficiency_score: efficiency,
    style_score: judged.style,
    tournament_id: tournamentId || null,
  });
  if (insertErr) {
    return NextResponse.json({ error: insertErr.message }, { status: 500 });
  }

  const coinsEarned = coinsForSubmission(challenge.difficulty, totalScore);
  const xpEarned = xpForSubmission(challenge.difficulty, totalScore);

  const { data: profile } = await supabase.from("profiles").select("coins, xp").eq("id", user.id).single();
  await supabase
    .from("profiles")
    .update({
      coins: (profile?.coins || 0) + coinsEarned,
      xp: (profile?.xp || 0) + xpEarned,
    })
    .eq("id", user.id);

  const isNewBuilderLevel = won && challenge.zone_id === "builder-track" && challenge.level_number > levelBefore;
  const newLevel = isNewBuilderLevel ? challenge.level_number : levelBefore;

  return NextResponse.json({
    outputText,
    accuracy: judged.accuracy,
    efficiency,
    style: judged.style,
    totalScore,
    coinsEarned,
    xpEarned,
    won,
    passScore: PASS_SCORE,
    leveledUp: isNewBuilderLevel,
    newLevel,
  });
}

export async function POST(request) {
  const startedAt = Date.now();
  return Sentry.startSpan({ name: "agent.run", op: "agent.run" }, async (span) => {
    try { return await submitChallenge(request, span); }
    finally { span?.setAttribute("agent.run.latency_ms", Date.now() - startedAt); }
  });
}
