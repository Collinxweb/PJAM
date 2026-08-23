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

## Migration v5 (1v1 tournaments + tournament delete)
Run `supabase-schema-v5.sql` after v4. Adds:
- Widens tournament capacity from 4–8 to **2–8**, so a capacity of 2 is a 1v1 duel
- Adds the RLS policy letting a host delete their own tournament
- Hardens the `submissions.tournament_id` foreign key to `ON DELETE SET NULL` as a safety net

## Migration v6 (real avatar uploads)
Run `supabase-schema-v6-avatar-storage.sql` after v5. Creates a public `avatars` storage bucket with per-user upload/update/delete policies (a player can only ever write to their own `<user_id>/avatar.<ext>` path). The Profile page now uploads an actual image file instead of accepting a pasted URL.

## What changed in this round
- **Profile page** (`/profile`) — real editable display name, unique username, bio, and now a **real avatar photo upload** (tap the avatar circle) via Supabase Storage — no more pasting an image URL.
- **Achievements** replaces Backpack — real badges computed from actual submissions/tournament wins/reputation, not placeholder unlocks.
- **Difficulty picker** (Easy/Medium/Hard) inside each zone, before the challenge list — and judging strictness now actually scales with it (lenient on Easy, strict on Hard), both for the AI judge prompt and the offline heuristic fallback.
- **Real win/fail distinction** — 🎉🏆 on clear (70+), 😞💔 with a Retry button on a miss (zone practice only — tournament entries are one-shot, no retry).
- **Level system finalized**: capped at 50, level-up is detected and shown in the win screen.
- **Only Gemini is playable right now** — Claude/ChatGPT/Grok show "Coming soon" everywhere they appear (Home badges, agent profile pages, the challenge submission picker) instead of silently failing, since those providers need paid billing that isn't set up yet.
- **Tournaments**: **1v1 duels now supported** (capacity slider goes down to 2), one submission per player enforced server-side, explicit rules shown on the tournament page, custom challenge creation, tie-break by earliest submission, a "Share your win" button (X + native share sheet) for the winner once closed, and **hosts can now delete their own tournament** (only allowed before anyone has submitted, to protect real entries).
- **Bottom nav** is now 5 tabs: Home, Explore, Tournaments, Achievements, Rank.
- **Report an issue** — added to Settings, linking to X (@0xcollinxweb3) and Telegram (t.me/C0llinXweb3).
- **"Share elsewhere" buttons** (invites and win-flaunting) use the native share sheet or clipboard copy — verified there's no real public share-intent API at prmpted.com to integrate directly, so this is the honest, working fallback until/unless that changes.
- **Get Started** page significantly expanded for genuine first-timers.

## Migration v7 (Builder Track — 50 levels)
Run `supabase-schema-v7-builder-track.sql` after v6. Adds:
- A new `builder-track` zone (sort_order 0, so it's the first thing players see)
- `level_number`, `level_name`, and `skill` columns on `challenges` (nullable — only Builder Track rows use them)
- All 50 real levels, from "First Blueprint" (Level 1, Easy) to "Grandmaster Architect" (Level 50, Hard) — each with a genuine brief and a complete, correct target answer, not placeholder text. Difficulty bands: Levels 1–17 Easy, 18–34 Normal, 35–50 Hard, matching the game's existing difficulty system exactly.

**Fixed in this round: the "stuck on the same challenge after winning" bug.** The win screen's Continue button previously just closed the popup — it never actually took you anywhere or cleared your old prompt. It's now a real navigation: on a zone win it goes to the next uncleared challenge (or back to the zone if none left); on a tournament entry it returns to the tournament page; "Leave it" on a failed attempt now clears the stale prompt too.

**Builder Track is sequential and locked, enforced on the server, not just the UI** — Level N stays locked until Level N-1 is cleared. Typing a later level's URL directly redirects back to the track rather than letting you skip ahead.

## Migration v8 (dim placeholder zones)
Run `supabase-schema-v8-dim-placeholder-zones.sql` after v7. Renames the 6 original zones to match the Builder Track's naming family and marks them `coming_soon` (still visible in Explore/Home, but rendered dimmed and non-clickable in the app):
- Instruction Basics → **Foundations Track**
- Few-Shot Arena → **Pattern Track**
- Constraint Vault → **Precision Track**
- Persona & Style Bay → **Voice Track**
- Chain-of-Thought Hollow → **Logic Track**
- Daily Rush → **Sprint Track**

Builder Track remains the only fully live zone for now, and carries the game on its own until the others get their own real levels.

## What changed in this round
- **Fixed a real design flaw, not just a bug**: "Level" on the Home header and Profile page was previously computed from an abstract XP curve, completely disconnected from "Level 3" shown inside the Builder Track — two different numbers sharing one word. Player Level is now **literally** your highest cleared Builder Track level (see `lib/progress.js`), so clearing Builder Track Level 3 makes your player Level show 3, everywhere, immediately.
- **Retry now actually clears the prompt box** — previously only "Leave it" did; both now give a genuinely fresh attempt.
- **AI judge sped up**: added response-length caps (the judge only ever needs to output ~15 tokens of JSON, so it's capped tightly) and a hard 20-second timeout on every provider call so a slow request fails fast with a clear error instead of hanging indefinitely. Applied consistently across all four providers, not just Gemini, so this holds up once more keys are added.
- **Placeholder zones renamed and dimmed** (see Migration v8) so the game reads as "Builder Track is live, more is coming" rather than six half-finished zones sitting alongside it.
