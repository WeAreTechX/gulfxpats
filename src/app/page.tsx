'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import JobCard from '@/components/jobs/JobCard';
import CompanyCard from '@/components/companies/CompanyCard';
import { ArrowRight, Briefcase, Building2, Search, Sparkles, TrendingUp, Users, Zap } from 'lucide-react';
import { JobN, Company } from '@/types';

export default function Home() {
  const [jobs, setJobs] = useState<JobN[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  const featuredJobs = jobs.slice(0, 6);
  const featuredCompanies = companies.slice(0, 6);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, companiesRes] = await Promise.all([
          fetch('/api/jobs?limit=6'),
          fetch('/api/companies?limit=6'),
        ]);
        
        const jobsData = await jobsRes.json();
        const companiesData = await companiesRes.json();
        
        if (jobsData.success) {
          setJobs(jobsData.jobs);
        }
        if (companiesData.success) {
          setCompanies(companiesData.companies);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading amazing opportunities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="relative py-12 lg:py-20">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-200/30 to-violet-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-emerald-200/30 to-cyan-200/30 rounded-full blur-3xl" />
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-8 animate-fade-in">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-700">New opportunities every day</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight animate-slide-up">
            Find Your Dream Job
            <span className="block mt-2 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
              Build Your Future
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Connect with top companies and discover opportunities that match your skills, passion, and career goals.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link href="/jobs" className="block">
              <div className="flex items-center bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-gray-200/50 hover:border-indigo-200 transition-all group">
                <Search className="h-5 w-5 text-gray-400 mr-3 group-hover:text-indigo-500 transition-colors" />
                <span className="text-gray-400 flex-1 text-left">Search jobs, companies, or keywords...</span>
                <span className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow">
                  Search
                </span>
              </div>
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all"
            >
              <Briefcase className="h-5 w-5 mr-2" />
              Browse All Jobs
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
            <Link
              href="/companies"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-medium shadow-sm hover:shadow-md hover:border-gray-300 hover:-translate-y-0.5 transition-all"
            >
              <Building2 className="h-5 w-5 mr-2" />
              Explore Companies
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="text-center p-4">
              <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl mx-auto mb-3">
                <Briefcase className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{jobs.length > 0 ? `${jobs.length}+` : '—'}</div>
              <div className="text-sm text-gray-500">Active Jobs</div>
            </div>
            <div className="text-center p-4">
              <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-xl mx-auto mb-3">
                <Building2 className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{companies.length > 0 ? `${companies.length}+` : '—'}</div>
              <div className="text-sm text-gray-500">Companies</div>
            </div>
            <div className="text-center p-4">
              <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-xl mx-auto mb-3">
                <Users className="h-6 w-6 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">10K+</div>
              <div className="text-sm text-gray-500">Job Seekers</div>
            </div>
            <div className="text-center p-4">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">95%</div>
              <div className="text-sm text-gray-500">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Jobs Section */}
      <section className="py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Zap className="h-4 w-4 text-indigo-600" />
              </div>
              <span className="text-sm font-medium text-indigo-600">Latest Opportunities</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Jobs</h2>
          </div>
          <Link
            href="/jobs"
            className="hidden sm:flex items-center text-indigo-600 hover:text-indigo-700 transition-colors font-medium group"
          >
            View All Jobs
            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        {featuredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredJobs.map((job, index) => (
              <div key={job.uid} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <JobCard job={job} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs available yet</h3>
            <p className="text-gray-500">Check back later for new opportunities.</p>
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/jobs"
            className="inline-flex items-center text-indigo-600 font-medium"
          >
            View All Jobs
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </section>

      {/* Featured Companies Section */}
      <section className="py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-4 w-4 text-emerald-600" />
              </div>
              <span className="text-sm font-medium text-emerald-600">Top Employers</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Companies</h2>
          </div>
          <Link
            href="/companies"
            className="hidden sm:flex items-center text-indigo-600 hover:text-indigo-700 transition-colors font-medium group"
          >
            View All Companies
            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        {featuredCompanies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredCompanies.map((company, index) => (
              <div key={company.uid} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CompanyCard company={company} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No companies available yet</h3>
            <p className="text-gray-500">Check back later for new company profiles.</p>
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/companies"
            className="inline-flex items-center text-indigo-600 font-medium"
          >
            View All Companies
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 rounded-3xl p-10 lg:p-16">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="1" fill="white" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>
          
          <div className="relative text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Take the Next Step?
            </h2>
            <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have found their dream jobs through Jingu. Your next opportunity is waiting.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/jobs"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-600 rounded-xl font-medium shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
              >
                <Briefcase className="h-5 w-5 mr-2" />
                Browse Jobs
              </Link>
              <Link
                href="/companies"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white border border-white/20 rounded-xl font-medium hover:bg-white/20 transition-colors"
              >
                <Building2 className="h-5 w-5 mr-2" />
                View Companies
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
