"use client";
import "./JobSwipePage.css";
import "@/components/cards/JobCard.css";
import React, { useState, useEffect } from "react";
import JobCard from "@/components/cards/JobCard";
import DropdownFilter from "@/components/buttons/DropdownFilter";
//import FilterSection from '"@/components/pages/FilterSection';
import { createClient } from "@/utils/supabase/client";

function JobSwipePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedJobs, setSavedJobs] = useState([]);
  const [jobsDataResults, setJobsDataResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [swipeDirection, setSwipeDirection] = useState("");
  const [flipped, setFlipped] = useState(false);
  const [viewedJobIds, setViewedJobIds] = useState(new Set());
  const [filters, setFilters] = useState({
    jobTitle: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
    maxDaysOld: 30, // Default to 30 days
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // Reset the current index and fetch filtered jobs
    setCurrentIndex(0);
    setJobsDataResults([]);
    fetchJobs(1, newFilters);
  };
  

  // ...existing code...
async function fetchJobs(pageNumber, filters, viewedIds = null) {
  const idsToCheck = viewedIds || viewedJobIds;
  const url = `https://gjanycplarxcosrhqtzs.supabase.co/functions/v1/adzuna`;
  const bodyRequest = {
    page: pageNumber,
    ...(filters.jobTitle && { jobTitle: filters.jobTitle }),
    ...(filters.location && { location: filters.location }),
    ...(filters.salaryMin && { salaryMin: filters.salaryMin }),
    ...(filters.salaryMax && { salaryMax: filters.salaryMax }),
    maxDaysOld: filters.maxDaysOld || 30,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(bodyRequest),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(`API error: ${response.status}`);
    }

    const json = await response.json();
    let newJobs = json.results || [];
    console.log('Total jobs fetched from API:', newJobs.length);

    // Add logging to check job IDs before filtering
    console.log('Sample job IDs from API:', newJobs.slice(0, 3).map(job => job.id));
    console.log('viewedJobIds contains:', [...viewedJobIds]);

    // Filter out jobs that have already been viewed
    newJobs = newJobs.filter(job => {
    const jobSourceId = String(job.id).trim();
    // Log the actual comparison
    console.log(`Comparing job ${jobSourceId} against viewed jobs:`, 
      [...idsToCheck].includes(jobSourceId));
    
    return ![...idsToCheck].includes(jobSourceId);
  });

    console.log('Jobs remaining after filtering viewed jobs:', newJobs.length);

    // If no jobs remain after filtering, fetch the next page
    if (newJobs.length === 0) {
      if (json.results?.length > 0) {
        console.log('All jobs were filtered out, fetching next page...');
        return fetchJobs(pageNumber + 1, filters);
      } else {
        console.log('No more jobs available from API');
      }
    }

    setJobsDataResults(prevJobs => [...prevJobs, ...newJobs]);
    setPageNumber(prevPage => prevPage + 1);
  } catch (error) {
    console.error("Fetch error:", error.message);
    setError(error.message);
  } finally {
    setLoading(false);
  }
}

  const fetchViewedJobs = async () => {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user?.id) {
      console.log('Fetching viewed jobs for user:', session.user.id);
      const { data: viewedJobs, error } = await supabase
        .from('viewed_jobs')
        .select(`
          jobs (
            source_id
          )
        `)
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Error fetching viewed jobs:', error);
        return new Set();
      }

      // Create a Set of source_ids
      const viewedSourceIds = new Set(
        viewedJobs
          .map(vj => vj.jobs?.source_id)
          .filter(Boolean)
      );
      
      console.log('Viewed source IDs:', [...viewedSourceIds]);
      setViewedJobIds(viewedSourceIds);
      return viewedSourceIds; // Return the Set
    }
    return new Set();
  } catch (error) {
    console.error('Error in fetchViewedJobs:', error);
    return new Set();
  }
};

  // Add this new function after saveJobToDatabase function
const saveViewedJobToDatabase = async (job_id, source) => {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user?.id) {
      const userId = session.user.id;
      const jobSourceId = job_id.toString();

      // First check if the job exists in the jobs table
      let { data: existingJob, error: lookupError } = await supabase
        .from("jobs")
        .select("id, source_id")
        .eq("source_id", jobSourceId)
        .eq("source", source)
        .single();

      // If job doesn't exist in jobs table, insert it first
      if (!existingJob) {
        const { data: newJob, error: insertError } = await supabase
          .from("jobs")
          .insert({
            source_id: jobSourceId,
            source: source,
          })
          .select('id, source_id')
          .single();

        if (insertError) {
          console.error("Error inserting job:", insertError);
          return;
        }
        existingJob = newJob;
      }

      // Update local state with source_id
      setViewedJobIds(prev => new Set([...prev, jobSourceId]));

      // Now try to insert into viewed_jobs table
      const { error } = await supabase
        .from("viewed_jobs")
        .upsert({
          user_id: userId,
          job_id: existingJob.id,
          viewed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,job_id',
          update: {
            viewed_at: new Date().toISOString()
          }
        });

      if (error) {
        console.error("Error saving viewed job:", error);
      }
    }
  } catch (error) {
    console.error("Error in saveViewedJobToDatabase:", error.message);
  }
};

// Modify the useEffect hook to track views when currentIndex changes
useEffect(() => {
  if (jobsDataResults[currentIndex]) {
    const currentJob = jobsDataResults[currentIndex];
    saveViewedJobToDatabase(currentJob.id, "adzuna");
  }
}, [currentIndex, jobsDataResults]);

useEffect(() => {
  const initializePage = async () => {
    setLoading(true);
    try {
      console.log('Initializing page...');
      const viewedIds = await fetchViewedJobs(); // Get the viewed IDs
      console.log('Fetching jobs after loading viewed jobs...');
      await fetchJobs(1, filters, viewedIds); // Pass viewedIds to fetchJobs
    } catch (error) {
      console.error('Error initializing page:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  initializePage();
}, []);// Empty dependency array ensures this runs only once on mount

  const handleSwipeRight = async () => {
    setSwipeDirection("swipe-right");
    const job = jobsDataResults[currentIndex];
    setSavedJobs([...savedJobs, job]);

    setTimeout(() => {
      saveJobToDatabase(job.id, "adzuna").catch((error) =>
        console.error("Background save error:", error)
      );
      console.log("Saved job:", job);
      console.log("Saved jobs:", savedJobs);

      goToNext();
      setSwipeDirection("");
    }, 500);
  };

  const saveJobToDatabase = async (job_id, source) => {
    try {
      // Create a Supabase client
      const supabase = createClient();

      // Get the current user session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // Only save if user is logged in
      if (session?.user?.id) {
        const userId = session.user.id;

        

        const { data: existingJob, error: lookupError } = await supabase
          .from("jobs")
          .select("id")
          .eq("source_id", job_id)
          .eq("source", source)
          .single();

        if (lookupError && lookupError.code !== "PGRST116") {
          console.error("Error looking up job:", lookupError);
          return;
        }

        if (!existingJob) {
          console.log("Job not found in database, not saving to user jobs...");
          return;
        }

        const job_table_id = existingJob.id;

        // Insert into saved_jobs table with just user_id and job_id
        const { error } = await supabase.from("saved_jobs").insert({
          user_id: userId,
          job_id: job_table_id,
        });

        if (error) {
          if (error.code === "23505") {
            console.log("You've already saved this job!");
            return;
          }
          console.error("Error saving job:", error);
        } else {
          console.log("Job saved to user saved jobs successfully");
        }
      } else {
        console.log("User not logged in - job saved locally only");
      }
    } catch (error) {
      console.error("Error in saveJobToDatabase:", error.message);
    }
  };

  const handleSwipeLeft = () => {
    setSwipeDirection("swipe-left"); // swipe direction set to left
    setTimeout(() => {
      setFlipped(false);
      goToNext();
      setSwipeDirection(""); // Reset swipe direction after animation
    }, 500); // animation duration
  };

  const toggleFlip = () => {
    setFlipped(!flipped);
  };

  const goToNext = () => {
  if (currentIndex < jobsDataResults.length - 1) {
    setCurrentIndex(currentIndex + 1);
  } else {
    setCurrentIndex(currentIndex + 1);
    setLoading(true);
    fetchJobs(pageNumber, filters, viewedJobIds); // Pass current viewedJobIds
  }
};

  

  if (loading) {
    return <div className="text-xl text-gray-600">Loading jobs...</div>;
  }

  if (error) {
    return <div className="text-xl text-red-600">Error: {error}</div>;
  }

  // Update the return statement in JobSwipePage.jsx
  return (
    <div className="swipe-page-container">
      <div className="filters-sidebar">
        <h2>Filters</h2>
        <DropdownFilter
          onFilterChange={handleFilterChange}
          setLoading={setLoading}
          currentFilters={filters}
        />
      </div>
      
      <div className="main-content">
        {jobsDataResults[currentIndex] ? (
          <div className={`job-card-container ${swipeDirection}`}>
            <JobCard
              job={jobsDataResults[currentIndex]}
              flipped={flipped}
              swipeLeft={handleSwipeLeft}
              swipeRight={handleSwipeRight}
              toggleFlip={toggleFlip}
            />
          </div>
        ) : (
          <div className="text-xl text-gray-600">No more jobs to show.</div>
        )}
      </div>
    </div>
  );
}

export default JobSwipePage;
