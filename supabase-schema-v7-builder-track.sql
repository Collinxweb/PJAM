-- ============================================================
-- PJAM — Migration v7: Builder Track (50 levels, level 1-50)
-- Run in Supabase SQL Editor, AFTER v2, v3, v4, v5, and v6.
-- ============================================================

-- ------------------------------------------------------------
-- 1. New hidden-from-Explore-filter-but-visible zone for the
-- Builder Track. It IS active (shows in Explore/Home) since
-- this is the main progression track, unlike the 'custom' zone
-- used for tournament-only challenges.
-- ------------------------------------------------------------
insert into public.zones (id, emoji, name, skill, description, sort_order, active) values
  ('builder-track', '🏗️', 'Builder Track', 'reasoning', '50 levels from First Blueprint to Grandmaster Architect — train to build real things with AI, not just answer trivia.', 0, true)
on conflict (id) do nothing;

-- ------------------------------------------------------------
-- 2. Level metadata columns on challenges (nullable — only
-- Builder Track rows use these; other zones' challenges leave
-- them null).
-- ------------------------------------------------------------
alter table public.challenges add column if not exists level_number int;
alter table public.challenges add column if not exists level_name text;
alter table public.challenges add column if not exists skill text check (skill in ('reasoning', 'format', 'style', 'speed'));

-- ------------------------------------------------------------
-- 3. The 50 levels.
-- ------------------------------------------------------------
insert into public.challenges (zone_id, level_number, level_name, title, brief, target_output, par_tokens, difficulty, skill) values
(
  'builder-track', 1, 'First Blueprint', 'Vague to Vision',
  'A friend says: "I want an app for splitting bills with roommates." Get the AI to turn that one sentence into a clear one-paragraph spec: what it does, who it''s for, and its 3 core features.',
  'SplitStay is a bill-splitting app for roommates. It lets users log shared expenses, automatically calculates who owes whom, and sends payment reminders. Core features: (1) add an expense and split it evenly or by custom share, (2) a running balance showing what each roommate owes or is owed, (3) one-tap payment reminders via notification.',
  40, 1, 'format'
),
(
  'builder-track', 2, 'Scaffold Starter', 'Signature Sketch',
  'Get the AI to write just the function signature (name, parameters, return type) for a function that calculates a shopping cart total from a list of items with price and quantity. No implementation, just the signature and a one-line comment.',
  '// Calculates the total price of all items in a shopping cart
function calculateCartTotal(items: { price: number, quantity: number }[]): number',
  30, 1, 'format'
),
(
  'builder-track', 3, 'Bug Hunter Apprentice', 'Why Is It Blank?',
  'A user says: "My page shows a blank screen and the console says ''Cannot read property map of undefined''." Get the AI to explain in plain terms what''s likely causing this and the most probable fix.',
  'This error means your code is trying to call .map() on a variable that is undefined — usually because the data (like an array from an API) hasn''t loaded yet when the component first renders. The fix: check that the array exists before mapping over it (e.g. `data?.map(...)` or a loading state), or set a default empty array value so it''s never undefined.',
  45, 1, 'reasoning'
),
(
  'builder-track', 4, 'Naming Things', 'What Should We Call It?',
  'Describe a function that checks whether a user''s email is already registered before allowing signup. Get the AI to suggest one clear, conventional function name for it, with a one-sentence reason why.',
  'isEmailTaken — it reads like a yes/no question, matches common boolean-naming convention (is/has/can prefixes), and immediately tells another developer what the function checks without needing to read its body.',
  30, 1, 'style'
),
(
  'builder-track', 5, 'Plain English Docs', 'Explain It Like I''m New',
  'Describe a function called `debounce(fn, delay)` that only calls `fn` after the user stops triggering it for `delay` milliseconds. Get the AI to write a 2-sentence README explanation a junior developer would understand.',
  'debounce() delays running a function until things have gone quiet for a bit. If you keep calling the debounced function again and again (like on every keystroke), it waits until you stop for `delay` milliseconds before actually running — so it doesn''t fire on every single call, just the last one.',
  35, 1, 'style'
),
(
  'builder-track', 6, 'The To-Do List', 'Break It Down',
  'Feature: "Add a dark mode toggle to the app." Get the AI to break this into a numbered list of 5 concrete implementation steps.',
  '1. Add a `theme` state (light/dark) stored in context or local storage.
2. Create a toggle switch component in the settings menu.
3. Define dark-mode color variables alongside the existing light-mode ones.
4. Apply the active theme''s variables at the app''s root level.
5. Persist the user''s choice so it''s remembered on their next visit.',
  40, 1, 'format'
),
(
  'builder-track', 7, 'First Fetch', 'Get the Data',
  'Get the AI to write a basic JavaScript fetch call that GETs a list of users from `/api/users` and logs the result, with basic error handling.',
  'fetch(''/api/users'')
  .then(res => {
    if (!res.ok) throw new Error(''Request failed'');
    return res.json();
  })
  .then(data => console.log(data))
  .catch(err => console.error(''Failed to fetch users:'', err));',
  45, 2, 'format'
),
(
  'builder-track', 8, 'Error Message Translator', 'Speak Human',
  'A user is confused by this error: "TypeError: fetch is not a function". Get the AI to explain, in one plain sentence a non-programmer could understand, what''s going wrong.',
  'The code is trying to use a tool called ''fetch'' to get data from the internet, but for some reason that tool isn''t available right now — usually because it''s being used somewhere it doesn''t exist yet, like on an older browser or a server environment that doesn''t have it built in.',
  30, 1, 'reasoning'
),
(
  'builder-track', 9, 'The Commit Message', 'Say What Changed',
  'Change made: fixed a bug where the submit button stayed disabled after a failed form submission. Get the AI to write one clean, conventional git commit message for this.',
  'fix: re-enable submit button after failed form submission',
  15, 1, 'style'
),
(
  'builder-track', 10, 'Simple Schema', 'Shape the Data',
  'Get the AI to design a JSON object representing a user profile with: id, name, email, and an array of favorite colors.',
  '{
  "id": "usr_8f2a",
  "name": "Jordan Lee",
  "email": "jordan@example.com",
  "favoriteColors": ["teal", "coral", "navy"]
}',
  35, 2, 'format'
),
(
  'builder-track', 11, 'Rubber Duck', 'Ask Before You Build',
  'A request comes in: "Add a search feature." Get the AI to ask 3 clarifying questions it would need answered before it could actually build this well.',
  '1. Should the search only match exact text, or also handle typos and partial matches?
2. What should be searchable — just titles, or full content too?
3. Should results update live as the user types, or only after they submit?',
  35, 1, 'reasoning'
),
(
  'builder-track', 12, 'The Changelog', 'Announce It',
  'Feature shipped: users can now export their data as a CSV file. Get the AI to write one changelog entry for this in a typical release-notes style.',
  'Added: Export your data as a CSV file directly from the Settings page.',
  15, 1, 'style'
),
(
  'builder-track', 13, 'Config Basics', 'Set the Variables',
  'Get the AI to write an example `.env` file for a small app that needs a database URL, an API key for a weather service, and a port number.',
  'DATABASE_URL=postgres://user:password@localhost:5432/mydb
WEATHER_API_KEY=your_weather_api_key_here
PORT=3000',
  25, 2, 'format'
),
(
  'builder-track', 14, 'Test Case Sketch', 'What Should It Do?',
  'Function: `isValidPassword(password)` should return true only if the password is at least 8 characters and contains a number. Get the AI to describe one test case for the failing scenario (a short password with no number) — what input, and what expected output.',
  'Input: ''abc'' — a 3-character password with no digits. Expected output: false, since it fails both the minimum-length requirement and the digit requirement.',
  35, 2, 'reasoning'
),
(
  'builder-track', 15, 'The README Opener', 'Hook the Reader',
  'Project: a lightweight note-taking app called Scribbl that syncs across devices instantly. Get the AI to write a 2-sentence opening for its README that would make someone want to try it.',
  'Scribbl is the note-taking app that gets out of your way. Write a thought on your phone, see it on your laptop before you''ve even put your phone down.',
  30, 1, 'style'
),
(
  'builder-track', 16, 'Pick the Stack', 'Choose Your Tools',
  'Project: a simple personal blog with a handful of posts, updated a few times a month, no user accounts needed. Get the AI to recommend a simple tech stack with one sentence of reasoning.',
  'A static site generator like Astro or Hugo with Markdown files for posts, deployed on a free host like Vercel or Netlify — since there''s no need for a database or backend when content is small and doesn''t change often, a static approach is faster, cheaper, and simpler to maintain.',
  40, 2, 'reasoning'
),
(
  'builder-track', 17, 'Scaffold Novice Graduation', 'Lay the Foundation',
  'Project: a small to-do list app with a frontend and a backend API. Get the AI to sketch a basic folder structure (as a text tree) for this project.',
  'todo-app/
├── client/
│   ├── src/
│   │   ├── components/
│   │   └── App.jsx
│   └── package.json
├── server/
│   ├── routes/
│   ├── models/
│   └── index.js
└── README.md',
  30, 2, 'format'
),
(
  'builder-track', 18, 'Systems Thinking I', 'Split the Work',
  'Feature: users can ''like'' a post and see the total like count update instantly. Get the AI to explain what the frontend is responsible for versus what the backend is responsible for.',
  'Frontend: capture the like click, optimistically update the displayed count immediately for a snappy feel, and send a request to the backend. Backend: verify the user hasn''t already liked the post, persist the like in the database, update the stored count, and return the confirmed count so the frontend can reconcile if its optimistic guess was wrong.',
  50, 3, 'reasoning'
),
(
  'builder-track', 19, 'The API Contract', 'Define the Handshake',
  'Endpoint needed: creating a new comment on a post. Get the AI to design the REST endpoint: HTTP method, URL path, request body shape, and success response shape.',
  'POST /api/posts/:postId/comments
Request body: { "authorId": "usr_123", "text": "Great post!" }
Success response (201): { "id": "cmt_456", "postId": "post_789", "authorId": "usr_123", "text": "Great post!", "createdAt": "2026-01-01T12:00:00Z" }',
  50, 3, 'format'
),
(
  'builder-track', 20, 'Debug the Logic', 'Find the Off-By-One',
  'Described bug: a function meant to return the last 3 items of an array is instead sometimes returning 4 items, or crashing on short arrays. The relevant line is: `arr.slice(arr.length - 4, arr.length)`. Get the AI to identify the bug and explain the fix.',
  'The slice starts at `arr.length - 4` instead of `arr.length - 3`, so it grabs one extra item from the front — that''s the 4-items bug. On short arrays, a negative start index doesn''t crash in JavaScript (slice clamps it to 0), but it does return fewer items than expected, which likely looks like a crash-adjacent bug elsewhere consuming the result. Fix: change 4 to 3 — `arr.slice(arr.length - 3, arr.length)`, or more simply `arr.slice(-3)`.',
  55, 3, 'reasoning'
),
(
  'builder-track', 21, 'Refactor Request', 'Clean It Up',
  'Described function: a 40-line function that fetches user data, then checks 6 different nested if-conditions to decide what to display, all inside one giant function. Get the AI to propose a refactor approach — not the full code, just the strategy — in 3-4 sentences.',
  'Split the fetch and the decision logic apart: one function fetches the data, another pure function takes that data and returns which view state applies. Replace the nested if-chain with an early-return guard clause style, or a lookup table mapping conditions to outcomes if the branches are simple enough. This makes each piece independently testable and the control flow easier to follow at a glance.',
  55, 3, 'style'
),
(
  'builder-track', 22, 'The Data Model', 'Design the Table',
  'Feature: an e-commerce order system. Get the AI to design a database table schema (column names and types) for an `orders` table that tracks a customer''s order status and total.',
  'orders
- id: UUID, primary key
- customer_id: UUID, foreign key to customers
- status: TEXT (e.g. ''pending'', ''shipped'', ''delivered'', ''cancelled'')
- total_cents: INTEGER (stored in cents to avoid float rounding issues)
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ',
  45, 3, 'format'
),
(
  'builder-track', 23, 'Edge Case Scout', 'What Could Go Wrong?',
  'Function: `splitBill(total, numPeople)` divides a total evenly among people. Get the AI to list 3 edge cases this function needs to handle.',
  '1. numPeople is 0 — would cause a division-by-zero error.
2. total doesn''t divide evenly (e.g. $10 / 3 people) — need to decide how to handle the leftover cent.
3. Negative numbers for total or numPeople — invalid input that should be rejected rather than silently producing a nonsense result.',
  40, 3, 'reasoning'
),
(
  'builder-track', 24, 'The Pull Request', 'Explain Your Change',
  'Change made: replaced a slow database query that fetched all users then filtered in code, with a query that filters directly in the database. Get the AI to write a short PR description explaining the change and why it matters.',
  'This PR replaces the in-memory filtering of all users with a direct database-level filter, so we''re no longer pulling every row into memory just to discard most of it. On the staging dataset this cut the endpoint''s response time noticeably, and it''ll scale much better as the user table grows. No behavior change from the caller''s perspective — same results, just fetched more efficiently.',
  60, 3, 'style'
),
(
  'builder-track', 25, 'Systems Architect I', 'Draw the Boxes',
  'App: a simple URL shortener — users submit a long URL and get a short code back, and visiting the short code redirects to the original. Get the AI to describe, in words, the 2-3 main components/services involved and how they interact.',
  'Two main pieces: a Web API that handles both creating short codes (writes a mapping to the database) and handling redirects (looks up the code, returns a redirect). A Database stores the mapping between short codes and original URLs. On create: API generates a unique short code, saves the mapping. On visit: API looks up the code, if found redirects to the original URL, if not found returns a 404.',
  55, 3, 'reasoning'
),
(
  'builder-track', 26, 'Error Handling Plan', 'Plan for Failure',
  'Scenario: the app calls a third-party payment API to charge a customer. Get the AI to design a short error-handling strategy: what happens if the call times out, and what happens if it returns a decline.',
  'On timeout: don''t assume the charge failed — the payment might have gone through on their end. Retry a status check (not a new charge) after a short delay, and if still unknown, flag the order as ''pending verification'' rather than either confirming or cancelling it outright. On a decline: surface a clear, specific message to the customer (e.g. ''card declined'') without exposing internal error details, and don''t retry automatically since a decline is usually not a transient failure.',
  60, 3, 'reasoning'
),
(
  'builder-track', 27, 'The Style Guide', 'Set the Standard',
  'Team convention needed for a JavaScript codebase. Get the AI to write 3 specific, enforceable code style rules (not vague advice like ''write clean code'').',
  '1. Use `const` by default; only use `let` when a variable is reassigned, never `var`.
2. Functions that return a boolean must be named with an is/has/can prefix (e.g. `isValid`, `hasPermission`).
3. No function should exceed 40 lines — split it into smaller named functions if it does.',
  40, 3, 'style'
),
(
  'builder-track', 28, 'State Machine Sketch', 'Map the Flow',
  'UI flow: a login form. Get the AI to describe the possible states (e.g. idle, submitting, error, success) and what triggers each transition.',
  'idle → submitting: user clicks Login with valid-looking input.
submitting → error: server responds with invalid credentials or a network failure.
submitting → success: server confirms valid credentials.
error → submitting: user corrects input and resubmits.
success → (redirect away from the form).',
  45, 3, 'format'
),
(
  'builder-track', 29, 'The Migration Plan', 'Change the Schema Safely',
  'Change needed: split a single `full_name` column into `first_name` and `last_name` on a live `users` table with existing data. Get the AI to outline a safe migration plan in ordered steps.',
  '1. Add the new `first_name` and `last_name` columns as nullable, without touching `full_name` yet.
2. Run a backfill script that splits existing `full_name` values into the two new columns.
3. Update the application code to read/write the new columns instead of `full_name`.
4. Once confirmed stable in production, mark the new columns as required if needed.
5. After a safe waiting period, drop the old `full_name` column.',
  55, 3, 'reasoning'
),
(
  'builder-track', 30, 'Performance Detective', 'Find the Slow Part',
  'Scenario: a page that lists 10,000 products feels sluggish when scrolling and when the user types in the filter box. Get the AI to name 2 likely causes and a fix for each.',
  '1. Rendering all 10,000 items in the DOM at once — fix with virtualization (only render the items currently visible in the viewport). 2. Re-filtering the full list on every single keystroke without any delay — fix by debouncing the filter input so it only runs after the user pauses typing.',
  50, 3, 'reasoning'
),
(
  'builder-track', 31, 'The Onboarding Doc', 'Welcome the New Dev',
  'Project: a Node.js/React app called TaskFlow. Get the AI to write a short ''Getting Started'' section (3-4 sentences) for a new developer joining the team.',
  'Welcome to TaskFlow! Clone the repo, run `npm install` in both the `client/` and `server/` folders, then `npm run dev` in each to start the frontend and backend locally. You''ll need a `.env` file in `server/` — copy `.env.example` and fill in the database URL you''ll get from the team lead. Once both are running, the app will be live at localhost:3000.',
  50, 3, 'style'
),
(
  'builder-track', 32, 'Feature Flag Design', 'Roll It Out Safely',
  'Feature: a redesigned checkout flow being tested with 10% of users before a full rollout. Get the AI to design a simple feature flag configuration for this.',
  '{
  "flag": "new-checkout-flow",
  "enabled": true,
  "rolloutPercentage": 10,
  "targeting": "random-by-user-id"
}',
  35, 3, 'format'
),
(
  'builder-track', 33, 'The Code Review', 'Improve, Don''t Just Approve',
  'Described snippet: a function that fetches user data inside a loop, once per user ID, instead of fetching all of them in a single batched request. Get the AI to list 3 specific improvements a reviewer should suggest.',
  '1. Batch the requests into a single call (e.g. `/api/users?ids=1,2,3`) instead of one network round-trip per user — this is likely the biggest performance win. 2. Add error handling for the case where one ID in the batch fails or doesn''t exist. 3. Consider caching results if the same user IDs are likely to be requested again soon.',
  50, 3, 'reasoning'
),
(
  'builder-track', 34, 'Normal Grind Graduation', 'Plan the Whole Thing',
  'Feature: add a ''saved for later'' list to an e-commerce app. Get the AI to produce a compact plan covering: a one-line spec, 3 implementation steps, and 1 real risk to watch for.',
  'Spec: users can save a product to a personal list without buying it, and view/remove items from that list later. Steps: (1) add a `saved_items` table linking user and product, (2) add save/unsave buttons on product pages that hit a simple API, (3) build a ''Saved'' page that lists the user''s saved products. Risk: if a saved product gets discontinued or its price changes, the saved list needs to handle showing stale/updated info gracefully rather than breaking.',
  65, 3, 'reasoning'
),
(
  'builder-track', 35, 'Systems Architect II', 'Design Under Constraints',
  'App: a real-time chat app that needs to support 100,000 concurrent users. Get the AI to describe an architecture (main components and how messages flow) that could handle this scale.',
  'Clients connect via WebSocket to a fleet of stateless connection servers behind a load balancer. A message published by one client is sent to a message broker (like Redis Pub/Sub or Kafka) rather than directly to other clients, since the recipients may be connected to a different server. Each connection server subscribes to the channels relevant to its connected users and pushes incoming messages down the right WebSocket. Message history is persisted separately to a database, decoupled from the real-time delivery path so a database slowdown doesn''t stall live messaging.',
  70, 4, 'reasoning'
),
(
  'builder-track', 36, 'The Race Condition', 'Two Requests, One Bug',
  'Described bug: two rapid clicks on a ''checkout'' button sometimes create two separate orders instead of one, even though the button is supposed to disable after the first click. Get the AI to diagnose the likely race condition and propose a fix.',
  'Disabling the button in the UI happens after the click handler starts running, so a second click that lands in that brief window before the disabled state is applied can still trigger a second submission — this is a classic race between the click event and the state update. The more robust fix isn''t just UI disabling: the backend should also enforce idempotency, e.g. by requiring an idempotency key generated once per checkout attempt, so even if two requests do arrive, only one order is ever created.',
  65, 4, 'reasoning'
),
(
  'builder-track', 37, 'API Versioning Strategy', 'Don''t Break Existing Clients',
  'Scenario: a public API needs a breaking change to how it returns error responses, but thousands of existing integrations depend on the old format. Get the AI to design a versioning strategy that avoids breaking them.',
  'Introduce the change as a new version (e.g. `/v2/...`) rather than modifying `/v1/...` in place, so existing integrations on v1 continue working unchanged. Announce a deprecation timeline for v1 with a generous window (e.g. 6-12 months), include a deprecation warning header on v1 responses during that period, and provide a migration guide documenting exactly what changed in the error format. Only remove v1 after the deprecation window closes and usage has meaningfully dropped.',
  65, 4, 'reasoning'
),
(
  'builder-track', 38, 'The Security Audit', 'Find the Holes',
  'Described auth flow: a login form checks the password directly against a plaintext value stored in the database, and returns a token containing the user''s raw email that''s used to identify them on every future request. Get the AI to identify 2 specific security risks here.',
  '1. Storing passwords in plaintext means anyone with database access (or a database breach) immediately has every user''s real password — passwords must be hashed (e.g. with bcrypt) and only the hash compared, never the raw value stored. 2. Using the raw email as the identifying token is insecure and forgeable — anyone could craft a token with someone else''s email and impersonate them; tokens should instead be signed (e.g. JWT) or be an opaque session ID validated server-side, so they can''t be fabricated.',
  60, 4, 'reasoning'
),
(
  'builder-track', 39, 'Caching Strategy', 'Serve It Fast',
  'Scenario: a product listing page is read very frequently but the underlying data only changes a few times a day. Get the AI to design a caching strategy, including what to do when the data does change.',
  'Cache the product listing response at the edge/CDN or in an in-memory store like Redis with a moderate TTL (e.g. 15-30 minutes), since reads vastly outnumber writes. When a product actually changes, explicitly invalidate the relevant cache entry immediately rather than waiting for the TTL to expire, so updates are reflected right away instead of being delayed by up to the full cache window. This gives fast reads most of the time while still staying accurate on the rare occasions data changes.',
  65, 4, 'reasoning'
),
(
  'builder-track', 40, 'The Incident Report', 'Write the Postmortem',
  'Incident: a database connection pool was exhausted during a traffic spike, causing 20 minutes of 500 errors for about 15% of users. Get the AI to write a short postmortem: what happened, impact, and root cause, in a calm factual tone.',
  'Summary: For approximately 20 minutes, roughly 15% of requests returned 500 errors due to database connection pool exhaustion during an unexpected traffic spike. Impact: Affected users experienced failed page loads and form submissions during the window; no data was lost or corrupted. Root cause: The connection pool''s maximum size was configured for typical load and did not scale with the spike, causing new requests to queue and eventually time out once the pool was fully saturated.',
  60, 4, 'style'
),
(
  'builder-track', 41, 'Scale the System', '1,000 to 1,000,000',
  'App: a social media app currently serving 1,000 users on a single server with one database. Get the AI to describe, in stages, what changes as it needs to scale to 1,000,000 users.',
  'At ~10k users: separate the database onto its own server, add a read replica for read-heavy queries like the feed, and introduce caching for frequently accessed data. At ~100k users: move to multiple stateless application servers behind a load balancer, introduce a CDN for static assets and images, and shard or partition the database if a single instance becomes a bottleneck. At ~1M users: adopt asynchronous processing (queues) for non-instant work like notifications, consider read/write splitting more aggressively, and introduce dedicated caching layers (Redis) in front of hot data paths like the feed and profile views, with careful attention to cache invalidation.',
  75, 5, 'reasoning'
),
(
  'builder-track', 42, 'The Tradeoff Memo', 'Pick a Side, Show Your Work',
  'Decision: choosing between a monolithic backend and a microservices architecture for a small team''s new product. Get the AI to write a short tradeoff memo recommending one, with reasoning.',
  'Recommendation: start with a monolith. For a small team building a new product, a monolith is faster to develop, simpler to deploy, and easier to reason about — there''s one codebase, one deployment, and no network calls between services to debug. Microservices add real operational overhead (service discovery, distributed tracing, more complex deployments) that mostly pays off once you have scale problems a monolith can''t solve, or multiple teams that need to ship independently — neither of which applies yet. The right move is to build the monolith with clean internal boundaries, so it can be split into services later if and when the team or scale actually demands it.',
  70, 4, 'reasoning'
),
(
  'builder-track', 43, 'Zero Downtime Deploy', 'Ship Without Breaking Anything',
  'Scenario: a service currently goes offline for about 2 minutes during every deploy, which is no longer acceptable. Get the AI to design a zero-downtime deployment strategy.',
  'Run multiple instances of the service behind a load balancer, and deploy using a rolling update: bring up a new instance with the updated code, wait for it to pass a health check, then route traffic to it and only then take one old instance out of rotation — repeating until all instances are updated. Ensure database schema changes are backward-compatible during the transition window (old and new code must both work against the schema simultaneously), since old instances may still be serving traffic briefly while new ones roll out.',
  70, 5, 'reasoning'
),
(
  'builder-track', 44, 'The Chaos Test', 'Break It on Purpose',
  'System: a distributed order-processing system with 3 services (orders, payments, inventory) communicating over the network. Get the AI to design one chaos-engineering test: what failure to inject, and what the expected safe behavior should be.',
  'Test: randomly kill the payments service mid-request during an active order, simulating an unexpected crash or network partition. Expected safe behavior: the orders service should detect the failed/timeout response rather than hanging indefinitely, mark the order as ''payment pending'' rather than falsely confirming it, and either retry the payment call or surface a clear failure state to the user — under no circumstance should inventory be deducted for an order whose payment status is unconfirmed.',
  70, 5, 'reasoning'
),
(
  'builder-track', 45, 'Legacy Rescue', 'Migrate Without a Big Bang',
  'Scenario: a large legacy monolith needs to be gradually replaced by newer services, without a risky all-at-once rewrite. Get the AI to describe a strangler-fig migration approach.',
  'Instead of rewriting everything at once, put a routing layer in front of the legacy monolith that can direct specific requests either to the old system or to a new service. Migrate one feature or endpoint at a time: build it as a new service, route just that traffic to it, verify it in production, then move to the next piece. Over time, more and more traffic is ''strangled'' away from the monolith to new services, until eventually the legacy system handles little or nothing and can be safely retired — all while the system stays fully functional and shippable throughout the process.',
  65, 5, 'reasoning'
),
(
  'builder-track', 46, 'The Design Doc', 'Write It Up Properly',
  'Feature: adding real-time collaborative editing (like multiple people editing a document at once) to an existing single-user document editor. Get the AI to write a compact technical design doc: Problem, Proposed Approach, and Key Risks.',
  'Problem: The editor currently supports only one editor at a time; concurrent edits from multiple users would silently overwrite each other''s changes.

Proposed Approach: Adopt an operational transformation or CRDT-based sync model so concurrent edits merge correctly instead of overwriting. Each client sends granular operations (insert/delete at a position) rather than full document snapshots; a central server (or peer sync) applies and broadcasts these operations, transforming them against concurrent operations as needed to preserve intent.

Key Risks: Correctness of the merge algorithm under high-concurrency edge cases is hard to get right and easy to get subtly wrong; network latency could cause visible lag or conflicting cursor positions; and migrating existing documents/data to support the new operation-based model needs a careful backward-compatible rollout.',
  80, 5, 'format'
),
(
  'builder-track', 47, 'Multi-Region Thinking', 'Go Global',
  'App: a currently single-region app is getting real usage from users in Europe and Asia, who experience high latency. Get the AI to describe a multi-region strategy to address this.',
  'Deploy application servers in multiple regions (e.g. US, Europe, Asia) behind a geo-routing layer that sends each user to their nearest region, cutting network latency for reads and writes. For data, either replicate a primary database to regional read replicas (fast local reads, writes still go to the primary region) or, for stronger multi-region write support, adopt a distributed database designed for it — accepting the added complexity of handling replication lag and potential conflict resolution across regions.',
  70, 5, 'reasoning'
),
(
  'builder-track', 48, 'The Postmortem Culture', 'Blame the System, Not the Person',
  'Get the AI to write a short (3-4 sentence) blameless postmortem policy statement for an engineering team, explaining the principle and why it matters.',
  'Postmortems at this company are blameless: we focus on what in our systems and processes allowed a failure to happen, never on which individual ''caused'' it. This matters because people make mistakes inside systems that either catch them or don''t — punishing individuals for that just teaches people to hide problems instead of surfacing them. A blameless culture means engineers can be honest about what went wrong without fear, which is the only way we actually learn and prevent it from happening again.',
  60, 5, 'style'
),
(
  'builder-track', 49, 'Ship Lord''s Checklist', 'Nothing Slips Through',
  'Scenario: a major new version of an app is about to launch to all users. Get the AI to write a pre-launch checklist covering at least 5 concrete items across testing, rollback, and monitoring.',
  '1. All critical user flows (signup, core feature, payment if applicable) have passing end-to-end tests.
2. A tested, documented rollback plan exists and someone knows how to execute it quickly if needed.
3. Monitoring and alerting are in place for error rates and latency, with someone on call during launch.
4. The launch is staged (e.g. canary or percentage rollout) rather than 100% at once, where feasible.
5. Database migrations, if any, have been verified as backward-compatible in case a rollback is needed.',
  70, 5, 'format'
),
(
  'builder-track', 50, 'Grandmaster Architect', 'From Idea to System',
  'Business requirement, one paragraph: "We want a platform where freelancers can list their services, clients can book and pay for them, and both sides can leave reviews afterward." Get the AI to design a complete system covering: core data entities, key API endpoints, how the system scales, and one major failure mode to guard against.',
  'Core entities: Users (with a freelancer/client role flag), Services (owned by a freelancer, with price and description), Bookings (linking a client, freelancer, and service, with a status), and Reviews (linked to a completed booking). Key endpoints: POST /services (create a listing), GET /services (browse/search), POST /bookings (create a booking + trigger payment), POST /bookings/:id/review (leave a review after completion). Scaling: search/browse traffic is the heaviest read path and benefits most from caching and eventually a dedicated search index; bookings and payments are lower-volume but need strong consistency, so they should not share the same relaxed-consistency path as browsing. Major failure mode to guard against: payment succeeding but the booking failing to record (or vice versa) — this must be handled with a transactional or idempotent approach (e.g. only confirm the booking after payment webhook confirmation, with retry-safe handling) so a client is never charged without a confirmed booking, or given a confirmed booking without a completed payment.',
  90, 5, 'reasoning'
);
