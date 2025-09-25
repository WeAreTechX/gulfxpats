import Link from 'next/link';
import { Job } from '@/types';
import { formatSalary, getRelativeTime, truncateText } from '@/lib/utils';
import { MapPin, Clock, DollarSign, Building2 } from 'lucide-react';

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <Link href={`/jobs/${job.uid}`}>
      <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-[#101418] transition-all duration-300 group cursor-pointer">
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
            {job.remote && (
              <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
                Remote
              </span>
            )}
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

