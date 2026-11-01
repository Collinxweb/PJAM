-- ============================================================
-- PJAM — Optional seed: one starter challenge per zone
-- Run in Supabase SQL Editor, AFTER supabase-schema.sql and
-- supabase-schema-v2.sql. Safe to expand with more rows later —
-- these are just enough to make the app playable immediately.
-- ============================================================

insert into public.challenges (zone_id, title, brief, target_output, par_tokens, difficulty) values
(
  'instruction-basics',
  'Exact Word Count',
  'Write a one-sentence product description for a reusable water bottle — exactly 12 words.',
  'This reusable water bottle keeps drinks cold for twenty-four hours daily.',
  15,
  1
),
(
  'few-shot-arena',
  'Pattern Match',
  'Given apple: red, banana: yellow, grape: purple — continue the pattern for lime.',
  'lime: green',
  20,
  2
),
(
  'constraint-vault',
  'Under 8 Words',
  'Describe what a black hole is in 8 words or fewer.',
  'A black hole traps light with gravity.',
  15,
  3
),
(
  'persona-style-bay',
  'Pirate Weather Report',
  'Describe today''s weather in a pirate''s voice, in 2 sentences.',
  'Arrr, the skies be clear as a captain''s conscience today, with a gentle breeze from the west, matey. No storms be brewin'', so set sail with confidence!',
  30,
  2
),
(
  'chain-of-thought-hollow',
  'Step-by-Step Math',
  'A train travels 60 mph for 2.5 hours. How far does it go? Show the reasoning step by step.',
  '60 mph times 2.5 hours equals 150 miles.',
  30,
  3
),
(
  'daily-rush',
  'Today''s Rush',
  'Name a fruit that starts with the last letter of the word "banana."',
  'Apple',
  10,
  1
);
