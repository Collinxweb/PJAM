import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAgentPlayable } from "@/lib/theme";

export async function POST(request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { agentId } = await request.json();
  if (!agentId) {
    return NextResponse.json({ error: "agentId is required" }, { status: 400 });
  }
  if (!isAgentPlayable(agentId)) {
    return NextResponse.json({ error: "This AI opponent is coming soon." }, { status: 400 });
  }

  const { error } = await supabase
    .from("profiles")
    .update({ selected_agent_id: agentId })
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
