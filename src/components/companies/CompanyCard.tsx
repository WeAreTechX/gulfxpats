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
    <Link href={`/companies/${company.uid}`}>
      <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-[#101418] transition-all duration-300 group cursor-pointer">
        <div className="flex items-start space-x-4 mb-4">
          {company.logo ? (
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-gray-100 transition-colors">
              <DynamicImage
                src={company.logo}
                 alt={`${company.name} logo`}
                 width={48}
                 height={48} className="rounded-xl"
              />
            </div>
          ) : (
            <div className="w-16 h-16 bg-[#101418] rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-white">
                {company.name.charAt(0)}
              </span>
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-[#101418] mb-1 truncate group-hover:text-[#1a1f26] transition-colors capitalize">
              {company.name}
            </h3>
            <p className="text-gray-600 text-sm mb-2 font-medium">-</p>
            <div className="flex items-center text-gray-500 text-sm">
              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
              <span className="truncate">{company.location}</span>
            </div>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {company.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-gray-400" />
            <span className="font-medium">- employees</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            <span className="font-medium">Founded -</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="bg-gray-200 text-[#101418] text-xs px-3 py-1 rounded-full font-medium">
              0 open jobs
            </span>
          </div>
          <div className="flex items-center text-gray-400 group-hover:text-[#101418] transition-colors">
            <ExternalLink className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}

