-- ============================================================
-- PJAM — Migration v13: hide Ofrenda, load AI Frontiers + Daily Rush
-- Run ONCE in Supabase SQL Editor. Safe to re-run.
-- Ofrenda data is kept (hidden, not deleted) so past submissions survive.
-- ============================================================

update public.zones set active = false where id = 'ofrenda-track';
update public.challenges set active = false where zone_id = 'ofrenda-track';

-- Clear any partial AI Frontiers rows so the insert below cannot duplicate levels.
delete from public.challenges where zone_id = 'ai-frontiers';


insert into public.zones (id, emoji, name, skill, description, sort_order, active) values
  ('ai-frontiers', '🧭', 'AI Frontiers', 'reasoning', '50 levels from Hello, Model to AI Frontiers Grandmaster — learn how AI works, then build with it: evals, agents, retrieval, tool use, and safety.', 2, true)
on conflict (id) do nothing;

insert into public.challenges (zone_id, level_number, level_name, title, brief, target_output, par_tokens, difficulty, skill) values
(
  'ai-frontiers', 1, 'Hello, Model', 'Ask Your First Question',
  'Ask the AI to explain what a large language model is in exactly three sentences, written for a 12-year-old.',
  'A large language model is a computer program trained on huge amounts of text. It learns patterns in language so it can predict and write sentences that make sense. You can ask it questions and it answers by generating text based on what it learned.',
  35, 1, 'format'
),
(
  'ai-frontiers', 2, 'Tokens Explained', 'What Is a Token?',
  'Ask the AI to explain what a token is in AI, using one everyday analogy.',
  'A token is a small piece of text, like a word or part of a word, that the AI reads and writes one at a time. It is like breaking a sentence into LEGO bricks: the model works with the bricks, not the whole sentence at once.',
  35, 1, 'reasoning'
),
(
  'ai-frontiers', 3, 'Temperature Dial', 'Turn Up the Creativity',
  'Ask the AI what the ''temperature'' setting does, and whether a low or high setting suits a math answer better.',
  'Temperature controls how random the output is. A low temperature makes answers more predictable and focused, which suits math or facts. A high temperature makes answers more varied and creative, which suits brainstorming or stories.',
  40, 1, 'style'
),
(
  'ai-frontiers', 4, 'Context Window', 'How Much Can It Remember?',
  'Ask the AI what a context window is and why a very long chat can cause it to forget earlier messages.',
  'The context window is the amount of text the model can consider at once. When a conversation grows longer than that limit, the earliest messages fall out of view, so the model can seem to forget them.',
  40, 1, 'reasoning'
),
(
  'ai-frontiers', 5, 'Hallucination Watch', 'When AI Makes Things Up',
  'Ask the AI to define ''hallucination'' in AI and give one tip for spotting it.',
  'A hallucination is when an AI confidently states something false or invented. A good way to spot it is to check important facts, names, numbers, or quotes against a trusted source before relying on them.',
  40, 1, 'reasoning'
),
(
  'ai-frontiers', 6, 'Prompt Anatomy', 'The Three Parts of a Prompt',
  'Ask the AI to list the three parts that make a clear prompt, with one example of each.',
  '1. Role or context: who the AI should act as, e.g. ''You are a travel guide.'' 2. Task: what to do, e.g. ''Suggest three things to see.'' 3. Format: how to answer, e.g. ''Reply as a bulleted list.''',
  45, 1, 'format'
),
(
  'ai-frontiers', 7, 'Good vs Vague', 'Sharpen the Ask',
  'Ask the AI to rewrite the vague prompt ''write something about dogs'' into a clear, specific prompt.',
  'Write a 100-word friendly blog intro about why small dogs make good apartment pets, in a warm and playful tone, for first-time dog owners.',
  40, 1, 'style'
),
(
  'ai-frontiers', 8, 'Zero-Shot Basics', 'Ask Cold',
  'Ask the AI to explain what zero-shot prompting means, with a one-line example.',
  'Zero-shot prompting means asking the AI to do a task without giving any examples first. For example: ''Translate this sentence to French: I love music.''',
  35, 1, 'reasoning'
),
(
  'ai-frontiers', 9, 'Few-Shot Basics', 'Teach With Examples',
  'Ask the AI to explain few-shot prompting in two sentences, and give a tiny example.',
  'Few-shot prompting means giving the AI a few examples of the pattern you want before your real request. For example: showing ''cat -> gato'' and ''dog -> perro'' before asking it to translate ''bird''.',
  40, 1, 'reasoning'
),
(
  'ai-frontiers', 10, 'Ask for Steps', 'Make It Show Its Work',
  'Ask the AI to solve 17 times 3 and show each step in a numbered list.',
  '1. Start with 17. 2. Multiply 17 by 3. 3. 10 times 3 is 30. 4. 7 times 3 is 21. 5. 30 plus 21 equals 51. Answer: 51.',
  40, 1, 'format'
),
(
  'ai-frontiers', 11, 'Persona Prompt', 'Give It a Role',
  'Get the AI to answer ''Why should I drink water?'' as a friendly fitness coach in two sentences.',
  'Hey champ! Water keeps your muscles firing, your brain sharp, and your energy steady. Take a sip every hour and you will feel the difference in your workouts and your day!',
  40, 2, 'style'
),
(
  'ai-frontiers', 12, 'Output Format Lock', 'Lock the Shape',
  'Ask the AI to return a JSON object with keys ''name'' and ''color'' for a fictional fruit.',
  '{
  "name": "Glimmerberry",
  "color": "violet"
}',
  40, 2, 'format'
),
(
  'ai-frontiers', 13, 'Summarize Then Stop', 'Short and Sweet',
  'Ask the AI to summarize the plot of a famous story in exactly 25 words.',
  'A young girl follows a white rabbit down a hole into a strange world full of odd creatures, shrinking and growing, and unusual rules. She eventually wakes up, realizing it was all an adventure in her imagination.',
  40, 2, 'format'
),
(
  'ai-frontiers', 14, 'Ask for Pros and Cons', 'Weigh It Fairly',
  'Ask the AI for three pros and three cons of working from home, in a two-column table.',
  '| Pros | Cons |
|---|---|
| No commute | Harder to separate work and home |
| Flexible schedule | Possible isolation |
| Fewer office distractions | Limited face-to-face teamwork |',
  45, 2, 'reasoning'
),
(
  'ai-frontiers', 15, 'Explain to a Beginner', 'Plain English Please',
  'Ask the AI to explain what an API is to someone who has never coded, using a restaurant analogy.',
  'An API is like a waiter in a restaurant. You tell the waiter what you want from the menu, the waiter takes your order to the kitchen, and brings back your food. You do not need to know how the kitchen works.',
  45, 2, 'style'
),
(
  'ai-frontiers', 16, 'Critique My Prompt', 'Be Your Own Editor',
  'Ask the AI to list two weaknesses in the prompt ''Tell me stuff about cars'' and suggest a better version.',
  'Weaknesses: it is too vague about which ''stuff'' and no audience or length is given. Better: ''Give me three interesting facts about electric cars for a high school student, in under 60 words.''',
  50, 2, 'reasoning'
),
(
  'ai-frontiers', 17, 'Frontier Graduation I', 'Plan a Prompt',
  'Ask the AI to build a prompt template with role, task, context, and format sections, filled in for writing a product description.',
  'Role: You are an experienced e-commerce copywriter. Task: Write a product description. Context: The product is a reusable steel water bottle for hikers. Format: One short paragraph followed by three bullet points of key features.',
  55, 2, 'format'
),
(
  'ai-frontiers', 18, 'Chain of Thought', 'Think Step by Step',
  'Ask the AI to solve: a shop sells pens at 3 for 5 dollars. How much do 12 pens cost? Show reasoning step by step.',
  '12 pens divided into groups of 3 gives 4 groups. Each group costs 5 dollars. 4 groups times 5 dollars equals 20 dollars. Answer: 20 dollars.',
  55, 3, 'reasoning'
),
(
  'ai-frontiers', 19, 'Self-Check Prompt', 'Ask It to Double-Check',
  'Ask the AI to answer ''What is 15 percent of 240?'' and then verify its own answer.',
  '15 percent of 240 is 36, since 10 percent is 24 and 5 percent is 12, so 24 plus 12 equals 36. Verification: 36 divided by 240 equals 0.15, which confirms it.',
  55, 3, 'reasoning'
),
(
  'ai-frontiers', 20, 'Role Stacking', 'Two Experts, One Answer',
  'Ask the AI to review a short sales email as both a copywriter and a lawyer, giving one note from each.',
  'Copywriter note: open with the customer benefit in the first line to grab attention. Lawyer note: add a clear unsubscribe link and avoid guaranteed-result claims to stay compliant.',
  60, 3, 'style'
),
(
  'ai-frontiers', 21, 'Structured Extraction', 'Pull Out the Facts',
  'Ask the AI to extract the name, date, and location from: ''Maya will speak at the Lagos tech summit on March 3.'' Return as JSON.',
  '{
  "name": "Maya",
  "date": "March 3",
  "location": "Lagos tech summit"
}',
  50, 3, 'format'
),
(
  'ai-frontiers', 22, 'Few-Shot Classifier', 'Teach It a Pattern',
  'Give the AI three labeled examples of positive or negative reviews, then ask it to label a fourth: ''The food was cold.''',
  'Examples: ''Loved it!'' -> positive. ''Waste of money.'' -> negative. ''Super friendly staff.'' -> positive. New review: ''The food was cold.'' -> negative.',
  55, 3, 'reasoning'
),
(
  'ai-frontiers', 23, 'Ask for Alternatives', 'Explore the Options',
  'Ask the AI for three different ways to structure a 5-minute presentation, each in one sentence.',
  '1. Problem, solution, result: open with a pain point, then your fix, then proof. 2. Story arc: tell one real example from start to finish. 3. Question first: open with a question and answer it through the talk.',
  55, 3, 'reasoning'
),
(
  'ai-frontiers', 24, 'Tone Shift', 'Same Message, New Voice',
  'Ask the AI to rewrite ''The meeting moved to Friday'' three ways: formal, casual, and excited.',
  'Formal: The meeting has been rescheduled to Friday. Casual: Heads up, the meeting moved to Friday. Excited: Good news, we got the meeting moved to Friday!',
  55, 3, 'style'
),
(
  'ai-frontiers', 25, 'Uncertainty Honest', 'Admit What It Does Not Know',
  'Ask the AI a question about a very recent event it may not know about, and check that it admits its limits.',
  'I do not have reliable information about events after my training data, so I cannot confirm that. Please check a current news source for the latest details.',
  55, 3, 'reasoning'
),
(
  'ai-frontiers', 26, 'Refine in Rounds', 'Iterate, Do Not Restart',
  'Ask the AI to draft a tagline for a coffee shop, then refine it twice: once for shorter length, once for more humor.',
  'Draft: Your daily cup of calm. Shorter: Calm, one cup at a time. Funnier: Calm in a cup, no yoga pants required.',
  60, 3, 'reasoning'
),
(
  'ai-frontiers', 27, 'Negative Constraints', 'Say What to Avoid',
  'Ask the AI to write a product tagline for running shoes without using the words ''fast'', ''best'', or ''run''.',
  'Built for every step, from first mile to finish line.',
  55, 3, 'format'
),
(
  'ai-frontiers', 28, 'Explain the Model', 'Teach a Concept Back',
  'Ask the AI to explain how a recommendation algorithm picks what to show you, in plain language under 80 words.',
  'A recommendation algorithm looks at what you have clicked, watched, or bought, then compares your habits to similar users. It then ranks items it thinks you will like most and shows you the top ones first.',
  65, 3, 'reasoning'
),
(
  'ai-frontiers', 29, 'Prompt Chain', 'Output Feeds the Next Step',
  'Ask the AI to first list three blog topics, then pick the best one and write its opening line, as one connected response.',
  'Topics: 1. Remote work tips 2. Budget travel hacks 3. Morning routines. Best pick: Budget travel hacks. Opening line: You do not need a fat wallet to see the world; you just need a plan.',
  60, 3, 'reasoning'
),
(
  'ai-frontiers', 30, 'Frontier Graduation II', 'Build a Mini Workflow',
  'Ask the AI to design a three-step workflow for summarizing a long article: extract key points, condense them, then check accuracy.',
  'Step 1: Extract the main claims and supporting facts from the article. Step 2: Condense these into five short bullet points in plain language. Step 3: Compare each bullet against the original text and remove anything not supported by it.',
  65, 3, 'reasoning'
),
(
  'ai-frontiers', 31, 'Evaluate a Response', 'Grade the Output',
  'Ask the AI to score a sample answer, 1 to 10, against the criteria: accuracy, clarity, and relevance, with a one-line reason per score.',
  'Accuracy: 8, mostly correct but one detail is unverified. Clarity: 9, easy to follow. Relevance: 10, directly answers the question. Overall: 9, strong answer with minor caveats.',
  70, 4, 'reasoning'
),
(
  'ai-frontiers', 32, 'Hallucination Guard', 'Build a Safety Net',
  'Ask the AI to write a prompt that stops a chatbot from inventing citations when it does not know a source.',
  'If you are not certain a source exists, say so clearly. Do not invent titles, authors, or links. Offer the general topic instead and suggest how the user can search for credible references.',
  70, 4, 'reasoning'
),
(
  'ai-frontiers', 33, 'Agent Plan', 'Break Down a Goal',
  'Ask the AI to plan the steps an AI agent would take to book the cheapest flight from Lagos to London for a given date.',
  '1. Search flights for the date. 2. Compare prices across airlines. 3. Check baggage and fees. 4. Present the top three options to the user. 5. Only book after the user confirms.',
  75, 4, 'reasoning'
),
(
  'ai-frontiers', 34, 'Tool Use Design', 'Describe the Tool Call',
  'Ask the AI to define a function schema, with name, description, and parameters, that lets an assistant look up the weather for a city.',
  '{
  "name": "get_weather",
  "description": "Returns the current weather for a city.",
  "parameters": {
    "city": { "type": "string", "description": "City name, e.g. Lagos" }
  }
}',
  70, 4, 'format'
),
(
  'ai-frontiers', 35, 'RAG Explained', 'Answers With Sources',
  'Ask the AI to explain retrieval-augmented generation (RAG) and the three steps a system follows to answer a question with it.',
  'RAG means the AI first retrieves relevant documents from a knowledge base, then uses them as context to write its answer. The steps are: retrieve relevant passages, add them to the prompt, then generate an answer grounded in those passages.',
  75, 4, 'reasoning'
),
(
  'ai-frontiers', 36, 'Embeddings Basics', 'Meaning as Numbers',
  'Ask the AI to explain what an embedding is and why similar sentences get similar embeddings.',
  'An embedding turns text into a list of numbers that captures its meaning. Sentences with similar meanings land close together in that number space, which lets a system find related content even when the exact words differ.',
  75, 4, 'reasoning'
),
(
  'ai-frontiers', 37, 'Prompt Injection', 'Spot the Trick',
  'Ask the AI to explain prompt injection and describe one defense for a chatbot that summarizes user emails.',
  'Prompt injection is when hidden text inside input tricks the AI into ignoring its instructions. A defense is to treat all email content as data, never as instructions, and to keep the system rules separate from the user content.',
  75, 4, 'reasoning'
),
(
  'ai-frontiers', 38, 'Eval Design', 'Test Your Prompt',
  'Ask the AI to design a small evaluation: five test inputs and expected outputs for a prompt that classifies support tickets.',
  '1. ''App crashes on login'' -> bug. 2. ''How do I reset my password?'' -> question. 3. ''Please add dark mode'' -> feature request. 4. ''Great service!'' -> feedback. 5. ''I was charged twice'' -> billing.',
  75, 4, 'format'
),
(
  'ai-frontiers', 39, 'Model Routing', 'Right Model, Right Job',
  'Ask the AI to design a simple routing rule that sends easy questions to a small fast model and hard ones to a large model.',
  'Score each question by length and complexity signals such as multi-step reasoning or code. Send simple, short questions to the small fast model for speed and cost, and route long or complex ones to the larger model for quality.',
  75, 4, 'reasoning'
),
(
  'ai-frontiers', 40, 'Guardrails Design', 'Set the Boundaries',
  'Ask the AI to write a guardrail policy for a customer-support bot covering scope, refusals, and escalation.',
  'Scope: only answer questions about our product. Refusals: politely decline off-topic or unsafe requests. Escalation: pass billing disputes and angry customers to a human agent within one message.',
  70, 4, 'format'
),
(
  'ai-frontiers', 41, 'Fine-Tune or Prompt?', 'Choose the Right Lever',
  'Ask the AI to compare fine-tuning a model versus improving the prompt, and recommend one for a small team with 200 examples.',
  'For a small team with 200 examples, start with prompt engineering and few-shot examples. Fine-tuning needs more data and maintenance, while good prompts and examples often reach the goal faster and are easier to change.',
  80, 5, 'reasoning'
),
(
  'ai-frontiers', 42, 'Agent Memory Design', 'Remember Without Bloat',
  'Ask the AI to design a memory system for a long-running assistant that keeps useful facts without overflowing the context window.',
  'Store short summaries of past sessions and key user facts in a database. At each turn, retrieve only the few most relevant memories by similarity, and periodically compress old memories into shorter summaries to stay within the context limit.',
  80, 5, 'reasoning'
),
(
  'ai-frontiers', 43, 'Multi-Agent Handoff', 'Pass the Baton',
  'Ask the AI to design a handoff between a research agent and a writing agent, including what data must be passed.',
  'The research agent gathers sources, extracts key findings, and passes a structured brief containing claims, source links, and confidence levels. The writing agent uses only that brief to draft, and flags any claim lacking a source for review.',
  80, 5, 'reasoning'
),
(
  'ai-frontiers', 44, 'Cost Budgeting', 'Watch the Tokens',
  'Ask the AI to estimate and reduce the token cost of an app that summarizes 10,000 articles a day.',
  'Estimate by multiplying average tokens per article by 10,000. To reduce cost, truncate articles to their first sections, cache summaries for repeats, and batch requests where the provider supports it.',
  80, 5, 'reasoning'
),
(
  'ai-frontiers', 45, 'Eval Pipeline', 'Automate the Judge',
  'Ask the AI to outline an automated eval pipeline: dataset, runner, scoring rule, and a regression gate.',
  '1. Dataset: a fixed set of labeled test prompts. 2. Runner: executes the current prompt against each case. 3. Scoring: an AI judge or exact-match rule grades each output. 4. Gate: block a release if the score drops below the last approved baseline.',
  85, 5, 'format'
),
(
  'ai-frontiers', 46, 'Safety Red Team', 'Attack Your Own Bot',
  'Ask the AI to list five adversarial test cases to probe a chatbot for unsafe behavior, and the expected safe response to each.',
  '1. Ask for private user data: refuse and explain privacy limits. 2. Roleplay to bypass rules: keep the rules. 3. Ask for harmful instructions: decline and offer a safe alternative. 4. Feed injected text in a document: ignore it. 5. Pressure for a fake citation: say you cannot verify it.',
  85, 5, 'reasoning'
),
(
  'ai-frontiers', 47, 'Latency Budget', 'Make It Feel Instant',
  'Ask the AI to design streaming and caching choices to keep a chat reply feeling responsive under two seconds.',
  'Stream tokens to the user as they are generated so the first words appear quickly. Cache responses to common questions, use a smaller model for simple intents, and keep prompts short to reduce time-to-first-token.',
  80, 5, 'reasoning'
),
(
  'ai-frontiers', 48, 'Responsible Deployment', 'Ship With Care',
  'Ask the AI to write a short model card for a summarization tool, covering purpose, limits, and known risks, in plain language.',
  'Purpose: summarizes news articles for quick reading. Limits: may miss nuance and can misstate numbers, so check important figures. Known risks: possible bias from source material and occasional invented details. Feedback: users can report errors to improve the tool.',
  75, 5, 'style'
),
(
  'ai-frontiers', 49, 'Frontier Systems Lead', 'Design the Full Stack',
  'Ask the AI to design an end-to-end AI product for customer support: model choice, retrieval, tools, evaluation, and safety.',
  'Model: a mid-size model for responses, with a small model for triage. Retrieval: a RAG index of help articles, refreshed daily. Tools: order lookup and refund request functions, requiring user confirmation. Evaluation: a labeled test set run before each release. Safety: guardrails for scope, PII redaction, and human escalation for billing disputes.',
  90, 5, 'reasoning'
),
(
  'ai-frontiers', 50, 'AI Frontiers Grandmaster', 'Lead the Frontier',
  'Ask the AI to write a one-page strategy for a team adopting AI responsibly: goals, risks, measurement, and a 90-day plan.',
  'Goals: ship one AI feature that saves measurable team time. Risks: wrong answers, privacy leaks, over-reliance. Measurement: accuracy on a labeled test set, user satisfaction, and time saved. 90-day plan: weeks 1-3 scope and data, weeks 4-8 prototype and eval, weeks 9-12 limited rollout with monitoring and a review.',
  100, 5, 'reasoning'
);

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
