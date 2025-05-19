import SavedJobsList from "@/components/pages/SavedJobsList";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function SavedJobsPage() {
  // 1) build server‐side supabase client
  const supabase = await createClient();

  // 2) fetch the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError; // or handle it somehow
  }
  if (!user) {
    return redirect("/sign-in"); // protect the page
  }

  // 3) fetch that user’s saved jobs by their ID
  const { data: jobsData = [], error: jobsError } = await supabase
    .from("saved_jobs")
    .select("*")
    .eq("user_id", user.id);

  if (jobsError) {
    throw jobsError;
  }

  const jobs = jobsData ?? [];

  // 4) render client component with the data
  return <SavedJobsList jobs={jobs} />;
}
