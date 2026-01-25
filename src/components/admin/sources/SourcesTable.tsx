import { useMemo } from "react";
import DataTable from "@/components/custom/DataTable";
import { Pagination } from "@/types";
import { formatDate } from "@/lib/date";
import { Source } from "@/types/companies";
import {Globe, Edit2} from "lucide-react";

interface SourcesTableProps {
  loading: boolean;
  error: string | null;
  sources: Source[];
  pagination: Pagination | undefined;
  onPageChange: (page: number) => void;
  onRetryAction: () => void;
}

export default function SourcesTable(props: SourcesTableProps) {
  const { loading, error, sources, pagination, onPageChange, onRetryAction } = props;
  const headers = useMemo(() => {
    return ["Name", "Code", "Base URL", "Created on", "Updated on"];
  }, []);

  const rows = useMemo(() => {
    return sources.map((source, rowIndex) => {
      const cells = [
        <div key="name" className="max-w-[200px]">
          <p className="font-medium text-gray-900">{source.name}</p>
        </div>,
        <span key="code" className="font-medium  text-slate-700">{source.code}</span>,
        <div key="base_url">
          {source.base_url ? (
            <a
              href={source.base_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1"
            >
              <Globe className="h-3.5 w-3.5" />
            </a>
          ) : (
            <span className="text-gray-400 text-sm">—</span>
          )}
        </div>,
        <span key="created_at" className="text-sm text-gray-600">{formatDate(source.created_at)}</span>,
        <span key="modified_at" className="text-sm text-gray-600">{formatDate(source.modified_at)}</span>,
        <span key="modified_at" className="text-sm text-gray-600 cursor-pointer" onClick={() => handleEdit(rowIndex)}>
          <Edit2 className="w-4 h-4"></Edit2>
        </span>,
      ];

      return { cells };
    });
  }, [sources]);

  const handleEdit = (rowIndex: number) => {
    const source = sources[rowIndex];
    console.log(source)
  };


  return (
    <DataTable
      error={error}
      loading={loading}
      headers={headers}
      rows={rows}
      pagination={pagination}
      onPageChange={onPageChange}
      onRetryAction={onRetryAction}
    />
  );
}
