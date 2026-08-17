import { createClient } from "@/lib/supabase/server";
import HomeView from "@/components/HomeView";

export default async function HomePage() {
  const supabase = createClient();

  const { data: zones } = await supabase
    .from("zones")
    .select("*")
    .eq("active", true)
    .order("sort_order")
    .limit(4);

  const { data: agents } = await supabase
    .from("ai_agents")
    .select("*")
    .eq("active", true);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    profile = data;
  }

  return <HomeView zones={zones || []} agents={agents || []} profile={profile} />;
}
