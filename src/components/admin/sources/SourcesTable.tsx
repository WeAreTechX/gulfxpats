import { useMemo } from "react";
import DataTable from "@/components/custom/DataTable";
import { Pagination } from "@/types";
import { formatDate } from "@/lib/date";
import { Source } from "@/types/supabase";
import { Globe, Check, X } from "lucide-react";

interface SourcesTableProps {
  loading: boolean;
  sources: Source[];
  pageSize: number;
  pagination: Pagination | undefined;
  onPageChange: (page: number) => void;
}

export default function SourcesTable({
  loading,
  sources,
  pageSize,
  pagination,
  onPageChange,
}: SourcesTableProps) {

  const headers = useMemo(() => {
    return ["Name", "Code", "Website", "Status", "Created on"];
  }, []);

  const rows = useMemo(() => {
    return sources.map((source) => {
      const cells = [
        <div key="name" className="max-w-[200px]">
          <p className="font-medium text-gray-900">{source.name}</p>
          {source.description && (
            <p className="text-gray-500 text-sm truncate">{source.description}</p>
          )}
        </div>,
        <span key="code" className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
          {source.code}
        </span>,
        <div key="website">
          {source.website_url ? (
            <a
              href={source.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1"
            >
              <Globe className="h-3.5 w-3.5" />
              <span className="truncate max-w-[150px]">{new URL(source.website_url).hostname}</span>
            </a>
          ) : (
            <span className="text-gray-400 text-sm">—</span>
          )}
        </div>,
        <div key="status">
          {source.is_active ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
              <Check className="h-3 w-3" />
              Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
              <X className="h-3 w-3" />
              Inactive
            </span>
          )}
        </div>,
        <span key="created_at" className="text-sm text-gray-600">{formatDate(source.created_at)}</span>,
      ];

      return { cells };
    });
  }, [sources]);

  const dropdownOptions = [
    { label: "Edit", action: "edit" },
    { label: "Toggle Status", action: "toggle-status" },
    { label: "Remove", action: "remove" },
  ];

  const handleOptionClick = (action: string, rowIndex: number) => {
    const source = sources[rowIndex];
    switch (action) {
      case "edit":
        // TODO: Implement edit
        console.log("Edit source:", source);
        break;
      case "toggle-status":
        // TODO: Implement toggle status
        console.log("Toggle status:", source);
        break;
      case "remove":
        // TODO: Implement remove
        console.log("Remove source:", source);
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
