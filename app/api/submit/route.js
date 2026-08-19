import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { coinsForSubmission, xpForSubmission } from "@/lib/theme";

// ---- Provider callers -------------------------------------------------
// Model names change over time — verify current IDs in each provider's docs
// before relying on this in production. Defaults below are read from env
// vars so they can be updated without touching code.

async function callClaude(prompt) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("Missing ANTHROPIC_API_KEY");
  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Claude API error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return (data.content || []).map((b) => b.text || "").join("\n");
}

async function callChatGPT(prompt) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("Missing OPENAI_API_KEY");
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`OpenAI API error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

async function callGrok(prompt) {
  const key = process.env.XAI_API_KEY;
  if (!key) throw new Error("Missing XAI_API_KEY");
  const model = process.env.XAI_MODEL || "grok-2-latest";
  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`xAI API error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

async function callGemini(prompt) {
  const key = process.env.GOOGLE_API_KEY;
  if (!key) throw new Error("Missing GOOGLE_API_KEY");
  const model = process.env.GOOGLE_MODEL || "gemini-2.0-flash";
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }
  );
  if (!res.ok) throw new Error(`Gemini API error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("\n") || "";
}

const PROVIDER_CALLERS = { claude: callClaude, chatgpt: callChatGPT, grok: callGrok, gemini: callGemini };

// ---- Judge --------------------------------------------------------------
// Uses OpenAI as a neutral judge (separate from the agent being tested,
// unless the agent itself IS ChatGPT, which is still fine as a judge call).
// Falls back to a simple word-overlap heuristic if OPENAI_API_KEY isn't set,
// so the app keeps working even with a partial provider setup.

async function judgeWithOpenAI(output, target) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  const model = process.env.OPENAI_JUDGE_MODEL || "gpt-4o-mini";
  const judgePrompt = `You are grading how well an AI's output matches a target answer.
Target answer:
"""${target}"""

AI's actual output:
"""${output}"""

Score the AI's output against the target on two dimensions:
- accuracy: 0-60, how closely the meaning and content match the target
- style: 0-15, quality of writing/creativity independent of correctness

Reply with ONLY strict JSON, no other text: {"accuracy": <number>, "style": <number>}`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: judgePrompt }],
      temperature: 0,
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || "";
  try {
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

function heuristicJudge(output, target) {
  const words = (s) => new Set(s.toLowerCase().match(/\w+/g) || []);
  const a = words(output);
  const b = words(target);
  const overlap = [...a].filter((w) => b.has(w)).length;
  const union = new Set([...a, ...b]).size || 1;
  const similarity = overlap / union;
  return { accuracy: Math.round(similarity * 60), style: 8 };
}

function scoreEfficiency(promptText, parTokens) {
  const approxTokens = (promptText.match(/\S+/g) || []).length;
  const ratio = approxTokens / Math.max(1, parTokens);
  if (ratio <= 1) return 25;
  const penalty = Math.min(25, Math.round((ratio - 1) * 25));
  return Math.max(0, 25 - penalty);
}

// ---- Route ----------------------------------------------------------

export async function POST(request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in to submit." }, { status: 401 });
  }

  const { challengeId, agentId, promptText, tournamentId } = await request.json();
  if (!challengeId || !agentId || !promptText?.trim()) {
    return NextResponse.json({ error: "Missing challengeId, agentId, or promptText." }, { status: 400 });
  }

  const { data: challenge, error: challengeErr } = await supabase
    .from("challenges")
    .select("*")
    .eq("id", challengeId)
    .single();
  if (challengeErr || !challenge) {
    return NextResponse.json({ error: "Challenge not found." }, { status: 404 });
  }

  const caller = PROVIDER_CALLERS[agentId];
  if (!caller) {
    return NextResponse.json({ error: `Unknown agent: ${agentId}` }, { status: 400 });
  }

  let outputText;
  try {
    outputText = await caller(promptText);
  } catch (err) {
    return NextResponse.json(
      { error: `Could not reach ${agentId}: ${err.message}. Check that its API key is set in Vercel env vars.` },
      { status: 502 }
    );
  }

  let judged = await judgeWithOpenAI(outputText, challenge.target_output);
  if (!judged) judged = heuristicJudge(outputText, challenge.target_output);

  const efficiency = scoreEfficiency(promptText, challenge.par_tokens);
  const totalScore = judged.accuracy + efficiency + judged.style;

  const { error: insertErr } = await supabase.from("submissions").insert({
    user_id: user.id,
    challenge_id: challengeId,
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
  const xpEarned = xpForSubmission(challenge.difficulty);

  const { data: profile } = await supabase.from("profiles").select("coins, xp").eq("id", user.id).single();
  await supabase
    .from("profiles")
    .update({
      coins: (profile?.coins || 0) + coinsEarned,
      xp: (profile?.xp || 0) + xpEarned,
    })
    .eq("id", user.id);

  return NextResponse.json({
    outputText,
    accuracy: judged.accuracy,
    efficiency,
    style: judged.style,
    totalScore,
    coinsEarned,
    xpEarned,
    won: totalScore >= 70,
  });
}
