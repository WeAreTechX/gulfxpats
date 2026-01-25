'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {JobsEmptyState} from '@/components/custom/EmptyStates';
import {ArrowRight, Zap} from 'lucide-react';
import JobCard from "@/components/app/jobs/JobCard";
import {Job} from "@/types/jobs";

export default function FeaturedJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const  jobsRes = await fetch('/api/jobs?limit=4')
        const jobsData = await jobsRes.json();
        if (jobsData.success) setJobs(jobsData.data.list);
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
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[#E6F4F0] rounded-full"></div>
            <div className="w-16 h-16 border-4 border-transparent border-t-[#04724D] rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-gray-500 text-sm animate-pulse">Discovering jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-20">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#04724D] to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-[#04724D]/20">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-semibold text-[#04724D] uppercase tracking-wider">Latest Opportunities</span>
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

      {jobs && jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.map((job, index) => (
            <div
              key={job.id}
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
                className="inline-flex items-center px-6 py-3 bg-[#04724D] text-white rounded-xl font-medium hover:bg-[#035E3F] transition-colors"
              >
                Browse All Jobs
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            }
          />
        </div>
      )}
    </section>
  );
}
