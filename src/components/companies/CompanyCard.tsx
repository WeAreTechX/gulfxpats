import Link from 'next/link';
import Image from 'next/image';
import { Company } from '@/types';
import { MapPin, Users, Calendar, ExternalLink } from 'lucide-react';
import DynamicImage from "@/components/layout/DynamicImage";

interface CompanyCardProps {
  company: Company;
}

export default function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Link href={`/companies/${company.id}`}>
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-start space-x-4 mb-4">
          {company.logo ? (
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <DynamicImage
                src={company.logo}
                 alt={`${company.name} logo`}
                 width={48}
                 height={48} className="rounded-lg"
              />
            </div>
          ) : (
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-gray-400">
                {company.name.charAt(0)}
              </span>
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-black mb-1 truncate">
              {company.name}
            </h3>
            <p className="text-gray-600 text-sm mb-2">{company.industry}</p>
            <div className="flex items-center text-gray-500 text-sm">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="truncate">{company.address}</span>
            </div>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {company.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{company.size} employees</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Founded {company.founded}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
              {company.openJobs} open jobs
            </span>
          </div>
          <div className="flex items-center text-gray-400">
            <ExternalLink className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}

