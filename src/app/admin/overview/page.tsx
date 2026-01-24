'use client';

import { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Building2, 
  Users, 
  TrendingUp, 
  BookOpen,
  ArrowUpRight,
  ArrowUp,
  ArrowDown,
  Clock,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

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
  const { admin } = useAdminAuth();

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

  const statsCards = [
    {
      title: 'Total Jobs',
      value: stats?.totalJobs || 0,
      subtext: `${stats?.activeJobs || 0} active`,
      icon: Briefcase,
      color: 'indigo',
      trend: 12,
      href: '/admin/jobs'
    },
    {
      title: 'Companies',
      value: stats?.totalCompanies || 0,
      subtext: 'Registered',
      icon: Building2,
      color: 'emerald',
      trend: 8,
      href: '/admin/companies'
    },
    {
      title: 'Users',
      value: stats?.totalUsers || 0,
      subtext: 'Job seekers',
      icon: Users,
      color: 'violet',
      trend: -3,
      href: '/admin/users'
    },
    {
      title: 'Resources',
      value: stats?.totalResources || 0,
      subtext: 'Published',
      icon: BookOpen,
      color: 'amber',
      trend: 5,
      href: '/admin/resources'
    },
  ];

  const quickActions = [
    {
      title: 'Manage Jobs',
      description: 'Add, edit, or remove job listings',
      icon: Briefcase,
      href: '/admin/jobs',
      color: 'indigo'
    },
    {
      title: 'Manage Companies',
      description: 'Company profiles and details',
      icon: Building2,
      href: '/admin/companies',
      color: 'emerald'
    },
    {
      title: 'Manage Resources',
      description: 'Career resources and guides',
      icon: BookOpen,
      href: '/admin/resources',
      color: 'violet'
    },
    {
      title: 'Manage Users',
      description: 'User accounts and profiles',
      icon: Users,
      href: '/admin/users',
      color: 'amber'
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-lg w-48"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-36 bg-slate-200 rounded-2xl"></div>
          ))}
        </div>
        <div className="h-64 bg-slate-200 rounded-2xl"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
        <h3 className="text-red-800 font-semibold mb-2">Error</h3>
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchAdminStats}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {getGreeting()}, {admin?.first_name}
          </h1>
          <p className="text-slate-500 mt-1">
            Here's what's happening with your platform today.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Clock className="h-4 w-4" />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <Link 
            key={stat.title}
            href={stat.href}
            className="group bg-white rounded-2xl p-5 border border-slate-200 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div className={`p-2.5 rounded-xl bg-${stat.color}-50 group-hover:bg-${stat.color}-100 transition-colors`}>
                <stat.icon className={`h-5 w-5 text-${stat.color}-600`} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${stat.trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {stat.trend >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {Math.abs(stat.trend)}%
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-slate-900">{stat.value.toLocaleString()}</p>
              <p className="text-sm text-slate-500 mt-1">{stat.title}</p>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100">
              <p className="text-xs text-slate-400">{stat.subtext}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Activity Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-xl">
              <Activity className="h-5 w-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
          </div>
          <span className="text-sm text-slate-500">Last 7 days</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              <span className="text-sm font-medium text-slate-700">New Jobs</span>
            </div>
            <p className="text-3xl font-bold text-indigo-600">{stats?.recentJobs || 0}</p>
            <p className="text-xs text-slate-500 mt-1">Added this week</p>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <Briefcase className="h-5 w-5 text-emerald-600" />
              <span className="text-sm font-medium text-slate-700">Active Jobs</span>
            </div>
            <p className="text-3xl font-bold text-emerald-600">{stats?.activeJobs || 0}</p>
            <p className="text-xs text-slate-500 mt-1">Currently live</p>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-violet-50 to-violet-100/50 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <Building2 className="h-5 w-5 text-violet-600" />
              <span className="text-sm font-medium text-slate-700">Companies</span>
            </div>
            <p className="text-3xl font-bold text-violet-600">{stats?.totalCompanies || 0}</p>
            <p className="text-xs text-slate-500 mt-1">Total registered</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="group flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl bg-${action.color}-50 group-hover:bg-${action.color}-100 transition-colors`}>
                  <action.icon className={`h-5 w-5 text-${action.color}-600`} />
                </div>
                <div>
                  <p className="font-medium text-slate-900 text-sm">{action.title}</p>
                  <p className="text-xs text-slate-500">{action.description}</p>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      {/* Platform Status */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">System Status</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <div>
              <p className="font-medium text-slate-900 text-sm">Database</p>
              <p className="text-xs text-emerald-600">Connected</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <div>
              <p className="font-medium text-slate-900 text-sm">Authentication</p>
              <p className="text-xs text-emerald-600">Active</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <div>
              <p className="font-medium text-slate-900 text-sm">API Services</p>
              <p className="text-xs text-emerald-600">Operational</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
