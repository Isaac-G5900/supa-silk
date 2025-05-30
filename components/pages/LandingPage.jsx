"use client";

import React from "react";
import JobCard from "@/components/cards/JobCard";
import jobsData from "@/components/data/mockJobs";
import Link from "next/link";
import "./LandingPage.css";

function LandingPage() {
  const job = jobsData[0];
  return (
    <div className="landing-page">
      <div className="content-container">
        <h2 className="headline">Find your next job</h2>
        <p className="subheading">
          Silk helps you discover and <br />
          swipe through job opportunities.
        </p>

        <Link href="/job-swipe">
          <button className="primary-button">Get Started</button>
        </Link>
      </div>
      <div className="jobcard-container">
        <JobCard job={job} />
      </div>
    </div>
  );
}

export default LandingPage;