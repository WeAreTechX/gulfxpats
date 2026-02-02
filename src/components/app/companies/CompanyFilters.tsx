'use client';

import { useState } from 'react';
import { X, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { COUNTRIES } from "@/lib/countries";

interface CompanyFiltersProps {
  locations: string[];
  onLocationsChange: (locations: string[]) => void;
  className?: string;
}

export default function CompanyFilters({ locations, onLocationsChange, className }: CompanyFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    location: true,
  });

  const middleEast = [
    'BHR', 'CYP', 'EGY', 'IRN', 'IRQ', 'ISR', 'JOR', 'KWT', 'UAE',
    'LBN', 'OMN', 'PSE', 'QAT', 'SAU', 'SYR', 'TUR', 'ARE', 'YEM'];
  const countries = COUNTRIES.filter(country => middleEast.includes(country.iso3));

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleLocationToggle = (location: string) => {
    const newLocations = locations.includes(location)
      ? locations.filter(l => l !== location)
      : [...locations, location];
    onLocationsChange(newLocations);
  };

  const clearFilters = () => {
    onLocationsChange([]);
  };

  const hasActiveFilters = locations.length > 0;
  const activeFilterCount = locations.length;

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
            {countries.length > 0 ? (
              countries.map((country) => (
                <label key={country.code} className="flex items-center gap-3 cursor-pointer group p-2 -mx-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="relative">
                    <input
                      disabled={!countries.length}
                      type="checkbox"
                      checked={locations.includes(country.iso3)}
                      onChange={() => handleLocationToggle(country.iso3)}
                      className="sr-only"
                    />
                    <div className={cn(
                      "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                      locations.includes(country.iso3)
                        ? "bg-emerald-600 border-emerald-600"
                        : "border-gray-300 group-hover:border-emerald-400"
                    )}>
                      {locations.includes(country.iso3) && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                          <path d="M10.28 2.28L4 8.56 1.72 6.28a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l7-7a.75.75 0 00-1.06-1.06z" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-gray-700">{country.name}</span>
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
