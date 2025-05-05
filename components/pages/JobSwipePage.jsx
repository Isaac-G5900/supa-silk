"use client";

import React, { useState, useEffect } from "react";
import JobCard from "@/components/cards/JobCard";
import DropdownFilter from "@/components/buttons/DropdownFilter";

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
      <DropdownFilter onFilterChange={handleFilterChange} />
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
