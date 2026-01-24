'use client';

import Link from 'next/link';
import { Company } from '@/types';
import { MapPin, Globe, Briefcase, ArrowUpRight, Building2 } from 'lucide-react';

interface CompanyCardProps {
  company: Company;
}

export default function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Link href={`/companies/${company.uid}`} className="block group">
      <div className="relative bg-white rounded-2xl border border-gray-200/80 p-6 transition-all duration-300 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 h-full">
        <div className="flex items-start gap-4">
          {/* Company logo */}
          <div className="flex-shrink-0">
            {company.logo ? (
              <img 
                src={company.logo} 
                alt={company.name}
                className="w-14 h-14 rounded-xl object-cover border border-gray-100"
              />
            ) : (
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-xl flex items-center justify-center border border-indigo-100">
                <Building2 className="h-7 w-7 text-indigo-500" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors truncate">
              {company.name}
            </h3>
            {company.location && (
              <p className="text-gray-500 text-sm mt-1 flex items-center">
                <MapPin className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                <span className="truncate">{company.location}</span>
              </p>
            )}
          </div>
        </div>

        {company.description && (
          <p className="text-gray-600 text-sm mt-4 line-clamp-2">
            {company.description}
          </p>
        )}

        {/* Stats */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4">
          {company.openJobs !== undefined && company.openJobs > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                <Briefcase className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{company.openJobs}</p>
                <p className="text-xs text-gray-500">Open roles</p>
              </div>
            </div>
          )}
          {company.website && (
            <a 
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-indigo-600 transition-colors ml-auto"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Website</span>
            </a>
          )}
        </div>

        {/* Hover arrow */}
        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <ArrowUpRight className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>
    </Link>
  );
}
