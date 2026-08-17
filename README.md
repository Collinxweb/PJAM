# PJAM

Real prompt-engineering challenges, scored on accuracy, efficiency, and style. Built with Next.js (App Router) + Supabase.

## What's real here vs. what's still a mockup
Everything in this project is wired to actual Supabase data — no fake/placeholder content:
- Home, Explore, and Zone pages read real rows from `zones`, `challenges`, and `ai_agents`.
- Backpack reads real `unlocks` and shows genuinely locked/unlocked state per signed-in user.
- Rank reads the real `leaderboard` view and a signed-in user's actual `reputation`.
- Onboarding calls real Supabase auth (`signInWithOAuth` for X, `signInWithOtp` for email) — not a UI mockup.

Still missing before it's fully playable: the scoring Edge Function (grades a submitted prompt) and real challenge rows in the `challenges` table. See "What's next" below.

## 1. Get this running (from your phone, no terminal on-device needed)

1. Create a GitHub repo (e.g. `pjam`) and upload every file in this project, keeping the folder structure intact (`app/`, `components/`, `lib/`).
2. Open the repo on github.com → **Code** → **Codespaces** tab → **Create codespace**. This opens a full dev environment (including a terminal) in your mobile browser.
3. In the Codespaces terminal:
   ```
   npm install
   cp .env.local.example .env.local
   ```
4. Edit `.env.local` (right in the Codespaces file browser) and fill in your real Supabase URL + anon key from Dashboard → Settings → API.
5. Run it:
   ```
   npm run dev
   ```
   Codespaces will offer to open a forwarded preview URL — that's your live test link, works from your phone browser.

## 2. Deploy for real (so X OAuth + email links work)
1. Go to vercel.com → sign in with GitHub → **Add New Project** → pick the `pjam` repo.
2. Add the same two env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in Vercel's project settings.
3. Deploy. You'll get a URL like `pjam.vercel.app`.
4. In Supabase Dashboard → Authentication → URL Configuration, set Site URL and add a Redirect URL to `https://pjam.vercel.app/auth/callback`.
5. If you set up X (Twitter) OAuth, update its callback URL the same way (see `supabase-auth-setup.md`).
6. When your `.xyz` domain is ready: point it at the Vercel project, then update Site URL / Redirect URLs / X callback to the new domain. Nothing else changes.

## 3. What's next
- **Scoring Edge Function** — a server-side function that takes a submitted prompt, runs it against the chosen AI agent, judges the output against `challenges.target_output`, and writes `accuracy_score` / `efficiency_score` / `style_score` back to `submissions`. This can't run client-side or players could fake their scores.
- **Real challenge content** — `challenges` is empty. Needs actual prompt puzzles written per zone before there's anything to play.
- **Submission UI** — a page where a signed-in player picks a challenge, writes a prompt, and submits it.

## Project structure
```
app/                Next.js routes (Home, Explore, Backpack, Rank, Zone detail, Onboarding, Auth callback)
components/          Shared UI + client-side page views
lib/supabase/        Browser, server, and middleware Supabase clients
lib/theme.js          Theme palette + rank tier data (single source of truth, matches the DB)
middleware.js         Refreshes the auth session on every request
```
