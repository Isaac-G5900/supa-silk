"use client";

import React from "react";
import CircleIcon from "../buttons/CircleIcon";
import { XIcon, Heart } from "lucide-react";
function JobCard({ job, swipeLeft, swipeRight }) {
  return (
    <div className="w-full max-w-7/12 p-6 bg-card rounded-md shadow-xl text-left border-4 border-white">
      <h2 className="text-2xl font-bold">{job.title}</h2>
      <p className="text-gray-700">{job.company}</p>
      <p className="text-sm text-gray-500">{job.location}</p>
      <div className="mt-4 text-gray-600 max-w-[95%]">
        {job.description.slice(0, 250)}
        {job.description.length > 250 ? "..." : ""}
      </div>
      <div className="flex justify-between mt-16">
        <CircleIcon
          icon={<XIcon size={40} />} // Pass the Lucide React SVG component
          size={50}
          color="#e5e7eb"
          hoverColor="#91a5c2"
          onClick={swipeLeft}
        />
        <CircleIcon
          icon={<Heart size={30} color="#ffffff" fill="#ffffff" />} // Pass the Lucide React SVG component
          size={50}
          color="#2368db"
          hoverColor="#91a5c2"
          onClick={swipeRight}
        />
      </div>
    </div>
  );
}

export default JobCard;
