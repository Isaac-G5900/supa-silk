"use client";

import React from "react";
import CircleIcon from "../buttons/CircleIcon";
import { XIcon, Heart } from "lucide-react";
import "./JobCard.css"; // Assuming you have some styles for the card
import "./JobDetailCard.css"; // Assuming you have some styles for the card
function JobCard({ job, swipeLeft, swipeRight, toggleFlip, flipped }) {
  const formatSalary = (salary) => {
    return salary?.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    // Format as relative time (e.g., "2 days ago")
    const postedDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - postedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 30) {
      return `${diffDays} days ago`;
    } else {
      return postedDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  const formatExactDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
  <div className={`job-card ${flipped ? 'flipped' : ''}`}>
    <div className="card-front">
      <div className="card-content">
        <h2 className="text-2xl font-bold">{job.title}</h2>
        <p className="text-gray-700">{job.company.display_name}</p>
        <div>
          <p className="text-sm text-gray-500">{job.location.display_name}</p>
          <p className="text-sm text-gray-500">
            {formatSalary(job.salary_min)} - {formatSalary(job.salary_max)}
          </p>
        </div>

        <div className="mt-4 text-gray-600 max-w-[95%]">
          {job.description.slice(0, 300)}
          {job.description.length > 300 ? "..." : ""}
        </div>

        {job.redirect_url && (
          <div className="mt-4 flex items-center">
            <a
              className="text-blue-500 hover:underline"
              href={job.redirect_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Apply Now
            </a>
            <button
              className="more-details-button"
              onClick={toggleFlip}
            >
              More Details
            </button>
          </div>
        )}

        <div className="icon-controls flex justify-between">
          <CircleIcon
            icon={<XIcon size={40} />}
            size={50}
            color="#e5e7eb"
            hoverColor="#91a5c2"
            onClick={swipeLeft}
          />
          <CircleIcon
            icon={<Heart size={30} color="#ffffff" fill="#ffffff" />}
            size={50}
            color="#2368db"
            hoverColor="#91a5c2"
            onClick={swipeRight}
          />
        </div>
      </div>
    </div>

    <div className="card-back">
      <button
        className="more-details-button"
        onClick={toggleFlip}
      >
        Back
      </button>
        <div className="card-content">
          <h2 className="text-xl font-bold">More About the Job</h2>
          <p className="text-sm text-gray-500 mt-1">
            Posted {formatDate(job.created)}
          </p>
          <div className="mt-4">
            {job.description}
              </div>
        </div>
    </div>
  </div>
);
}

export default JobCard;
