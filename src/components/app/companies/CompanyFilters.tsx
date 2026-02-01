'use client';

import { useState } from 'react';
import { X, ChevronDown, ChevronUp, SlidersHorizontal, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompanyFiltersProps {
  filters: {
    query: string;
    locations: string[];
    hasOpenJobs: boolean;
  };
  onFiltersChange: (filters: any) => void;
  availableLocations: string[];
  className?: string;
}

export default function CompanyFilters({ 
  filters, 
  onFiltersChange, 
  availableLocations,
  className 
}: CompanyFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    location: false,
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

  const clearFilters = () => {
    onFiltersChange({
      query: '',
      locations: [],
      hasOpenJobs: false,
    });
  };

  const hasActiveFilters = filters.locations.length > 0 || filters.hasOpenJobs;

  const activeFilterCount = 
    filters.locations.length + 
    (filters.hasOpenJobs ? 1 : 0);

  return (
    <div className={cn("bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm", className)}>
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <SlidersHorizontal className="h-4 w-4 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Filters</h3>
            {activeFilterCount > 0 && (
              <span className="px-2 py-0.5 bg-emerald-600 text-white text-xs font-medium rounded-full">
                {activeFilterCount}
              </span>
            )}
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-emerald-600 flex items-center gap-1 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Has Open Jobs Toggle */}
      <div className="p-5 border-b border-gray-100">
        <label className="flex items-center justify-between cursor-pointer group">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-gray-400 group-hover:text-emerald-500 transition-colors" />
            <span className="text-sm font-medium text-gray-700">Has open jobs</span>
          </div>
          <div className="relative">
            <input
              type="checkbox"
              checked={filters.hasOpenJobs}
              onChange={(e) => onFiltersChange({ ...filters, hasOpenJobs: e.target.checked })}
              className="sr-only"
            />
            <div className={cn(
              "w-11 h-6 rounded-full transition-colors",
              filters.hasOpenJobs ? "bg-emerald-600" : "bg-gray-200"
            )}>
              <div className={cn(
                "w-5 h-5 bg-white rounded-full shadow-sm transition-transform absolute top-0.5"
              )} style={{ transform: filters.hasOpenJobs ? 'translateX(22px)' : 'translateX(2px)' }} />
            </div>
          </div>
        </label>
      </div>

      {/* Location Section */}
      <div>
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
          <div className="px-5 pb-5 space-y-2 max-h-64 overflow-y-auto">
            {availableLocations.length > 0 ? (
              availableLocations.map((location) => (
                <label key={location} className="flex items-center gap-3 cursor-pointer group p-2 -mx-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="relative">
                    <input
                      disabled={!availableLocations.length}
                      type="checkbox"
                      checked={filters.locations.includes(location)}
                      onChange={() => handleLocationToggle(location)}
                      className="sr-only"
                    />
                    <div className={cn(
                      "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                      filters.locations.includes(location)
                        ? "bg-emerald-600 border-emerald-600"
                        : "border-gray-300 group-hover:border-emerald-400"
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
    </div>
  );
}
