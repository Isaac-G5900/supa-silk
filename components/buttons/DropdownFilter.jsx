"use client";

import React, { useState, useEffect } from "react";

function DropdownFilter({ onFilterChange, setLoading, currentFilters }) {
  const [filters, setFilters] = useState(
    currentFilters || {
      jobTitle: "",
      location: "",
      salaryMin: "",
      salaryMax: "",
    }
  );

  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplyFilters = () => {
    setLoading(true);
    onFilterChange(filters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Job Title Filter */}
        <div className="space-y-2">
          <label
            htmlFor="jobTitle"
            className="block text-sm font-medium text-gray-700"
          >
            Job Title
          </label>
          <input
            type="text"
            name="jobTitle"
            id="jobTitle"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. Software Engineer"
            value={filters.jobTitle}
            onChange={handleFilterChange}
          />
        </div>

        {/* Location Filter */}
        <div className="space-y-2">
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location
          </label>
          <input
            type="text"
            name="location"
            id="location"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. Remote, New York"
            value={filters.location}
            onChange={handleFilterChange}
          />
        </div>

        {/* Salary Range */}
        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Salary Range
          </label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="salaryMin"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Min"
              value={filters.salaryMin}
              onChange={handleFilterChange}
            />
            <input
              type="number"
              name="salaryMax"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Max"
              value={filters.salaryMax}
              onChange={handleFilterChange}
            />
          </div>
          <div className="md:col-span-2 mt-4">
            <button
              onClick={handleApplyFilters}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DropdownFilter;
