-- ============================================================
-- PJAM — Migration v10: Integrations Track (50 levels)
-- Run in Supabase SQL Editor, AFTER v2 through v9.
-- ============================================================

insert into public.zones (id, emoji, name, skill, description, sort_order, active) values
  ('integrations-track', '🔌', 'Integrations Track', 'reasoning', '50 levels from First Handshake to Integration Grandmaster — learn to prompt AI for real API integration work: auth, webhooks, rate limits, retries, and failure handling.', 1, true)
on conflict (id) do nothing;

insert into public.challenges (zone_id, level_number, level_name, title, brief, target_output, par_tokens, difficulty, skill) values
(
  'integrations-track', 1, 'First Handshake', 'Say Hello to an API',
  'Get the AI to write a basic fetch call that GETs a joke from a public API at `/api/joke` and logs the result to the console.',
  'fetch(''/api/joke'')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(''Failed to fetch joke:'', err));',
  40, 1, 'format'
),
(
  'integrations-track', 2, 'Reading the Docs', 'What Does This Endpoint Do?',
  'Docs snippet: "GET /users/:id/orders — returns the 20 most recent orders for a user, newest first." Get the AI to explain in plain English what calling this endpoint with id=42 would return.',
  'Calling GET /users/42/orders would return a list of up to 20 orders belonging to user 42, sorted so the most recently placed order appears first in the list.',
  35, 1, 'reasoning'
),
(
  'integrations-track', 3, 'The Query String', 'Build the URL',
  'Get the AI to construct a URL that calls `/api/search` with query parameters for `q=sneakers` and `limit=10`.',
  '/api/search?q=sneakers&limit=10',
  25, 1, 'format'
),
(
  'integrations-track', 4, 'Header Basics', 'What''s This Header For?',
  'Get the AI to explain, in one sentence, what the header `Authorization: Bearer abc123` tells the API receiving the request.',
  'It tells the API that this request is being made on behalf of an authenticated user or app, identified by the token ''abc123'', which the server can check to decide whether to allow the request.',
  30, 1, 'reasoning'
),
(
  'integrations-track', 5, 'JSON In, JSON Out', 'Describe the Shape',
  'API description: calling GET /weather?city=Lagos returns the current temperature and condition. Get the AI to design what the JSON response might look like.',
  '{
  "city": "Lagos",
  "temperatureCelsius": 29,
  "condition": "Partly Cloudy"
}',
  30, 1, 'format'
),
(
  'integrations-track', 6, 'The API Key Secret', 'Where Does It Live?',
  'Get the AI to explain, in 1-2 sentences, why an API key should be stored in an environment variable instead of directly in the source code.',
  'Storing an API key directly in source code means it gets committed to version control and could leak if the repo is ever made public or breached. An environment variable keeps the key out of the codebase entirely, so it can be rotated or kept secret without touching the code.',
  40, 1, 'reasoning'
),
(
  'integrations-track', 7, 'Status Code Sleuth', '404 vs 500',
  'Get the AI to explain, in one sentence each, the difference between a 404 and a 500 response from an API.',
  'A 404 means the specific resource you asked for doesn''t exist (e.g. a wrong ID or URL), while a 500 means something went wrong on the server''s own side while trying to process an otherwise valid request.',
  35, 1, 'reasoning'
),
(
  'integrations-track', 8, 'POST vs GET', 'Pick the Right Verb',
  'Get the AI to explain, in one sentence, why creating a new comment should use POST rather than GET.',
  'POST is used because creating a comment changes data on the server (it''s not just reading), and GET requests are meant to be safe and repeatable without side effects — using GET to create something could also cause it to be accidentally triggered by browsers prefetching or caching the URL.',
  35, 1, 'reasoning'
),
(
  'integrations-track', 9, 'The Webhook Basics', 'What''s a Webhook?',
  'Get the AI to explain, in 2 sentences a beginner would understand, what a webhook is.',
  'A webhook is a way for one service to notify another the moment something happens, instead of the second service having to keep asking ''did anything happen yet?'' The first service sends an HTTP request to a URL you provide whenever the event occurs, with details about what happened.',
  40, 1, 'reasoning'
),
(
  'integrations-track', 10, 'Rate Limit 101', 'Too Many Requests',
  'Get the AI to explain what a `429 Too Many Requests` response means and what a client should generally do when it receives one.',
  'A 429 means the client has sent too many requests in a given time window and the API is temporarily refusing more. The client should back off and retry after a delay, ideally using the `Retry-After` header if the API provides one, rather than immediately retrying.',
  40, 1, 'reasoning'
),
(
  'integrations-track', 11, 'The Response Shape', 'Design the Payload',
  'API: creating a new order. Get the AI to describe the JSON shape of a successful response, including an order ID and status.',
  '{
  "orderId": "ord_9f21",
  "status": "confirmed",
  "createdAt": "2026-01-01T12:00:00Z"
}',
  35, 2, 'format'
),
(
  'integrations-track', 12, 'Error Body Design', 'Shape the Failure',
  'Get the AI to design a simple, consistent JSON shape an API should return when a request fails validation, including a machine-readable code and a human-readable message.',
  '{
  "error": {
    "code": "invalid_email",
    "message": "The email address provided is not valid."
  }
}',
  35, 2, 'format'
),
(
  'integrations-track', 13, 'The .env Secret', 'Set It Up Right',
  'Get the AI to write an example `.env` entry for storing a third-party API key called STRIPE_API_KEY.',
  'STRIPE_API_KEY=sk_test_your_key_here',
  20, 1, 'format'
),
(
  'integrations-track', 14, 'Timeout Basics', 'What If It Hangs?',
  'Get the AI to explain what should happen if a call to a third-party API takes more than 10 seconds to respond, from the calling app''s perspective.',
  'The app should give up waiting after a set timeout (e.g. 10 seconds) rather than hanging indefinitely, and treat it as a failure — showing the user an error or fallback rather than leaving the request pending forever, since a hung request can block resources and degrade the whole app.',
  40, 2, 'reasoning'
),
(
  'integrations-track', 15, 'The Retry Idea', 'Try Again, Briefly',
  'Get the AI to describe, in 2-3 sentences, a simple retry strategy for a failed API call that might just be a temporary network blip.',
  'Retry the request a small number of times (e.g. up to 3), waiting a short, increasing delay between attempts (like 1s, then 2s, then 4s) rather than retrying instantly. If it still fails after those attempts, stop retrying and surface the failure rather than looping forever.',
  40, 2, 'reasoning'
),
(
  'integrations-track', 16, 'Mock vs Real', 'Don''t Call the Real Thing Yet',
  'Get the AI to explain, in one sentence, why developers often use a mocked version of a third-party API during testing instead of calling the real one.',
  'Mocking avoids making real network calls during tests, which keeps tests fast, free of rate limits or costs, and reliable even if the real API is down or its data changes.',
  35, 1, 'reasoning'
),
(
  'integrations-track', 17, 'First Integration Graduation', 'Put It Together',
  'Project: display today''s weather on a page using a public weather API. Get the AI to list the 4 basic steps to wire this up.',
  '1. Sign up for the weather API and get an API key.
2. Store the key in an environment variable, not in the code.
3. Make a request to the API''s current-weather endpoint for the user''s city.
4. Parse the JSON response and display the temperature and condition on the page.',
  45, 2, 'format'
),
(
  'integrations-track', 18, 'OAuth Handshake', 'The Authorization Dance',
  'Get the AI to describe, step by step, the basic flow of OAuth2''s authorization code grant for letting a user log in with a third-party account.',
  '1. The app redirects the user to the provider''s login/consent screen. 2. The user logs in and approves access. 3. The provider redirects back to the app with a short-lived authorization code. 4. The app exchanges that code (server-side, with its client secret) for an access token. 5. The app uses the access token to make authenticated requests on the user''s behalf.',
  55, 3, 'reasoning'
),
(
  'integrations-track', 19, 'The Webhook Receiver', 'Build the Listener',
  'Get the AI to design an endpoint that receives a webhook from a payment provider and verifies it''s genuinely from that provider before processing it.',
  'POST /webhooks/payment-provider — reads the raw request body and the signature header the provider sends, recomputes the expected signature using the shared webhook secret, and compares it to the received signature. Only if they match does it parse the payload and process the event; otherwise it returns a 401 and discards the request.',
  55, 3, 'format'
),
(
  'integrations-track', 20, 'Pagination Plan', 'Get Every Page',
  'API returns 50 items per page with a `nextCursor` field. Get the AI to describe how to fetch all items across every page.',
  'Make the first request without a cursor, then check the response for a `nextCursor` value. If present, make another request passing that cursor, repeating this loop and collecting results each time, until a response comes back with no `nextCursor` (or an empty one), which signals there are no more pages left.',
  45, 3, 'reasoning'
),
(
  'integrations-track', 21, 'Idempotency Key', 'Don''t Charge Twice',
  'Scenario: a payment API call might get retried due to a network blip, but retrying a real charge could double-bill the customer. Get the AI to explain how an idempotency key solves this.',
  'The client generates a unique idempotency key once per logical payment attempt and sends it with the request. If the same key is sent again (e.g. due to a retry), the payment provider recognizes it''s a duplicate of a request it already processed and returns the original result instead of charging the customer a second time.',
  50, 3, 'reasoning'
),
(
  'integrations-track', 22, 'The Circuit Breaker', 'Stop Hammering a Down Service',
  'Get the AI to explain the circuit breaker pattern for calling a flaky third-party API, including what happens when the breaker is ''open''.',
  'A circuit breaker tracks recent failures when calling the third-party API; once failures cross a threshold, it ''opens'' and stops sending real requests for a cooldown period, immediately failing fast instead. This protects both your system (from piling up slow/failed calls) and the struggling third-party service, giving it room to recover. After the cooldown, the breaker allows a trial request through to see if the service has recovered before fully closing again.',
  55, 3, 'reasoning'
),
(
  'integrations-track', 23, 'Rate Limit Strategy', 'Stay Under the Limit',
  'Third-party API allows 100 requests per minute. Get the AI to design a client-side strategy to avoid hitting that limit.',
  'Track how many requests have been made in the current rolling minute window client-side, and if approaching the limit (e.g. 90+), delay or queue further requests until the window resets. Combine this with respecting any rate-limit headers the API returns (like remaining-requests count), and implement exponential backoff if a 429 does occur despite the safeguard.',
  50, 3, 'reasoning'
),
(
  'integrations-track', 24, 'SDK vs Raw Calls', 'Pick Your Tool',
  'Decision: integrating with a payment provider that offers an official SDK. Get the AI to write a short tradeoff memo on using the SDK versus making raw HTTP calls.',
  'Recommendation: use the official SDK. It handles authentication, retries, and edge cases the provider already knows about, and gets updated when their API changes — writing raw HTTP calls means re-solving problems the SDK has already solved, and re-discovering breaking changes the hard way. The only reason to skip it is if the SDK doesn''t support your language/runtime, or if you specifically need functionality it doesn''t expose.',
  55, 3, 'reasoning'
),
(
  'integrations-track', 25, 'The Webhook Retry', 'When Processing Fails',
  'Scenario: your server receives a webhook successfully but then fails to process it internally (e.g. a database write fails). Get the AI to describe how this should be handled.',
  'Acknowledge receipt of the webhook to the provider quickly (return a 2xx) even if internal processing hasn''t finished, then process it asynchronously — this avoids the provider''s own retry logic firing due to your slow response. If internal processing then fails, queue the event for a retry with backoff on your own side, separate from the provider''s delivery retries, and alert if it keeps failing after several attempts.',
  55, 3, 'reasoning'
),
(
  'integrations-track', 26, 'Auth Token Refresh', 'Don''t Let It Expire',
  'Access tokens expire after 1 hour and come with a refresh token. Get the AI to design the logic for keeping a valid token available.',
  'Before making an API call, check if the current access token is expired or close to expiring (e.g. within 5 minutes). If so, use the refresh token to request a new access token from the provider first, store the new token, and then proceed with the original API call using the fresh token.',
  50, 3, 'format'
),
(
  'integrations-track', 27, 'The API Versioning Client', 'Handle Their Changes',
  'A third-party API you depend on announces it''s deprecating v1 in favor of v2 with some breaking changes. Get the AI to describe how your client code should handle this transition.',
  'Read the v2 migration guide and identify exactly which response fields or behaviors changed. Update the integration to target v2, ideally behind a flag so it can be tested in staging before full rollout, and keep the v1 code path available briefly as a fallback in case v2 has unexpected issues, removing it only once v2 is confirmed stable in production.',
  55, 3, 'reasoning'
),
(
  'integrations-track', 28, 'Multi-Provider Abstraction', 'Don''t Lock In',
  'Feature: the app can send SMS via either of two providers, Twilio or Vonage. Get the AI to design a simple interface that abstracts sending an SMS regardless of which provider is active.',
  'interface SmsProvider {
  send(to: string, message: string): Promise<{ success: boolean, messageId?: string }>
}

// Both TwilioSmsProvider and VonageSmsProvider implement this same interface,
// translating the generic send() call into each provider''s specific API shape internally.
// The rest of the app calls send() without knowing or caring which provider is behind it.',
  55, 3, 'format'
),
(
  'integrations-track', 29, 'The Sync Job', 'Pull Data on a Schedule',
  'Feature: pull new customer records from a CRM''s API every 15 minutes and store them locally. Get the AI to design the sync job''s basic logic.',
  'Every 15 minutes, the job requests records from the CRM API updated since the last successful sync''s timestamp (not all records every time). It stores/updates matching local records, and only advances the ''last synced at'' timestamp after successfully processing the batch — so a failed run doesn''t lose track of what''s actually been synced.',
  55, 3, 'format'
),
(
  'integrations-track', 30, 'Webhook Signature Verify', 'Prove It''s Really Them',
  'Get the AI to describe exactly how to verify an HMAC-SHA256 webhook signature sent in a `X-Signature` header.',
  'Take the raw request body (before any JSON parsing) and compute an HMAC-SHA256 hash of it using the shared webhook secret as the key. Compare this computed hash to the value in the `X-Signature` header using a constant-time comparison (to avoid timing attacks) — if they match, the request is genuinely from the provider and hasn''t been tampered with; if not, reject it.',
  55, 3, 'format'
),
(
  'integrations-track', 31, 'The Fallback Provider', 'When Plan A Is Down',
  'Feature: sending transactional emails via a primary provider, with a backup provider in case the primary is down. Get the AI to design the fallback logic.',
  'Attempt to send via the primary provider first, with a short timeout. If it fails or times out, immediately attempt the same send via the backup provider rather than giving up. Log which provider actually handled it either way, and consider alerting if the primary has failed enough times recently to suggest an ongoing outage rather than a one-off blip.',
  55, 4, 'reasoning'
),
(
  'integrations-track', 32, 'GraphQL vs REST', 'Choose the Integration Style',
  'Decision: a partner offers both a GraphQL and a REST API for the same data. Get the AI to write a short tradeoff memo on which to integrate with.',
  'If the app only needs a few specific fields from a large or deeply nested resource, GraphQL likely reduces over-fetching and the number of round trips needed. If the integration is simple, mostly needs full resources as-is, and the team is more familiar with REST conventions and tooling, REST is usually the lower-friction choice. For a small integration with modest needs, REST''s simplicity often wins unless GraphQL''s flexibility solves a real, specific problem.',
  55, 3, 'reasoning'
),
(
  'integrations-track', 33, 'The API Client Wrapper', 'Don''t Call It Raw Everywhere',
  'Get the AI to describe why wrapping a third-party API in your own internal module (rather than calling it directly all over the codebase) is a good practice.',
  'A wrapper module centralizes auth, error handling, retries, and request shaping in one place, so the rest of the app just calls simple internal functions like `getWeather(city)` without knowing the underlying API''s quirks. If the provider changes their API or you switch providers entirely, you only need to update the wrapper, not every call site scattered across the codebase.',
  50, 3, 'format'
),
(
  'integrations-track', 34, 'Normal Grind Graduation', 'Plan the Full Integration',
  'Feature: integrate a shipping-rates API into a checkout flow. Get the AI to produce a compact plan: one-line spec, 3 implementation steps, and 1 real risk to watch for.',
  'Spec: at checkout, call the shipping API with the cart''s weight and destination to show the customer real shipping cost options before they pay. Steps: (1) build a wrapper function that calls the rates endpoint and maps their response to your own rate objects, (2) call it when the customer enters their address, showing a loading state, (3) cache rates briefly per address/cart combo to avoid re-calling on every minor page interaction. Risk: if the shipping API is slow or down at checkout, it could block customers from completing a purchase — need a timeout and a sensible fallback (e.g. a flat estimated rate) rather than letting checkout hang.',
  65, 3, 'reasoning'
),
(
  'integrations-track', 35, 'Multi-Region API Failover', 'When a Region Goes Down',
  'A third-party API offers endpoints in multiple regions (US, EU) for redundancy. Get the AI to design a failover strategy for calling it reliably.',
  'Attempt the call against the primary region first, with a reasonably short timeout. On failure or timeout, immediately retry against the secondary region rather than failing the whole request outright. Track which region actually served each recent request, and if the primary is failing repeatedly, temporarily prefer the secondary directly rather than always trying-then-failing over first, to reduce latency during an ongoing regional outage.',
  65, 4, 'reasoning'
),
(
  'integrations-track', 36, 'The Distributed Idempotency', 'Idempotency at Scale',
  'Scenario: multiple application servers might independently retry the same logical payment request due to a load balancer timeout, not just a single client retrying. Get the AI to describe how idempotency needs to work here.',
  'The idempotency key must be stored and checked in a shared, centralized store (like a database or distributed cache) that all application servers can see — not just in memory on one server — so that no matter which server handles a retried request, it recognizes the key has already been processed and returns the original result instead of creating a duplicate charge.',
  65, 4, 'reasoning'
),
(
  'integrations-track', 37, 'Webhook Ordering', 'Events Out of Order',
  'Scenario: your webhook receiver sometimes gets an ''order.shipped'' event before the ''order.paid'' event for the same order, due to network timing. Get the AI to describe how to handle this safely.',
  'Design event processing to be order-independent where possible: check the actual current state of the order (e.g. via the provider''s API or your own stored state) rather than assuming events arrive in a strict logical sequence. If ''order.shipped'' arrives before ''order.paid'' is recorded, either hold/queue it briefly and reconcile once ''order.paid'' arrives, or process it but flag the order for verification, rather than assuming webhook delivery order matches the real sequence of events.',
  65, 4, 'reasoning'
),
(
  'integrations-track', 38, 'The API Gateway', 'One Front Door',
  'Scenario: an app calls 6 different external APIs (payments, email, maps, etc.) directly from various parts of the codebase. Get the AI to describe the benefit of introducing an internal API gateway layer in front of them.',
  'A gateway layer centralizes cross-cutting concerns — auth to each external service, retries, rate limiting, logging, and error normalization — in one place instead of duplicating that logic everywhere each API is called. It also means internal code talks to one consistent internal interface regardless of which external provider is behind it, making it far easier to swap a provider or add monitoring without touching every call site.',
  65, 4, 'reasoning'
),
(
  'integrations-track', 39, 'Secrets Rotation', 'Rotate Without Downtime',
  'Scenario: an API key needs to be rotated for security reasons, but the service using it can''t go down during the swap. Get the AI to design a zero-downtime rotation strategy.',
  'Generate a new API key with the provider while the old one is still active (most providers allow multiple valid keys simultaneously). Deploy the new key to the application via a config update, verify it works in production, and only then revoke the old key with the provider — never revoke the old key before confirming the new one is live and working, or there will be a window with no valid credential at all.',
  60, 4, 'reasoning'
),
(
  'integrations-track', 40, 'The Integration Test Suite', 'Test Without Hitting Real APIs',
  'Get the AI to describe a testing strategy for code that integrates with a third-party payment API, without making real API calls or real charges during automated tests.',
  'Use a recorded-response or mock server approach: capture real (sanitized) example responses from the provider once, then replay them in tests instead of hitting the live API — tools like a local mock server or request-recording libraries handle this well. For a smaller number of true end-to-end checks, use the provider''s official sandbox/test-mode environment (most payment providers offer one) rather than their production API, so nothing real is ever charged.',
  65, 4, 'reasoning'
),
(
  'integrations-track', 41, 'Scale the Integrations', '1 API to 50',
  'App: currently integrates with 1 external API directly. Get the AI to describe, in stages, what changes as it grows to integrating with 50 different external APIs.',
  'At a handful of APIs: each integration can still reasonably live as its own small wrapper module. At ~10-15: patterns start repeating (auth, retries, rate limiting) — worth extracting a shared internal library so every new integration doesn''t reinvent those pieces. At ~50: introduce a proper internal gateway/abstraction layer with consistent logging, monitoring, and failure isolation across all of them, plus a standard process/checklist for onboarding a new integration, since at this scale ad-hoc, one-off integrations become an operational risk — one badly-behaved API can otherwise take down unrelated parts of the system if failures aren''t isolated per-integration.',
  70, 5, 'reasoning'
),
(
  'integrations-track', 42, 'The Contract Testing', 'Catch Breaking Changes Early',
  'Scenario: a partner''s API occasionally changes its response shape without warning, breaking your integration in production. Get the AI to describe how contract testing could catch this earlier.',
  'Contract testing defines an explicit, versioned expectation of what the partner''s API response shape should look like, and runs an automated check against the real (or sandboxed) API periodically or in CI to confirm it still matches. If the partner changes something that breaks the contract, the test fails immediately in a controlled environment, surfacing the problem before it silently breaks production traffic.',
  60, 4, 'reasoning'
),
(
  'integrations-track', 43, 'Breaking Change Response', 'They Changed It on You',
  'Scenario: a partner API announces a breaking change going live in 48 hours, with limited notice. Get the AI to describe an immediate response plan.',
  'Immediately read the changelog to identify exactly what''s breaking, and check whether the partner offers a way to opt into the old behavior temporarily (a version pin or flag) to buy time. In parallel, patch the integration code for the new behavior and deploy it ahead of their 48-hour deadline if at all possible, testing against their sandbox if available. If it truly can''t be fixed in time, prepare a temporary degraded-but-functional fallback (e.g. disabling just that specific feature) rather than letting the whole integration fail unnoticed when the change goes live.',
  65, 4, 'reasoning'
),
(
  'integrations-track', 44, 'The Chaos Test for APIs', 'Simulate an Outage',
  'System depends on a critical third-party API for checkout. Get the AI to design one chaos test simulating that API being completely unreachable, and the expected safe behavior.',
  'Test: block or fail all outbound requests to the third-party API''s domain during a checkout flow test run. Expected safe behavior: the app should detect the failures (via timeout/connection error) quickly rather than hanging, and either serve a clear ''temporarily unavailable, try again shortly'' message or fall back to a degraded checkout path if one exists — under no circumstance should the app silently proceed as if the call succeeded, or crash the entire checkout flow for unrelated reasons.',
  65, 5, 'reasoning'
),
(
  'integrations-track', 45, 'Legacy API Migration', 'Retire the Old Integration Gradually',
  'Scenario: migrating from an old SOAP-based partner API to their new REST API, without a risky all-at-once cutover. Get the AI to describe a strangler-fig style migration approach.',
  'Build the new REST-based integration alongside the existing SOAP one behind a shared internal interface, so calling code doesn''t know or care which is used. Migrate traffic gradually — start with a small percentage or a low-risk subset of calls routed to the new REST integration, monitor for issues, and increase the share over time. Only remove the old SOAP integration once the REST path has handled full production traffic reliably for a meaningful period.',
  65, 5, 'reasoning'
),
(
  'integrations-track', 46, 'The Integration Design Doc', 'Write It Up Properly',
  'Feature: integrating a new payments provider into an existing checkout system. Get the AI to write a compact technical design doc: Problem, Proposed Approach, and Key Risks.',
  'Problem: The current checkout only supports one payment provider, limiting payment methods available in certain regions and creating a single point of failure.

Proposed Approach: Introduce a payment-provider abstraction interface so checkout code calls a generic `charge()` method rather than the new provider''s API directly. Implement the new provider behind this interface, including auth, webhook handling for async payment confirmation, and idempotency keys to prevent double-charging on retries.

Key Risks: Handling payment confirmation timing differs between providers (some confirm synchronously, some only via webhook) and must be normalized carefully; test coverage must include webhook failure/retry scenarios, not just the happy path; and rollout should be gradual (e.g. feature-flagged by region) rather than switching all traffic at once, in case of unexpected issues with the new provider''s behavior in production.',
  80, 5, 'format'
),
(
  'integrations-track', 47, 'Multi-Tenant API Keys', 'Every Customer, Their Own Key',
  'Scenario: a multi-tenant SaaS lets each customer connect their own account to a third-party API (e.g. their own CRM). Get the AI to describe how API key/credential management should work.',
  'Each tenant''s credentials must be stored separately, encrypted at rest, and never mixed up or accessible across tenants — a bug that used tenant A''s key for tenant B''s request would be a serious security incident. Credentials should be fetched per-request based on which tenant is making the call, ideally through a dedicated secrets-management layer rather than plain database columns, and access to view/manage a tenant''s own credentials should be restricted to that tenant and authorized internal systems only.',
  65, 5, 'reasoning'
),
(
  'integrations-track', 48, 'The Postmortem: API Outage', 'When Their API Silently Changed',
  'Incident: a partner API silently changed how it formats a date field, causing your system to misparse dates for 3 hours before anyone noticed. Get the AI to write a short postmortem: summary, impact, and root cause.',
  'Summary: For approximately 3 hours, a partner API began returning date fields in a different format without any announced change, causing our parser to misread them. Impact: Orders processed during the window had incorrect delivery date estimates shown to customers; no orders were lost, but customer-facing dates were wrong. Root cause: Our integration assumed the partner''s date format was fixed and didn''t validate the shape of incoming data, so a silent upstream format change went undetected until customer reports surfaced it — highlighting a gap in monitoring for unexpected changes in third-party response shapes.',
  60, 5, 'style'
),
(
  'integrations-track', 49, 'Integration Launch Checklist', 'Ship the New Integration Safely',
  'Scenario: a new third-party integration is about to go live for all users. Get the AI to write a pre-launch checklist covering at least 5 concrete items.',
  '1. Error handling and timeouts are in place for every call to the new API, with no case where a slow/failed call can hang the app indefinitely.
2. Webhook signature verification (if applicable) is implemented and tested, not just assumed to work.
3. Rate limits from the provider are known and respected, with backoff logic in place.
4. A fallback or clear user-facing error exists for when the integration is unavailable.
5. Monitoring/alerting is in place specifically for this integration''s error rate and latency, separate from generic app-wide monitoring.',
  70, 5, 'format'
),
(
  'integrations-track', 50, 'Integration Grandmaster', 'The Full Integration Layer',
  'Platform requirement: connect to 5 external APIs — payments, email, SMS, maps, and analytics. Get the AI to design the integration layer covering: architecture, auth handling, error handling, and one major failure-isolation principle.',
  'Architecture: each external API gets its own thin wrapper module behind a shared internal interface pattern (e.g. a common retry/timeout/logging wrapper), so integrations are consistent without being identical. Auth handling: credentials for each provider are stored centrally (e.g. a secrets manager), fetched per-integration, and refreshed automatically where tokens expire (e.g. OAuth-based providers). Error handling: every integration has its own timeout and retry policy suited to that provider''s behavior, with failures surfaced through a consistent internal error shape regardless of which provider failed. Failure isolation principle: a failure in one integration (e.g. analytics being down) must never block or crash a request that doesn''t strictly depend on it — for example, a failed analytics call should be logged and ignored, not allowed to fail the checkout request it was merely tracking, since not every integration is equally critical to the core flow.',
  90, 5, 'reasoning'
);
