"use client";

import React, { useState, useEffect } from "react";
import JobCard from "@/components/cards/JobCard";

function JobSwipePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedJobs, setSavedJobs] = useState([]);
  const [jobsDataResults, setJobsDataResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  async function fetchJobs(pageNumber) {
    const url = `https://gjanycplarxcosrhqtzs.supabase.co/functions/v1/adzuna`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ page: pageNumber }),
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
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
    fetchJobs(pageNumber);
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleSwipeRight = () => {
    const job = jobsDataResults[currentIndex];
    setSavedJobs([...savedJobs, job]);
    goToNext();
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
      fetchJobs(pageNumber);
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
      {jobsDataResults[currentIndex] ? (
        <JobCard
          job={jobsDataResults[currentIndex]}
          swipeLeft={handleSwipeLeft}
          swipeRight={handleSwipeRight}
        />
      ) : (
        <div className="text-xl text-gray-600">No more jobs to show.</div>
      )}
    </div>
  );
}

export default JobSwipePage;
