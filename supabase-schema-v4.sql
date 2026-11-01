-- ============================================================
-- PJAM — Migration v4: profile fields + custom tournament challenges
-- Run in Supabase SQL Editor, AFTER v2 and v3.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Profile identity fields (shown on the new /profile page).
-- ------------------------------------------------------------
alter table public.profiles add column if not exists display_name text;
alter table public.profiles add column if not exists bio text;

-- ------------------------------------------------------------
-- 2. Custom challenges: a tournament host can write their own
-- challenge instead of picking an existing one. These need a
-- zone_id to satisfy the existing foreign key, so we use one
-- hidden "custom" zone that never appears in Explore/Home
-- (active = false keeps it out of every normal zone listing).
-- ------------------------------------------------------------
insert into public.zones (id, emoji, name, skill, description, sort_order, active) values
  ('custom', '🎨', 'Custom Tournament Challenges', 'reasoning', 'Host-written challenges used only inside tournaments.', 99, false)
on conflict (id) do nothing;

alter table public.challenges add column if not exists is_custom boolean not null default false;
alter table public.challenges add column if not exists created_by uuid references public.profiles (id);

-- Signed-in users can create a challenge for themselves as long as it's
-- flagged custom and tied to the hidden 'custom' zone — this is what lets
-- a tournament host write their own challenge from the app.
drop policy if exists "Users can create their own custom challenges" on public.challenges;
create policy "Users can create their own custom challenges"
  on public.challenges for insert
  with check (auth.uid() = created_by and is_custom = true and zone_id = 'custom');

-- ------------------------------------------------------------
-- 3. Tie-break support: track when each participant's best score
-- was submitted, so ties go to whoever got there first (matches
-- what the tournament rules text actually says).
-- ------------------------------------------------------------
create or replace view public.tournament_leaderboard as
select
  s.tournament_id,
  s.user_id,
  p.username,
  max(s.total_score) as best_score,
  min(s.created_at) as first_submitted_at
from public.submissions s
join public.profiles p on p.id = s.user_id
where s.tournament_id is not null
group by s.tournament_id, s.user_id, p.username
order by best_score desc, first_submitted_at asc;
