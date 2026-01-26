'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Users,
  CheckCircle,
  Clock,
  Calendar,
} from 'lucide-react';
import UsersTable, { User } from '@/components/admin/users/UsersTable';
import { Pagination } from '@/types';

interface UserStats {
  total: number;
  verified: number;
  unverified: number;
  newThisMonth: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats>({ total: 0, verified: 0, unverified: 0, newThisMonth: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>({ count: 1, current_page: 1, total_count: 1, total_pages: 1 });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/users?includeStats=true');
      const data = await response.json();

      if (data.success) {
        const { list, stats, pagination } = data.data || {};
        setUsers(list || data.users || []);
        if (stats) {
          setStats(stats);
        } else {
          // Calculate stats from users list
          const userList = list || data.users || [];
          const now = new Date();
          setStats({
            total: userList.length,
            verified: userList.filter((u: User) => u.status?.code === 'verified').length,
            unverified: userList.filter((u: User) => u.status?.code === 'unverified').length,
            newThisMonth: userList.filter((u: User) => {
              const createdDate = new Date(u.created_at);
              return createdDate.getMonth() === now.getMonth() &&
                     createdDate.getFullYear() === now.getFullYear();
            }).length,
          });
        }
        setPagination(pagination || { count: 1, current_page: 1, total_count: userList?.length || 0, total_pages: 1 });
      } else {
        setError('Failed to fetch users');
      }
    } catch (err) {
      setError('Error loading users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
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
          onClick={fetchUsers}
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
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600 mt-1">Manage and view all users on the platform</p>
        </div>
        <button
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition-all shadow-lg shadow-teal-700/25"
        >
          <Plus className="h-5 w-5" />
          Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#E6F4F0] rounded-lg">
              <Users className="h-5 w-5 text-[#04724D]" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
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
              <p className="text-sm text-gray-600">Verified</p>
              <p className="text-xl font-bold text-gray-900">{stats.verified}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Clock className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Unverified</p>
              <p className="text-xl font-bold text-gray-900">{stats.unverified}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">New This Month</p>
              <p className="text-xl font-bold text-gray-900">{stats.newThisMonth}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <UsersTable
        loading={loading}
        error={error}
        users={users}
        pagination={pagination}
        onPageChange={setCurrentPage}
        onRowChange={fetchUsers}
      />
    </div>
  );
}
