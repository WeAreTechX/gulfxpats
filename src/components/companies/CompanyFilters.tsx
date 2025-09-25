'use client';

import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

interface CompanyFilters {
  query: string;
  location: string;
  industry: string;
  openJobs: boolean;
}

interface CompanyFiltersProps {
  filters: CompanyFilters;
  onFiltersChange: (filters: CompanyFilters) => void;
  onSortChange: (sort: { field: string; direction: string }) => void;
}

export default function CompanyFilters({ filters, onFiltersChange, onSortChange }: CompanyFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (key: keyof CompanyFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      query: '',
      location: '',
      industry: '',
      openJobs: false,
    });
  };

  const hasActiveFilters = filters.query || filters.location || filters.industry || filters.openJobs;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search companies, industries, or keywords..."
            value={filters.query}
            onChange={(e) => handleFilterChange('query', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none text-black font-medium"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-4 py-2 border border-gray-300 rounded-lg text-black cursor-pointer ${showFilters ? 'bg-[#101418] text-white' : ''}`}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                placeholder="City, State, Country"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none text-black"
              />
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Industry
              </label>
              <select
                value={filters.industry}
                onChange={(e) => handleFilterChange('industry', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none text-black"
              >
                <option value="">All Industries</option>
                <option value="Technology">Technology</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Retail">Retail</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Consulting">Consulting</option>
                <option value="Media">Media</option>
                <option value="Non-profit">Non-profit</option>
                <option value="Government">Government</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                onChange={(e) => {
                  const [field, direction] = e.target.value.split('-');
                  onSortChange({ field, direction });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none text-black"
              >
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
                <option value="location-asc">Location: A to Z</option>
                <option value="location-desc">Location: Z to A</option>
                <option value="industry-asc">Industry: A to Z</option>
                <option value="industry-desc">Industry: Z to A</option>
              </select>
            </div>

            {/* Open Jobs Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter
              </label>
              <div className="flex items-center h-10">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.openJobs}
                    onChange={(e) => handleFilterChange('openJobs', e.target.checked)}
                    className="h-4 w-4 text-[#101418] focus:ring-[#101418] border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Has open jobs</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
