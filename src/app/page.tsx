'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Job, Company } from '@/types';
import JobCard from '@/components/jobs/JobCard';
import CompanyCard from '@/components/companies/CompanyCard';
import { getJobs, getCompanies } from '@/lib/data-service';
import { ArrowRight, Briefcase, Building2 } from 'lucide-react';

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch jobs and companies using unified data service
        const [jobs, companies] = await Promise.all([
          getJobs(),
          getCompanies()
        ]);

        console.log('Fetched jobs:', jobs);
        console.log('Fetched companies:', companies);

        setJobs(jobs);
        setCompanies(companies);
      } catch (error) {
        console.error('Error fetching data:', error);
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
      <div className="text-center mb-20">
        <div className="mb-8">
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-6">
            🚀 New opportunities every day
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-[#101418] mb-6 leading-tight">
          Find Your Dream Job
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
          Connect with top companies and discover opportunities that match your skills, passion, and career goals. Your next adventure starts here.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/jobs"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-200 inline-flex items-center justify-center font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Briefcase className="h-5 w-5 mr-2" />
            Browse Jobs
          </Link>
          <Link
            href="/companies"
            className="bg-[#101418] text-white px-8 py-4 rounded-full hover:bg-[#1a1f26] transition-all duration-200 inline-flex items-center justify-center font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Building2 className="h-5 w-5 mr-2" />
            Explore Companies
          </Link>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#101418] mb-2">{jobs.length}+</div>
            <div className="text-gray-600">Active Jobs</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#101418] mb-2">{companies.length}+</div>
            <div className="text-gray-600">Companies</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#101418] mb-2">24/7</div>
            <div className="text-gray-600">Support</div>
          </div>
        </div>
      </div>

      {/* Featured Jobs Section */}
      <section className="mb-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-[#101418] mb-3">Discover Jobs</h2>
            <p className="text-gray-600 text-lg">Latest job opportunities from top companies</p>
          </div>
          <Link
            href="/jobs"
            className="flex items-center text-[#101418] hover:text-[#1a1f26] transition-colors"
          >
            View All Jobs
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        {featuredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <JobCard key={job.uid} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No jobs available at the moment.</p>
            <p className="text-gray-400 text-sm mt-2">Check back later for new opportunities.</p>
          </div>
        )}
      </section>

      {/* Featured Companies Section */}
      <section className="mb-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-[#101418] mb-3">Discover Companies</h2>
            <p className="text-gray-600 text-lg">Explore amazing companies and their opportunities</p>
          </div>
          <Link
            href="/companies"
            className="flex items-center text-[#101418] hover:text-[#1a1f26] transition-colors"
          >
            View All Companies
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        {featuredCompanies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCompanies.map((company) => (
              <CompanyCard key={company.uid} company={company} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No companies available at the moment.</p>
            <p className="text-gray-400 text-sm mt-2">Check back later for new company profiles.</p>
          </div>
        )}
      </section>
    </div>
  );
}