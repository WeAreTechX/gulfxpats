'use client';

import { useState, useEffect, useMemo } from 'react';
import { Resource } from '@/types';
import ResourceCard from '@/components/app/resources/ResourceCard';
import ResourceFilters from '@/components/app/resources/ResourceFilters';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  BookOpen, 
  ExternalLink,
  FileText,
  Video,
  Headphones,
  Wrench,
  GraduationCap,
  BookMarked,
  Sparkles,
  Bell,
  ArrowRight,
  Zap
} from 'lucide-react';

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
        filters.resourceTypes.includes(resource.type.code);

      return matchesSearch && matchesType;
    });
  }, [resources, searchQuery, filters]);

  // Sort resources by publishedAt (newest first)
  const sortedResources = useMemo(() => {
    return [...filteredResources].sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
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
    const resourceTypes = [
      { 
        icon: FileText, 
        name: 'Blog Articles', 
        description: 'In-depth guides and industry insights',
        color: 'from-blue-500 to-blue-600',
        bgColor: 'bg-blue-50',
        iconColor: 'text-blue-600'
      },
      { 
        icon: Video, 
        name: 'Video Tutorials', 
        description: 'Step-by-step visual learning content',
        color: 'from-red-500 to-rose-600',
        bgColor: 'bg-red-50',
        iconColor: 'text-red-600'
      },
      { 
        icon: GraduationCap, 
        name: 'Online Courses', 
        description: 'Structured learning paths for skill development',
        color: 'from-purple-500 to-violet-600',
        bgColor: 'bg-purple-50',
        iconColor: 'text-purple-600'
      },
      { 
        icon: Headphones, 
        name: 'Podcasts', 
        description: 'Expert conversations on career growth',
        color: 'from-emerald-500 to-teal-600',
        bgColor: 'bg-emerald-50',
        iconColor: 'text-emerald-600'
      },
      { 
        icon: Wrench, 
        name: 'Career Tools', 
        description: 'Templates, calculators, and utilities',
        color: 'from-amber-500 to-orange-600',
        bgColor: 'bg-amber-50',
        iconColor: 'text-amber-600'
      },
      { 
        icon: BookMarked, 
        name: 'E-Books', 
        description: 'Comprehensive guides and handbooks',
        color: 'from-pink-500 to-rose-600',
        bgColor: 'bg-pink-50',
        iconColor: 'text-pink-600'
      },
    ];

    return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#04724D]/5 via-white to-teal-50/50"></div>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[#04724D]/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-teal-100/50 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
          
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
            {/* Badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#04724D]/10 rounded-full">
                <Sparkles className="w-4 h-4 text-[#04724D]" />
                <span className="text-sm font-semibold text-[#04724D]">Coming Soon</span>
              </div>
            </div>

            {/* Main Heading */}
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Your Career
                <span className="relative">
                  <span className="relative z-10 text-[#04724D]"> Resource Hub</span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                    <path d="M2 10C50 4 150 2 298 8" stroke="#04724D" strokeWidth="4" strokeLinecap="round" className="opacity-30"/>
                  </svg>
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-10 leading-relaxed">
                We&#39;re building a comprehensive library of resources to accelerate your career growth.
                From expert guides to practical tools — everything you need in one place.
              </p>

              {/* Progress Section */}
              <div className="inline-flex flex-col items-center gap-3 px-8 py-6 bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-[#E6F4F0] flex items-center justify-center">
                      <Zap className="w-6 h-6 text-[#04724D]" />
                    </div>
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#04724D] rounded-full animate-ping"></span>
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#04724D] rounded-full"></span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">Actively Building</p>
                    <p className="text-xs text-gray-500">Launching very soon</p>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full w-4/5 bg-gradient-to-r from-[#04724D] to-teal-500 rounded-full relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                  </div>
                </div>
                <p className="text-xs text-gray-400">80% complete</p>
              </div>
            </div>
          </div>
        </div>

        {/* What's Coming Section */}
        <div className="bg-white py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                What&#39;s Coming
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                A curated collection of resources tailored for professionals in the African tech ecosystem
              </p>
            </div>

            {/* Resource Type Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {resourceTypes.map((resource, index) => (
                <div 
                  key={resource.name}
                  className="group relative bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl hover:shadow-gray-200/50 hover:border-transparent transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${resource.color} opacity-0 group-hover:opacity-[0.03] rounded-2xl transition-opacity duration-300`}></div>
                  
                  <div className="relative">
                    <div className={`w-14 h-14 ${resource.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <resource.icon className={`w-7 h-7 ${resource.iconColor}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.name}</h3>
                    <p className="text-gray-500 text-sm">{resource.description}</p>
                  </div>

                  {/* Coming soon badge */}
                  <div className="absolute top-4 right-4 px-2 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">
                    Soon
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="bg-gradient-to-b from-gray-50 to-white py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-medium mb-6">
                  <Bell className="w-4 h-4" />
                  Early Access
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                  Be the first to explore our resources
                </h2>
                <p className="text-gray-600 text-lg mb-8">
                  Get notified when we launch. Early members will receive exclusive access to premium content and special features.
                </p>

                <div className="space-y-4">
                  {[
                    'Curated content from industry experts',
                    'Practical tools for job seekers',
                    'Exclusive career development guides',
                    'Regular updates with new materials'
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#E6F4F0] flex items-center justify-center flex-shrink-0">
                        <svg className="w-3.5 h-3.5 text-[#04724D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Content - Illustration/Card */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#04724D]/20 to-teal-500/20 rounded-3xl blur-2xl"></div>
                <div className="relative bg-white rounded-3xl shadow-2xl shadow-gray-200/50 p-8 border border-gray-100">
                  {/* Mock Resource Card */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#04724D] to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-100 rounded w-full"></div>
                        <div className="h-3 bg-gray-100 rounded w-2/3 mt-1"></div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl opacity-75">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Video className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                        <div className="h-3 bg-gray-100 rounded w-full"></div>
                        <div className="h-3 bg-gray-100 rounded w-1/2 mt-1"></div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl opacity-50">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Wrench className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-3 bg-gray-100 rounded w-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#04724D]/10 rounded-full blur-xl"></div>
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-teal-500/10 rounded-full blur-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden bg-gradient-to-br from-[#04724D] via-[#04724D] to-teal-600 rounded-3xl p-10 sm:p-14">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>
              
              <div className="relative text-center">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  Stay in the Loop
                </h3>
                <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                  Follow us for the latest updates on our resource library launch and get exclusive previews of what&#39;s coming.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <a 
                    href="https://www.instagram.com/wearetechx/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3.5 bg-white text-[#04724D] rounded-xl font-semibold hover:bg-gray-100 transition-all hover:shadow-lg hover:shadow-white/20 group"
                  >
                    Follow on Instagram
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a 
                    href="https://linkedin.com/company/wearetechx" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3.5 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-xl font-semibold hover:bg-white/20 transition-all group"
                  >
                    Connect on LinkedIn
                    <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>
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
