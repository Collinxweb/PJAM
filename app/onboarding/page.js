import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import OnboardingView from "@/components/OnboardingView";

export default async function OnboardingPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/");

  return <OnboardingView />;
}
