-- ============================================================
-- PJAM — Migration v12: Daily Rush pool refresh (30 new AI Frontiers prompts)
-- Run in Supabase SQL Editor, AFTER v2 through v11.
-- Replaces the day_index 1-30 pool. Safe to re-run.
-- ============================================================

delete from public.daily_rush_challenges;

insert into public.daily_rush_challenges (day_index, brief, inspiration) values
(1, 'Get the AI to invent an AI assistant that a grandmother would actually enjoy using. Give it a name, a personality, and one thing it does better than anyone else.', 'Judged on originality and warmth, not technical depth.'),
(2, 'Get the AI to design a robot whose only job is to double-check other robots'' homework. Describe how it looks and how it earns trust.', null),
(3, 'Get the AI to invent a new AI safety rule that sounds serious but is actually a joke. Write the rule and explain the loophole it closes.', null),
(4, 'Get the AI to design a chatbot for a bakery that only answers questions in the form of recipes. Show three sample replies.', null),
(5, 'Get the AI to invent a tiny model that lives inside a smart fridge and gives advice about groceries. Name it and describe its one quirky habit.', null),
(6, 'Get the AI to design a mascot for an AI ethics club for kids. Describe its look, its catchphrase, and one lesson it teaches.', null),
(7, 'Get the AI to invent a new kind of prompt, the ''Whisper prompt'', that is only three words long but gets great results. Show the words and one example output.', null),
(8, 'Get the AI to design an AI that writes poems but only in the style of a weather report. Show a short sample.', null),
(9, 'Get the AI to invent a board game where players compete to write the best prompt for a mystery character. Describe the rules in five steps.', null),
(10, 'Get the AI to design a futuristic classroom where every student has a personal AI tutor with a different teaching style. Describe two of the tutors.', null),
(11, 'Get the AI to invent a new emoji that means ''the model is confidently wrong''. Describe what it looks like and when to use it.', null),
(12, 'Get the AI to design an AI that negotiates the price of a bus ticket on your behalf. Write its opening message to the bus company.', null),
(13, 'Get the AI to invent a language that only AI models would understand, with five words and their meanings.', null),
(14, 'Get the AI to design a museum exhibit about the history of prompts, through three objects that could be displayed. Describe each one.', null),
(15, 'Get the AI to invent a fictional startup that builds tiny AI agents for houseplants. Give the company name, tagline, and first product.', null),
(16, 'Get the AI to design a daily challenge for a gym that is judged by an AI coach. Describe three exercises and how the AI scores them.', null),
(17, 'Get the AI to invent a comic strip about an AI that is afraid of being asked the same question twice. Describe the first three panels.', null),
(18, 'Get the AI to design a travel app whose AI guide only recommends places that are closed today. Show a sample itinerary.', null),
(19, 'Get the AI to invent a new kind of hackathon where every team must build something using only one prompt. Describe the rules and one winning idea.', null),
(20, 'Get the AI to design a mascot for a newsletter about AI. It should be a creature that lives in the margin of a document. Describe its name and habit.', null),
(21, 'Get the AI to invent a pet that is trained using prompts instead of treats. Describe the pet, the commands, and what it does when it succeeds.', null),
(22, 'Get the AI to design a voice assistant for a lighthouse keeper. Describe how it handles storms and one personal touch.', null),
(23, 'Get the AI to invent a rating system for AI answers using weather symbols. Define each symbol and what it means.', null),
(24, 'Get the AI to design an app that helps people learn to ask better questions by playing a guessing game. Describe the first round.', null),
(25, 'Get the AI to invent a superhero whose power is spotting when an AI answer is missing a key detail. Write the origin story in three sentences.', null),
(26, 'Get the AI to design a library catalog system run by an AI librarian who only shelves books by their first sentence. Describe how it works.', null),
(27, 'Get the AI to invent a new kind of calendar where each day has an AI-generated prompt challenge. Show what Monday and Tuesday look like.', null),
(28, 'Get the AI to design an AI that writes lullabies for debugging sessions. Show the first verse.', null),
(29, 'Get the AI to invent a fictional city powered entirely by a single AI assistant. Describe its one rule and one problem it creates.', null),
(30, 'Get the AI to design the ultimate AI-powered treehouse for a team of five builders. Describe its one unusual feature and how the team uses it.', null);
