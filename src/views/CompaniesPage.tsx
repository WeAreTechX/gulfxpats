'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Company } from '@/types';
import CompanyCard from '@/components/app/companies/CompanyCard';
import CompanyFilters from '@/components/app/companies/CompanyFilters';
import CompanyPreviewModal from '@/components/app/companies/CompanyPreviewModal';
import { Search, SlidersHorizontal, X, Building2, Sparkles, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from "next/navigation";

export default function CompaniesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Separate filter states
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [locations, setLocations] = useState<string[]>([]);

  // Modal state
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Ref to track if this is the initial mount
  const isFirstRender = useRef(true);

  // Initialize filters from URL params on mount
  useEffect(() => {
    const searchParam = searchParams.get('search') || '';
    const locationParam = searchParams.get('locations') || '';
    
    setSearch(searchParam);
    setDebouncedSearch(searchParam);
    setLocations(locationParam ? locationParam.split(",") : []);
    setIsInitialized(true);
  }, [searchParams]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // Update URL when filters change
  const updateURL = useCallback((currentSearch: string, currentLocations: string[]) => {
    const params = new URLSearchParams();

    if (currentSearch) {
      params.set('search', currentSearch);
    }
    if (currentLocations.length > 0) {
      params.set('locations', currentLocations.join(","));
    }

    const queryString = params.toString();
    const newPath = queryString ? `/companies?${queryString}` : '/companies';

    router.replace(newPath, { scroll: false });
  }, [router]);

  // Update URL when debounced search or locations change
  useEffect(() => {
    if (isInitialized) {
      updateURL(debouncedSearch, locations);
    }
  }, [debouncedSearch, locations, isInitialized, updateURL]);

  // Fetch companies
  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (debouncedSearch) {
        params.append('search', debouncedSearch);
      }
      
      if (locations.length > 0) {
        params.append('country', locations.join(","));
      }

      const queryString = params.toString();
      const companiesRes = await fetch(`/api/companies?${queryString}`);
      const companiesData = await companiesRes.json();
      
      if (companiesData.success) {
        const { list } = companiesData.data;
        setCompanies(list || []);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, locations]);

  // Fetch when debounced search or locations change
  useEffect(() => {
    if (isInitialized) {
      // Skip first render since we fetch on init
      if (isFirstRender.current) {
        isFirstRender.current = false;
        fetchCompanies();
        return;
      }
      fetchCompanies();
    }
  }, [isInitialized, debouncedSearch, locations, fetchCompanies]);

  // Handle search change
  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  // Handle location change
  const handleLocationsChange = (newLocations: string[]) => {
    setLocations(newLocations);
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

  // Clear search
  const clearSearch = () => {
    setSearch('');
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearch('');
    setLocations([]);
  };

  const activeFilterCount = locations.length;

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
          Explore {companies.length} companies and their opportunities
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
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#04724D] focus:border-transparent outline-none text-gray-900 shadow-sm placeholder-gray-400"
            />
            {loading && (
              <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                <Loader2 className="h-5 w-5 text-[#04724D] animate-spin" />
              </div>
            )}
            {search && !loading && (
              <button
                onClick={clearSearch}
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
              locations={locations}
              onLocationsChange={handleLocationsChange}
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
                  locations={locations}
                  onLocationsChange={handleLocationsChange}
                />
              </div>
              <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full bg-gradient-to-r from-[#04724D] to-teal-600 text-white py-3.5 rounded-xl font-medium shadow-lg shadow-[#04724D]/25"
                >
                  Show {companies.length} results
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
              {locations.map(location => (
                <span key={location} className="inline-flex items-center px-3 py-1.5 bg-[#E6F4F0] text-sm text-[#04724D] rounded-lg font-medium">
                  {location}
                  <button
                    onClick={() => handleLocationsChange(locations.filter(l => l !== location))}
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
              Showing <span className="font-semibold text-gray-900">{companies.length}</span> companies
              {loading && <span className="ml-2 text-[#04724D]">Updating...</span>}
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

          {companies.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              {companies.map((company, index) => (
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
