'use client';

import { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Building2, 
  Users, 
  TrendingUp, 
  BookOpen,
  CheckCircle,
  ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';

interface AdminStats {
  totalJobs: number;
  totalCompanies: number;
  totalUsers: number;
  totalResources: number;
  recentJobs: number;
  activeJobs: number;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch statistics from APIs
      const [jobsRes, companiesRes, usersRes, resourcesRes] = await Promise.all([
        fetch('/api/jobs'),
        fetch('/api/companies'),
        fetch('/api/users'),
        fetch('/api/resources'),
      ]);

      const [jobsData, companiesData, usersData, resourcesData] = await Promise.all([
        jobsRes.json(),
        companiesRes.json(),
        usersRes.json(),
        resourcesRes.json(),
      ]);

      // Calculate recent jobs (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const jobs = jobsData.jobs || [];
      const recentJobs = jobs.filter((job: any) => 
        new Date(job.created_at) >= sevenDaysAgo
      ).length;

      const activeJobs = jobs.filter((job: any) => 
        job.status?.code === 'active'
      ).length;

      setStats({
        totalJobs: jobs.length,
        totalCompanies: companiesData.companies?.length || 0,
        totalUsers: usersData.users?.length || 0,
        totalResources: resourcesData.resources?.length || 0,
        recentJobs,
        activeJobs,
      });
    } catch (err) {
      setError('Error loading statistics');
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <h3 className="text-red-800 font-semibold mb-2">Error</h3>
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchAdminStats}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here's an overview of your platform.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Jobs</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.totalJobs || 0}</p>
              <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                {stats?.activeJobs || 0} active
              </p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-xl">
              <Briefcase className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Companies</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.totalCompanies || 0}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <Building2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.totalUsers || 0}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Recent Jobs</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.recentJobs || 0}</p>
              <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-xl">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/jobs"
            className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-200 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                <Briefcase className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Manage Jobs</p>
                <p className="text-sm text-gray-500">Add, edit, or remove jobs</p>
              </div>
            </div>
            <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
          </Link>

          <Link
            href="/admin/companies"
            className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-green-50 hover:border-green-200 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <Building2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Manage Companies</p>
                <p className="text-sm text-gray-500">Company profiles</p>
              </div>
            </div>
            <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" />
          </Link>

          <Link
            href="/admin/resources"
            className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-purple-50 hover:border-purple-200 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <BookOpen className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Manage Resources</p>
                <p className="text-sm text-gray-500">Career resources</p>
              </div>
            </div>
            <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
          </Link>

          <Link
            href="/admin/users"
            className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-orange-50 hover:border-orange-200 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                <Users className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Manage Users</p>
                <p className="text-sm text-gray-500">User accounts</p>
              </div>
            </div>
            <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
          </Link>
        </div>
      </div>

      {/* Platform Status */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-gray-900">Database</p>
              <p className="text-sm text-green-600">Supabase Connected</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-gray-900">Authentication</p>
              <p className="text-sm text-green-600">Active</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-gray-900">API</p>
              <p className="text-sm text-green-600">Operational</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
