'use client';

import { useState, useEffect } from 'react';
import {Clock, CheckCircle, Plus, Upload, Building2} from 'lucide-react';
import { StoreSingleCompanyModal, StoreMultipleCompanyModal } from '@/components/admin';
import CompaniesTable from "@/components/admin/companies/CompaniesTable";
import {Company} from "@/types/companies";

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [stats, setStats] = useState<{ [key: string]: number }>({ total: 0, published: 0, unpublished: 0 });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ count: 1, current_page: 1, total_count: 1, total_pages: 1 });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/companies?includeStats=true');
      const data = await response.json();

      if (data.success) {
        setCompanies(data.list || []);
        setStats(data.stats);
        setPagination(data.pagination || {});
      } else {
        setError('Failed to fetch companies');
      }
    } catch (err) {
      setError('Error loading companies');
      console.error('Error fetching companies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies().then();
  }, []);

  // Modal states
  const [isSingleModalOpen, setisSingleModalOpen] = useState(false);
  const [isMultipleModalOpen, setisMultipleModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const handleAddSuccess = () => {
    fetchCompanies();
  };

  const handleEditCompany = (company: Company) => {
    setEditingCompany(company);
    setisSingleModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setisSingleModalOpen(false);
    setEditingCompany(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#101418]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-semibold mb-2">Error</h3>
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchCompanies}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Modals */}
      <StoreSingleCompanyModal
        isOpen={isSingleModalOpen}
        onClose={handleCloseAddModal}
        onSuccess={handleAddSuccess}
        company={editingCompany}
      />
      <StoreMultipleCompanyModal
        isOpen={isMultipleModalOpen}
        onClose={() => setisMultipleModalOpen(false)}
        onSuccess={handleAddSuccess}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Companies Management</h1>
          <p className="text-gray-600 mt-1">Manage and view all companies in the system</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setisMultipleModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <Upload className="h-4 w-4" />
            Bulk Upload
          </button>
          <button
            onClick={() => setisSingleModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25"
          >
            <Plus className="h-5 w-5" />
            Add Company
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Building2 className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Companies</p>
              <p className="text-xl font-bold text-gray-900">{stats?.total || companies.length}</p>
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
              <p className="text-xl font-bold text-gray-900">{stats?.published || 0}</p>
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
              <p className="text-xl font-bold text-gray-900">{stats?.unpublished || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <CompaniesTable
        loading={loading}
        companies={companies}
        pagination={pagination}
        onPageChange={setCurrentPage} />
    </div>
  );
}
