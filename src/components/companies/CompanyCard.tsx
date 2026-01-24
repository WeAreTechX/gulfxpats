'use client';

import Link from 'next/link';
import { Company } from '@/types';
import { MapPin, Globe, Briefcase, ArrowUpRight, Building2, Users, ExternalLink } from 'lucide-react';

interface CompanyCardProps {
  company: Company;
  variant?: 'default' | 'compact' | 'featured';
}

export default function CompanyCard({ company, variant = 'default' }: CompanyCardProps) {
  if (variant === 'compact') {
    return (
      <Link href={`/companies/${company.uid}`} className="block group">
        <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-indigo-100 hover:shadow-lg transition-all">
          <div className="flex-shrink-0">
            {company.logo ? (
              <img 
                src={company.logo} 
                alt={company.name}
                className="w-12 h-12 rounded-xl object-cover border border-gray-100"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-xl flex items-center justify-center border border-indigo-100">
                <Building2 className="h-6 w-6 text-indigo-500" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
              {company.name}
            </h3>
            {company.location && (
              <p className="text-sm text-gray-500 truncate">{company.location}</p>
            )}
          </div>
          <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/companies/${company.uid}`} className="block group h-full">
      <div className="relative bg-white rounded-2xl border border-gray-100 p-6 transition-all duration-300 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          {/* Company logo */}
          <div className="flex-shrink-0">
            {company.logo ? (
              <img 
                src={company.logo} 
                alt={company.name}
                className="w-16 h-16 rounded-2xl object-cover border border-gray-100 shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-violet-100 rounded-2xl flex items-center justify-center border border-indigo-100 shadow-sm">
                <Building2 className="h-8 w-8 text-indigo-500" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors truncate">
              {company.name}
            </h3>
            {company.location && (
              <p className="text-gray-500 text-sm mt-1 flex items-center">
                <MapPin className="h-3.5 w-3.5 mr-1.5 flex-shrink-0 text-gray-400" />
                <span className="truncate">{company.location}</span>
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        {company.description && (
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 flex-1">
            {company.description}
          </p>
        )}

        {/* Stats & Actions */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          {/* Open jobs badge */}
          {company.openJobs !== undefined && company.openJobs > 0 ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                <Briefcase className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{company.openJobs}</p>
                <p className="text-xs text-gray-500">{company.openJobs === 1 ? 'Open role' : 'Open roles'}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="h-4 w-4" />
              <span className="text-sm">No open roles</span>
            </div>
          )}
          
          {/* Website link */}
          {company.website && (
            <a 
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Website</span>
              <ExternalLink className="h-3 w-3 opacity-50" />
            </a>
          )}
        </div>

        {/* Hover arrow */}
        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <ArrowUpRight className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>
    </Link>
  );
}
