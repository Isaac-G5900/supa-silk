import SavedJobsList from "@/components/pages/SavedJobsList";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

// Define the Job type here since the import is causing issues
type Job = {
  id: string;
  source_id?: string;
  title: string;
  company_name?: string;
  location?: string;
  description?: string;
  url?: string;
  source?: string;
  salary_min?: number;
  salary_max?: number;
  created_at?: string;
  saved_at?: string;
};

// Define the type for the Supabase response structure
type SavedJobRecord = {
  saved_at: string | null;
  jobs: {
    // This is a single job object, not an array
    id: string;
    source_id: string | null;
    title: string;
    company_name: string | null;
    location: string | null;
    description: string | null;
    url: string | null;
    source: string | null;
    salary_min: number | null;
    salary_max: number | null;
    created_at: string | null;
  };
};

export default async function SavedJobsPage() {
  // 1) build server‐side supabase client
  const supabase = await createClient();

  // 2) fetch the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }
  if (!user) {
    return redirect("/sign-in");
  }

  // 3) fetch that user's saved jobs by their ID with all job details
  const { data, error: jobsError } = await supabase
    .from("saved_jobs")
    .select(
      `
      saved_at,
      jobs:job_id (
        id, 
        source_id, 
        title, 
        company_name, 
        location, 
        description, 
        url, 
        source, 
        salary_min, 
        salary_max, 
        created_at
      )
    `
    )
    .eq("user_id", user.id);

  if (jobsError) {
    throw jobsError;
  }

  // First cast to unknown, then to our expected type to avoid TypeScript errors
  const jobsData = data as unknown as SavedJobRecord[];

  // Transform the nested data structure to a flat array of jobs with saved_at
  const jobs: Job[] = (jobsData || []).map((item) => {
    return {
      id: item.jobs.id,
      source_id: item.jobs.source_id || undefined,
      title: item.jobs.title,
      company_name: item.jobs.company_name || undefined,
      location: item.jobs.location || undefined,
      description: item.jobs.description || undefined,
      url: item.jobs.url || undefined,
      source: item.jobs.source || undefined,
      salary_min: item.jobs.salary_min || undefined,
      salary_max: item.jobs.salary_max || undefined,
      created_at: item.jobs.created_at || undefined,
      saved_at: item.saved_at || undefined,
    };
  });

  // 4) render client component with the data
  return <SavedJobsList jobs={jobs} />;
}
