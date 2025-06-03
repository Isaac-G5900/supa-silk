import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FaBriefcase, FaBookmark, FaChartLine, FaUserCircle } from "react-icons/fa";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch user stats
  const { data: savedJobs } = await supabase
    .from('saved_jobs')
    .select('count', { count: 'exact' })
    .eq('user_id', user.id);

  const { data: viewedJobs } = await supabase
    .from('viewed_jobs')
    .select('count', { count: 'exact' })
    .eq('user_id', user.id);

  const savedCount = savedJobs?.[0]?.count || 0;
  const viewedCount = viewedJobs?.[0]?.count || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center gap-4">
            <FaUserCircle size="2.25rem" color="#9ca3af" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Welcome back!</h1>
              <p className="text-gray-600 mt-1">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <FaChartLine color="#3b82f6" size="1.25em" />
              <h2 className="text-lg text-gray-600 font-semibold">Your Activity</h2>
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-gray-600">Jobs Viewed: {viewedCount}</p>
              <p className="text-gray-600">Jobs Saved: {savedCount}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <FaBriefcase color="#3b82f6" size="1.25em" />
              <h2 className="text-lg text-gray-600 font-semibold">Quick Tips</h2>
            </div>
            <ul className="mt-4 space-y-2 text-gray-600 list-disc list-inside">
              <li>Swipe right to save jobs you're interested in</li>
              <li>Review saved jobs to track your applications</li>
              <li>Update your preferences for better matches</li>
            </ul>
          </div>
        </div>

        {/* Actions Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/job-swipe" className="block">
            <button className="w-full group relative px-6 py-4 bg-[#3385d1] hover:bg-[#8479fe] text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md">
              <div className="flex items-center gap-3">
                <FaBriefcase size="1.25em" />
                <div className="text-left">
                  <div className="font-semibold text-lg">Find Jobs</div>
                  <div className="text-sm text-gray-100">Discover new opportunities</div>
                </div>
              </div>
            </button>
          </Link>
          
          <Link href="/protected/saved-jobs" className="block">
            <button className="w-full group relative px-6 py-4 bg-[#3385d1] hover:bg-[#8479fe] text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md">
              <div className="flex items-center gap-3">
                <FaBookmark size="1.25em" />
                <div className="text-left">
                  <div className="font-semibold text-lg">Saved Jobs</div>
                  <div className="text-sm text-gray-100">Review your saved positions</div>
                </div>
              </div>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}