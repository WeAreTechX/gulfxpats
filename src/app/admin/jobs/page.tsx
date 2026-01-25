'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Building2,
  Briefcase, Clock, Archive,
} from 'lucide-react';
import { StoreSingleJobModal } from '@/components/admin';
import {Job} from "@/types/jobs";
import JobsTable from "@/components/admin/jobs/JobsTable";
import {QueryStats} from "@/types/api";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<QueryStats>({ total: 0, published: 0, unpublished: 0, archived: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ count: 1, current_page: 1, total_count: 1, total_pages: 1 });

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#04724D]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jobs Management</h1>
          <p className="text-gray-600 mt-1">Manage job listings on the platform</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#04724D] to-teal-600 text-white rounded-xl hover:from-[#035E3F] hover:to-teal-700 transition-all shadow-lg shadow-[#04724D]/25"
        >
          <Plus className="h-5 w-5" />
          Add Job
        </button>
      </div>

      {/* Search */}
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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#E6F4F0] rounded-lg">
              <Briefcase className="h-5 w-5 text-[#04724D]" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Jobs</p>
              <p className="text-xl font-bold text-gray-900">{jobs.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Building2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Published</p>
              <p className="text-xl font-bold text-gray-900">{stats?.published}</p>
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
              <p className="text-xl font-bold text-gray-900">{stats?.unpublished}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Archive className="h-5 w-5 text-gray-900" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Archived</p>
              <p className="text-xl font-bold text-gray-900">{stats?.archived}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs Table */}
      <JobsTable
        loading={loading}
        jobs={jobs}
        pagination={pagination} onPageChange={setCurrentPage} onRowChange={fetchData} />

      {/* Job Modal */}
      <StoreSingleJobModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        job={editingJob}
      />
    </div>
  );
}
