'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Database,
  RefreshCw,
  Download, Search,
} from 'lucide-react';
import { Source } from '@/types/companies';
import SourcesTable from '@/components/admin/jobs/sources/SourcesTable';
import StoreSourceModal from '@/components/admin/jobs/sources/StoreSourceModal';

export default function SourcesView({ refresh }: { refresh: boolean }) {
  const [sources, setSources] = useState<Source[]>([]);
  const [stats, setStats] = useState<{ total: number; active: number; inactive: number }>({ total: 0, active: 0, inactive: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ count: 1, current_page: 1, total_count: 1, total_pages: 1 });

  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<Source | null>(null);

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
        setStats(stats || { total: 0, active: 0, inactive: 0 });
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

  const handleOpenModal = (source?: Source) => {
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
      <StoreSourceModal
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
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition-all shadow-lg shadow-teal-700/25"
          >
            <Plus className="h-5 w-5" />
            Add Source
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#E6F4F0] rounded-lg">
              <Database className="h-5 w-5 text-[#04724D]" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Sources</p>
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <RefreshCw className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Sources</p>
              <p className="text-xl font-bold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Download className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Fetches</p>
              <p className="text-xl font-bold text-gray-900">{sources.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        {/* Tab Content */}
        <div className="p-0">
          <SourcesTable
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
