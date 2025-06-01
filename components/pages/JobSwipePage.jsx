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
      console.log(response);
      const json = await response.json();
      const newJobs = json.results || [];

      console.log("Fetched jobs...");
      setJobsDataResults((prevJobs) => [...prevJobs, ...newJobs]);
      setPageNumber((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Fetch error:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchJobs(pageNumber, filters); // Fetch jobs on component mount
  }, []); // Empty dependency array ensures this runs only once on mount

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
