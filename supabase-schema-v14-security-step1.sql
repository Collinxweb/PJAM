-- ============================================================
-- PJAM — v14 step 1: tournament leaderboard function with tie-break
-- Run NOW in Supabase SQL Editor. Replaces the earlier function.
-- ============================================================

drop function if exists public.get_tournament_leaderboard(uuid);

create or replace function public.get_tournament_leaderboard(p_tournament_id uuid)
returns table(user_id uuid, username text, best_score numeric, first_submitted_at timestamptz)
language sql stable security definer set search_path = public
as $$
  select s.user_id,
         p.username,
         max(s.total_score) as best_score,
         min(s.created_at) as first_submitted_at
  from public.submissions s
  join public.profiles p on p.id = s.user_id
  where s.tournament_id = p_tournament_id
  group by s.user_id, p.username
  order by max(s.total_score) desc, min(s.created_at) asc;
$$;
