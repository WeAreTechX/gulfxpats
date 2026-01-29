'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Upload
} from 'lucide-react';
import { StoreSingleJobModal } from '@/components/admin';
import StoreMultipleJobsModal from '@/components/admin/jobs/listings/StoreMultipleJobsModal';
import JobsTable from "@/components/admin/jobs/listings/JobsTable";
import {Job,QueryStats} from "@/types";

export default function JobsListing({ refresh }: { refresh: boolean }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<QueryStats>({ total: 0, published: 0, unpublished: 0, archived: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ count: 1, current_page: 1, total_count: 1, total_pages: 1 });

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  useEffect(() => {
    fetchData();
  }, [refresh, currentPage]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const jobsRes= await fetch('/api/jobs?includeStats=true')
      const jobsData = await jobsRes.json();

      if (jobsData.success) {
        const { list, stats, pagination } = jobsData.data;
        setJobs(list || []);
        setStats(stats || {});
        setPagination(pagination ||  { count: 1, current_page: 1, total_count: 1, total_pages: 1 })
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (job?: Job) => {
    setEditingJob(job || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
  };

  const handleSuccess = () => {
    fetchData();
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        fetchData();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs by title or description"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#04724D] focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <Upload className="h-4 w-4" />
            Bulk Upload
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition-all shadow-lg shadow-teal-700/25"
          >
            <Plus className="h-5 w-5" />
            Add Job
          </button>
        </div>
      </div>

      {/* Jobs Table */}
      <JobsTable
        loading={loading}
        error={error}
        jobs={jobs}
        pagination={pagination} onPageChange={setCurrentPage} onRowChange={fetchData} />

      {/* Job Modal */}
      <StoreSingleJobModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        job={editingJob}
      />

      {/* Bulk Upload Modal */}
      <StoreMultipleJobsModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
