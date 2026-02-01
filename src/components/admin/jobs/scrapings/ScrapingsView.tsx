'use client';

import {useState, useEffect, useCallback} from 'react';
import {
  Plus,
  RefreshCw, Search,
} from 'lucide-react';
import JobsSourcesTable from '@/components/admin/jobs/sources/JobsSourcesTable';
import StoreJobSourceModal from '@/components/admin/jobs/sources/StoreJobSourceModal';
import {JobSource, QueryViewAction} from "@/types";

export default function ScrapingsView({ refresh, onFetchAction }: QueryViewAction) {
  const [sources, setSources] = useState<JobSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ count: 1, current_page: 1, total_count: 1, total_pages: 1 });

  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<JobSource | null>(null);

  const fetchSources = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/jobs/sources?includeStats=true');
      const result = await response.json();

      if (result.success) {
        const { list, stats, pagination } = result.data;
        setSources(list || []);
        onFetchAction({ total_scrapings: stats.total })
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
  }, [onFetchAction]);

  useEffect(() => {
    fetchSources();
  }, [refresh, currentPage, fetchSources]);


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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs by title, company, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#04724D] focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchSources}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition-all shadow-lg shadow-teal-700/25"
          >
            <Plus className="h-5 w-5" />
            Add Source
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        {/* Tab Content */}
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
    </div>
  );
}
