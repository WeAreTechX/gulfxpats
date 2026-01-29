'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Building2, Loader2 } from 'lucide-react';
import { COUNTRIES } from '@/lib/countries';
import {CompanyCreate, Company} from "@/types";

interface AddCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  company?: Company | null; // If provided, modal is in edit mode
}

export default function StoreSingleCompanyModal({ isOpen, onClose, onSuccess, company }: AddCompanyModalProps) {
  const isEditMode = !!company;
  
  const [formData, setFormData] = useState<CompanyCreate>({
    name: '',
    short_description: '',
    long_description: '',
    website_url: '',
    logo_url: '',
    location: '',
    country: '',
    metadata: {
      industry: '',
      phone: '',
      email: '',
      linkedin: ''
    },
    contact: {
      first_name: '',
      last_name: '',
      email: '',
      linkedin: '',
    },
    tags: [],
    rank: 5,
    is_premium: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getInitialFormData = (): CompanyCreate => ({
    name: '',
    short_description: '',
    long_description: '',
    website_url: '',
    logo_url: '',
    location: '',
    country: '',
    metadata: {
      industry: '',
      phone: '',
      email: '',
      linkedin: ''
    },
    contact: {
      first_name: '',
      last_name: '',
      email: '',
      linkedin: '',
    },
    tags: [],
    rank: 5,
    is_premium: false
  });

  // Reset form when modal opens/closes or company changes
  useEffect(() => {
    if (isOpen) {
      if (company) {
        // Populate form with existing company data for edit mode
        setFormData({
          name: company.name || '',
          short_description: company.short_description || '',
          long_description: company.long_description || '',
          website_url: company.website_url || '',
          logo_url: company.logo_url || '',
          location: company.location || '',
          country: company.country || '',
          metadata: company.metadata,
          contact: company.contact,
          tags: company.tags,
          rank: company.rank || 5,
          is_premium: company.is_premium || false
        });
      } else {
        // Reset form for add mode
        setFormData(getInitialFormData());
      }
      setError(null);
    }
  }, [isOpen, company]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested fields (metadata.* and contact_person.*)
    if (name.startsWith('metadata.')) {
      const field = name.replace('metadata.', '');
      setFormData(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          [field]: value
        }
      }));
    } else if (name.startsWith('contact.')) {
      const field = name.replace('contact.', '');
      setFormData(prev => ({
        ...prev,
        contact: {
          ...prev.contact,
          [field]: value
        }
      }));
    } else {
      // Handle flat fields
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = isEditMode ? `/api/companies/${company.id}` : '/api/companies';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || `Failed to ${isEditMode ? 'update' : 'create'} company`);
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
                      <Building2 className="h-5 w-5 text-white" />
                    </div>
                  </div>

                  <Dialog.Title as="h3" className="text-xl font-bold">
                    {isEditMode ? 'Edit Company' : 'Add New Company'}
                  </Dialog.Title>
                  <p className="mt-1 text-white/70 text-sm">
                    {isEditMode ? 'Update the company information below' : 'Fill in the details to add a new company'}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Basic Information */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-4">Basic Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Company Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                          placeholder="Enter company name"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Description
                        </label>
                        <textarea
                          name="short_description"
                          value={formData.short_description}
                          onChange={handleChange}
                          rows={3}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors resize-none"
                          placeholder="Brief description of the company"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Website
                        </label>
                        <input
                          type="url"
                          name="website_url"
                          value={formData.website_url}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                          placeholder="https://example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Logo URL
                        </label>
                        <input
                          type="url"
                          name="logo_url"
                          value={formData.logo_url}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                          placeholder="https://example.com/logo.png"
                        />
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
                          placeholder="Los Angeles, California"
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
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                        >
                          <option value="">Select a country</option>
                          {COUNTRIES.map(country => (
                            <option key={country.code} value={country.iso3}>
                              {country.name}
                            </option>
                          ))}
                        </select>
                      </div>

                    </div>
                  </div>

                  {/* Social Links */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-4">Social Links</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Company LinkedIn
                        </label>
                        <input
                          type="url"
                          name="metadata.linkedin"
                          value={formData.metadata.linkedin || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                          placeholder="https://linkedin.com/company/..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Company Email
                        </label>
                        <input
                          type="email"
                          name="metadata.email"
                          value={formData?.metadata?.email || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                          placeholder="hello@company.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Person */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-4">Contact Person</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="contact.first_name"
                          value={formData?.contact?.first_name || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                          placeholder="John"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="contact.last_name"
                          value={formData?.contact?.last_name || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                          placeholder="Doe"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          name="contact.email"
                          value={formData?.contact?.email || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                          placeholder="contact@company.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          LinkedIn Profile
                        </label>
                        <input
                          type="url"
                          name="contact.linkedin"
                          value={formData?.contact?.linkedin || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                          placeholder="https://www.linkedin.com/in/johndoe"
                        />
                      </div>
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
                    disabled={loading || !formData.name}
                    className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isEditMode ? 'Update Company' : 'Add Company'}
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
