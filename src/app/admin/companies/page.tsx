'use client';

import { useState } from 'react';
import {
  Building2,
  CheckCircle,
  Clock,
  Database,
  RefreshCw,
} from 'lucide-react';
import CompaniesListing from "@/components/admin/companies/listings/CompaniesListing";
import CompaniesSourcesView from "@/components/admin/companies/sources/CompaniesSourcesView";
import { QueryStats } from "@/types";

type TabType = 'listings' | 'sources';

export default function AdminCompaniesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('listings');
  const [refresh, setRefresh] = useState(false);

  const [stats, setStats] = useState<QueryStats>({ 
    total: 0, 
    published: 0, 
    unpublished: 0, 
    total_sources: 0 
  });

  const tabs = [
    { id: 'listings' as TabType, label: 'Listings' },
    { id: 'sources' as TabType, label: 'Sources' },
  ];

  const handleSetStats = (next: QueryStats) => {
    setStats(prev => ({
      ...prev,
      ...next
    }));
  };

  const handleRefresh = () => {
    setRefresh(prev => !prev);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Companies Management</h1>
          <p className="text-gray-600 mt-1">Manage companies and their data sources</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            disabled={true}
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#E6F4F0] rounded-lg">
              <Building2 className="h-5 w-5 text-[#04724D]" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Companies</p>
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
          <CompaniesListing refresh={refresh} onStatsChange={handleSetStats} />
        )}

        {activeTab === 'sources' && (
          <CompaniesSourcesView refresh={refresh} onStatsChange={handleSetStats} />
        )}
      </div>
    </div>
  );
}
