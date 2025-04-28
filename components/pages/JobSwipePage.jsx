"use client";

import React, { useState } from "react";
import JobCard from "@/components/cards/JobCard";
import jobsData from "@/components/data/mockAdzunaJobs"; // Mock data array

function JobSwipePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedJobs, setSavedJobs] = useState([]);

  const jobsDataResults = jobsData.results;

  async function getData() {
    const page = 1;
    const url = `https://api.adzuna.com/v1/api/jobs/us/search/${page}?app_id=${process.env.NEXT_PUBLIC_ADZUNA_APP_ID}&app_key=${process.env.NEXT_PUBLIC_ADZUNA_APP_KEY}&results_per_page=10&what=software%20engineer&where=remote&content-type=application/json`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.error(error.message);
    }
  }

  console.log("Fetching data...");
  console.log(getData());

  console.log("Jobs Data Results length:", jobsDataResults.length);

  const handleSwipeRight = () => {
    const job = jobsDataResults[currentIndex];
    setSavedJobs([...savedJobs, job]);
    goToNext();
  };

  const handleSwipeLeft = () => {
    goToNext();
  };

  const goToNext = () => {
    if (currentIndex < jobsDataResults.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert("You’ve reached the end!");
    }
  };

  return (
    <div className="h-auto w-ful flex flex-col items-center justify-center px-4">
      {jobsDataResults[currentIndex] ? (
        <>
          <JobCard
            job={jobsDataResults[currentIndex]}
            swipeLeft={handleSwipeLeft}
            swipeRight={handleSwipeRight}
          />
        </>
      ) : (
        <div className="text-xl text-gray-600">No more jobs to show.</div>
      )}
    </div>
  );
}

export default JobSwipePage;
