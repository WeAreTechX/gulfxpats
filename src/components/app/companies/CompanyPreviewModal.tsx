'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Company } from '@/types/companies';
import {
  X,
  MapPin,
  Globe,
  Building2,
  ExternalLink,
  Briefcase,
  Users,
  Share2,
  Bookmark,
  Mail,
  Linkedin,
} from 'lucide-react';
import { getCountryByIso3 } from '@/lib/countries';

interface CompanyPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company | null;
}

export default function CompanyPreviewModal({ isOpen, onClose, company }: CompanyPreviewModalProps) {
  if (!company) return null;

  const locationName = company.location ? getCountryByIso3(company.location)?.name : null;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: company.name,
          text: `Check out ${company.name} on Jingu`,
          url: window.location.origin + `/companies/${company.id}`,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.origin + `/companies/${company.id}`);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div 
            className="flex min-h-full items-center justify-center p-4"
            onClick={onClose}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in-out duration-300"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <Dialog.Panel 
                className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="relative bg-gradient-to-br from-[#04724D] to-teal-600 px-6 py-6 text-white">
                  {/* Close button */}
                  <button
                    onClick={onClose}
                    className="absolute right-4 top-4 p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  {/* Company Info */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-20 h-20 bg-white rounded-xl flex items-center justify-center overflow-hidden shadow-lg">
                      {company.logo_url ? (
                        <img 
                          src={company.logo_url} 
                          alt={company.name} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <Building2 className="h-10 w-10 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pr-8">
                      <Dialog.Title as="h3" className="text-xl font-bold leading-tight mb-1">
                        {company.name}
                      </Dialog.Title>
                      {company.metadata?.industry && (
                        <p className="text-white/80 font-medium mb-2">
                          {company.metadata.industry}
                        </p>
                      )}
                      {/* Quick Info Pills */}
                      <div className="flex flex-wrap gap-2">
                        {locationName && (
                          <span className="inline-flex items-center px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-lg">
                            <MapPin className="h-3 w-3 mr-1.5" />
                            {locationName}
                          </span>
                        )}
                        {company.jobs_count !== undefined && company.jobs_count > 0 && (
                          <span className="inline-flex items-center px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-lg">
                            <Briefcase className="h-3 w-3 mr-1.5" />
                            {company.jobs_count} open {company.jobs_count === 1 ? 'role' : 'roles'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
                      <div className="flex items-center text-emerald-600 mb-1">
                        <Briefcase className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">Open Positions</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {company.jobs_count || 0}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <div className="flex items-center text-gray-600 mb-1">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">Location</span>
                      </div>
                      <p className="text-lg font-bold text-gray-900 truncate">
                        {locationName || 'Not specified'}
                      </p>
                    </div>
                  </div>

                  {/* About Section */}
                  {company.short_description && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                        <div className="w-1 h-4 bg-[#04724D] rounded-full mr-2"></div>
                        About {company.name}
                      </h4>
                      <div className="prose prose-sm prose-gray max-w-none">
                        <p className="text-gray-600 leading-relaxed">
                          {company.short_description}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Long Description if available */}
                  {company.long_description && (
                    <div className="mb-6">
                      <div className="prose prose-sm prose-gray max-w-none">
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                          {company.long_description}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Company Details Grid */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                      <div className="w-1 h-4 bg-[#04724D] rounded-full mr-2"></div>
                      Company Details
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {company.metadata?.industry && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <span className="text-xs text-gray-500 block mb-1">Industry</span>
                          <span className="text-sm font-medium text-gray-900">
                            {company.metadata.industry}
                          </span>
                        </div>
                      )}
                      {locationName && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <span className="text-xs text-gray-500 block mb-1">Country</span>
                          <span className="text-sm font-medium text-gray-900">
                            {locationName}
                          </span>
                        </div>
                      )}
                      {company.address && (
                        <div className="bg-gray-50 rounded-lg p-3 col-span-2">
                          <span className="text-xs text-gray-500 block mb-1">Address</span>
                          <span className="text-sm font-medium text-gray-900">
                            {company.address}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Information */}
                  {(company.contact?.email || company.contact?.linkedin || company.metadata?.email) && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                        <div className="w-1 h-4 bg-[#04724D] rounded-full mr-2"></div>
                        Contact
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {(company.contact?.email || company.metadata?.email) && (
                          <a
                            href={`mailto:${company.contact?.email || company.metadata?.email}`}
                            className="inline-flex items-center px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                          >
                            <Mail className="h-4 w-4 mr-2 text-gray-500" />
                            Email
                          </a>
                        )}
                        {(company.contact?.linkedin || company.metadata?.linkedin) && (
                          <a
                            href={company.contact?.linkedin || company.metadata?.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                          >
                            <Linkedin className="h-4 w-4 mr-2 text-gray-500" />
                            LinkedIn
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Website Card */}
                  {company.website_url && (
                    <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-1">Visit Website</h4>
                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            {company.website_url.replace(/^https?:\/\//, '')}
                          </p>
                        </div>
                        <a
                          href={company.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Globe className="h-4 w-4" />
                          Open
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {}}
                      className="p-2.5 text-gray-500 hover:text-[#04724D] hover:bg-[#E6F4F0] rounded-xl transition-colors"
                      title="Save company"
                    >
                      <Bookmark className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-2.5 text-gray-500 hover:text-[#04724D] hover:bg-[#E6F4F0] rounded-xl transition-colors"
                      title="Share company"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={onClose}
                      className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Close
                    </button>
                    {company.website_url && (
                      <a
                        href={company.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#04724D] to-teal-600 rounded-xl hover:from-[#035E3F] hover:to-teal-700 transition-all shadow-lg shadow-[#04724D]/25"
                      >
                        Visit Website
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
