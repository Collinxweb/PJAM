import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileView from "@/components/ProfileView";

export default async function ProfilePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/onboarding");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  return <ProfileView profile={profile} />;
}
