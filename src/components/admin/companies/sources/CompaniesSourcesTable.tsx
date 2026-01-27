import { useMemo } from "react";
import DataTable from "@/components/custom/DataTable";
import { Pagination } from "@/types";
import { formatDate } from "@/lib/date";
import { CompaniesSources } from "@/types/companies";
import { Globe, Building2 } from "lucide-react";

interface CompaniesSourcesTableProps {
  loading: boolean;
  error: string | null;
  sources: CompaniesSources[];
  pagination: Pagination | undefined;
  onPageChange: (page: number) => void;
  onRetryAction: () => void;
  onEdit: (source: CompaniesSources) => void;
}

export default function CompaniesSourcesTable(props: CompaniesSourcesTableProps) {
  const { loading, error, sources, pagination, onPageChange, onRetryAction, onEdit } = props;
  
  const headers = useMemo(() => {
    return ["Company", "Source", "Last Synced", "Created on", "Updated on"];
  }, []);

  const rows = useMemo(() => {
    return sources.map((item) => {
      const cells = [
        <div key="company" className="max-w-[200px]">
          {item.company ? (
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-gray-400" />
              <p className="font-medium text-gray-900">{item.company.name}</p>
            </div>
          ) : (
            <span className="text-gray-400 text-sm">—</span>
          )}
        </div>,
        <div key="source" className="max-w-[200px]">
          {item.source ? (
            <div>
              <p className="font-medium text-gray-900">{item.source.name}</p>
              <span className="font-mono text-xs text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">{item.source.code}</span>
            </div>
          ) : (
            <span className="text-gray-400 text-sm">—</span>
          )}
        </div>,
        <span key="synced_at" className="text-sm text-gray-600">
          {item.synced_at ? formatDate(item.synced_at) : '—'}
        </span>,
        <span key="created_at" className="text-sm text-gray-600">{formatDate(item.created_at)}</span>,
        <span key="modified_at" className="text-sm text-gray-600">{formatDate(item.modified_at)}</span>,
      ];

      return { cells };
    });
  }, [sources]);

  const dropdownOptions = [
    { label: "Edit", action: "edit" },
    { label: "Remove", action: "remove" },
  ];

  const handleDelete = async (sourceId: number) => {
    if (!confirm('Are you sure you want to delete this company source?')) return;

    try {
      const response = await fetch(`/api/companies/sources/${sourceId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        onRetryAction(); // Refresh the list
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting company source:', error);
      alert('Failed to delete company source');
    }
  };

  const handleOptionClick = (action: string, rowIndex: number) => {
    const source = sources[rowIndex];
    switch (action) {
      case "edit":
        onEdit(source);
        break;
      case "remove":
        handleDelete(source.id).then();
        break;
      default:
        break;
    }
  };

  return (
    <DataTable
      error={error}
      loading={loading}
      headers={headers}
      rows={rows}
      pagination={pagination}
      onPageChange={onPageChange}
      dropdownOptions={dropdownOptions}
      onOptionClick={handleOptionClick}
      onRetryAction={onRetryAction}
    />
  );
}
