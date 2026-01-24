'use client';

import Link from 'next/link';
import { JobN } from '@/types';
import { MapPin, Clock, Banknote, Building2, ArrowUpRight, Zap } from 'lucide-react';

interface JobCardProps {
  job: JobN;
}

export default function JobCard({ job }: JobCardProps) {
  const formatSalary = (min: number, max: number, currency: string) => {
    if (!min && !max) return null;
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: 0,
    });
    if (min && max) {
      return `${formatter.format(min)} - ${formatter.format(max)}`;
    }
    if (min) return `From ${formatter.format(min)}`;
    if (max) return `Up to ${formatter.format(max)}`;
    return null;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const salary = formatSalary(job.salaryMin, job.salaryMax, job.currency);
  const isNew = new Date(job.postedDate).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000;

  const jobTypeColors: Record<string, string> = {
    'full-time': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'part-time': 'bg-blue-50 text-blue-700 border-blue-200',
    'contract': 'bg-amber-50 text-amber-700 border-amber-200',
    'internship': 'bg-purple-50 text-purple-700 border-purple-200',
    'freelance': 'bg-pink-50 text-pink-700 border-pink-200',
  };

  return (
    <Link href={`/jobs/${job.uid}`} className="block group">
      <div className="relative bg-white rounded-2xl border border-gray-200/80 p-5 transition-all duration-300 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1">
        {/* New badge */}
        {isNew && (
          <div className="absolute -top-2.5 -right-2.5">
            <div className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-medium rounded-full shadow-lg shadow-indigo-500/30">
              <Zap className="h-3 w-3" />
              New
            </div>
          </div>
        )}

        <div className="flex items-start justify-between gap-4">
          {/* Company logo placeholder */}
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl flex items-center justify-center border border-gray-200/50">
            <Building2 className="h-6 w-6 text-gray-400" />
          </div>

          {/* Remote badge */}
          {job.remote && (
            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full border border-indigo-100">
              Remote
            </span>
          )}
        </div>

        <div className="mt-4">
          <h3 className="font-semibold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors line-clamp-1">
            {job.title}
          </h3>
          <p className="text-gray-600 text-sm mt-1 flex items-center">
            <Building2 className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
            {job.companyName || job.company}
          </p>
        </div>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-lg border ${jobTypeColors[job.type] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
            {job.type?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Full Time'}
          </span>
          {job.location && (
            <span className="inline-flex items-center px-2.5 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-lg border border-gray-200">
              <MapPin className="h-3 w-3 mr-1" />
              {job.location}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {salary && (
              <span className="flex items-center text-sm font-semibold text-gray-900">
                <Banknote className="h-4 w-4 mr-1.5 text-emerald-500" />
                {salary}
              </span>
            )}
          </div>
          <span className="flex items-center text-xs text-gray-500">
            <Clock className="h-3.5 w-3.5 mr-1" />
            {formatDate(job.postedDate)}
          </span>
        </div>

        {/* Hover arrow */}
        <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <ArrowUpRight className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>
    </Link>
  );
}
