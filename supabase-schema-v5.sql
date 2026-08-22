-- ============================================================
-- PJAM — Migration v5: 1v1 tournaments + tournament delete
-- Run in Supabase SQL Editor, AFTER v2, v3, and v4.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Allow capacity as low as 2, enabling 1v1 duels alongside
-- the existing 3-8 player group tournaments.
-- ------------------------------------------------------------
alter table public.tournaments drop constraint if exists tournaments_capacity_check;
alter table public.tournaments add constraint tournaments_capacity_check check (capacity between 2 and 8);

-- ------------------------------------------------------------
-- 2. Let the host delete their own tournament (app enforces this
-- is only allowed before anyone has submitted — see api route).
-- Participants and the tournament_id link on submissions both
-- already cascade/allow null safely:
--   - tournament_participants has ON DELETE CASCADE already.
--   - submissions.tournament_id has no ON DELETE action set,
--     which would block deletion if a submission exists — so we
--     explicitly set it to SET NULL here as a safety net, even
--     though the app also refuses to delete a tournament that
--     already has entries.
-- ------------------------------------------------------------
alter table public.submissions drop constraint if exists submissions_tournament_id_fkey;
alter table public.submissions
  add constraint submissions_tournament_id_fkey
  foreign key (tournament_id) references public.tournaments (id) on delete set null;

drop policy if exists "Host can delete their tournament" on public.tournaments;
create policy "Host can delete their tournament"
  on public.tournaments for delete
  using (auth.uid() = host_id);
