'use client';

import { useState, useEffect, useMemo } from 'react';
import { Job, SearchFilters } from '@/types';
import JobCard from '@/components/jobs/JobCard';
import JobFilters from '@/components/jobs/JobFilters';
import { getJobs } from '@/lib/airtable';

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    location: '',
    jobType: '',
    remote: false,
    salary: { min: 0, max: 0 },
    company: '',
  });
  const [sort, setSort] = useState({ field: 'postedAt', direction: 'desc' });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const airtableJobs = await getJobs();
        // Transform Airtable data to our Job interface
        const transformedJobs: Job[] = airtableJobs.map(job => ({
          id: job.id,
          title: job.fields.Title || '',
          company: job.fields.Company?.[0] || '',
          companyId: job.fields.Company?.[0] || '',
          location: job.fields.Location || '',
          type: (job.fields.Type?.toLowerCase() as any) || 'full-time',
          remote: job.fields.Remote || false,
          salary: job.fields['Salary Min'] && job.fields['Salary Max'] ? {
            min: job.fields['Salary Min'],
            max: job.fields['Salary Max'],
            currency: job.fields.Currency || 'USD'
          } : undefined,
          description: job.fields.Description || '',
          requirements: job.fields.Requirements ? job.fields.Requirements.split('\n') : [],
          benefits: job.fields.Benefits ? job.fields.Benefits.split('\n') : [],
          postedAt: job.fields['Posted Date'] || new Date().toISOString(),
          applicationUrl: job.fields['Application URL'] || '',
          tags: job.fields.Tags ? job.fields.Tags.split(',').map(tag => tag.trim()) : [],
        }));
        console.log(transformedJobs)
        setJobs(transformedJobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        // Fallback to mock data if Airtable fails
        setJobs(getMockJobs());
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
        job.company.toLowerCase().includes(filters.query.toLowerCase()) ||
        job.tags.some(tag => tag.toLowerCase().includes(filters.query.toLowerCase()));
      
      const matchesLocation = !filters.location || 
        job.location.toLowerCase().includes(filters.location.toLowerCase());
      
      const matchesJobType = !filters.jobType || job.type === filters.jobType;
      
      const matchesRemote = !filters.remote || job.remote;
      
      const matchesCompany = !filters.company || 
        job.company.toLowerCase().includes(filters.company.toLowerCase());
      
      const matchesSalary = !filters.salary.min || !job.salary || 
        job.salary.max >= filters.salary.min;

      return matchesQuery && matchesLocation && matchesJobType && 
             matchesRemote && matchesCompany && matchesSalary;
    });

    // Sort jobs
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sort.field) {
        case 'postedAt':
          aValue = new Date(a.postedAt).getTime();
          bValue = new Date(b.postedAt).getTime();
          break;
        case 'salary':
          aValue = a.salary?.max || 0;
          bValue = b.salary?.max || 0;
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'company':
          aValue = a.company.toLowerCase();
          bValue = b.company.toLowerCase();
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">
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
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {filteredAndSortedJobs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No jobs found matching your criteria.</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  );
}

// Mock data fallback
function getMockJobs(): Job[] {
  return [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      companyId: 'techcorp',
      location: 'San Francisco, CA',
      type: 'full-time',
      remote: true,
      salary: { min: 120000, max: 180000, currency: 'USD' },
      description: 'We are looking for a senior frontend developer to join our team and help build amazing user experiences.',
      requirements: ['5+ years React experience', 'TypeScript proficiency', 'Team leadership skills'],
      benefits: ['Health insurance', '401k matching', 'Flexible PTO'],
      postedAt: '2024-01-15T10:00:00Z',
      applicationUrl: 'https://techcorp.com/careers',
      tags: ['React', 'TypeScript', 'Frontend', 'Remote'],
    },
    {
      id: '2',
      title: 'Backend Engineer',
      company: 'DataFlow',
      companyId: 'dataflow',
      location: 'New York, NY',
      type: 'full-time',
      remote: false,
      salary: { min: 100000, max: 150000, currency: 'USD' },
      description: 'Join our backend team to build scalable APIs and data processing systems.',
      requirements: ['Python/Node.js experience', 'Database design', 'API development'],
      benefits: ['Stock options', 'Health insurance', 'Learning budget'],
      postedAt: '2024-01-14T14:30:00Z',
      applicationUrl: 'https://dataflow.com/jobs',
      tags: ['Python', 'Node.js', 'Backend', 'API'],
    },
    {
      id: '3',
      title: 'UX Designer',
      company: 'DesignStudio',
      companyId: 'designstudio',
      location: 'Austin, TX',
      type: 'contract',
      remote: true,
      description: 'Create beautiful and intuitive user experiences for our mobile and web applications.',
      requirements: ['3+ years UX design', 'Figma proficiency', 'User research skills'],
      benefits: ['Flexible schedule', 'Remote work'],
      postedAt: '2024-01-13T09:15:00Z',
      applicationUrl: 'https://designstudio.com/careers',
      tags: ['UX', 'Design', 'Figma', 'Mobile'],
    },
  ];
}
