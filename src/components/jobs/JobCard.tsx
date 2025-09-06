import Link from 'next/link';
import { Job } from '@/types';
import { formatSalary, getRelativeTime, truncateText } from '@/lib/utils';
import { MapPin, Clock, DollarSign, Building2 } from 'lucide-react';

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <Link href={`/jobs/${job.id}`}>
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-black mb-1">
              {job.title}
            </h3>
            <div className="flex items-center text-gray-600 mb-2">
              <Building2 className="h-4 w-4 mr-1" />
              <span className="text-sm">{job.company}</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-500 mb-1">
              {getRelativeTime(job.postedAt)}
            </span>
            {job.remote && (
              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                Remote
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{job.location}</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            <span className="text-sm capitalize">{job.type.replace('-', ' ')}</span>
          </div>
          {job.salary && (
            <div className="flex items-center text-gray-600">
              <DollarSign className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">
                {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
              </span>
            </div>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4">
          {truncateText(job.description, 150)}
        </p>

        <div className="flex flex-wrap gap-2">
          {job.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
          {job.tags.length > 3 && (
            <span className="text-gray-500 text-xs px-2 py-1">
              +{job.tags.length - 3} more
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

