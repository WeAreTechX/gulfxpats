'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Briefcase, Loader2 } from 'lucide-react';
import {Currency, Entity, Job, JobCreate, Company } from "@/types";
import {COUNTRIES} from "@/lib/countries";

interface StoreSingleJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  job?: Job | null;
}

const getInitialFormData = (): JobCreate => ({
  title: '',
  description: '',
  type_id: undefined,
  company_id: '',
  company_name: '',
  jobs_scrapings_id: '',
  industry_id: undefined,
  location: '',
  country: '',
  salary_min: 0,
  salary_max: 0,
  salary_frequency: 'monthly',
  currency_id: undefined,
  apply_url: '',
  metadata: {},
  is_premium: false
});

export default function StoreSingleJobModal({
  isOpen,
  onClose,
  onSuccess,
  job
}: StoreSingleJobModalProps) {
  const isEditMode = !!job;

  const [companies, setCompanies] = useState<Company[]>([]);
  const [jobTypes, setJobTypes] = useState<Entity[]>([]);
  const [industries, setIndustries] = useState<Entity[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch companies and lookups in parallel
      const [companiesRes, jobTypesRes, industriesRes, currenciesRes] = await Promise.all([
        fetch('/api/lookups?type=companies'),
        fetch('/api/lookups?type=job-types'),
        fetch('/api/lookups?type=industries'),
        fetch('/api/lookups?type=currencies'),
      ]);

      const companiesData = await companiesRes.json();
      const jobTypesData = await jobTypesRes.json();
      const industriesData = await industriesRes.json();
      const currenciesData = await currenciesRes.json();

      if (companiesData.success) setCompanies(companiesData.list || []);
      if (jobTypesData.success) setJobTypes(jobTypesData.list || []);
      if (industriesData.success) setIndustries(industriesData.list || []);
      if (currenciesData.success) setCurrencies(currenciesData.list || []);

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
          type_id: job.type_id,
          company_id: job.company_id,
          company_name: job.company_name,
          jobs_scrapings_id: job.jobs_scrapings_id,
          location: job.location || '',
          country: job.country || '',
          salary_min: job.salary_min,
          salary_max: job.salary_max,
          salary_frequency: job.salary_frequency,
          industry_id: job.industry_id,
          currency_id: job.currency_id,
          apply_url: job.apply_url || '',
          metadata: job.metadata,
          is_premium: job.is_premium,
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

  const handleCompanyChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = e.target;
    
    if (value) {
      // Company selected - find the company and prefill company_name
      const selectedCompany = companies.find(company => company.id === value);
      setFormData(prev => ({
        ...prev,
        company_id: value,
        company_name: selectedCompany?.name || ''
      }));
    } else {
      // No company selected - clear company_name and enable field
      setFormData(prev => ({
        ...prev,
        company_id: '',
        company_name: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        title: formData.title,
        description: formData.description || null,
        type_id: formData.type_id,
        company_id: formData.company_id,
        company_name: formData.company_name,
        location: formData.location || null,
        country: formData.country,
        salary_min: formData.salary_min,
        salary_max: formData.salary_max,
        salary_frequency: formData.salary_frequency,
        industry_id: formData.industry_id,
        currency_id: formData.currency_id,
        apply_url: formData.apply_url,
        metadata: formData.metadata,
        is_premium: formData.is_premium,
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
                <div className="relative bg-gradient-to-br from-teal-700 to-teal-800 px-6 py-6 text-white">
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
                          Title <span className="text-red-500">*</span>
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Company
                          </label>
                          <select
                            name="company_id"
                            value={formData.company_id as string}
                            onChange={handleCompanyChange}
                            required
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                          >
                            <option value="">Select or enters company name</option>
                            {companies.map((company) => (
                              <option key={company.id} value={company.id}>
                                {company.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        {!formData.company_id && (
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                              Company Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="company_name"
                              value={formData.company_name}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                              placeholder="Enter company name"
                            />
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Job Type <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="type_id"
                            value={formData.type_id}
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
                            name="industry_id"
                            value={formData.industry_id}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                          >
                            <option value="">Select industry</option>
                            {industries.map((type) => (
                              <option key={type.id} value={type.id}>
                                {type.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            placeholder="e.g., Dubai"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Country
                          </label>
                          <select
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                          >
                            <option value="">Select country</option>
                            {COUNTRIES.map((item) => (
                              <option key={item.code} value={item.iso3}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Salary Information */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-4">Salary Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                          Frequency
                        </label>
                        <select
                          name="salary_frequency"
                          value={formData.salary_frequency}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                        >
                          <option key={'monthly'} value={'monthly'}>Monthly</option>
                          <option key={'annually'} value={'annually'}>Annually</option>
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
                    disabled={loading || !formData.title || !formData.type_id || !formData.apply_url}
                    className="px-5 py-2.5 text-sm font-medium text-white bg-teal-700  rounded-xl hover:bg-teal-800 transition-all shadow-lg shadow-teal-700/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
