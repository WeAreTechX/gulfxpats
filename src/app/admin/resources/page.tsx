'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  BookOpen,
  CheckCircle,
  Clock,
  Star,
} from 'lucide-react';
import ResourcesTable, { Resource } from '@/components/admin/resources/ResourcesTable';
import { QueryPagination } from '@/types';

interface ResourceStats {
  total: number;
  published: number;
  unpublished: number;
  premium: number;
}

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [stats, setStats] = useState<ResourceStats>({ total: 0, published: 0, unpublished: 0, premium: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<QueryPagination>({ count: 1, current_page: 1, total_count: 1, total_pages: 1 });

  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/resources?includeStats=true');
      const data = await response.json();

      if (data.success) {
        const { list, stats, pagination } = data.data || {};
        setResources(list || data.resources || []);
        setStats(stats || { total: 0, published: 0, unpublished: 0, premium: 0 });
        setPagination(pagination || { count: 1, current_page: 1, total_count: 1, total_pages: 1 });
      } else {
        setError('Failed to fetch resources');
      }
    } catch (err) {
      setError('Error loading resources');
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [currentPage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#04724D]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-semibold mb-2">Error</h3>
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchResources}
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
          <h1 className="text-2xl font-bold text-gray-900">Resources Management</h1>
          <p className="text-gray-600 mt-1">Manage career resources and content</p>
        </div>
        <button
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition-all shadow-lg shadow-teal-700/25"
        >
          <Plus className="h-5 w-5" />
          Add Resource
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#E6F4F0] rounded-lg">
              <BookOpen className="h-5 w-5 text-[#04724D]" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Resources</p>
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Published</p>
              <p className="text-xl font-bold text-gray-900">{stats.published}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Clock className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Unpublished</p>
              <p className="text-xl font-bold text-gray-900">{stats.unpublished}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Star className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Premium</p>
              <p className="text-xl font-bold text-gray-900">{stats.premium}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Resources Table */}
      <ResourcesTable
        loading={loading}
        error={error}
        resources={resources}
        pagination={pagination}
        onPageChange={setCurrentPage}
        onRowChange={fetchResources}
      />
    </div>
  );
}
