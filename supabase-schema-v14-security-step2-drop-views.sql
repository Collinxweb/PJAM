-- ============================================================
-- PJAM — v14 step 2: remove the insecure leaderboard views
-- Run ONLY AFTER the new code has deployed on Vercel and
-- the Rank, Tournament, and Daily Rush pages load correctly.
-- ============================================================

drop view if exists public.leaderboard;
drop view if exists public.tournament_leaderboard;
drop view if exists public.daily_rush_leaderboard;
