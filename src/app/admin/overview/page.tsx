'use client';

import { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Building2, 
  Users, 
  TrendingUp, 
  Globe,
  Database,
  Clock,
  CheckCircle
} from 'lucide-react';

interface AdminStats {
  totalJobs: number;
  totalCompanies: number;
  gulfJobs: number;
  recentJobs: number;
  byCountry: Record<string, number>;
  bySource: Record<string, number>;
  byCategory: Record<string, number>;
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

      // Fetch jobs statistics
      const jobsResponse = await fetch('/api/jobs?includeStats=true');
      const jobsData = await jobsResponse.json();

      // Fetch companies (placeholder for now)
      const companiesResponse = await fetch('/api/companies');
      const companiesData = await companiesResponse.json();

      if (jobsData.success) {
        setStats({
          totalJobs: jobsData.totalJobs,
          totalCompanies: companiesData.success ? companiesData.companies.length : 0,
          gulfJobs: jobsData.statistics?.totalJobs || 0,
          recentJobs: jobsData.statistics?.recentJobs || 0,
          byCountry: jobsData.statistics?.byCountry || {},
          bySource: jobsData.statistics?.bySource || {},
          byCategory: jobsData.statistics?.byCategory || {}
        });
      } else {
        setError('Failed to fetch statistics');
      }
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
          onClick={fetchAdminStats}
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
      <div>
        <h1 className="text-3xl font-bold text-[#101418]">Admin Overview</h1>
        <p className="text-gray-600 mt-2">
          Overview of your job platform and Gulf jobs system
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Jobs</p>
              <p className="text-2xl font-bold text-[#101418]">{stats?.totalJobs || 0}</p>
            </div>
            <Briefcase className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Companies</p>
              <p className="text-2xl font-bold text-[#101418]">{stats?.totalCompanies || 0}</p>
            </div>
            <Building2 className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Gulf Jobs</p>
              <p className="text-2xl font-bold text-[#101418]">{stats?.gulfJobs || 0}</p>
            </div>
            <Globe className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Recent Jobs</p>
              <p className="text-2xl font-bold text-[#101418]">{stats?.recentJobs || 0}</p>
              <p className="text-xs text-gray-500">Last 7 days</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Gulf Jobs Overview */}
      {stats && stats.gulfJobs > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Jobs by Country */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-[#101418] mb-4">Jobs by Country</h3>
            <div className="space-y-3">
              {Object.entries(stats.byCountry)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 6)
                .map(([country, count]) => (
                  <div key={country} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{country}</span>
                    <span className="font-semibold text-[#101418]">{count}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Jobs by Source */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-[#101418] mb-4">Jobs by Source</h3>
            <div className="space-y-3">
              {Object.entries(stats.bySource)
                .sort(([,a], [,b]) => b - a)
                .map(([source, count]) => (
                  <div key={source} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{source}</span>
                    <span className="font-semibold text-[#101418]">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* System Status */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-[#101418] mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Gulf Jobs System</p>
              <p className="text-xs text-gray-500">Active</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Database className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Data Storage</p>
              <p className="text-xs text-gray-500">JSON Files</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-orange-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Auto Scraping</p>
              <p className="text-xs text-gray-500">Every 6 hours</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-[#101418] mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/jobs"
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Briefcase className="h-6 w-6 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">Manage Jobs</p>
              <p className="text-sm text-gray-500">View and manage job listings</p>
            </div>
          </a>
          <a
            href="/admin/companies"
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Building2 className="h-6 w-6 text-green-600" />
            <div>
              <p className="font-medium text-gray-900">Manage Companies</p>
              <p className="text-sm text-gray-500">View and manage companies</p>
            </div>
          </a>
          <a
            href="/admin/jobs"
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Globe className="h-6 w-6 text-purple-600" />
            <div>
              <p className="font-medium text-gray-900">Gulf Jobs Dashboard</p>
              <p className="text-sm text-gray-500">Monitor Gulf jobs system</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
