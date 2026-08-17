import { createClient } from "@/lib/supabase/server";
import ExploreView from "@/components/ExploreView";

export default async function ExplorePage() {
  const supabase = createClient();

  const { data: zones } = await supabase
    .from("zones")
    .select("*")
    .eq("active", true)
    .order("sort_order");

  return <ExploreView zones={zones || []} />;
}
