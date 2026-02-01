'use client';

import { Job } from '@/types';
import { MapPin, Clock, Banknote, Building2, ArrowUpRight, Zap, Bookmark } from 'lucide-react';
import { formatDate } from "@/lib/date";
import { formatSalary } from "@/lib/utils";
import CustomImage from "@/components/custom/Image";

interface JobCardProps {
  job: Job;
  onViewJob?: (job: Job) => void;
}

export default function JobCard({ job, onViewJob }: JobCardProps) {
  const salary = job.salary_min && job.salary_max && formatSalary(job.salary_min, job.salary_max, job.currency!.code);
  const isNew = new Date(job.created_at).getTime() > Date.now() - 3 * 24 * 60 * 60 * 1000;

  const jobTypeConfig: Record<string, { bg: string; text: string; border: string }> = {
    'full-time': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' },
    'part-time': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' },
    'contract': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100' },
    'internship': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100' },
    'freelance': { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-100' },
  };

  const typeStyle = jobTypeConfig[job.type!.code] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-100' };

  const handleClick = () => {
    if (onViewJob) {
      onViewJob(job);
    }
  };

  const handleSaveJob = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Handle save job logic
  };

  return (
    <div 
      onClick={handleClick}
      className="block group h-full cursor-pointer"
    >
      <div className="relative bg-white rounded-2xl border border-gray-200 p-5 transition-all duration-300 hover:border-[#04724D]/20 hover:shadow-xl hover:shadow-[#04724D]/5 h-full flex flex-col">
        {/* New badge */}
        {isNew && (
          <div className="absolute -top-2.5 left-5">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-[#04724D] to-teal-600 text-white text-xs font-semibold rounded-full shadow-lg shadow-[#04724D]/30">
              <Zap className="h-3 w-3" />
              New
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          {/* Company logo */}
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center border border-gray-100 overflow-hidden">
            {job.company?.logo_url ? (
              <CustomImage
                src={job.company.logo_url}
                alt={job.company_name}
                width={64}
                height={64}
                className="rounded-xl object-cover border border-gray-100" />
            ) : (
              <Building2 className="h-6 w-6 text-gray-400" />
            )}
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2">
            {job.type?.code.includes('remote') && (
              <span className="px-2.5 py-1 bg-[#E6F4F0] text-[#04724D] text-xs font-medium rounded-lg border border-[#04724D]/20">
                Remote
              </span>
            )}
            <button 
              onClick={handleSaveJob}
              className="p-1.5 text-gray-400 hover:text-[#04724D] hover:bg-[#E6F4F0] rounded-lg transition-colors"
              title="Save job"
            >
              <Bookmark className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Job info */}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg group-hover:text-[#04724D] transition-colors line-clamp-2 mb-1">
            {job.title}
          </h3>
          <p className="text-gray-500 text-sm flex items-center">
            {job.company?.name}
          </p>
        </div>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-lg border ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}>
            {job.type?.name?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Full Time'}
          </span>
          {job.location && (
            <span className="inline-flex items-center px-2.5 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-lg border border-gray-100">
              <MapPin className="h-3 w-3 mr-1 text-gray-400" />
              {job.location}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex-1 min-w-0">
            {salary ? (
              <span className="flex items-center text-sm font-semibold text-gray-900">
                <Banknote className="h-4 w-4 mr-1.5 text-emerald-500 flex-shrink-0" />
                <span className="truncate">{salary}</span>
              </span>
            ) : (
              <span className="text-sm text-gray-400">Salary not disclosed</span>
            )}
          </div>
          <span className="flex items-center text-xs text-gray-400 flex-shrink-0 ml-3">
            <Clock className="h-3.5 w-3.5 mr-1" />
            {formatDate(job.created_at, 'medium')}
          </span>
        </div>

        {/* Hover effect arrow */}
        <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className="w-9 h-9 bg-[#04724D] rounded-xl flex items-center justify-center shadow-lg shadow-[#04724D]/30">
            <ArrowUpRight className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
