"use client";

import React, { useState } from "react";
import JobCard from "@/components/cards/JobCard";
import jobsData from "@/components/data/mockJobs"; // Mock data array

function JobSwipePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedJobs, setSavedJobs] = useState([]);

  const handleSwipeRight = () => {
    const job = jobsData[currentIndex];
    setSavedJobs([...savedJobs, job]);
    goToNext();
  };

  const handleSwipeLeft = () => {
    goToNext();
  };

  const goToNext = () => {
    if (currentIndex < jobsData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert("You’ve reached the end!");
    }
  };

  return (
    <div className="h-auto w-ful flex flex-col items-center justify-center px-4">
      {jobsData[currentIndex] ? (
        <>
          <JobCard
            job={jobsData[currentIndex]}
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
