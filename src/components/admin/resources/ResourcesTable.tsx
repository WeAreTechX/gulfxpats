import { useMemo } from "react";
import DataTable from "@/components/custom/DataTable";
import Status from "@/components/ui/Status";
import { Pagination, Status as StatusType } from "@/types";
import { formatDate } from "@/lib/date";
import { ExternalLink } from "lucide-react";

export interface Resource {
  id: string;
  title: string;
  description: string | null;
  url: string;
  resource_type?: { id: number; name: string; code: string };
  is_premium: boolean;
  status?: StatusType;
  created_at: string;
  modified_at: string;
}

interface ResourcesTableProps {
  loading: boolean;
  error: string | null;
  resources: Resource[];
  pagination: Pagination | undefined;
  onPageChange: (page: number) => void;
  onRowChange: () => void;
}

export default function ResourcesTable({
  loading,
  error,
  resources,
  pagination,
  onPageChange,
  onRowChange,
}: ResourcesTableProps) {

  const headers = useMemo(() => {
    return ["Title", "Type", "URL", "Premium", "Created on", "Updated on", "Status"];
  }, []);

  const rows = useMemo(() => {
    return resources.map((resource) => {
      const cells = [
        <div key="title" className="max-w-[200px]">
          <p className="font-medium text-gray-900">{resource.title}</p>
          {resource.description && (
            <p className="text-gray-500 text-sm truncate">{resource.description}</p>
          )}
        </div>,
        <span key="type" className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {resource.resource_type?.name || '-'}
        </span>,
        <a
          key="url"
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-teal-600 hover:text-teal-800 flex items-center"
        >
          <ExternalLink className="h-4 w-4 mr-1" />
          Visit
        </a>,
        <span
          key="premium"
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            resource.is_premium ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'
          }`}
        >
          {resource.is_premium ? 'Premium' : 'Free'}
        </span>,
        <p key="created_at" className="text-gray-600">{formatDate(resource.created_at)}</p>,
        <p key="modified_at" className="text-gray-600">{formatDate(resource.modified_at)}</p>,
        resource.status ? <Status key="status" {...resource.status} /> : <span key="status" className="text-gray-400">—</span>
      ];
      return { cells };
    });
  }, [resources]);

  const dropdownOptions = [
    { label: "Edit", action: "edit" },
    { label: "Change status", action: "change-status" },
    { label: "Remove", action: "remove" },
  ];

  const handleDelete = async (resourceId: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;

    try {
      const response = await fetch(`/api/resources?id=${resourceId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        onRowChange?.();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting resource:', error);
      alert('Failed to delete resource');
    }
  };

  const handleOptionClick = (action: string, rowIndex: number) => {
    const resource = resources[rowIndex];
    switch (action) {
      case "edit":
        // Handle edit
        break;
      case "change-status":
        // Handle status change
        break;
      case "remove":
        handleDelete(resource.id).then();
        break;
      default:
        break;
    }
  };

  return (
    <DataTable
      loading={loading}
      error={error}
      headers={headers}
      rows={rows}
      pagination={pagination}
      onPageChange={onPageChange}
      dropdownOptions={dropdownOptions}
      onOptionClick={handleOptionClick}
      onRetryAction={onRowChange}
    />
  );
}
