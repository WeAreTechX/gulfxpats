import Link from 'next/link';
import Image from 'next/image';
import { Company, Job } from '@/types';
import { formatSalary, getRelativeTime } from '@/lib/utils';
import { 
  MapPin, 
  Users, 
  Calendar, 
  ExternalLink,
  ArrowLeft,
  Building2,
  Globe,
  Linkedin,
  Twitter,
  Facebook
} from 'lucide-react';

interface CompanyDetailsProps {
  company: Company;
  jobs: Job[];
}

export default function CompanyDetails({ company, jobs }: CompanyDetailsProps) {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Back Button */}
      <Link 
        href="/companies"
        className="inline-flex items-center text-gray-600 hover:text-black mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Companies
      </Link>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Company Header */}
        <div className="p-8 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start space-x-6 mb-6 lg:mb-0">
              {company.logo ? (
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Image
                    src={company.logo}
                    alt={`${company.name} logo`}
                    width={80}
                    height={80}
                    className="rounded-lg"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-4xl font-bold text-gray-400">
                    {company.name.charAt(0)}
                  </span>
                </div>
              )}
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-black mb-2">
                  {company.name}
                </h1>
                <p className="text-lg text-gray-600 mb-4">{company.industry}</p>
                
                <div className="flex flex-wrap items-center gap-6 text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{company.address}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{company.size} employees</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Founded {company.founded}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Visit Website
                </a>
              )}
              
              <div className="flex space-x-2">
                {company.socialMedia.linkedin && (
                  <a
                    href={company.socialMedia.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
                {company.socialMedia.twitter && (
                  <a
                    href={company.socialMedia.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                )}
                {company.socialMedia.facebook && (
                  <a
                    href={company.socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <section>
                <h2 className="text-2xl font-semibold text-black mb-4">About {company.name}</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {company.short_description}
                  </p>
                </div>
              </section>

              {/* Open Jobs */}
              <section>
                <h2 className="text-2xl font-semibold text-black mb-6">
                  Open Positions ({jobs.length})
                </h2>
                
                {jobs.length > 0 ? (
                  <div className="space-y-4">
                    {jobs.map((job) => (
                      <div key={job.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                          <div className="flex-1">
                            <Link 
                              href={`/src/app/(app)/jobs/${job.id}`}
                              className="text-xl font-semibold text-black hover:underline mb-2 block"
                            >
                              {job.title}
                            </Link>
                            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-3">
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>{job.location}</span>
                              </div>
                              <span className="capitalize">{job.type.replace('-', ' ')}</span>
                              {job.remote && (
                                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                  Remote
                                </span>
                              )}
                              <span className="text-sm">
                                Posted {getRelativeTime(job.postedAt)}
                              </span>
                            </div>
                            {job.salary && (
                              <div className="text-gray-600 mb-3">
                                <span className="font-medium">
                                  {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
                                </span>
                              </div>
                            )}
                            <p className="text-gray-600 text-sm line-clamp-2">
                              {job.description}
                            </p>
                          </div>
                          <div className="mt-4 lg:mt-0 lg:ml-6">
                            <Link
                              href={`/src/app/(app)/jobs/${job.id}`}
                              className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                            >
                              View Job
                              <ExternalLink className="h-4 w-4 ml-2" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No open positions at the moment.</p>
                    <p className="text-gray-400 text-sm mt-2">Check back later for new opportunities.</p>
                  </div>
                )}
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Company Info */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-black mb-4">Company Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Industry</span>
                    <span className="font-medium">{company.industry}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Size</span>
                    <span className="font-medium">{company.size} employees</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Founded</span>
                    <span className="font-medium">{company.founded}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location</span>
                    <span className="font-medium">{company.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Open Jobs</span>
                    <span className="font-medium">{company.openJobs}</span>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-black mb-4">Get in Touch</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Interested in working at {company.name}? Check out their open positions or visit their website.
                </p>
                <div className="space-y-2">
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-black font-medium hover:underline"
                    >
                      Visit Website
                    </a>
                  )}
                  <Link
                    href="/"
                    className="block text-black font-medium hover:underline"
                  >
                    View All Jobs
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

