'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Database, Clock, TrendingUp, MapPin, Building } from 'lucide-react';

interface JobsStats {
  totalJobs: number;
  byCountry: Record<string, number>;
  bySource: Record<string, number>;
  byCategory: Record<string, number>;
  byType: Record<string, number>;
  recentJobs: number;
}

interface SchedulerStatus {
  isRunning: boolean;
  isScheduled: boolean;
  config: {
    enabled: boolean;
    intervalHours: number;
    maxRetries: number;
    retryDelayMinutes: number;
    cleanupOldFiles: boolean;
    keepLastFiles: number;
  };
  nextRun?: string;
}

export default function JobsDashboard() {
  const [stats, setStats] = useState<JobsStats | null>(null);
  const [schedulerStatus, setSchedulerStatus] = useState<SchedulerStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch statistics
      const statsResponse = await fetch('/api/jobs-scraper?action=stats');
      const statsData = await statsResponse.json();
      
      if (statsData.success) {
        setStats(statsData.statistics);
      }

      // Fetch scheduler status
      const schedulerResponse = await fetch('/api/scheduler');
      const schedulerData = await schedulerResponse.json();
      
      if (schedulerData.success) {
        setSchedulerStatus(schedulerData.status);
      }
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const triggerScraping = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/jobs-scraper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ forceScrape: true }),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchData(); // Refresh data
        alert(`Successfully scraped ${data.totalJobs} jobs!`);
      } else {
        alert('Failed to trigger scraping: ' + data.error);
      }
    } catch (err) {
      alert('Error triggering scraping: ' + err);
    } finally {
      setLoading(false);
    }
  };

  const toggleScheduler = async (action: 'start' | 'stop') => {
    try {
      setLoading(true);
      const response = await fetch('/api/scheduler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchData(); // Refresh data
        alert(`Scheduler ${action}ed successfully!`);
      } else {
        alert(`Failed to ${action} scheduler: ${data.error}`);
      }
    } catch (err) {
      alert(`Error ${action}ing scheduler: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !stats) {
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
          onClick={fetchData}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#101418] mb-2">
          Jobs Dashboard
        </h1>
        <p className="text-gray-600">
          Monitor and manage your job scraping system
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mb-8 flex flex-wrap gap-4">
        <button
          onClick={triggerScraping}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Trigger Scraping
        </button>
        
        {schedulerStatus && (
          <button
            onClick={() => toggleScheduler(schedulerStatus.isScheduled ? 'stop' : 'start')}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg disabled:opacity-50 ${
              schedulerStatus.isScheduled 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            <Clock className="w-4 h-4" />
            {schedulerStatus.isScheduled ? 'Stop Scheduler' : 'Start Scheduler'}
          </button>
        )}
        
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-[#101418]">{stats.totalJobs}</p>
              </div>
              <Database className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recent Jobs</p>
                <p className="text-2xl font-bold text-[#101418]">{stats.recentJobs}</p>
                <p className="text-xs text-gray-500">Last 7 days</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Countries</p>
                <p className="text-2xl font-bold text-[#101418]">{Object.keys(stats.byCountry).length}</p>
              </div>
              <MapPin className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sources</p>
                <p className="text-2xl font-bold text-[#101418]">{Object.keys(stats.bySource).length}</p>
              </div>
              <Building className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>
      )}

      {/* Scheduler Status */}
      {schedulerStatus && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-[#101418] mb-4">Scheduler Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className={`font-semibold ${schedulerStatus.isScheduled ? 'text-green-600' : 'text-red-600'}`}>
                {schedulerStatus.isScheduled ? 'Running' : 'Stopped'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Interval</p>
              <p className="font-semibold">{schedulerStatus.config.intervalHours} hours</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Next Run</p>
              <p className="font-semibold">
                {schedulerStatus.nextRun ? new Date(schedulerStatus.nextRun).toLocaleString() : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Auto Cleanup</p>
              <p className="font-semibold">{schedulerStatus.config.cleanupOldFiles ? 'Enabled' : 'Disabled'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Statistics */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Jobs by Country */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-[#101418] mb-4">Jobs by Country</h3>
            <div className="space-y-2">
              {Object.entries(stats.byCountry)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10)
                .map(([country, count]) => (
                  <div key={country} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{country}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Jobs by Source */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-[#101418] mb-4">Jobs by Source</h3>
            <div className="space-y-2">
              {Object.entries(stats.bySource)
                .sort(([,a], [,b]) => b - a)
                .map(([source, count]) => (
                  <div key={source} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{source}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Jobs by Category */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-[#101418] mb-4">Jobs by Category</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {Object.entries(stats.byCategory)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 15)
                .map(([category, count]) => (
                  <div key={category} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{category}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Jobs by Type */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-[#101418] mb-4">Jobs by Type</h3>
            <div className="space-y-2">
              {Object.entries(stats.byType)
                .sort(([,a], [,b]) => b - a)
                .map(([type, count]) => (
                  <div key={type} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 capitalize">{type.replace('-', ' ')}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
