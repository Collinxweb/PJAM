-- ============================================================
-- PJAM — Migration v2: coins, xp, agent selection, tournaments
-- Run this in Supabase Dashboard -> SQL Editor, AFTER supabase-schema.sql
-- ============================================================

-- ------------------------------------------------------------
-- 1. Profile additions: coins, XP, and a remembered opponent AI.
-- ------------------------------------------------------------
alter table public.profiles add column if not exists coins numeric not null default 0;
alter table public.profiles add column if not exists xp numeric not null default 0;
alter table public.profiles add column if not exists selected_agent_id text references public.ai_agents (id);

-- ------------------------------------------------------------
-- 2. TOURNAMENTS
-- A host picks a challenge and a capacity (4-8). Others join until
-- full or the host starts/ends it manually.
-- ------------------------------------------------------------
create table if not exists public.tournaments (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.profiles (id) on delete cascade,
  challenge_id uuid not null references public.challenges (id) on delete cascade,
  capacity int not null check (capacity between 4 and 8),
  status text not null default 'open' check (status in ('open', 'in_progress', 'completed')),
  winner_id uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  ends_at timestamptz
);

alter table public.tournaments enable row level security;

drop policy if exists "Tournaments are publicly readable" on public.tournaments;
create policy "Tournaments are publicly readable"
  on public.tournaments for select
  using (true);

drop policy if exists "Signed-in users can host a tournament" on public.tournaments;
create policy "Signed-in users can host a tournament"
  on public.tournaments for insert
  with check (auth.uid() = host_id);

drop policy if exists "Host can update their tournament" on public.tournaments;
create policy "Host can update their tournament"
  on public.tournaments for update
  using (auth.uid() = host_id);

-- ------------------------------------------------------------
-- 3. TOURNAMENT PARTICIPANTS
-- ------------------------------------------------------------
create table if not exists public.tournament_participants (
  tournament_id uuid not null references public.tournaments (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (tournament_id, user_id)
);

alter table public.tournament_participants enable row level security;

drop policy if exists "Participants are publicly readable" on public.tournament_participants;
create policy "Participants are publicly readable"
  on public.tournament_participants for select
  using (true);

drop policy if exists "Users can join a tournament as themselves" on public.tournament_participants;
create policy "Users can join a tournament as themselves"
  on public.tournament_participants for insert
  with check (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 4. Link submissions to a tournament attempt (nullable — most
-- submissions are regular zone practice, not tournament play).
-- ------------------------------------------------------------
alter table public.submissions add column if not exists tournament_id uuid references public.tournaments (id);

-- ------------------------------------------------------------
-- 5. Tournament leaderboard view: best submission per participant.
-- ------------------------------------------------------------
create or replace view public.tournament_leaderboard as
select
  s.tournament_id,
  s.user_id,
  p.username,
  max(s.total_score) as best_score
from public.submissions s
join public.profiles p on p.id = s.user_id
where s.tournament_id is not null
group by s.tournament_id, s.user_id, p.username
order by best_score desc;

-- ============================================================
-- Done. Known limitation: tournament capacity is checked in the
-- app's API route, not enforced by a DB constraint — under very
-- high concurrent join attempts on the same tournament, capacity
-- could theoretically be exceeded by a couple of seats. Fine for
-- a contest MVP; worth hardening with a trigger later if needed.
-- ============================================================
