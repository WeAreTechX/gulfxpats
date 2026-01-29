'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Database, Loader2 } from 'lucide-react';
import { Source } from '@/types/companies';

interface StoreSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  source?: Source | null;
}

interface SourceFormData {
  name: string;
  code: string;
  base_url: string;
}

const getInitialFormData = (): SourceFormData => ({
  name: '',
  code: '',
  base_url: '',
});

export default function CreateMigrationModal({
  isOpen,
  onClose,
  onSuccess,
  source
}: StoreSourceModalProps) {
  const isEditMode = !!source;

  const [formData, setFormData] = useState<SourceFormData>(getInitialFormData());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal opens/closes or source changes
  useEffect(() => {
    if (isOpen) {
      if (source) {
        // Populate form with existing source data for edit mode
        setFormData({
          name: source.name || '',
          code: source.code || '',
          base_url: source.base_url || '',
        });
      } else {
        // Reset form for add mode
        setFormData(getInitialFormData());
      }
      setError(null);
    }
  }, [isOpen, source]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Auto-generate code from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      name: value,
      // Only auto-generate code if not in edit mode and code hasn't been manually changed
      code: !isEditMode && prev.code === generateCode(prev.name)
        ? generateCode(value)
        : prev.code,
    }));
  };

  const generateCode = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        name: formData.name.trim(),
        code: formData.code.trim(),
        base_url: formData.base_url.trim() || null,
      };

      const url = isEditMode ? `/api/jobs/sources/${source.id}` : '/api/jobs/sources';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || `Failed to ${isEditMode ? 'update' : 'create'} source`);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.name.trim() && formData.code.trim();

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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
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
                      <Database className="h-5 w-5 text-white" />
                    </div>
                  </div>

                  <Dialog.Title as="h3" className="text-xl font-bold">
                    {isEditMode ? 'Edit Source' : 'Add New Source'}
                  </Dialog.Title>
                  <p className="mt-1 text-white/70 text-sm">
                    {isEditMode ? 'Update the source information below' : 'Fill in the details to add a new data source'}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Source Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleNameChange}
                      required
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors"
                      placeholder="e.g., LinkedIn Jobs"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors font-mono text-sm"
                      placeholder="e.g., linkedin-jobs"
                    />
                    <p className="mt-1 text-xs text-slate-500">
                      Unique identifier for this source. Use lowercase letters, numbers, and hyphens.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Base URL
                    </label>
                    <input
                      type="url"
                      name="base_url"
                      value={formData.base_url}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors"
                      placeholder="https://example.com/jobs"
                    />
                    <p className="mt-1 text-xs text-slate-500">
                      The base URL where jobs are fetched from (optional).
                    </p>
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
                    disabled={loading || !isFormValid}
                    className="px-5 py-2.5 text-sm font-medium text-white bg-teal-700 rounded-xl hover:bg-teal-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isEditMode ? 'Update Source' : 'Add Source'}
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
