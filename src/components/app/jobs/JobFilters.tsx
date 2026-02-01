'use client';

import { useState } from 'react';
import { X, ChevronDown, ChevronUp, SlidersHorizontal, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Entity} from "@/types";

interface JobFiltersProps {
  filters: {
    locations: string[];
    jobTypes: string[];
    remote: boolean;
    salaryMin: number;
    salaryMax: number;
  };
  onFiltersChange: (filters: any) => void;
  availableLocations: string[];
  jobTypes: Entity[];
  className?: string;
}

const SALARY_RANGES = [
  { label: 'Any', min: 0, max: 0 },
  { label: '$0 - $50k', min: 0, max: 50000 },
  { label: '$50k - $100k', min: 50000, max: 100000 },
  { label: '$100k - $150k', min: 100000, max: 150000 },
  { label: '$150k+', min: 150000, max: 0 },
];

export default function JobFilters(props: JobFiltersProps) {
  const { filters, onFiltersChange, jobTypes, availableLocations, className } = props;
  const [expandedSections, setExpandedSections] = useState({
    jobType: true,
    location: true,
    salary: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleLocationToggle = (location: string) => {
    const newLocations = filters.locations.includes(location)
      ? filters.locations.filter(l => l !== location)
      : [...filters.locations, location];
    onFiltersChange({ ...filters, locations: newLocations });
  };

  const handleJobTypeToggle = (jobType: string) => {
    const newJobTypes = filters.jobTypes.includes(jobType)
      ? filters.jobTypes.filter(t => t !== jobType)
      : [...filters.jobTypes, jobType];
    onFiltersChange({ ...filters, jobTypes: newJobTypes });
  };

  const handleSalaryChange = (min: number, max: number) => {
    onFiltersChange({ ...filters, salaryMin: min, salaryMax: max });
  };

  const clearFilters = () => {
    onFiltersChange({
      locations: [],
      jobTypes: [],
      remote: false,
      salaryMin: 0,
      salaryMax: 0,
    });
  };

  const hasActiveFilters = filters.locations.length > 0 || 
    filters.jobTypes.length > 0 || 
    filters.remote || 
    filters.salaryMin > 0;

  const activeFilterCount = 
    filters.locations.length + 
    filters.jobTypes.length + 
    (filters.remote ? 1 : 0) + 
    (filters.salaryMin > 0 ? 1 : 0);

  return (
    <div className={cn("bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm", className)}>
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#E6F4F0] rounded-lg flex items-center justify-center">
              <SlidersHorizontal className="h-4 w-4 text-[#04724D]" />
            </div>
            <h3 className="font-semibold text-gray-900">Filters</h3>
            {activeFilterCount > 0 && (
              <span className="px-2 py-0.5 bg-[#04724D] text-white text-xs font-medium rounded-full">
                {activeFilterCount}
              </span>
            )}
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-[#04724D] flex items-center gap-1 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Remote Work Toggle */}
      <div className="p-5 border-b border-gray-100">
        <label className="flex items-center justify-between cursor-pointer group">
          <div className="flex items-center gap-2">
            <Wifi className="h-4 w-4 text-gray-400 group-hover:text-[#04724D] transition-colors" />
            <span className="text-sm font-medium text-gray-700">Remote only</span>
          </div>
          <div className="relative">
            <input
              type="checkbox"
              checked={filters.remote}
              onChange={(e) => onFiltersChange({ ...filters, remote: e.target.checked })}
              className="sr-only"
            />
            <div className={cn(
              "w-11 h-6 rounded-full transition-colors",
              filters.remote ? "bg-[#04724D]" : "bg-gray-200"
            )}>
              <div className={cn(
                "w-5 h-5 bg-white rounded-full shadow-sm transition-transform absolute top-0.5",
                filters.remote ? "translate-x-5.5" : "translate-x-0.5"
              )} style={{ transform: filters.remote ? 'translateX(22px)' : 'translateX(2px)' }} />
            </div>
          </div>
        </label>
      </div>

      {/* Job Type Section */}
      <div className="border-b border-gray-100">
        <button
          onClick={() => toggleSection('jobType')}
          className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <span className="text-sm font-medium text-gray-900">Job Type</span>
          {expandedSections.jobType ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </button>
        {expandedSections.jobType && (
          <div className="px-5 pb-5 space-y-2">
            {jobTypes.map((type) => (
              <label key={type.id} className="flex items-center gap-3 cursor-pointer group p-2 -mx-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={filters.jobTypes.includes(type.code)}
                    onChange={() => handleJobTypeToggle(type.code)}
                    className="sr-only"
                  />
                  <div className={cn(
                    "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                    filters.jobTypes.includes(type.code)
                      ? "bg-[#04724D] border-[#04724D]"
                      : "border-gray-300 group-hover:border-[#04724D]"
                  )}>
                    {filters.jobTypes.includes(type.code) && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M10.28 2.28L4 8.56 1.72 6.28a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l7-7a.75.75 0 00-1.06-1.06z" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-700">{type.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Location Section */}
      <div className="border-b border-gray-100">
        <button
          onClick={() => toggleSection('location')}
          className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <span className="text-sm font-medium text-gray-900">Location</span>
          {expandedSections.location ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </button>
        {expandedSections.location && (
          <div className="px-5 pb-5 space-y-2 max-h-52 overflow-y-auto">
            {availableLocations.length > 0 ? (
              availableLocations.map((location) => (
                <label key={location} className="flex items-center gap-3 cursor-pointer group p-2 -mx-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={filters.locations.includes(location)}
                      onChange={() => handleLocationToggle(location)}
                      className="sr-only"
                    />
                    <div className={cn(
                      "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                      filters.locations.includes(location)
                        ? "bg-[#04724D] border-[#04724D]"
                        : "border-gray-300 group-hover:border-[#04724D]"
                    )}>
                      {filters.locations.includes(location) && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                          <path d="M10.28 2.28L4 8.56 1.72 6.28a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l7-7a.75.75 0 00-1.06-1.06z" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-gray-700">{location}</span>
                </label>
              ))
            ) : (
              <p className="text-sm text-gray-500 py-2">No locations available</p>
            )}
          </div>
        )}
      </div>

      {/* Salary Range Section */}
      <div>
        <button
          onClick={() => toggleSection('salary')}
          className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <span className="text-sm font-medium text-gray-900">Salary Range</span>
          {expandedSections.salary ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </button>
        {expandedSections.salary && (
          <div className="px-5 pb-5 space-y-2">
            {SALARY_RANGES.map((range) => (
              <label key={range.label} className="flex items-center gap-3 cursor-pointer group p-2 -mx-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="relative">
                  <input
                    type="radio"
                    name="salary"
                    checked={filters.salaryMin === range.min && filters.salaryMax === range.max}
                    onChange={() => handleSalaryChange(range.min, range.max)}
                    className="sr-only"
                  />
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                    filters.salaryMin === range.min && filters.salaryMax === range.max
                      ? "border-[#04724D]"
                      : "border-gray-300 group-hover:border-[#04724D]"
                  )}>
                    {filters.salaryMin === range.min && filters.salaryMax === range.max && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#04724D]" />
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-700">{range.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
