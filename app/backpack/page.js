import { createClient } from "@/lib/supabase/server";
import BackpackView from "@/components/BackpackView";

export default async function BackpackPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: unlocks } = await supabase.from("unlocks").select("*").order("sort_order");

  let unlockedIds = [];
  if (user) {
    const { data: userUnlocks } = await supabase
      .from("user_unlocks")
      .select("unlock_id")
      .eq("user_id", user.id);
    unlockedIds = (userUnlocks || []).map((u) => u.unlock_id);
  }

  return <BackpackView unlocks={unlocks || []} unlockedIds={unlockedIds} signedIn={!!user} />;
}
