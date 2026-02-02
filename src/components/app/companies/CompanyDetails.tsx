import Link from 'next/link';
import Image from 'next/image';
import { Company, Job } from '@/types';
import {
  MapPin, 
  Users, 
  Calendar,
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
              {company.logo_url ? (
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Image
                    src={company.logo_url}
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
                {company?.metadata?.indusry && <p className="text-lg text-gray-600 mb-4">{company.metadata.industry as string}</p>}
                
                <div className="flex flex-wrap items-center gap-6 text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{company.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>0 employees</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Founded XX</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              {company.website_url && (
                <a
                  href={company.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Visit Website
                </a>
              )}
              
              <div className="flex space-x-2">
                {company?.metadata?.linkedin && (
                  <a
                    href={company.metadata.linkedin as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
                {company?.metadata?.twitter && (
                  <a
                    href={company.metadata.twitter as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                )}
                {company?.metadata?.facebook && (
                  <a
                    href={company.metadata.facebook as string}
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

                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No open positions at the moment.</p>
                  <p className="text-gray-400 text-sm mt-2">Check back later for new opportunities.</p>
                </div>
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
                    <span className="font-medium">-</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Size</span>
                    <span className="font-medium">0 employees</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Founded</span>
                    <span className="font-medium">XX</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location</span>
                    <span className="font-medium">{company.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Open Jobs</span>
                    <span className="font-medium">0</span>
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
                  {company.website_url && (
                    <a
                      href={company.website_url as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-black font-medium hover:underline"
                    >
                      Visit Website
                    </a>
                  )}
                  <Link
                    href="/public"
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

