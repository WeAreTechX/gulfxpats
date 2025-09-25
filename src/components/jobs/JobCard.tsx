import Link from 'next/link';
import { Job } from '@/types';
import { formatSalary, getRelativeTime, truncateText } from '@/lib/utils';
import { MapPin, Clock, DollarSign, Building2, Globe } from 'lucide-react';

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  // Check if this is a Gulf job based on location or source
  const isGulfJob = job.location && (
    job.location.toLowerCase().includes('dubai') ||
    job.location.toLowerCase().includes('abu dhabi') ||
    job.location.toLowerCase().includes('riyadh') ||
    job.location.toLowerCase().includes('jeddah') ||
    job.location.toLowerCase().includes('doha') ||
    job.location.toLowerCase().includes('kuwait') ||
    job.location.toLowerCase().includes('manama') ||
    job.location.toLowerCase().includes('muscat') ||
    job.location.toLowerCase().includes('uae') ||
    job.location.toLowerCase().includes('saudi') ||
    job.location.toLowerCase().includes('qatar') ||
    job.location.toLowerCase().includes('bahrain') ||
    job.location.toLowerCase().includes('oman')
  );

  return (
    <Link href={`/jobs/${job.uid}`}>
      <div className={`bg-white border rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer ${
        isGulfJob 
          ? 'border-blue-200 hover:border-blue-400 bg-gradient-to-br from-blue-50/30 to-white' 
          : 'border-gray-200 hover:border-[#101418]'
      }`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[#101418] mb-2 group-hover:text-[#1a1f26] transition-colors">
              {job.title}
            </h3>
            <div className="flex items-center text-gray-600 mb-2">
              <Building2 className="h-4 w-4 mr-2 text-gray-400" />
              <span className="text-sm font-medium">{job.companyName || "-"}</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-500 mb-2">
              {getRelativeTime(job.postedDate)}
            </span>
            <div className="flex flex-col gap-1">
              {isGulfJob && (
                <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  Gulf
                </span>
              )}
              {job.remote && (
                <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
                  Remote
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
          <span className="text-sm">{job.location}</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-2 text-gray-400" />
            <span className="text-sm capitalize font-medium">{job.type.replace('-', ' ')}</span>
          </div>
          {job.salaryMin && (
            <div className="flex items-center text-gray-600">
              <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
              <span className="text-sm font-semibold text-[#101418]">
                {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
              </span>
            </div>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {truncateText(job.description, 150)}
        </p>

        <div className="flex flex-wrap gap-2">
          {job.companyIndustry && job.companyIndustry.split(",").slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="bg-[#101418] text-white text-xs px-3 py-1 rounded-full font-medium"
            >
              {tag.trim()}
            </span>
          ))}
          {job.companyIndustry && job.companyIndustry.split(",").length > 3 && (
            <span className="text-gray-500 text-xs px-3 py-1">
              +{job.companyIndustry.split(",").length - 3} more
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

