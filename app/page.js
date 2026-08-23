import { createClient } from "@/lib/supabase/server";
import HomeView from "@/components/HomeView";
import { getBuilderLevel } from "@/lib/progress";

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
  let builderLevel = 0;
  if (user) {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    profile = data;
    builderLevel = await getBuilderLevel(supabase, user.id);
  }

  return <HomeView zones={zones || []} agents={agents || []} profile={profile} builderLevel={builderLevel} />;
}
