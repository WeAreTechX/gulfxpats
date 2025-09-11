'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Job, Company } from '@/types';
import JobCard from '@/components/jobs/JobCard';
import CompanyCard from '@/components/companies/CompanyCard';
import { getJobs, getCompanies } from '@/lib/airtable';
import { ArrowRight, Briefcase, Building2 } from 'lucide-react';

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch jobs
        const airtableJobs = await getJobs();
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

        // Fetch companies
        const airtableCompanies = await getCompanies();
        const transformedCompanies: Company[] = airtableCompanies.map(company => ({
          id: company.id,
          name: company.fields.Name || '',
          logo: company.fields.Logo?.[0]?.url,
          description: company.fields.Description || '',
          website: company.fields.Website || '',
          address: company.fields.Address || '',
          industry: company.fields.Industry || '',
          size: company.fields.Size || '',
          founded: company.fields.Founded || 0,
          openJobs: company.fields.OpenRoles || Math.floor(Math.random() * 20) + 1,
          socialMedia: {
            linkedin: company.fields['LinkedIn URL'],
            twitter: company.fields['Twitter URL'],
            facebook: company.fields['Facebook URL'],
          },
        }));

        setJobs(transformedJobs);
        setCompanies(transformedCompanies);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to mock data if API fails
        setJobs(getMockJobs());
        setCompanies(getMockCompanies());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get first 6 jobs and 6 companies for display
  const featuredJobs = jobs.slice(0, 3);
  const featuredCompanies = companies.slice(0, 3);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
          Find Your Dream Job
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Discover amazing opportunities with top companies. Connect with employers and find your next career move.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/jobs"
            className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors inline-flex items-center justify-center"
          >
            <Briefcase className="h-5 w-5 mr-2" />
            Browse Jobs
          </Link>
          <Link
            href="/companies"
            className="border border-black text-black px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
          >
            <Building2 className="h-5 w-5 mr-2" />
            Explore Companies
          </Link>
        </div>
      </div>

      {/* Featured Jobs Section */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-black mb-2">Discover Jobs</h2>
            <p className="text-gray-600">Latest job opportunities from top companies</p>
          </div>
          <Link
            href="/jobs"
            className="flex items-center text-black hover:text-gray-600 transition-colors"
          >
            View All Jobs
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        {featuredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No jobs available at the moment.</p>
            <p className="text-gray-400 text-sm mt-2">Check back later for new opportunities.</p>
          </div>
        )}
      </section>

      {/* Featured Companies Section */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-black mb-2">Discover Companies</h2>
            <p className="text-gray-600">Explore amazing companies and their opportunities</p>
          </div>
          <Link
            href="/companies"
            className="flex items-center text-black hover:text-gray-600 transition-colors"
          >
            View All Companies
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        {featuredCompanies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCompanies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No companies available at the moment.</p>
            <p className="text-gray-400 text-sm mt-2">Check back later for new company profiles.</p>
          </div>
        )}
      </section>
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
    {
      id: '4',
      title: 'Product Manager',
      company: 'InnovateCorp',
      companyId: 'innovatecorp',
      location: 'Seattle, WA',
      type: 'full-time',
      remote: true,
      salary: { min: 130000, max: 200000, currency: 'USD' },
      description: 'Lead product strategy and development for our next-generation platform.',
      requirements: ['5+ years product management', 'Technical background', 'Agile experience'],
      benefits: ['Equity', 'Health insurance', 'Unlimited PTO'],
      postedAt: '2024-01-12T16:45:00Z',
      applicationUrl: 'https://innovatecorp.com/careers',
      tags: ['Product', 'Strategy', 'Agile', 'Remote'],
    },
    {
      id: '5',
      title: 'DevOps Engineer',
      company: 'CloudTech',
      companyId: 'cloudtech',
      location: 'Denver, CO',
      type: 'full-time',
      remote: false,
      salary: { min: 110000, max: 160000, currency: 'USD' },
      description: 'Build and maintain our cloud infrastructure and deployment pipelines.',
      requirements: ['AWS/Azure experience', 'Docker/Kubernetes', 'CI/CD pipelines'],
      benefits: ['Health insurance', '401k matching', 'Learning budget'],
      postedAt: '2024-01-11T11:20:00Z',
      applicationUrl: 'https://cloudtech.com/jobs',
      tags: ['DevOps', 'AWS', 'Kubernetes', 'Infrastructure'],
    },
    {
      id: '6',
      title: 'Data Scientist',
      company: 'AnalyticsPro',
      companyId: 'analyticspro',
      location: 'Boston, MA',
      type: 'full-time',
      remote: true,
      salary: { min: 125000, max: 175000, currency: 'USD' },
      description: 'Apply machine learning and statistical analysis to solve complex business problems.',
      requirements: ['PhD in Data Science', 'Python/R proficiency', 'ML frameworks'],
      benefits: ['Stock options', 'Health insurance', 'Research budget'],
      postedAt: '2024-01-10T14:10:00Z',
      applicationUrl: 'https://analyticspro.com/careers',
      tags: ['Data Science', 'Machine Learning', 'Python', 'Remote'],
    },
  ];
}

function getMockCompanies(): Company[] {
  return [
    {
      id: 'techcorp',
      name: 'TechCorp',
      description: 'Leading technology company focused on innovation and cutting-edge solutions for modern businesses.',
      website: 'https://techcorp.com',
      address: 'San Francisco, CA',
      industry: 'Technology',
      size: '500-1000',
      founded: 2015,
      openJobs: 12,
      socialMedia: {
        linkedin: 'https://linkedin.com/company/techcorp',
        twitter: 'https://twitter.com/techcorp',
      },
    },
    {
      id: 'dataflow',
      name: 'DataFlow',
      description: 'Data analytics and processing company helping businesses make data-driven decisions.',
      website: 'https://dataflow.com',
      address: 'New York, NY',
      industry: 'Data & Analytics',
      size: '100-500',
      founded: 2018,
      openJobs: 8,
      socialMedia: {
        linkedin: 'https://linkedin.com/company/dataflow',
      },
    },
    {
      id: 'designstudio',
      name: 'DesignStudio',
      description: 'Creative design agency specializing in user experience and brand identity.',
      website: 'https://designstudio.com',
      address: 'Austin, TX',
      industry: 'Design',
      size: '50-100',
      founded: 2020,
      openJobs: 5,
      socialMedia: {
        linkedin: 'https://linkedin.com/company/designstudio',
        twitter: 'https://twitter.com/designstudio',
        facebook: 'https://facebook.com/designstudio',
      },
    },
    {
      id: 'innovatecorp',
      name: 'InnovateCorp',
      description: 'Innovation-driven company creating breakthrough products that transform industries.',
      website: 'https://innovatecorp.com',
      address: 'Seattle, WA',
      industry: 'Technology',
      size: '200-500',
      founded: 2017,
      openJobs: 15,
      socialMedia: {
        linkedin: 'https://linkedin.com/company/innovatecorp',
        twitter: 'https://twitter.com/innovatecorp',
      },
    },
    {
      id: 'cloudtech',
      name: 'CloudTech',
      description: 'Cloud infrastructure and services provider enabling digital transformation.',
      website: 'https://cloudtech.com',
      address: 'Denver, CO',
      industry: 'Cloud Computing',
      size: '100-200',
      founded: 2019,
      openJobs: 7,
      socialMedia: {
        linkedin: 'https://linkedin.com/company/cloudtech',
      },
    },
    {
      id: 'analyticspro',
      name: 'AnalyticsPro',
      description: 'Advanced analytics and AI solutions for enterprise customers worldwide.',
      website: 'https://analyticspro.com',
      address: 'Boston, MA',
      industry: 'Analytics & AI',
      size: '300-600',
      founded: 2016,
      openJobs: 10,
      socialMedia: {
        linkedin: 'https://linkedin.com/company/analyticspro',
        twitter: 'https://twitter.com/analyticspro',
      },
    },
  ];
}
