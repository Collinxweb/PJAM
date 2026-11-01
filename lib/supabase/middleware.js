import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function updateSession(request) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // Refreshes the auth token if it's expired — required for server components
  // to see an up-to-date session. Wrapped with a timeout and a catch: if
  // Supabase is slow to respond (e.g. waking from a free-tier pause) or
  // unreachable, the whole site must not hang waiting on this — better to
  // serve the page without a refreshed session than to 504 for everyone.
  try {
    await Promise.race([
      supabase.auth.getUser(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("auth refresh timeout")), 5000)),
    ]);
  } catch {
    // Fall through and serve the page anyway — individual pages that need
    // a confirmed session will still check it themselves.
  }

  return response;
}
