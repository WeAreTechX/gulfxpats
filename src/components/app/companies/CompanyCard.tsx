'use client';

import { Company } from '@/types';
import { MapPin, Globe, Briefcase, ArrowUpRight, Building2, Users, ExternalLink } from 'lucide-react';
import {getCountryByIso3} from "@/lib/countries";
import CustomImage from "@/components/custom/Image";

interface CompanyCardProps {
  company: Company;
  variant?: 'default' | 'compact' | 'featured';
  onViewCompany?: (company: Company) => void;
}

export default function CompanyCard({ company, variant = 'default', onViewCompany }: CompanyCardProps) {
  const handleClick = () => {
    if (onViewCompany) {
      onViewCompany(company);
    }
  };

  const handleWebsiteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (variant === 'compact') {
    return (
      <div onClick={handleClick} className="block group cursor-pointer">
        <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-[#04724D]/20 hover:shadow-lg transition-all">
          <div className="flex-shrink-0">
            {company.logo_url ? (
              <CustomImage
                src={company.logo_url}
                alt={company.name}
                width={64}
                height={64}
                className="rounded-xl object-cover border border-gray-100" />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-[#E6F4F0] to-teal-100 rounded-xl flex items-center justify-center border border-[#04724D]/20">
                <Building2 className="h-6 w-6 text-[#04724D]" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 group-hover:text-[#04724D] transition-colors truncate">
              {company.name}
            </h3>
            <p className="text-sm text-gray-500 truncate">{getCountryByIso3(company.country)?.name}</p>
          </div>
          <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-[#04724D] transition-colors" />
        </div>
      </div>
    );
  }

  return (
    <div onClick={handleClick} className="block group h-full cursor-pointer">
      <div className="relative bg-white rounded-2xl border border-gray-200 p-6 transition-all duration-300 hover:border-[#04724D]/20 hover:shadow-xl hover:shadow-[#04724D]/5 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          {/* Company logo */}
          <div className="flex-shrink-0">
            {company.logo_url ? (
              <CustomImage
                src={company.logo_url}
                alt={company.name}
                width={64}
                height={64}
                className="w-11 h-11 rounded-xl object-cover border border-gray-100 shadow-sm" />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-[#E6F4F0] to-teal-100 rounded-2xl flex items-center justify-center border border-[#04724D]/20 shadow-sm">
                <Building2 className="h-8 w-8 text-[#04724D]" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-lg group-hover:text-[#04724D] transition-colors truncate">
              {company.name}
            </h3>
            {company.location && (
              <p className="text-gray-500 text-sm mt-1 flex items-center">
                <MapPin className="h-3.5 w-3.5 mr-1.5 flex-shrink-0 text-gray-400" />
                <span className="truncate">{getCountryByIso3(company.country)?.name}</span>
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        {company.short_description && (
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 flex-1">
            {company.short_description}
          </p>
        )}

        {/* Stats & Actions */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          {/* Open jobs badge */}
          {company.jobs_count !== undefined && company.jobs_count > 0 ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                <Briefcase className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{company.jobs_count}</p>
                <p className="text-xs text-gray-500">{company.jobs_count === 1 ? 'Open role' : 'Open roles'}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="h-4 w-4" />
              <span className="text-sm">No open roles</span>
            </div>
          )}
          
          {/* Website link */}
          {company.website_url && (
            <a 
              href={company.website_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWebsiteClick}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-[#04724D] hover:bg-[#E6F4F0] rounded-lg transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Website</span>
              <ExternalLink className="h-3 w-3 opacity-50" />
            </a>
          )}
        </div>

        {/* Hover arrow */}
        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className="w-9 h-9 bg-[#04724D] rounded-xl flex items-center justify-center shadow-lg shadow-[#04724D]/30">
            <ArrowUpRight className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
