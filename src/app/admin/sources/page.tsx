'use client';

import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import JobsView from "@/components/admin/jobs/listings/JobsView";
import SourcesView from "@/components/admin/jobs/sources/SourcesView";
import MigrationsView from "@/components/admin/jobs/migrations/MigrationsView";

type TabType = 'listings' | 'sources' | 'migrations';

export default function AdminSourcesPage() {

  const [activeTab, setActiveTab] = useState<TabType>('sources');
  
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    //
  }, []);

  const tabs = [
    { id: 'listings' as TabType, label: 'Listings' },
    { id: 'sources' as TabType, label: 'Sources' },
    { id: 'migrations' as TabType, label: 'Migrations' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sources Management</h1>
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
      <div className="p-0">
        {activeTab === 'listings' && (
          <JobsView refresh={refresh} />
        )}

        {activeTab === 'sources' && (
          <SourcesView refresh={refresh} />
        )}

        {activeTab === 'migrations' && (
          <MigrationsView refresh={refresh} />
        )}
      </div>
    </div>
  );
}
