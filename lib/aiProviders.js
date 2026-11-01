// Shared across app/api/submit/route.js and app/api/daily-rush/submit/route.js
// so both real gameplay paths call providers the exact same way.
// Model names change over time — verify current IDs in each provider's docs
// before relying on this in production. Defaults below are read from env
// vars so they can be updated without touching code.

// Fetch with a hard timeout so a slow/stuck provider request fails fast
// instead of leaving the player staring at "Scoring..." indefinitely.
export async function fetchWithTimeout(url, options, timeoutMs = 20000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function callClaude(prompt, maxOutputTokens = 500) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("Missing ANTHROPIC_API_KEY");
  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";
  const res = await fetchWithTimeout("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: maxOutputTokens,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Claude API error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return (data.content || []).map((b) => b.text || "").join("\n");
}

export async function callChatGPT(prompt, maxOutputTokens = 500) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("Missing OPENAI_API_KEY");
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const res = await fetchWithTimeout("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: maxOutputTokens,
    }),
  });
  if (!res.ok) throw new Error(`OpenAI API error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

export async function callGrok(prompt, maxOutputTokens = 500) {
  const key = process.env.XAI_API_KEY;
  if (!key) throw new Error("Missing XAI_API_KEY");
  const model = process.env.XAI_MODEL || "grok-2-latest";
  const res = await fetchWithTimeout("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: maxOutputTokens,
    }),
  });
  if (!res.ok) throw new Error(`xAI API error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

export async function callGemini(prompt, maxOutputTokens = 500) {
  const key = process.env.GOOGLE_API_KEY;
  if (!key) throw new Error("Missing GOOGLE_API_KEY");
  const model = process.env.GOOGLE_MODEL || "gemini-2.5-flash";
  const res = await fetchWithTimeout(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        // Capping output length is the single biggest lever on response
        // time — these are short answers, not essays, so there's no
        // reason to let generation run unbounded.
        generationConfig: { maxOutputTokens },
      }),
    }
  );
  if (!res.ok) throw new Error(`Gemini API error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("\n") || "";
}

export const PROVIDER_CALLERS = { claude: callClaude, chatgpt: callChatGPT, grok: callGrok, gemini: callGemini };
