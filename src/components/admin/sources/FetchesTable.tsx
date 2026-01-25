import { useMemo } from "react";
import DataTable from "@/components/custom/DataTable";
import { Pagination } from "@/types";
import { formatDate } from "@/lib/date";
import { Source } from "@/types/supabase";
import { Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";

// Using Source type temporarily until Fetch type is created
interface FetchesTableProps {
  loading: boolean;
  fetches: Source[]; // Will be replaced with Fetch[] when the table exists
  pageSize: number;
  pagination: Pagination | undefined;
  onPageChange: (page: number) => void;
}

export default function FetchesTable({
  loading,
  fetches,
  pageSize,
  pagination,
  onPageChange,
}: FetchesTableProps) {

  const headers = useMemo(() => {
    return ["Source", "Status", "Records", "Started At", "Duration"];
  }, []);

  // Mock data transformation - will be replaced with actual fetch data
  const rows = useMemo(() => {
    return fetches.map((fetch, index) => {
      // Mock status based on index for demo purposes
      const statuses = ['completed', 'failed', 'running', 'pending'];
      const mockStatus = statuses[index % statuses.length];
      const mockRecords = Math.floor(Math.random() * 500) + 10;
      const mockDuration = `${Math.floor(Math.random() * 60) + 1}s`;

      const getStatusBadge = (status: string) => {
        switch (status) {
          case 'completed':
            return (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                <CheckCircle className="h-3 w-3" />
                Completed
              </span>
            );
          case 'failed':
            return (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                <XCircle className="h-3 w-3" />
                Failed
              </span>
            );
          case 'running':
            return (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                <Loader2 className="h-3 w-3 animate-spin" />
                Running
              </span>
            );
          default:
            return (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                <Clock className="h-3 w-3" />
                Pending
              </span>
            );
        }
      };

      const cells = [
        <div key="source" className="max-w-[200px]">
          <p className="font-medium text-gray-900">{fetch.name}</p>
          <p className="text-gray-500 text-xs">{fetch.code}</p>
        </div>,
        getStatusBadge(mockStatus),
        <span key="records" className="text-sm text-gray-700 font-medium">
          {mockStatus === 'completed' ? mockRecords.toLocaleString() : '—'}
        </span>,
        <span key="started_at" className="text-sm text-gray-600">{formatDate(fetch.created_at)}</span>,
        <span key="duration" className="text-sm text-gray-600">
          {mockStatus === 'completed' || mockStatus === 'failed' ? mockDuration : '—'}
        </span>,
      ];

      return { cells };
    });
  }, [fetches]);

  const dropdownOptions = [
    { label: "View Details", action: "view" },
    { label: "Retry", action: "retry" },
    { label: "Cancel", action: "cancel" },
  ];

  const handleOptionClick = (action: string, rowIndex: number) => {
    const fetch = fetches[rowIndex];
    switch (action) {
      case "view":
        console.log("View fetch:", fetch);
        break;
      case "retry":
        console.log("Retry fetch:", fetch);
        break;
      case "cancel":
        console.log("Cancel fetch:", fetch);
        break;
      default:
        break;
    }
  };

  return (
    <DataTable
      loading={loading}
      headers={headers}
      rows={rows}
      pagination={pagination}
      pageSize={pageSize}
      onPageChange={onPageChange}
      dropdownOptions={dropdownOptions}
      onOptionClick={handleOptionClick}
    />
  );
}
