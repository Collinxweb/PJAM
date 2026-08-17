import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ZoneDetailView from "@/components/ZoneDetailView";

export default async function ZonePage({ params }) {
  const supabase = createClient();

  const { data: zone } = await supabase.from("zones").select("*").eq("id", params.id).single();
  if (!zone) notFound();

  const { data: challenges } = await supabase
    .from("challenges")
    .select("id, title, brief, difficulty, par_tokens")
    .eq("zone_id", params.id)
    .eq("active", true)
    .order("difficulty");

  return <ZoneDetailView zone={zone} challenges={challenges || []} />;
}
