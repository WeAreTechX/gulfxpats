'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Briefcase, Loader2 } from 'lucide-react';
import {Job, JobCreate} from "@/types/jobs";
import {Currency } from "@/types";
import {Company} from "@/types/companies";
import {JobType, JobIndustry} from "@/types/jobs";

interface StoreSingleJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  job?: Job | null;
}

const getInitialFormData = (): JobCreate => ({
  title: '',
  description: '',
  company_id: 0,
  job_type_id: 0,
  job_industry_id: 0,
  location: '',
  salary_min: 0,
  salary_max: 0,
  salary_frequency: 'monthly',
  currency_id: 0,
  apply_url: '',
  status_id: 8,
  metadata: {}
});

export default function StoreSingleJobModal({
  isOpen,
  onClose,
  onSuccess,
  job
}: StoreSingleJobModalProps) {
  const isEditMode = !!job;

  const [companies, setCompanies] = useState<Company[]>([]);
  const [jobTypes, setJobTypes] = useState<JobType[]>([]);
  const [jobIndustries, setJobIndustries] = useState<JobIndustry[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch companies and lookups in parallel
      const [companiesRes, jobTypesRes, jobIndustriesRes, currenciesRes] = await Promise.all([
        fetch('/api/companies'),
        fetch('/api/lookups?type=job-types'),
        fetch('/api/lookups?type=job-industries'),
        fetch('/api/lookups?type=currencies'),
      ]);

      const companiesData = await companiesRes.json();
      const jobTypesData = await jobTypesRes.json();
      const jobIndustriesData = await jobIndustriesRes.json();
      const currenciesData = await currenciesRes.json();

      if (companiesData.success) setCompanies(companiesData.companies || []);
      if (jobTypesData.success) setJobTypes(jobTypesData.data || []);
      if (jobIndustriesData.success) setJobIndustries(jobIndustriesData.data || []);
      if (currenciesData.success) setCurrencies(currenciesData.data || []);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const [formData, setFormData] = useState<JobCreate>(getInitialFormData());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal opens/closes or job changes
  useEffect(() => {
    if (isOpen) {
      if (job) {
        // Populate form with existing job data for edit mode
        setFormData({
          title: job.title,
          description: job.description,
          company_id: job.company_id,
          job_type_id: job.job_type_id,
          job_industry_id: job.job_industry_id,
          location: job.location || '',
          salary_min: job.salary_min,
          salary_max: job.salary_max,
          salary_frequency: job.salary_frequency,
          currency_id: job.currency_id,
          apply_url: job.apply_url || '',
          status_id: job.status_id,
          metadata: job.metadata
        });
      } else {
        // Reset form for add mode
        setFormData(getInitialFormData());
      }
      setError(null);
    }
  }, [isOpen, job]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        title: formData.title,
        description: formData.description || null,
        company_id: formData.company_id,
        job_type_id: formData.job_type_id,
        job_industry_id: formData.job_industry_id,
        location: formData.location || null,
        salary_min: formData.salary_min,
        salary_max: formData.salary_max,
        currency_id: formData.currency_id,
        apply_url: formData.apply_url,
        status_id: formData.status_id,
      };

      const url = isEditMode ? `/api/jobs/${job.id}` : '/api/jobs';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || `Failed to ${isEditMode ? 'update' : 'create'} job`);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
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
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                {/* Header */}
                <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 px-6 py-6 text-white">
                  <button
                    onClick={onClose}
                    className="absolute right-4 top-4 p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <Briefcase className="h-5 w-5 text-white" />
                    </div>
                  </div>

                  <Dialog.Title as="h3" className="text-xl font-bold">
                    {isEditMode ? 'Edit Job' : 'Add New Job'}
                  </Dialog.Title>
                  <p className="mt-1 text-white/70 text-sm">
                    {isEditMode ? 'Update the job information below' : 'Fill in the details to add a new job listing'}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Job Details */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-4">Job Details</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Job Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                          placeholder="e.g., Senior Software Engineer"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows={4}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors resize-none"
                          placeholder="Job description and requirements..."
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Company <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="company_id"
                            value={formData.company_id}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                          >
                            <option value="">Select company</option>
                            {companies.map((company) => (
                              <option key={company.id} value={company.id}>
                                {company.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Job Type <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="job_type_id"
                            value={formData.job_type_id}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                          >
                            <option value="">Select type</option>
                            {jobTypes.map((type) => (
                              <option key={type.id} value={type.id}>
                                {type.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Job Industry <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="job_industry_id"
                            value={formData.job_industry_id}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                          >
                            <option value="">Select industry</option>
                            {jobIndustries.map((type) => (
                              <option key={type.id} value={type.id}>
                                {type.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                          placeholder="e.g., Dubai, UAE"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Salary Information */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-4">Salary Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Min Salary
                        </label>
                        <input
                          type="number"
                          name="salary_min"
                          value={formData.salary_min}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Max Salary
                        </label>
                        <input
                          type="number"
                          name="salary_max"
                          value={formData.salary_max}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Currency
                        </label>
                        <select
                          name="currency_id"
                          value={formData.currency_id}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                        >
                          <option value="">Select currency</option>
                          {currencies.map((curr) => (
                            <option key={curr.id} value={curr.id}>
                              {curr.code} ({curr.symbol})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Application URL */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-4">Application</h4>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Apply URL <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        name="apply_url"
                        value={formData.apply_url}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </form>

                {/* Footer */}
                <div className="border-t border-slate-200 px-6 py-4 bg-slate-50 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !formData.title || !formData.company_id || !formData.job_type_id || !formData.apply_url}
                    className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isEditMode ? 'Update Job' : 'Add Job'}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
