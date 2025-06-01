"use client";
import React, { useState, useEffect } from "react";
import CollapsibleDropdown from "./CollapsibleDropdown";


function DropdownFilter({ onFilterChange, setLoading, currentFilters }) {
  const [filters, setFilters] = useState(
    currentFilters || {
      jobTitle: "",
      location: "",
      salaryMin: "",
      salaryMax: "",
      maxDaysOld: 30,
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
    <div className="grid grid-cols-1 gap-4">
      <CollapsibleDropdown label="Job Title">
        <div className="space-y-2">
          <label
            htmlFor="jobTitle"
            className="block text-sm font-medium text-gray-700"
          >
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
      </CollapsibleDropdown>

      <CollapsibleDropdown label="Location">
        <div className="space-y-2">
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
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
      </CollapsibleDropdown>

      <CollapsibleDropdown label="Salary Range">
        <div className="space-y-2">
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
        </div>
      </CollapsibleDropdown>

      <CollapsibleDropdown label="Max Days Old">
        <div className="space-y-2">
          <input
            type="number"
            name="maxDaysOld"
            id="maxDaysOld"
            min="1"
            max="365"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. 30 days"
            value={filters.maxDaysOld}
            onChange={handleFilterChange}
          />
        </div>
      </CollapsibleDropdown>

      <div className="mt-4">
        <button
          onClick={handleApplyFilters}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  </div>
);
}

export default DropdownFilter;
