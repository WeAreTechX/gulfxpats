import { useMemo } from "react";
import DataTable from "@/components/custom/DataTable";
import { Pagination } from "@/types";
import { formatDate } from "@/lib/date";
import { Source } from "@/types/companies";
import { Globe } from "lucide-react";

interface SourcesTableProps {
  loading: boolean;
  error: string | null;
  sources: Source[];
  pagination: Pagination | undefined;
  onPageChange: (page: number) => void;
  onRetryAction: () => void;
  onEdit: (source: Source) => void;
}

export default function JobsSourcesTable(props: SourcesTableProps) {
  const { loading, error, sources, pagination, onPageChange, onRetryAction, onEdit } = props;
  
  const headers = useMemo(() => {
    return ["Name", "Code", "Base URL", "Created on", "Updated on"];
  }, []);

  const rows = useMemo(() => {
    return sources.map((source) => {
      const cells = [
        <div key="name" className="max-w-[200px]">
          <p className="font-medium text-gray-900">{source.name}</p>
        </div>,
        <span key="code" className="font-mono text-sm text-slate-700 bg-slate-100 px-2 py-1 rounded">{source.code}</span>,
        <div key="base_url">
          {source.base_url && source.base_url !== '-' ? (
            <a
              href={source.base_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 hover:text-teal-800 text-sm flex items-center gap-1"
            >
              <Globe className="h-3.5 w-3.5" />
              <span className="truncate max-w-[200px]">{source.base_url}</span>
            </a>
          ) : (
            <span className="text-gray-400 text-sm">—</span>
          )}
        </div>,
        <span key="created_at" className="text-sm text-gray-600">{formatDate(source.created_at)}</span>,
        <span key="modified_at" className="text-sm text-gray-600">{formatDate(source.modified_at)}</span>,
      ];

      return { cells };
    });
  }, [sources]);

  const dropdownOptions = [
    { label: "Edit", action: "edit" },
    { label: "Remove", action: "remove" },
  ];

  const handleDelete = async (sourceId: string) => {
    if (!confirm('Are you sure you want to delete this source?')) return;

    try {
      const response = await fetch(`/api/jobs/sources/${sourceId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        onRetryAction(); // Refresh the list
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting source:', error);
      alert('Failed to delete source');
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
