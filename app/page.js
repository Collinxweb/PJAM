import { createClient } from "@/lib/supabase/server";
import HomeView from "@/components/HomeView";
import { getBuilderLevel } from "@/lib/progress";
import { todayRushDate, dayIndexForDate } from "@/lib/dailyRush";

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
  let dailyRushBrief = null;
  let showDailyRushPopup = false;

  if (user) {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    profile = data;
    builderLevel = await getBuilderLevel(supabase, user.id);

    const rushDate = todayRushDate();
    if (profile?.last_daily_rush_seen_date !== rushDate) {
      const dayIndex = dayIndexForDate(rushDate);
      const { data: challenge } = await supabase
        .from("daily_rush_challenges")
        .select("brief")
        .eq("day_index", dayIndex)
        .single();
      if (challenge) {
        dailyRushBrief = challenge.brief;
        showDailyRushPopup = true;
        // Mark it seen now, in this same request — a page refresh won't
        // re-show it, matching "first time in a day" as a one-shot prompt.
        await supabase.from("profiles").update({ last_daily_rush_seen_date: rushDate }).eq("id", user.id);
      }
    }
  }

  return (
    <HomeView
      zones={zones || []}
      agents={agents || []}
      profile={profile}
      builderLevel={builderLevel}
      showDailyRushPopup={showDailyRushPopup}
      dailyRushBrief={dailyRushBrief}
    />
  );
}
