'use client';

import { useState, useEffect, useMemo } from 'react';
import { Job } from '@/types/jobs';
import JobCard from '@/components/jobs/JobCard';
import JobFilters from '@/components/jobs/JobFilters';
import { Search, SlidersHorizontal, X, Briefcase, Sparkles } from 'lucide-react';

const DEFAULT_JOB_TYPES = [
  { id: '1', name: 'Full Time', code: 'full-time' },
  { id: '2', name: 'Part Time', code: 'part-time' },
  { id: '3', name: 'Contract', code: 'contract' },
  { id: '4', name: 'Internship', code: 'internship' },
  { id: '5', name: 'Freelance', code: 'freelance' },
];

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobN[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    query: '',
    locations: [] as string[],
    jobTypes: [] as string[],
    remote: false,
    salaryMin: 0,
    salaryMax: 0,
  });

  const availableLocations = useMemo(() => {
    const locations = jobs
      .map(job => job.location)
      .filter(Boolean);
    return [...new Set(locations)].sort();
  }, [jobs]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/jobs?includeStats=true');
        const data = await response.json();
        
        if (data.success) {
          setJobs(data.list);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = !searchQuery || 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job.description && job.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesLocation = filters.locations.length === 0 || 
        filters.locations.some(loc => job.location.toLowerCase().includes(loc.toLowerCase()));
      
      const matchesJobType = filters.jobTypes.length === 0 || 
        filters.jobTypes.includes(job.type);
      
      const matchesRemote = !filters.remote || job.remote;
      
      const matchesSalary = filters.salaryMin === 0 || 
        (job.salaryMax && job.salaryMax >= filters.salaryMin);

      return matchesSearch && matchesLocation && matchesJobType && matchesRemote && matchesSalary;
    });
  }, [jobs, searchQuery, filters]);

  const sortedJobs = useMemo(() => {
    return [...filteredJobs].sort((a, b) => {
      return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
    });
  }, [filteredJobs]);

  const activeFilterCount = 
    filters.locations.length + 
    filters.jobTypes.length + 
    (filters.remote ? 1 : 0) + 
    (filters.salaryMin > 0 ? 1 : 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#E6F4F0] border-t-[#04724D] rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-[#E6F4F0] rounded-lg flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-[#04724D]" />
          </div>
          <span className="text-sm font-medium text-[#04724D]">Explore Opportunities</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Find Your Perfect Job
        </h1>
        <p className="text-gray-600">
          Discover {sortedJobs.length} amazing opportunities waiting for you
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs, companies, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#04724D] focus:border-transparent outline-none text-gray-900 shadow-sm placeholder-gray-400"
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
            className="lg:hidden flex items-center justify-center px-5 py-3.5 bg-white border border-gray-200 rounded-xl hover:border-[#04724D]/30 hover:bg-[#E6F4F0] transition-colors shadow-sm"
          >
            <SlidersHorizontal className="h-5 w-5 mr-2 text-gray-600" />
            <span className="font-medium text-gray-700">Filters</span>
            {activeFilterCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-[#04724D] text-white text-xs font-medium rounded-full">
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
            <JobFilters
              filters={filters}
              onFiltersChange={setFilters}
              availableLocations={availableLocations}
              availableJobTypes={DEFAULT_JOB_TYPES}
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
                <JobFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  availableLocations={availableLocations}
                  availableJobTypes={DEFAULT_JOB_TYPES}
                />
              </div>
              <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full bg-gradient-to-r from-[#04724D] to-teal-600 text-white py-3.5 rounded-xl font-medium shadow-lg shadow-[#04724D]/25"
                >
                  Show {sortedJobs.length} results
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Job Listings */}
        <div className="flex-1">
          {/* Active Filters Pills */}
          {activeFilterCount > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              {filters.remote && (
                <span className="inline-flex items-center px-3 py-1.5 bg-[#E6F4F0] text-sm text-[#04724D] rounded-lg font-medium">
                  Remote
                  <button
                    onClick={() => setFilters({ ...filters, remote: false })}
                    className="ml-2 hover:text-[#035E3F]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              )}
              {filters.jobTypes.map(type => (
                <span key={type} className="inline-flex items-center px-3 py-1.5 bg-[#E6F4F0] text-sm text-[#04724D] rounded-lg font-medium">
                  {DEFAULT_JOB_TYPES.find(t => t.code === type)?.name || type}
                  <button
                    onClick={() => setFilters({ ...filters, jobTypes: filters.jobTypes.filter(t => t !== type) })}
                    className="ml-2 hover:text-[#035E3F]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
              {filters.locations.map(location => (
                <span key={location} className="inline-flex items-center px-3 py-1.5 bg-[#E6F4F0] text-sm text-[#04724D] rounded-lg font-medium">
                  {location}
                  <button
                    onClick={() => setFilters({ ...filters, locations: filters.locations.filter(l => l !== location) })}
                    className="ml-2 hover:text-[#035E3F]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
              {filters.salaryMin > 0 && (
                <span className="inline-flex items-center px-3 py-1.5 bg-[#E6F4F0] text-sm text-[#04724D] rounded-lg font-medium">
                  ${(filters.salaryMin / 1000).toFixed(0)}k+
                  <button
                    onClick={() => setFilters({ ...filters, salaryMin: 0, salaryMax: 0 })}
                    className="ml-2 hover:text-[#035E3F]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              )}
              <button
                onClick={() => setFilters({
                  query: '',
                  locations: [],
                  jobTypes: [],
                  remote: false,
                  salaryMin: 0,
                  salaryMax: 0,
                })}
                className="text-sm text-gray-500 hover:text-[#04724D] font-medium"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Results Count */}
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{sortedJobs.length}</span> jobs
            </p>
          </div>

          {/* Job Cards Grid */}
          {sortedJobs.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {sortedJobs.map((job, index) => (
                <div key={job.uid} className="animate-fade-in" style={{ animationDelay: `${Math.min(index * 0.05, 0.5)}s` }}>
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or search terms.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilters({
                    query: '',
                    locations: [],
                    jobTypes: [],
                    remote: false,
                    salaryMin: 0,
                    salaryMax: 0,
                  });
                }}
                className="text-[#04724D] font-medium hover:text-[#035E3F]"
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
