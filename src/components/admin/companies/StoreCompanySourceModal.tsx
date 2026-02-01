'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { CompanyJobSource, Company, JobSource } from '@/types';

interface StoreCompanySourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  source?: CompanyJobSource | null;
}

export default function StoreCompanySourceModal({
  isOpen,
  onClose,
  onSuccess,
  source,
}: StoreCompanySourceModalProps) {
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [availableSources, setAvailableSources] = useState<JobSource[]>([]);
  const [formData, setFormData] = useState({
    company_id: '',
    source_id: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchCompanies();
      fetchSources();
      
      if (source) {
        setFormData({
          company_id: source.company_id || '',
          source_id: source.jobs_source_id?.toString() || '',
        });
      } else {
        setFormData({
          company_id: '',
          source_id: '',
        });
      }
    }
  }, [isOpen, source]);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies');
      const result = await response.json();
      if (result.success) {
        setCompanies(result.data.list || []);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const fetchSources = async () => {
    try {
      const response = await fetch('/api/jobs/sources');
      const result = await response.json();
      if (result.success) {
        setAvailableSources(result.data.list || []);
      }
    } catch (error) {
      console.error('Error fetching sources:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = source
        ? `/api/companies/sources/${source.id}`
        : '/api/companies/sources';
      const method = source ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id: formData.company_id,
          source_id: parseInt(formData.source_id),
        }),
      });

      const data = await response.json();

      if (data.success) {
        onSuccess();
        onClose();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error saving company source:', error);
      alert('Failed to save company source');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {source ? 'Edit Company Source' : 'Add Company Source'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <select
                value={formData.company_id}
                onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#04724D] focus:border-transparent"
                required
              >
                <option value="">Select a company</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Source
              </label>
              <select
                value={formData.source_id}
                onChange={(e) => setFormData({ ...formData, source_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#04724D] focus:border-transparent"
                required
              >
                <option value="">Select a source</option>
                {availableSources.map((src) => (
                  <option key={src.id} value={src.id}>
                    {src.name} ({src.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-teal-700 rounded-xl hover:bg-teal-800 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : source ? 'Update' : 'Add Source'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
