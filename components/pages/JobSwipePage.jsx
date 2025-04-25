"use client";

import React, { useState } from "react";
import JobCard from "@/components/cards/JobCard";
import jobsData from "@/components/data/mockAdzunaJobs"; // Mock data array

function JobSwipePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedJobs, setSavedJobs] = useState([]);

  const jobsDataResults = jobsData.results;

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
    if (currentIndex < jobsDataResults.length - 1) {
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
