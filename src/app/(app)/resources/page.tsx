'use client';

import { useState, useEffect, useMemo } from 'react';
import { Resource } from '@/types';
import ResourceCard from '@/components/app/resources/ResourceCard';
import ResourceFilters from '@/components/app/resources/ResourceFilters';
import { Search, SlidersHorizontal, X, BookOpen, ExternalLink } from 'lucide-react';

// Default resource types
const DEFAULT_RESOURCE_TYPES = [
  { id: '1', name: 'Blog', code: 'blog' },
  { id: '2', name: 'Course', code: 'course' },
  { id: '3', name: 'Tool', code: 'tool' },
  { id: '4', name: 'Video', code: 'video' },
  { id: '5', name: 'Podcast', code: 'podcast' },
  { id: '6', name: 'E-Book', code: 'ebook' },
];

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    resourceTypes: [] as string[],
  });

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch('/api/resources');
        const data = await response.json();
        
        if (data.success) {
          setResources(data.resources);
        } else {
          console.error('Error fetching resources:', data.error);
        }
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      // Search query filter
      const matchesSearch = !searchQuery || 
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (resource.description && resource.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Resource type filter
      const matchesType = filters.resourceTypes.length === 0 || 
        filters.resourceTypes.includes(resource.type);

      return matchesSearch && matchesType;
    });
  }, [resources, searchQuery, filters]);

  // Sort resources by publishedAt (newest first)
  const sortedResources = useMemo(() => {
    return [...filteredResources].sort((a, b) => {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }, [filteredResources]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#101418]"></div>
      </div>
    );
  }

  // Show coming soon if no resources
  if (resources.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#101418] rounded-full mb-6">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#101418] mb-4">
              Resources
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your comprehensive hub for career development, job search tips, and professional growth resources
            </p>
          </div>

          {/* Coming Soon */}
          <div className="relative mb-16">
            <div className="bg-white rounded-3xl shadow-2xl p-12 text-center border border-gray-100">
              <h2 className="text-3xl font-bold text-[#101418] mb-4">
                Coming Soon
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                We're crafting an amazing collection of resources to help you excel in your career journey. 
                Get ready for expert insights, practical tips, and valuable tools.
              </p>

              {/* Progress indicator */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-6 max-w-md mx-auto">
                <div className="bg-[#101418] h-2 rounded-full w-3/4 animate-pulse"></div>
              </div>
              <p className="text-sm text-gray-500">Development in progress...</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-[#101418] to-gray-800 rounded-3xl p-12 text-white">
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="text-lg mb-8 opacity-90">
              Be the first to know when our resources are ready. Follow us for updates and exclusive early access.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="https://www.instagram.com/wearetechx/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-white text-[#101418] rounded-full font-medium hover:bg-gray-100 transition-colors"
              >
                Follow on Instagram
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
              <a 
                href="https://linkedin.com/company/wearetechx" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
              >
                Connect on LinkedIn
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#101418] mb-2">
          Resources
        </h1>
        <p className="text-gray-600">
          Discover career resources, tips, and tools to help you succeed. {sortedResources.length} resources available.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#101418] focus:border-transparent outline-none text-[#101418] font-medium"
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
            className="lg:hidden flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <SlidersHorizontal className="h-5 w-5 mr-2 text-[#101418]" />
            <span className="font-medium text-[#101418]">Filters</span>
            {filters.resourceTypes.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-[#101418] text-white text-xs rounded-full">
                {filters.resourceTypes.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters - Desktop */}
        <div className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-24">
            <ResourceFilters
              filters={filters}
              onFiltersChange={setFilters}
              availableResourceTypes={DEFAULT_RESOURCE_TYPES}
            />
          </div>
        </div>

        {/* Mobile Filters Overlay */}
        {showMobileFilters && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50">
            <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <h2 className="font-semibold text-[#101418]">Filters</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4">
                <ResourceFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  availableResourceTypes={DEFAULT_RESOURCE_TYPES}
                />
              </div>
              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full bg-[#101418] text-white py-3 rounded-xl font-medium hover:bg-[#1a1f26] transition-colors"
                >
                  Show {sortedResources.length} results
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Resource Listings */}
        <div className="flex-1">
          {/* Active Filters Pills */}
          {filters.resourceTypes.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {filters.resourceTypes.map(type => (
                <span key={type} className="inline-flex items-center px-3 py-1 bg-gray-100 text-sm text-[#101418] rounded-full">
                  {DEFAULT_RESOURCE_TYPES.find(t => t.code === type)?.name || type}
                  <button
                    onClick={() => setFilters({ ...filters, resourceTypes: filters.resourceTypes.filter(t => t !== type) })}
                    className="ml-2 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Results Count */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium text-[#101418]">{sortedResources.length}</span> resources
            </p>
          </div>

          {/* Resource Cards Grid */}
          {sortedResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#101418] mb-2">No resources found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your filters or search terms.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilters({ resourceTypes: [] });
                }}
                className="text-[#101418] font-medium hover:underline"
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
