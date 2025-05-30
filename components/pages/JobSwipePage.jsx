"use client";

import React, { useState, useEffect } from "react";
import JobCard from "@/components/cards/JobCard";
import DropdownFilter from "@/components/buttons/DropdownFilter";

import { createClient } from "@/utils/supabase/client";

function JobSwipePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedJobs, setSavedJobs] = useState([]);
  const [jobsDataResults, setJobsDataResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
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

  async function fetchJobs(pageNumber, filters) {
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      // Get viewed job IDs if user is logged in
      let viewedJobIds = [];
      if (session?.user?.id) {
        const { data: viewedJobs } = await supabase
          .from('viewed_jobs')
          .select('jobs(source_id)')
          .eq('user_id', session.user.id);
        
        viewedJobIds = viewedJobs?.map(vj => vj.jobs?.source_id).filter(Boolean) || [];
      }

      const url = `https://gjanycplarxcosrhqtzs.supabase.co/functions/v1/adzuna`;
      const bodyRequest = {
        page: pageNumber,
        ...(filters.jobTitle && { jobTitle: filters.jobTitle }),
        ...(filters.location && { location: filters.location }),
        ...(filters.salaryMin && { salaryMin: filters.salaryMin }),
        ...(filters.salaryMax && { salaryMax: filters.salaryMax }),
        maxDaysOld: filters.maxDaysOld || 30,
      };

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

      //filter out viewed jobs
      newJobs = newJobs.filter(job => !viewedJobIds.includes(job.id));

      //only update state if we have new unviewed jobs
      if (newJobs.length > 0) {
        setJobsDataResults(prevJobs => [...prevJobs, ...newJobs]);
        setPageNumber(prevPage => prevPage + 1);
      } else if (json.results?.length > 0) {
        // If we filtered out all jobs but there were results, fetch next page
        return fetchJobs(pageNumber + 1, filters);
      }
    } catch (error) {
      console.error("Fetch error:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
  fetchJobs(pageNumber, filters);

  // Track when job is viewed
  if (jobsDataResults[currentIndex]) {
    const currentJob = jobsDataResults[currentIndex];
    saveViewedJobToDatabase(currentJob.id, "adzuna").catch((error) =>
      console.error("Error tracking viewed job:", error)
    );
  }
}, [currentIndex, pageNumber]); // Add currentIndex to dependencies

  const handleSwipeRight = async () => {
    const job = jobsDataResults[currentIndex];
    setSavedJobs([...savedJobs, job]);

    // Save to database if user is logged in
    saveJobToDatabase(job.id, "adzuna").catch((error) =>
      console.error("Background save error:", error)
    );
    console.log("Saved job:", job);
    console.log("Saved jobs:", savedJobs);

    goToNext();
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

  //adding to viewed jobs table
  const saveViewedJobToDatabase = async (job_id, source) => {
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user?.id) {
        const userId = session.user.id;

        // Check if job exists in jobs table
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
          console.log("Job not found in database, not saving to viewed jobs...");
          return;
        }

        // Insert into viewed_jobs table
        const { error } = await supabase
          .from("viewed_jobs")
          .insert({
            user_id: userId,
            job_id: existingJob.id
          })
          .single();

        if (error) {
          if (error.code === "23505") {
            // Unique constraint violation - job was already viewed
            console.log("Job was already marked as viewed");
            return;
          }
          console.error("Error saving viewed job:", error);
        } else {
          console.log("Successfully marked job as viewed");
        }
      }
    } catch (error) {
      console.error("Error in saveViewedJobToDatabase:", error.message);
    }
  };

  const handleSwipeLeft = () => {
    goToNext();
  };

  const goToNext = () => {
    if (currentIndex < jobsDataResults.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Fetch more jobs when we reach the end
      setCurrentIndex(currentIndex + 1);
      setLoading(true);
      fetchJobs(pageNumber, filters); // Fetch more jobs
    }
  };

  if (loading) {
    return <div className="text-xl text-gray-600">Loading jobs...</div>;
  }

  if (error) {
    return <div className="text-xl text-red-600">Error: {error}</div>;
  }

  return (
    <div className="h-auto w-ful flex flex-col items-center justify-center px-4">
      <DropdownFilter
        onFilterChange={handleFilterChange}
        setLoading={setLoading}
        currentFilters={filters}
      />
      {jobsDataResults[currentIndex] ? (
        <div className="mt-6">
          <JobCard
            job={jobsDataResults[currentIndex]}
            swipeLeft={handleSwipeLeft}
            swipeRight={handleSwipeRight}
          />
        </div>
      ) : (
        <div className="text-xl text-gray-600">No more jobs to show.</div>
      )}
    </div>
  );
}

export default JobSwipePage;
