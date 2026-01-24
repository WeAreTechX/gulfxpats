'use client';

import { useState } from 'react';
import { X, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResourceFiltersProps {
  filters: {
    resourceTypes: string[];
  };
  onFiltersChange: (filters: any) => void;
  availableResourceTypes: { id: string; name: string; code: string }[];
  className?: string;
}

export default function ResourceFilters({ 
  filters, 
  onFiltersChange, 
  availableResourceTypes,
  className 
}: ResourceFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    resourceType: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleResourceTypeToggle = (type: string) => {
    const newTypes = filters.resourceTypes.includes(type)
      ? filters.resourceTypes.filter(t => t !== type)
      : [...filters.resourceTypes, type];
    onFiltersChange({ ...filters, resourceTypes: newTypes });
  };

  const clearFilters = () => {
    onFiltersChange({
      resourceTypes: [],
    });
  };

  const hasActiveFilters = filters.resourceTypes.length > 0;

  return (
    <div className={cn("bg-white rounded-xl border border-gray-200 overflow-hidden", className)}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="h-5 w-5 text-[#101418]" />
            <h3 className="font-semibold text-[#101418]">Filters</h3>
            {filters.resourceTypes.length > 0 && (
              <span className="px-2 py-0.5 bg-[#101418] text-white text-xs rounded-full">
                {filters.resourceTypes.length}
              </span>
            )}
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-[#101418] flex items-center"
            >
              <X className="h-4 w-4 mr-1" />
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Resource Type Section */}
      <div>
        <button
          onClick={() => toggleSection('resourceType')}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
        >
          <span className="text-sm font-medium text-[#101418]">Resource Type</span>
          {expandedSections.resourceType ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </button>
        {expandedSections.resourceType && (
          <div className="px-4 pb-4 space-y-2">
            {availableResourceTypes.map((type) => (
              <label key={type.id} className="flex items-center space-x-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={filters.resourceTypes.includes(type.code)}
                    onChange={() => handleResourceTypeToggle(type.code)}
                    className="sr-only"
                  />
                  <div className={cn(
                    "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                    filters.resourceTypes.includes(type.code)
                      ? "bg-[#101418] border-[#101418]"
                      : "border-gray-300 group-hover:border-gray-400"
                  )}>
                    {filters.resourceTypes.includes(type.code) && (
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
    </div>
  );
}
