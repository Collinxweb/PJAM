import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const { displayName, username, bio, avatarUrl } = await request.json();

  if (username && !/^[a-zA-Z0-9_-]{3,20}$/.test(username)) {
    return NextResponse.json(
      { error: "Username must be 3-20 characters: letters, numbers, - or _ only." },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: displayName || null,
      username: username || null,
      bio: bio || null,
      avatar_url: avatarUrl || null,
    })
    .eq("id", user.id);

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "That username is already taken." }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
