'use client';

import { useState, useEffect, useMemo } from 'react';
import { Job, SearchFilters } from '@/types';
import JobCard from '@/components/jobs/JobCard';
import JobFilters from '@/components/jobs/JobFilters';
import { getJobs } from '@/lib/data-service';

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    location: '',
    jobType: '',
    remote: false,
    salaryMin: 0,
    salaryMax: 0,
    company: '',
  });
  const [sort, setSort] = useState({ field: 'postedAt', direction: 'desc' });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobs = await getJobs();
        console.log('Fetched jobs:', jobs);
        setJobs(jobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredAndSortedJobs = useMemo(() => {
    let filtered = jobs.filter(job => {
      const matchesQuery = !filters.query || 
        job.title.toLowerCase().includes(filters.query.toLowerCase()) ||
        job.companyName.toLowerCase().includes(filters.query.toLowerCase()) ||
        (job.companyIndustry && job.companyIndustry.split(",").some(industry => industry.toLowerCase().includes(filters.query.toLowerCase())));
      
      const matchesLocation = !filters.location || 
        job.location.toLowerCase().includes(filters.location.toLowerCase());
      
      const matchesJobType = !filters.jobType || job.type === filters.jobType;
      
      const matchesRemote = !filters.remote || job.remote;
      
      const matchesCompany = !filters.company || 
        job.companyName.toLowerCase().includes(filters.company.toLowerCase());
      
      const matchesSalary = !filters.salaryMin ||
        job.salaryMax >= filters.salaryMin;

      return matchesQuery && matchesLocation && matchesJobType && 
             matchesRemote && matchesCompany && matchesSalary;
    });

    // Sort jobs
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sort.field) {
        case 'postedAt':
          aValue = new Date(a.postedDate).getTime();
          bValue = new Date(b.postedDate).getTime();
          break;
        case 'salary':
          aValue = a.salaryMax || 0;
          bValue = b.salaryMax || 0;
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'company':
          aValue = a.companyName.toLowerCase();
          bValue = b.companyName.toLowerCase();
          break;
        default:
          return 0;
      }

      if (sort.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [jobs, filters, sort]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#101418]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#101418] mb-2">
          Find Your Dream Job
        </h1>
        <p className="text-gray-600">
          Discover amazing opportunities with top companies. {filteredAndSortedJobs.length} jobs available.
        </p>
      </div>

      {/* Filters */}
      <JobFilters
        filters={filters}
        onFiltersChange={setFilters}
        onSortChange={setSort}
      />

      {/* Job Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAndSortedJobs.map((job) => (
          <JobCard key={job.uid} job={job} />
        ))}
      </div>

      {filteredAndSortedJobs.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
          <p className="text-gray-500 text-lg">No jobs found matching your criteria.</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  );
}