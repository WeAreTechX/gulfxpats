'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Job, JobType } from '@/types/jobs';
import JobCard from '@/components/app/jobs/JobCard';
import JobFilters from '@/components/app/jobs/JobFilters';
import JobPreviewModal from '@/components/app/jobs/JobPreviewModal';
import { Search, SlidersHorizontal, X, Briefcase, Sparkles, Loader2 } from 'lucide-react';

interface Filters {
  locations: string[];
  jobTypes: string[];
  remote: boolean;
  salaryMin: number;
  salaryMax: number;
}

export default function JobsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [jobTypes, setJobTypes] = useState<JobType[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize state from URL params
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState<Filters>({
    locations: [],
    jobTypes: [],
    remote: false,
    salaryMin: 0,
    salaryMax: 0,
  });

  // Modal state
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Available locations (fetched from API response)
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);

  // Initialize filters from URL params on mount
  useEffect(() => {
    const search = searchParams.get('search') || '';
    const location = searchParams.get('location') || '';
    const jobType = searchParams.get('type') || '';
    const remote = searchParams.get('remote') === 'true';
    const salaryMin = parseInt(searchParams.get('salaryMin') || '0');
    const salaryMax = parseInt(searchParams.get('salaryMax') || '0');

    setSearchQuery(search);
    setDebouncedSearch(search);
    setFilters({
      locations: location ? [location] : [],
      jobTypes: jobType ? [jobType] : [],
      remote,
      salaryMin,
      salaryMax,
    });
    setIsInitialized(true);
  }, []);

  // Update URL when filters or search change
  const updateURL = useCallback((search: string, currentFilters: Filters) => {
    const params = new URLSearchParams();

    if (search) {
      params.set('search', search);
    }
    if (currentFilters.locations.length > 0) {
      params.set('location', currentFilters.locations[0]);
    }
    if (currentFilters.jobTypes.length > 0) {
      params.set('type', currentFilters.jobTypes[0]);
    }
    if (currentFilters.remote) {
      params.set('remote', 'true');
    }
    if (currentFilters.salaryMin > 0) {
      params.set('salaryMin', currentFilters.salaryMin.toString());
    }
    if (currentFilters.salaryMax > 0) {
      params.set('salaryMax', currentFilters.salaryMax.toString());
    }

    const queryString = params.toString();
    const newPath = queryString ? `/jobs?${queryString}` : '/jobs';

    router.replace(newPath, { scroll: false });
  }, [router]);

  // Debounce search query and update URL
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      if (isInitialized) {
        updateURL(searchQuery, filters);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Update URL when filters change
  useEffect(() => {
    if (isInitialized) {
      updateURL(debouncedSearch, filters);
    }
  }, [filters, isInitialized]);

  // Build query params for API call
  const buildQueryParams = useCallback(() => {
    const params = new URLSearchParams();

    if (debouncedSearch) {
      params.append('search', debouncedSearch);
    }

    if (filters.locations.length > 0) {
      params.append('location', filters.locations[0]);
    }

    if (filters.jobTypes.length > 0) {
      const jobTypeId = jobTypes.find(t => t.code === filters.jobTypes[0])?.id;
      if (jobTypeId) {
        params.append('job_type_id', jobTypeId?.toString());
      }
    }

    return params.toString();
  }, [debouncedSearch, filters, jobTypes]);

  // Fetch jobs when filters change
  const fetchJobs = useCallback(async (showLoader = true) => {
    try {
      setLoading(true);
      if (showLoader) {
        setSearching(true);
      }

      const queryString = buildQueryParams();
      const jobsRes = await fetch(`/api/jobs?${queryString}`);
      const jobsData = await jobsRes.json();

      if (jobsData.success) {
        const { list } = jobsData.data;
        setJobs(list || []);

        const locations = (list || [])
          .map((job: Job) => job.location)
          .filter(Boolean);
        const uniqueLocations = [...new Set(locations)] as string[];
        setAvailableLocations(uniqueLocations.sort());
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  }, [buildQueryParams]);

  // Fetch job types
  const fetchData = async () => {
    try {
      const [jobTypesRes] = await Promise.all([
        fetch('/api/lookups?type=job-types')
      ]);
      const jobTypesData = await jobTypesRes.json();
      if (jobTypesData.success) setJobTypes(jobTypesData.list || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch jobs when initialized and when filters/search change
  useEffect(() => {
    if (isInitialized) {
      fetchJobs(!loading);
    }
  }, [isInitialized, debouncedSearch, filters, jobTypes]);

  // Handle filter changes
  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  // Handle job card click - open preview modal
  const handleViewJob = (job: Job) => {
    setSelectedJob(job);
    setIsPreviewModalOpen(true);
  };

  // Close preview modal
  const handleClosePreview = () => {
    setIsPreviewModalOpen(false);
    setSelectedJob(null);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery('');
    setFilters({
      locations: [],
      jobTypes: [],
      remote: false,
      salaryMin: 0,
      salaryMax: 0,
    });
  };

  // Filter jobs locally for filters that API doesn't support
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesRemote = !filters.remote || job.metadata?.remote === 'true';

      const matchesSalary = filters.salaryMin === 0 ||
        (job.salary_max && job.salary_max >= filters.salaryMin);

      const matchesLocation = filters.locations.length <= 1 ||
        filters.locations.some(loc => job.location?.toLowerCase().includes(loc.toLowerCase()));

      const matchesJobType = filters.jobTypes.length <= 1 ||
        filters.jobTypes.includes(job.job_type?.code || '');

      return matchesRemote && matchesSalary && matchesLocation && matchesJobType;
    });
  }, [jobs, filters]);

  // Sort jobs by date
  const sortedJobs = useMemo(() => {
    return [...filteredJobs].sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [filteredJobs]);

  const activeFilterCount =
    filters.locations.length +
    filters.jobTypes.length +
    (filters.remote ? 1 : 0) +
    (filters.salaryMin > 0 ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Job Preview Modal */}
      <JobPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={handleClosePreview}
        job={selectedJob}
      />

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
              placeholder="Search job titles, keyword, or industry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#04724D] focus:border-transparent outline-none text-gray-900 shadow-sm placeholder-gray-400"
            />
            {searching && (
              <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                <Loader2 className="h-5 w-5 text-[#04724D] animate-spin" />
              </div>
            )}
            {searchQuery && !searching && (
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
              onFiltersChange={handleFiltersChange}
              availableLocations={availableLocations}
              jobTypes={jobTypes}
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
                  onFiltersChange={handleFiltersChange}
                  availableLocations={availableLocations}
                  jobTypes={jobTypes}
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
                    onClick={() => handleFiltersChange({ ...filters, remote: false })}
                    className="ml-2 hover:text-[#035E3F]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              )}
              {filters.jobTypes.map(type => (
                <span key={type} className="inline-flex items-center px-3 py-1.5 bg-[#E6F4F0] text-sm text-[#04724D] rounded-lg font-medium">
                  {jobTypes.find(t => t.code === type)?.name || type}
                  <button
                    onClick={() => handleFiltersChange({ ...filters, jobTypes: filters.jobTypes.filter(t => t !== type) })}
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
                    onClick={() => handleFiltersChange({ ...filters, locations: filters.locations.filter(l => l !== location) })}
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
                    onClick={() => handleFiltersChange({ ...filters, salaryMin: 0, salaryMax: 0 })}
                    className="ml-2 hover:text-[#035E3F]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              )}
              <button
                onClick={clearAllFilters}
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
              {searching && <span className="ml-2 text-[#04724D]">Updating...</span>}
            </p>
          </div>

          {/* Job Cards Grid */}
          {loading && (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[#E6F4F0] border-t-[#04724D] rounded-full animate-spin" />
                <p className="text-gray-500 text-sm">Loading companies...</p>
              </div>
            </div>
          )}

          {sortedJobs.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              {sortedJobs.map((job, index) => (
                <div key={job.id} className="animate-fade-in" style={{ animationDelay: `${Math.min(index * 0.05, 0.5)}s` }}>
                  <JobCard job={job} onViewJob={handleViewJob} />
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
                onClick={clearAllFilters}
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
