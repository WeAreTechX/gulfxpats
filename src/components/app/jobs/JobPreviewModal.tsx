'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Job } from '@/types/jobs';
import { formatSalary } from '@/lib/utils';
import { formatDate } from '@/lib/date';
import {
  X,
  MapPin,
  Clock,
  Banknote,
  Building2,
  ExternalLink,
  Briefcase,
  Calendar,
  Globe,
  Bookmark,
  Share2,
  Zap,
} from 'lucide-react';

interface JobPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
}

export default function JobPreviewModal({ isOpen, onClose, job }: JobPreviewModalProps) {
  if (!job) return null;

  const salary = formatSalary(job.salary_min, job.salary_max, job.currency?.code || 'USD');
  const isNew = new Date(job.created_at).getTime() > Date.now() - 3 * 24 * 60 * 60 * 1000;

  const jobTypeConfig: Record<string, { bg: string; text: string; border: string }> = {
    'full-time': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    'part-time': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    'contract': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    'internship': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    'freelance': { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  };

  const typeStyle = jobTypeConfig[job.job_type?.code || ''] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: job.title,
          text: `Check out this job: ${job.title} at ${job.company?.name}`,
          url: window.location.origin + `/jobs/${job.id}`,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.origin + `/jobs/${job.id}`);
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

                  {/* New badge */}
                  {isNew && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full mb-4">
                      <Zap className="h-3 w-3" />
                      New
                    </div>
                  )}

                  {/* Company and Job Title */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-white rounded-xl flex items-center justify-center overflow-hidden shadow-lg">
                      {job.company?.logo_url ? (
                        <img 
                          src={job.company.logo_url} 
                          alt={job.company.name} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <Building2 className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pr-8">
                      <Dialog.Title as="h3" className="text-xl font-bold leading-tight mb-1">
                        {job.title}
                      </Dialog.Title>
                      <p className="text-white/80 font-medium">
                        {job.company?.name}
                      </p>
                    </div>
                  </div>

                  {/* Quick Info Pills */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg border ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}>
                      <Briefcase className="h-3 w-3 mr-1.5" />
                      {job.job_type?.name || 'Full Time'}
                    </span>
                    {job.location && (
                      <span className="inline-flex items-center px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-lg">
                        <MapPin className="h-3 w-3 mr-1.5" />
                        {job.location}
                      </span>
                    )}
                    {job.industry && (
                      <span className="inline-flex items-center px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-lg">
                        <Globe className="h-3 w-3 mr-1.5" />
                        {job.industry.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                  {/* Salary and Posted Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
                      <div className="flex items-center text-emerald-600 mb-1">
                        <Banknote className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">Salary</span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">
                        {salary || 'Not disclosed'}
                      </p>
                      {job.salary_frequency && (
                        <p className="text-xs text-gray-500 mt-0.5 capitalize">
                          {job.salary_frequency}
                        </p>
                      )}
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <div className="flex items-center text-gray-600 mb-1">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">Posted</span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">
                        {formatDate(job.created_at, 'medium')}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                      <div className="w-1 h-4 bg-[#04724D] rounded-full mr-2"></div>
                      Job Description
                    </h4>
                    <div className="prose prose-sm prose-gray max-w-none">
                      <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                        {job.description || 'No description provided.'}
                      </p>
                    </div>
                  </div>

                  {/* Job Details Grid */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                      <div className="w-1 h-4 bg-[#04724D] rounded-full mr-2"></div>
                      Job Details
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <span className="text-xs text-gray-500 block mb-1">Job Type</span>
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {job.job_type?.name || 'Full Time'}
                        </span>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <span className="text-xs text-gray-500 block mb-1">Location</span>
                        <span className="text-sm font-medium text-gray-900">
                          {job.location || 'Not specified'}
                        </span>
                      </div>
                      {job.industry && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <span className="text-xs text-gray-500 block mb-1">Industry</span>
                          <span className="text-sm font-medium text-gray-900">
                            {job.industry.name}
                          </span>
                        </div>
                      )}
                      <div className="bg-gray-50 rounded-lg p-3">
                        <span className="text-xs text-gray-500 block mb-1">Status</span>
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {job.status?.name || 'Open'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Company Info */}
                  {job.company && (
                    <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-100">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">About {job.company.name}</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {job.company.short_description || 'Learn more about this company and their opportunities.'}
                      </p>
                      {job.company.website_url && (
                        <a
                          href={job.company.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm font-medium text-[#04724D] hover:text-teal-700 transition-colors"
                        >
                          <Globe className="h-4 w-4 mr-1.5" />
                          Visit Website
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {}}
                      className="p-2.5 text-gray-500 hover:text-[#04724D] hover:bg-[#E6F4F0] rounded-xl transition-colors"
                      title="Save job"
                    >
                      <Bookmark className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-2.5 text-gray-500 hover:text-[#04724D] hover:bg-[#E6F4F0] rounded-xl transition-colors"
                      title="Share job"
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
                    {job.apply_url && (
                      <a
                        href={job.apply_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#04724D] to-teal-600 rounded-xl hover:from-[#035E3F] hover:to-teal-700 transition-all shadow-lg shadow-[#04724D]/25"
                      >
                        Apply Now
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
