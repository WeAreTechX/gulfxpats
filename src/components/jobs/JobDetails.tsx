import Link from 'next/link';
import { Job } from '@/types';
import { formatSalary, formatDate, getRelativeTime } from '@/lib/utils';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Building2, 
  ExternalLink,
  ArrowLeft,
  Users,
  Calendar
} from 'lucide-react';

interface JobDetailsProps {
  job: Job;
}

export default function JobDetails({ job }: JobDetailsProps) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <Link 
        href="/"
        className="inline-flex items-center text-gray-600 hover:text-black mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Jobs
      </Link>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-black mb-2">
                {job.title}
              </h1>
              <div className="flex items-center text-gray-600 mb-4">
                <Building2 className="h-5 w-5 mr-2" />
                <Link 
                  href={`/companies/${job.companyId}`}
                  className="text-lg font-medium hover:text-black"
                >
                  {job.company}
                </Link>
              </div>
              
              <div className="flex flex-wrap items-center gap-6 text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="capitalize">{job.type.replace('-', ' ')}</span>
                </div>
                {job.remote && (
                  <span className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                    Remote
                  </span>
                )}
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Posted {getRelativeTime(job.postedAt)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 lg:mt-0 lg:ml-8">
              {job.salary && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="flex items-center text-gray-600 mb-1">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span className="text-sm">Salary</span>
                  </div>
                  <div className="text-xl font-bold text-black">
                    {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
                  </div>
                </div>
              )}
              
              <a
                href={job.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full lg:w-auto bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors inline-flex items-center justify-center"
              >
                Apply Now
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <section>
                <h2 className="text-xl font-semibold text-black mb-4">Job Description</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {job.description}
                  </p>
                </div>
              </section>

              {/* Requirements */}
              {job.requirements.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold text-black mb-4">Requirements</h2>
                  <ul className="space-y-2">
                    {job.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-gray-700">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Benefits */}
              {job.benefits.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold text-black mb-4">Benefits</h2>
                  <ul className="space-y-2">
                    {job.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Job Details */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-black mb-4">Job Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type</span>
                    <span className="font-medium capitalize">{job.type.replace('-', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location</span>
                    <span className="font-medium">{job.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Remote</span>
                    <span className="font-medium">{job.remote ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Posted</span>
                    <span className="font-medium">{formatDate(job.postedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {job.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Skills & Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Company Info */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-black mb-4">About {job.company}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Learn more about this company and their other opportunities.
                </p>
                <Link
                  href={`/companies/${job.companyId}`}
                  className="text-black font-medium hover:underline inline-flex items-center"
                >
                  View Company Profile
                  <ExternalLink className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

