'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import JobCard from '@/components/jobs/JobCard';
import CompanyCard from '@/components/companies/CompanyCard';
import { JobsEmptyState, CompaniesEmptyState } from '@/components/custom/EmptyStates';
import { 
  ArrowRight, 
  Briefcase, 
  Building2, 
  Search, 
  Sparkles,
  Users, 
  Zap,
  CheckCircle,
  Globe,
  Shield,
  Target,
  Star,
  ChevronRight
} from 'lucide-react';
import { Job, Company } from '@/types';

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const featuredJobs = jobs.slice(0, 6);
  const featuredCompanies = companies.slice(0, 4);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, companiesRes] = await Promise.all([
          fetch('/api/jobs?limit=6'),
          fetch('/api/companies?limit=4'),
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/jobs?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-100 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-gray-500 text-sm animate-pulse">Discovering opportunities...</p>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: Target,
      title: 'Smart Matching',
      description: 'Find jobs that match your skills and career goals perfectly.',
      color: 'indigo'
    },
    {
      icon: Shield,
      title: 'Verified Employers',
      description: 'All companies are verified to ensure legitimate opportunities.',
      color: 'emerald'
    },
    {
      icon: Globe,
      title: 'Remote & Global',
      description: 'Access opportunities worldwide, including remote positions.',
      color: 'violet'
    },
    {
      icon: Zap,
      title: 'Quick Apply',
      description: 'Apply to multiple jobs in minutes with your saved profile.',
      color: 'amber'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="relative pt-8 pb-20 lg:pt-16 lg:pb-32 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-100 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-violet-100 rounded-full blur-3xl opacity-40"></div>
          <div className="absolute top-40 left-1/4 w-64 h-64 bg-emerald-100 rounded-full blur-3xl opacity-30"></div>
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 -z-10 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>

        <div className="text-center px-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100/50 mb-8 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-sm font-medium text-indigo-700">New jobs added daily</span>
          </div>
          
          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
            <span className="block">Find Your Perfect</span>
            <span className="block mt-2 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
              Career Match
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Discover thousands of job opportunities from top companies. 
            Your next career breakthrough is just a search away.
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative flex items-center bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-xl shadow-gray-200/30">
                <Search className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                <input
                  id="homeSearch"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Job title, keyword, or company..."
                  className="flex-1 text-gray-900 placeholder-gray-400 focus-visible:outline-none! focus:outline-none text-base"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:from-indigo-700 hover:to-violet-700 transition-all ml-3"
                >
                  Search Jobs
                </button>
              </div>
            </div>
            
            {/* Popular searches */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-sm">
              <span className="text-gray-500">Popular:</span>
              {['Remote', 'Full-time', 'Engineering', 'Marketing'].map((term) => (
                <Link
                  key={term}
                  href={`/jobs?search=${term.toLowerCase()}`}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
                >
                  {term}
                </Link>
              ))}
            </div>
          </form>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-8 lg:gap-16">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-gray-900">{jobs.length > 0 ? `${jobs.length}+` : '500+'}</p>
                <p className="text-sm text-gray-500">Active Jobs</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                <Building2 className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-gray-900">{companies.length > 0 ? `${companies.length}+` : '100+'}</p>
                <p className="text-sm text-gray-500">Companies</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-violet-100 rounded-2xl flex items-center justify-center">
                <Users className="h-6 w-6 text-violet-600" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-gray-900">10K+</p>
                <p className="text-sm text-gray-500">Job Seekers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t border-gray-100">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Jingu?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">We're committed to helping you find the perfect opportunity with tools and features designed for your success.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="group relative bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl bg-${feature.color}-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`h-6 w-6 text-${feature.color}-600`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-20">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">Latest Opportunities</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Featured Jobs</h2>
            <p className="text-gray-600 mt-2">Handpicked opportunities from top employers</p>
          </div>
          <Link
            href="/jobs"
            className="inline-flex items-center px-5 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors group"
          >
            View All Jobs
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        {featuredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredJobs.map((job, index) => (
              <div 
                key={job.uid} 
                className="opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
              >
                <JobCard job={job} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-100">
            <JobsEmptyState 
              action={
                <Link
                  href="/jobs"
                  className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                >
                  Browse All Jobs
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              }
            />
          </div>
        )}
      </section>

      {/* Trusted Companies Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-100 -mx-4 px-4 sm:mx-0 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Top Employers</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Trusted Companies</h2>
            <p className="text-gray-600 mt-2">Join teams at these amazing organizations</p>
          </div>
          <Link
            href="/companies"
            className="inline-flex items-center px-5 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors group shadow-sm"
          >
            View All Companies
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        {featuredCompanies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredCompanies.map((company, index) => (
              <div 
                key={company.uid}
                className="opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
              >
                <CompanyCard company={company} />
              </div>
            ))}
          </div>
        ) : (
          <CompaniesEmptyState 
            action={
              <Link
                href="/companies"
                className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
              >
                Explore Companies
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            }
          />
        )}
      </section>

      {/* Testimonial Section */}
      <section className="py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Loved by Job Seekers</h2>
          <p className="text-gray-600">See what our community has to say about their experience</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote: "Found my dream job within 2 weeks of signing up. The platform made job hunting so much easier!",
              author: "Sarah M.",
              role: "Software Engineer",
              rating: 5
            },
            {
              quote: "The quality of job listings here is amazing. No spam, just real opportunities from verified companies.",
              author: "James K.",
              role: "Product Manager",
              rating: 5
            },
            {
              quote: "I love how easy it is to filter and find relevant jobs. The interface is clean and intuitive.",
              author: "Amina O.",
              role: "UX Designer",
              rating: 5
            }
          ].map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">{testimonial.author[0]}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 mb-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 rounded-3xl p-10 lg:p-16">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="0.5" fill="white" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>
          
          <div className="relative text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
              <Sparkles className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">Start your journey today</span>
            </div>
            
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
              Ready to Find Your
              <span className="block">Dream Job?</span>
            </h2>
            <p className="text-lg text-indigo-100 mb-10 max-w-2xl mx-auto">
              Join thousands of professionals who have already found their perfect career match. Your next opportunity is just a click away.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/jobs"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
              >
                <Briefcase className="h-5 w-5 mr-2" />
                Browse Jobs
                <ChevronRight className="h-5 w-5 ml-1" />
              </Link>
              <Link
                href="/companies"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-xl font-semibold hover:bg-white/20 transition-colors"
              >
                <Building2 className="h-5 w-5 mr-2" />
                Explore Companies
              </Link>
            </div>
            
            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-10 pt-10 border-t border-white/10">
              <div className="flex items-center gap-2 text-white/80">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">Free to use</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">Verified companies</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">Daily updates</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
