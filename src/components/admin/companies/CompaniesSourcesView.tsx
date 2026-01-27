'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
} from 'lucide-react';
import { CompaniesSources, Source } from '@/types/companies';
import CompaniesSourcesTable from '@/components/admin/companies/CompaniesSourcesTable';
import StoreCompanySourceModal from '@/components/admin/companies/StoreCompanySourceModal';
import { QueryStats } from '@/types/api';

interface CompaniesSourcesViewProps {
  refresh: boolean;
  onStatsChange?: (stats: QueryStats) => void;
}

export default function CompaniesSourcesView({ refresh, onStatsChange }: CompaniesSourcesViewProps) {
  const [sources, setSources] = useState<CompaniesSources[]>([]);
  const [stats, setStats] = useState<{ total: number; active: number; inactive: number }>({ total: 0, active: 0, inactive: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ count: 1, current_page: 1, total_count: 1, total_pages: 1 });

  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<CompaniesSources | null>(null);

  useEffect(() => {
    fetchSources();
  }, [refresh, currentPage]);

  const fetchSources = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/companies/sources?includeStats=true');
      const result = await response.json();

      if (result.success) {
        const { list, stats, pagination } = result.data;
        setSources(list || []);
        setStats(stats || { total: 0, active: 0, inactive: 0 });
        setPagination(pagination || { count: 1, current_page: 1, total_count: 1, total_pages: 1 });
        
        if (onStatsChange && stats) {
          onStatsChange({ total_sources: stats.total });
        }
      } else {
        setError('Failed to fetch company sources');
      }
    } catch (err) {
      setError('Error loading company sources');
      console.error('Error fetching company sources:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (source?: CompaniesSources) => {
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
      <StoreCompanySourceModal
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
            placeholder="Search by company or source"
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
        <CompaniesSourcesTable
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
