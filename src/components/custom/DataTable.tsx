import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ReactNode, useMemo } from "react";
import {ChevronDown, ChevronLeft, ChevronRight, Database, Loader2, MoreVertical} from "lucide-react";
import {Pagination} from "@/types";

interface CustomDataTableProps {
  loading?: boolean;
  error: string | null;
  headers: string[];
  rows: {
    cells: (string | ReactNode)[];
  }[];
  dropdownOptionsTrigger?: 'icon' | 'text';
  dropdownOptions?: { label: string; action: string }[];
  onOptionClick?: (action: string, rowIndex: number) => void;
  pagination: Pagination | undefined;
  hidePagination?: boolean,
  onPageChange?: (page: number) => void;
  onRetryAction: () => void;
}

export default function DataTable({
    loading = false,
    error = null,
    headers,
    rows,
    dropdownOptionsTrigger = 'icon',
    dropdownOptions,
    onOptionClick,
    pagination,
    hidePagination = false,
    onPageChange,
    onRetryAction
  }: CustomDataTableProps) {

  const currentPage = pagination?.current_page || 1;
  const totalCount = pagination?.total_count || 0;
  const totalPages = pagination?.total_pages || 0

  const paginationRange = useMemo(() => {
    const range = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) range.push(i);
    } else {
      if (currentPage <= 3) {
        range.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        range.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        range.push(1, '...', currentPage, '...', totalPages);
      }
    }
    return range;
  }, [currentPage, totalPages]);

  const startCount = pagination ? ((currentPage - 1) * (pagination.count) + 1) : 1
  const endCount = pagination ? (Math.min(currentPage * pagination.count, totalCount)) : 1

  const hidePaginationSection = hidePagination || rows.length == 0;

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-semibold mb-2">Error</h3>
        <p className="text-red-600">{error}</p>
        <button
          onClick={onRetryAction}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{header}</th>
              ))}
              {dropdownOptions && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={12}>

                <div className="flex items-center justify-center min-h-[400px]">
                  <Loader2 className="h-10 w-10 text-[#04724D] animate-spin" />
                </div>
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td
                colSpan={headers.length + (dropdownOptions ? 1 : 0)}
                className="px-6 py-16"
              >
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="mb-3">
                    <Database className="w-14 h-14 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-500 mb-1">No data available</h3>
                  <p className="text-sm text-gray-600 max-w-md">There are no items to display at this time.</p>
                </div>
              </td>
            </tr>
          ) : (
            rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                {row.cells.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-5 py-4 text-sm">
                    {cell}
                  </td>
                ))}
                {dropdownOptions && dropdownOptions.length > 0 && (
                  <td className="text-right px-6 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        {dropdownOptionsTrigger === 'icon' ? (
                          <button className="p-2 hover:bg-gray-100 rounded-md">
                            <MoreVertical className="w-5 h-5 text-black" />
                          </button>
                        ) : (
                          <button
                            className={cn(
                              "text-sm border border-gray-300 bg-white",
                              "rounded-md px-[12px] py-[10.5px] w-[100px] h-[32px]",
                              "flex items-center justify-center gap-2 text-black"
                            )}
                            title="Options menu"
                          >
                            <span>Options</span>
                            <ChevronDown className="w- h-4" />
                          </button>
                        )}

                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        {dropdownOptions.map((option, optIdx) => (
                          <DropdownMenuItem
                            key={optIdx}
                            onClick={() => onOptionClick?.(option.action, rowIndex)}
                          >
                            {option.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                )}
              </tr>
            ))
          )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!hidePaginationSection && !loading && (
        <div className="flex items-center justify-between px-6 py-4">
          <p className="text-sm text-gray-600">
            Showing {startCount}–{endCount} of {totalCount}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange?.(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 border border-gray-400 rounded text-gray-700 flex items-center justify-center"
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {paginationRange.map((item, idx) => (
              <button
                key={idx}
                disabled={item === '...'}
                onClick={() =>
                  typeof item === "number" ? onPageChange?.(item) : undefined
                }
                className={cn(
                  "w-8 h-8 border border-gray-400 rounded text-sm flex items-center justify-center",
                  item === currentPage ? "bg-gray-200" : "bg-white"
                )}
                title={typeof item === 'number' ? `Page ${item}` : 'More pages'}
              >
                {item}
              </button>
            ))}

            <button
              onClick={() => onPageChange?.(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 border border-gray-400 rounded text-gray-700 flex items-center justify-center"
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
