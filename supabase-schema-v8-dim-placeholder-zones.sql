-- ============================================================
-- PJAM — Migration v8: dim the placeholder zones, rename to
-- match the Builder Track family, while Builder Track carries
-- the game solo for now.
-- Run in Supabase SQL Editor, AFTER v2 through v7.
-- ============================================================

-- coming_soon zones still appear in Explore/Home (so players know
-- they exist and are on the way) but render dimmed and non-clickable
-- in the app — active stays true, this is a separate, additive flag.
alter table public.zones add column if not exists coming_soon boolean not null default false;

update public.zones set
  name = 'Foundations Track',
  emoji = '🧱',
  description = 'Coming soon — zero-shot prompting fundamentals. For now, master the basics inside the Builder Track.',
  coming_soon = true
where id = 'instruction-basics';

update public.zones set
  name = 'Pattern Track',
  emoji = '🧩',
  description = 'Coming soon — example-driven prompting. For now, master this inside the Builder Track.',
  coming_soon = true
where id = 'few-shot-arena';

update public.zones set
  name = 'Precision Track',
  emoji = '💎',
  description = 'Coming soon — exact format, length, and tone control. For now, master this inside the Builder Track.',
  coming_soon = true
where id = 'constraint-vault';

update public.zones set
  name = 'Voice Track',
  emoji = '🎨',
  description = 'Coming soon — persona and style transfer. For now, master this inside the Builder Track.',
  coming_soon = true
where id = 'persona-style-bay';

update public.zones set
  name = 'Logic Track',
  emoji = '🧠',
  description = 'Coming soon — multi-step reasoning. For now, master this inside the Builder Track.',
  coming_soon = true
where id = 'chain-of-thought-hollow';

update public.zones set
  name = 'Sprint Track',
  emoji = '⏳',
  description = 'Coming soon — timed daily challenges. For now, master this inside the Builder Track.',
  coming_soon = true
where id = 'daily-rush';
