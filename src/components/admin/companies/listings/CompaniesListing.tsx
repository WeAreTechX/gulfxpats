'use client';

import {useState, useEffect, useCallback} from 'react';
import {
  Plus,
  Search,
  Upload,
} from 'lucide-react';
import { StoreSingleCompanyModal, StoreMultipleCompanyModal } from '@/components/admin';
import CompaniesTable from "@/components/admin/companies/listings/CompaniesTable";
import { QueryStats, Company } from "@/types";

interface CompaniesViewProps {
  refresh: boolean;
  onStatsChange?: (stats: QueryStats) => void;
}

export default function CompaniesListing({ refresh, onStatsChange }: CompaniesViewProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ count: 1, current_page: 1, total_count: 1, total_pages: 1 });

  const [searchQuery, setSearchQuery] = useState('');
  const [isSingleModalOpen, setIsSingleModalOpen] = useState(false);
  const [isMultipleModalOpen, setIsMultipleModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const companiesRes = await fetch('/api/companies?includeStats=true');
      const companiesData = await companiesRes.json();

      if (companiesData.success) {
        const { list, stats, pagination } = companiesData.data;
        setCompanies(list || []);
        setPagination(pagination || { count: 1, current_page: 1, total_count: 1, total_pages: 1 });

        if (onStatsChange && stats) {
          onStatsChange(stats);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch companies');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [refresh, currentPage, fetchData]);

  const handleOpenModal = (company?: Company) => {
    setEditingCompany(company || null);
    setIsSingleModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsSingleModalOpen(false);
    setEditingCompany(null);
  };

  const handleSuccess = () => {
    fetchData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search companies by name or description"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#04724D] focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMultipleModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <Upload className="h-4 w-4" />
            Bulk Upload
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-700 text-sm text-white rounded-xl hover:bg-teal-800 transition-all shadow-lg shadow-teal-700/25"
          >
            <Plus className="h-4 w-4" />
            Add Company
          </button>
        </div>
      </div>

      {/* Companies Table */}
      <CompaniesTable
        loading={loading}
        error={error}
        companies={companies}
        pagination={pagination}
        onPageChange={setCurrentPage}
        onRowChange={fetchData}
      />

      {/* Company Modals */}
      <StoreSingleCompanyModal
        isOpen={isSingleModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        company={editingCompany}
      />
      <StoreMultipleCompanyModal
        isOpen={isMultipleModalOpen}
        onClose={() => setIsMultipleModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
