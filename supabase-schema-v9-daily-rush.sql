-- ============================================================
-- PJAM — Migration v9: Daily Rush rebuilt as a real feature
-- Run in Supabase SQL Editor, AFTER v2 through v8.
-- ============================================================

-- Retire the old zone-based Daily Rush entry (it's becoming its
-- own dedicated feature, not a browsable zone) so it stops
-- showing up in Explore/Home at all.
update public.zones set active = false where id = 'daily-rush';

-- Tracks whether a player has been shown today's popup yet.
alter table public.profiles add column if not exists last_daily_rush_seen_date date;

-- The 30-challenge rotating pool. day_index cycles deterministically
-- from the calendar date (see lib/dailyRush.js) — no cron job needed.
create table if not exists public.daily_rush_challenges (
  id uuid primary key default gen_random_uuid(),
  day_index int not null unique check (day_index between 1 and 30),
  brief text not null,
  inspiration text,
  created_at timestamptz not null default now()
);

alter table public.daily_rush_challenges enable row level security;
drop policy if exists "Daily Rush challenges are publicly readable" on public.daily_rush_challenges;
create policy "Daily Rush challenges are publicly readable"
  on public.daily_rush_challenges for select
  using (true);

-- One entry per player per calendar day — this is what makes the
-- "first 10 solvers" ranking fair: one shot, not unlimited retries.
create table if not exists public.daily_rush_entries (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.daily_rush_challenges (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  rush_date date not null,
  ai_agent_id text not null references public.ai_agents (id),
  prompt_text text not null,
  output_text text,
  creativity_score numeric check (creativity_score between 0 and 100),
  solved boolean not null default false,
  solve_rank int,
  coins_earned numeric not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, rush_date)
);

alter table public.daily_rush_entries enable row level security;

drop policy if exists "Users can insert their own daily rush entry" on public.daily_rush_entries;
create policy "Users can insert their own daily rush entry"
  on public.daily_rush_entries for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can read their own daily rush entries" on public.daily_rush_entries;
create policy "Users can read their own daily rush entries"
  on public.daily_rush_entries for select
  using (auth.uid() = user_id);

-- Public leaderboard view exposes rank/score/username only — never
-- the raw prompt or AI output, same privacy pattern as tournaments.
create or replace view public.daily_rush_leaderboard as
select
  e.rush_date,
  e.user_id,
  p.username,
  e.creativity_score,
  e.solved,
  e.solve_rank
from public.daily_rush_entries e
join public.profiles p on p.id = e.user_id
order by e.rush_date desc, e.creativity_score desc;

insert into public.daily_rush_challenges (day_index, brief, inspiration) values
(1, 'Get the AI to invent a completely original app that doesn''t exist yet — give it a name and describe its one standout feature.', 'Judged purely on originality and imagination, not correctness.'),
(2, 'Get the AI to design a gadget from 50 years in the future that solves an everyday annoyance.', null),
(3, 'Get the AI to invent a new sport that could realistically be played in a small city park.', null),
(4, 'Get the AI to create an origin myth for something totally mundane, like why socks go missing in the laundry.', null),
(5, 'Get the AI to design a mascot for a fictional coffee shop, including personality and one catchphrase.', null),
(6, 'Get the AI to invent a slang term for a very specific modern feeling, plus its definition and example usage.', null),
(7, 'Get the AI to design a board game about surviving a Monday morning commute.', null),
(8, 'Get the AI to invent a superhero whose power is deliberately unglamorous but surprisingly useful.', null),
(9, 'Get the AI to design a themed room for a treehouse aimed at kids who love space.', null),
(10, 'Get the AI to invent a new holiday, including its name, date, and one weird tradition.', null),
(11, 'Get the AI to create a recipe that mashes up two cuisines that have never met before.', null),
(12, 'Get the AI to design a startup pitch (name + one-liner) for a business that is delightfully unnecessary.', null),
(13, 'Get the AI to invent a musical instrument that doesn''t exist and describe how it''s played.', null),
(14, 'Get the AI to design a piece of furniture that solves a problem nobody''s tried to solve before.', null),
(15, 'Get the AI to invent a fictional creature that would live exclusively inside a public library.', null),
(16, 'Get the AI to design a phone app icon and one-sentence pitch for an app that helps introverts at parties.', null),
(17, 'Get the AI to invent a new ice cream flavor inspired by a rainy day.', null),
(18, 'Get the AI to design a tiny robot''s one job, and give the robot a name and personality.', null),
(19, 'Get the AI to invent a game show concept that would only work in a grocery store.', null),
(20, 'Get the AI to design a t-shirt slogan for a fictional company that makes umbrellas for pets.', null),
(21, 'Get the AI to invent a constellation and the story behind its name.', null),
(22, 'Get the AI to design a treehouse-to-office commute system for a squirrel with a 9-to-5 job.', null),
(23, 'Get the AI to invent a new emoji and describe exactly what feeling it captures that no existing emoji does.', null),
(24, 'Get the AI to design a vending machine that sells something other than snacks — what, and why.', null),
(25, 'Get the AI to invent a fictional small town and its one claim to fame.', null),
(26, 'Get the AI to design a bedtime ritual for a dragon who''s afraid of the dark.', null),
(27, 'Get the AI to invent a new Olympic event that tests a skill nobody''s ever been ranked on before.', null),
(28, 'Get the AI to design a logo concept (described in words) for a bakery run entirely by robots.', null),
(29, 'Get the AI to invent a language that only cats would speak, with 3 example words and meanings.', null),
(30, 'Get the AI to design the ultimate treehouse fort and describe its one secret feature.', null);
