'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Company } from '@/types/companies';
import CompanyCard from '@/components/app/companies/CompanyCard';
import CompanyFilters from '@/components/app/companies/CompanyFilters';
import CompanyPreviewModal from '@/components/app/companies/CompanyPreviewModal';
import { Search, SlidersHorizontal, X, Building2, Sparkles, Loader2 } from 'lucide-react';

interface Filters {
  locations: string[];
  hasOpenJobs: boolean;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState<Filters>({
    locations: [],
    hasOpenJobs: false,
  });

  // Modal state
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Available locations
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Build query params from filters
  const buildQueryParams = useCallback(() => {
    const params = new URLSearchParams();
    
    if (debouncedSearch) {
      params.append('search', debouncedSearch);
    }
    
    if (filters.locations.length > 0) {
      params.append('location', filters.locations[0]);
    }
    
    return params.toString();
  }, [debouncedSearch, filters]);

  // Fetch companies
  const fetchCompanies = useCallback(async (showLoader = true) => {
    try {
      setLoading(true);
      if (showLoader) {
        setSearching(true);
      }

      const queryString = buildQueryParams();
      const response = await fetch(`/api/companies?${queryString}`);
      const data = await response.json();
      
      if (data.success) {
        const list = data.data?.list || [];
        setCompanies(list);
        
        // Extract unique locations
        const locations = list
          .map((company: Company) => company.location)
          .filter(Boolean);
        const uniqueLocations = [...new Set(locations)] as string[];
        setAvailableLocations(uniqueLocations.sort());
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  }, [buildQueryParams]);

  // Initial fetch
  useEffect(() => {
    fetchCompanies();
  }, []);

  // Fetch when filters or search change
  useEffect(() => {
    if (!loading) {
      fetchCompanies(false);
    }
  }, [debouncedSearch, filters]);

  // Handle filter changes
  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  // Handle company card click - open preview modal
  const handleViewCompany = (company: Company) => {
    setSelectedCompany(company);
    setIsPreviewModalOpen(true);
  };

  // Close preview modal
  const handleClosePreview = () => {
    setIsPreviewModalOpen(false);
    setSelectedCompany(null);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery('');
    setFilters({
      locations: [],
      hasOpenJobs: false,
    });
  };

  // Filter companies locally for filters that API doesn't support
  const filteredCompanies = useMemo(() => {
    return companies.filter(company => {
      const matchesOpenJobs = !filters.hasOpenJobs || 
        (company.jobs_count !== undefined && company.jobs_count > 0);

      // Additional location filtering if multiple locations selected
      const matchesLocation = filters.locations.length <= 1 || 
        filters.locations.some(loc => 
          company.location && company.location.toLowerCase().includes(loc.toLowerCase())
        );

      return matchesOpenJobs && matchesLocation;
    });
  }, [companies, filters]);

  const sortedCompanies = useMemo(() => {
    return [...filteredCompanies].sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredCompanies]);

  const activeFilterCount = 
    filters.locations.length + 
    (filters.hasOpenJobs ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Company Preview Modal */}
      <CompanyPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={handleClosePreview}
        company={selectedCompany}
      />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-[#E6F4F0] rounded-lg flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-[#04724D]" />
          </div>
          <span className="text-sm font-medium text-[#04724D]">Top Employers</span>
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
            <CompanyFilters
              filters={{ ...filters, query: '' }}
              onFiltersChange={handleFiltersChange}
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
                  filters={{ ...filters, query: '' }}
                  onFiltersChange={handleFiltersChange}
                  availableLocations={availableLocations}
                />
              </div>
              <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full bg-gradient-to-r from-[#04724D] to-teal-600 text-white py-3.5 rounded-xl font-medium shadow-lg shadow-[#04724D]/25"
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
                <span className="inline-flex items-center px-3 py-1.5 bg-[#E6F4F0] text-sm text-[#04724D] rounded-lg font-medium">
                  Has open jobs
                  <button
                    onClick={() => handleFiltersChange({ ...filters, hasOpenJobs: false })}
                    className="ml-2 hover:text-[#035E3F]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              )}
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
              Showing <span className="font-semibold text-gray-900">{sortedCompanies.length}</span> companies
              {searching && <span className="ml-2 text-[#04724D]">Updating...</span>}
            </p>
          </div>

          {/* Company Cards Grid */}
          {loading && (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[#E6F4F0] border-t-[#04724D] rounded-full animate-spin" />
                <p className="text-gray-500 text-sm">Loading companies...</p>
              </div>
            </div>
          )}

          {sortedCompanies.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              {sortedCompanies.map((company, index) => (
                <div key={company.id} className="animate-fade-in" style={{ animationDelay: `${Math.min(index * 0.05, 0.5)}s` }}>
                  <CompanyCard company={company} onViewCompany={handleViewCompany} />
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
