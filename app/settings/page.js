import { createClient } from "@/lib/supabase/server";
import SettingsView from "@/components/SettingsView";

export default async function SettingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <SettingsView signedIn={!!user} />;
}
