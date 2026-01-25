'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Database,
  RefreshCw,
  Download,
} from 'lucide-react';
import { Source } from '@/types/companies';
import SourcesTable from '@/components/admin/sources/SourcesTable';
import FetchesTable from '@/components/admin/sources/FetchesTable';

type TabType = 'sources' | 'fetches';

export default function AdminSourcesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('sources');
  const [sources, setSources] = useState<Source[]>([]);
  const [stats, setStats] = useState<{ total: number; active: number; inactive: number }>({ total: 0, active: 0, inactive: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ count: 1, current_page: 1, total_count: 1, total_pages: 1 });

  useEffect(() => {
    fetchSources();
  }, [currentPage]);

  const fetchSources = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/sources?includeStats=true');
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

  const tabs = [
    { id: 'sources' as TabType, label: 'Sources', count: stats.total },
    { id: 'fetches' as TabType, label: 'Fetches', count: sources.length },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-semibold mb-2">Error</h3>
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchSources}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sources Management</h1>
          <p className="text-gray-600 mt-1">Manage data sources and view fetch history</p>
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
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25"
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
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Database className="h-5 w-5 text-indigo-600" />
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
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative px-6 py-4 text-sm font-medium transition-colors
                  ${activeTab === tab.id 
                    ? 'text-indigo-600 border-b-2 border-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.label}
                <span className={`
                  ml-2 px-2 py-0.5 rounded-full text-xs
                  ${activeTab === tab.id 
                    ? 'bg-indigo-100 text-indigo-600' 
                    : 'bg-gray-100 text-gray-600'
                  }
                `}>
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-0">
          {activeTab === 'sources' && (
            <SourcesTable
              error={error}
              loading={loading}
              sources={sources}
              pagination={pagination}
              onPageChange={setCurrentPage}
              onRetryAction={fetchSources}
            />
          )}

          {activeTab === 'fetches' && (
            <FetchesTable
              error={error}
              loading={loading}
              fetches={sources}
              pagination={pagination}
              onPageChange={setCurrentPage}
              onRetryAction={fetchSources}
            />
          )}
        </div>
      </div>
    </div>
  );
}
