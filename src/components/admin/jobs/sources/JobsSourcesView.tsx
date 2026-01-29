'use client';

import { useState, useEffect } from 'react';
import {
  Plus, Search,
} from 'lucide-react';
import {JobSource, QueryViewAction} from '@/types';
import JobsSourcesTable from '@/components/admin/jobs/sources/JobsSourcesTable';
import StoreJobSourceModal from '@/components/admin/jobs/sources/StoreJobSourceModal';

export default function JobsSourcesView({ refresh, onFetchAction }: QueryViewAction) {
  const [sources, setSources] = useState<JobSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ count: 1, current_page: 1, total_count: 1, total_pages: 1 });

  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<JobSource | null>(null);

  useEffect(() => {
    fetchSources();
  }, [refresh, currentPage]);

  const fetchSources = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/jobs/sources?includeStats=true');
      const result = await response.json();

      if (result.success) {
        const { list, stats, pagination } = result.data;
        setSources(list || []);
        onFetchAction({ total_sources: stats.total || 0 });
        setPagination(pagination || { count: 1, current_page: 1, total_count: 1, total_pages: 1 });
      } else {
        setError('Failed to fetch sources');
      }
    } catch (err) {
      setError('Error loading sources');
      console.error('Error fetching sources:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (source?: JobSource) => {
    setEditingSource(source || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSource(null);
  };

  const handleSuccess = () => {
    fetchSources();
  };

  return (
    <div className="space-y-6">
      {/* Modal */}
      <StoreJobSourceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        source={editingSource}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or code"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#04724D] focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition-all shadow-lg shadow-teal-700/25"
          >
            <Plus className="h-5 w-5" />
            Add Source
          </button>
        </div>
      </div>


      <div className="p-0">
        <JobsSourcesTable
          error={error}
          loading={loading}
          sources={sources}
          pagination={pagination}
          onPageChange={setCurrentPage}
          onRetryAction={fetchSources}
          onEdit={handleOpenModal}
        />
      </div>
    </div>
  );
}
