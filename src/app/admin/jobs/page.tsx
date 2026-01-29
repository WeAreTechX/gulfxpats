'use client';

import { useState } from 'react';
import {
  Archive,
  Briefcase,
  CheckCircle,
  Clock,
  Database,
  Download,
  RefreshCw,
} from 'lucide-react';
import JobsListing from "@/components/admin/jobs/listings/JobsListing";
import JobsSourcesView from "@/components/admin/jobs/sources/JobsSourcesView";
import ScrapingsView from "@/components/admin/jobs/scrapings/ScrapingsView";
import {QueryStats} from "@/types";

type TabType = 'listings' | 'sources' | 'scrapings';

export default function AdminSourcesPage() {

  const [activeTab, setActiveTab] = useState<TabType>('listings');
  const [refresh, setRefresh] = useState(false);

  const [stats, setStats] = useState<QueryStats>({ total_jobs: 0, published_jobs: 0, unpublished_jobs: 0, archived_jobs: 0, total_sources: 0 });

  const tabs = [
    { id: 'listings' as TabType, label: 'Listings' },
    { id: 'sources' as TabType, label: 'Sources' },
    { id: 'scrapings' as TabType, label: 'Scrapings' },
  ];

  const handleSetStats = (next: QueryStats) => {
    setStats(prev => ({
      ...prev,
      ...next
    }));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jobs Management</h1>
          <p className="text-gray-600 mt-1">Manage data sources and view fetch history</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setRefresh(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#E6F4F0] rounded-lg">
              <Briefcase className="h-5 w-5 text-[#04724D]" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Jobs</p>
              <p className="text-xl font-bold text-gray-900">{stats.total_jobs}</p>
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
              <p className="text-xl font-bold text-gray-900">{stats?.published_jobs}</p>
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
              <p className="text-xl font-bold text-gray-900">{stats?.unpublished_jobs}</p>
            </div>
          </div>
        </div>

        {activeTab === 'listings' && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Archive className="h-5 w-5 text-gray-900" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Archived</p>
                <p className="text-xl font-bold text-gray-900">{stats?.archived_jobs}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sources' && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#E6F4F0] rounded-lg">
                <Database className="h-5 w-5 text-[#04724D]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Sources</p>
                <p className="text-xl font-bold text-gray-900">{stats?.total_sources}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'scrapings' && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Download className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Fetches</p>
                <p className="text-xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Tabs */}
      <div className="bg-white rounded-tl-xl rounded-tr-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative px-6 py-4 text-sm font-medium transition-colors
                  ${activeTab === tab.id
                  ? 'text-[#04724D] border-b-2 border-[#04724D]'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white p-4 rounded-xl">

        {activeTab === 'listings' && (
          <JobsListing refresh={refresh} onFetchAction={handleSetStats} />
        )}

        {activeTab === 'sources' && (
          <JobsSourcesView refresh={refresh} onFetchAction={handleSetStats} />
        )}

        {activeTab === 'scrapings' && (
          <ScrapingsView refresh={refresh} onFetchAction={handleSetStats} />
        )}
      </div>
    </div>
  );
}
