'use client';

import { useState, useEffect, useMemo } from 'react';
import { Company } from '@/types';
import CompanyCard from '@/components/companies/CompanyCard';
import CompanyFilters from '@/components/companies/CompanyFilters';
import { Search, SlidersHorizontal, X, Building2, Sparkles } from 'lucide-react';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    query: '',
    locations: [] as string[],
    hasOpenJobs: false,
  });

  const availableLocations = useMemo(() => {
    const locations = companies
      .map(company => company.location)
      .filter(Boolean);
    return [...new Set(locations)].sort();
  }, [companies]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('/api/companies');
        const data = await response.json();
        
        if (data.success) {
          setCompanies(data.companies);
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const filteredCompanies = useMemo(() => {
    return companies.filter(company => {
      const matchesSearch = !searchQuery || 
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (company.description && company.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesLocation = filters.locations.length === 0 || 
        filters.locations.some(loc => 
          company.location && company.location.toLowerCase().includes(loc.toLowerCase())
        );
      
      const matchesOpenJobs = !filters.hasOpenJobs || 
        (company.openJobs && company.openJobs > 0);

      return matchesSearch && matchesLocation && matchesOpenJobs;
    });
  }, [companies, searchQuery, filters]);

  const sortedCompanies = useMemo(() => {
    return [...filteredCompanies].sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredCompanies]);

  const activeFilterCount = 
    filters.locations.length + 
    (filters.hasOpenJobs ? 1 : 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-emerald-600" />
          </div>
          <span className="text-sm font-medium text-emerald-600">Top Employers</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Discover Amazing Companies
        </h1>
        <p className="text-gray-600">
          Explore {sortedCompanies.length} companies and their opportunities
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-900 shadow-sm placeholder-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden flex items-center justify-center px-5 py-3.5 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-colors shadow-sm"
          >
            <SlidersHorizontal className="h-5 w-5 mr-2 text-gray-600" />
            <span className="font-medium text-gray-700">Filters</span>
            {activeFilterCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-indigo-600 text-white text-xs font-medium rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters - Desktop */}
        <div className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-24">
            <CompanyFilters
              filters={filters}
              onFiltersChange={setFilters}
              availableLocations={availableLocations}
            />
          </div>
        </div>

        {/* Mobile Filters Overlay */}
        {showMobileFilters && (
          <div className="lg:hidden fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-sm">
            <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl overflow-y-auto animate-slide-up">
              <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between z-10">
                <h2 className="font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4">
                <CompanyFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  availableLocations={availableLocations}
                />
              </div>
              <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3.5 rounded-xl font-medium shadow-lg shadow-indigo-500/25"
                >
                  Show {sortedCompanies.length} results
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Company Listings */}
        <div className="flex-1">
          {/* Active Filters Pills */}
          {activeFilterCount > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              {filters.hasOpenJobs && (
                <span className="inline-flex items-center px-3 py-1.5 bg-emerald-50 text-sm text-emerald-700 rounded-lg font-medium">
                  Has open jobs
                  <button
                    onClick={() => setFilters({ ...filters, hasOpenJobs: false })}
                    className="ml-2 hover:text-emerald-900"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              )}
              {filters.locations.map(location => (
                <span key={location} className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-sm text-indigo-700 rounded-lg font-medium">
                  {location}
                  <button
                    onClick={() => setFilters({ ...filters, locations: filters.locations.filter(l => l !== location) })}
                    className="ml-2 hover:text-indigo-900"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
              <button
                onClick={() => setFilters({
                  query: '',
                  locations: [],
                  hasOpenJobs: false,
                })}
                className="text-sm text-gray-500 hover:text-indigo-600 font-medium"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Results Count */}
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{sortedCompanies.length}</span> companies
            </p>
          </div>

          {/* Company Cards Grid */}
          {sortedCompanies.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              {sortedCompanies.map((company, index) => (
                <div key={company.uid} className="animate-fade-in" style={{ animationDelay: `${Math.min(index * 0.05, 0.5)}s` }}>
                  <CompanyCard company={company} variant="compact" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No companies found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or search terms.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilters({
                    query: '',
                    locations: [],
                    hasOpenJobs: false,
                  });
                }}
                className="text-indigo-600 font-medium hover:text-indigo-700"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
