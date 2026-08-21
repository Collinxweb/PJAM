# PJAM

Real prompt-engineering challenges, scored on accuracy, efficiency, and style — with tournaments. Built with Next.js (App Router) + Supabase.

## What's real here
- Home, Explore, Zone, and Agent pages read real rows from `zones`, `challenges`, and `ai_agents`.
- Submitting a prompt on a challenge actually calls the chosen AI provider's real API, judges the output, and writes a real score — see `app/api/submit/route.js`.
- Coins, XP, and reputation update for real after a scored submission (reputation via a DB trigger, coins/XP via the submit route).
- Tournaments (create, join, leaderboard, host-ends-and-pays-winner) are fully wired, including an X invite-tweet link.
- Onboarding calls real Supabase auth (`signInWithOAuth` for X, `signInWithOtp` for email).
- Theme switcher is a real, permanent setting (`/settings`), not a dev-only preview.

## 1. Database setup
Run these in Supabase Dashboard → SQL Editor, **in order**:
1. `supabase-schema.sql` (if not already run)
2. `supabase-schema-v2.sql` — adds coins/xp/selected_agent_id to profiles, and the full tournaments schema

## 2. Environment variables
Set these in Vercel → Project → Settings → Environment Variables (Production + Preview):

**Required (already set up):**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Required for the game to actually score submissions — add whichever AI providers you want playable:**
- `ANTHROPIC_API_KEY` — powers Claude as an opponent
- `OPENAI_API_KEY` — powers ChatGPT as an opponent, and is also used as a judging fallback (see below).
- `GOOGLE_API_KEY` — powers Gemini as an opponent, and is tried **first** as the neutral judge for every submission (accuracy + style), since Google AI Studio offers a genuinely free tier — no billing required to get started.

**Judging order:** Gemini → OpenAI → rough word-overlap heuristic. The app tries each in turn and falls back gracefully, so it keeps working even with zero paid keys configured — just less precisely without at least one real judge.
- `XAI_API_KEY` — powers Grok as an opponent
- `GOOGLE_API_KEY` — powers Gemini as an opponent

If a key is missing, that specific AI opponent will show a clear error when someone tries to prompt it, rather than crashing the whole app.

**Optional overrides** (defaults are set in code, but model names change over time — check each provider's current docs before relying on this):
- `ANTHROPIC_MODEL` (default: `claude-sonnet-4-6`)
- `OPENAI_MODEL` (default: `gpt-4o-mini`)
- `OPENAI_JUDGE_MODEL` (default: `gpt-4o-mini`)
- `XAI_MODEL` (default: `grok-2-latest`)
- `GOOGLE_MODEL` (default: `gemini-2.0-flash`)

After adding/changing env vars, **redeploy** — Vercel doesn't apply them to an already-built deployment.

## 3. Get this running locally (optional — only needed if you want to test before deploying)
1. `npm install`
2. `cp .env.local.example .env.local` and fill in the vars above
3. `npm run dev`

If `npm install` keeps failing on a phone (common on Termux due to memory/network limits), skip local testing entirely — push straight to GitHub and let Vercel build it. See "What's next" below for a leaner path.

## 4. Deploy
1. vercel.com → sign in → Add New Project → pick the `pjam` repo
2. Add the env vars above
3. Deploy
4. In Supabase → Authentication → URL Configuration, set Site URL to your Vercel URL, add `<your-url>/auth/callback` to Redirect URLs
5. If using X OAuth, update its callback URL the same way

## 5. What's still missing / worth knowing
- **Real challenge content** — `challenges` needs actual prompt puzzles written per zone (a handful per zone is enough for a contest demo). Without rows there, zones will show "no challenges published yet."
- **Trademarked AI logos** — agent badges use stylized monograms in each brand's approximate color, not the actual logo artwork. Official logos usually require checking each company's brand-usage guidelines before shipping publicly.
- **Tournament capacity** is checked in the API route, not a hard DB constraint — under simultaneous joins on the exact same tournament, capacity could theoretically be exceeded by a seat or two. Fine for a contest demo; worth hardening later with a DB-level check.
- **Judge quality** depends on `OPENAI_API_KEY` being set. Without it, scoring is a rough approximation, not a real AI judgment.

## Project structure
```
app/                     Next.js routes — Home, Explore, Zone, Challenge submission, Agent profile,
                          Tournaments (list + detail), Rules, Get Started, Settings, Onboarding, Auth callback
app/api/                 submit (real scoring), select-agent, tournaments/create|join|finish
components/              Shared UI + client-side page views
lib/supabase/            Browser, server, and middleware Supabase clients
lib/theme.js             Theme palette, rank tiers, and the coin/XP/level formulas — single source of truth
supabase-schema.sql      Base schema (profiles, zones, challenges, submissions, ai_agents, unlocks)
supabase-schema-v2.sql   Coins/XP/selected agent + full tournaments schema
```

## Migration v4 (profile fields + custom tournament challenges)
Run `supabase-schema-v4.sql` after v2 and v3. Adds:
- `display_name` and `bio` to profiles (shown on the new `/profile` page)
- Custom tournament challenges: a hidden `custom` zone, `is_custom`/`created_by` on challenges, and the RLS policy that lets a host insert their own challenge
- A tie-break-aware tournament leaderboard (ties go to whoever submitted first)

## What changed in this round
- **Profile page** (`/profile`) — real editable display name, unique username, bio, and avatar (as an image URL — no upload widget yet, that'd need a Supabase Storage bucket).
- **Achievements** replaces Backpack — real badges computed from actual submissions/tournament wins/reputation, not placeholder unlocks.
- **Difficulty picker** (Easy/Medium/Hard) inside each zone, before the challenge list.
- **Real win/fail distinction** — 🎉🏆 on clear (70+), 😞💔 with a Retry button on a miss (zone practice only — tournament entries are one-shot, no retry).
- **Level system finalized**: capped at 50, level-up is detected and shown in the win screen.
- **Tournaments**: one submission per player enforced server-side, explicit rules shown on the tournament page, custom challenge creation, tie-break by earliest submission, and a "Share your win" button (X + native share sheet) for the winner once the tournament is closed.
- **Bottom nav** is now 5 tabs: Home, Explore, Tournaments, Achievements, Rank.
- **Get Started** page significantly expanded for genuine first-timers.
