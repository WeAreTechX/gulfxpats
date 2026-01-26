import { useMemo } from "react";
import DataTable from "@/components/custom/DataTable";
import Status from "@/components/ui/Status";
import { Pagination, Status as StatusType } from "@/types";
import { formatDate } from "@/lib/date";
import { Mail } from "lucide-react";

export interface Admin {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'admin' | 'super_admin';
  status?: StatusType;
  created_at: string;
  modified_at: string;
}

interface AdminsTableProps {
  loading: boolean;
  error: string | null;
  admins: Admin[];
  pagination: Pagination | undefined;
  onPageChange: (page: number) => void;
  onRowChange: () => void;
}

export default function AdminsTable({
  loading,
  error,
  admins,
  pagination,
  onPageChange,
  onRowChange,
}: AdminsTableProps) {

  const headers = useMemo(() => {
    return ["Admin", "Role", "Created on", "Updated on", "Status"];
  }, []);

  const rows = useMemo(() => {
    return admins.map((admin) => {
      const cells = [
        <div key="admin" className="flex items-center min-w-[200px]">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white font-medium">
            {admin.first_name.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3">
            <p className="font-medium text-gray-900">
              {admin.first_name} {admin.last_name}
            </p>
            <p className="text-sm text-gray-500 flex items-center">
              <Mail className="h-3 w-3 mr-1" />
              {admin.email}
            </p>
          </div>
        </div>,
        <span
          key="role"
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            admin.role === 'super_admin'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-indigo-100 text-indigo-800'
          }`}
        >
          {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
        </span>,
        <p key="created_at" className="text-gray-600">{formatDate(admin.created_at)}</p>,
        <p key="modified_at" className="text-gray-600">{formatDate(admin.modified_at)}</p>,
        admin.status ? <Status key="status" {...admin.status} /> : <span key="status" className="text-gray-400">—</span>
      ];
      return { cells };
    });
  }, [admins]);

  const dropdownOptions = [
    { label: "Edit", action: "edit" },
    { label: "Change status", action: "change-status" },
    { label: "Remove", action: "remove" },
  ];

  const handleDelete = async (adminId: string) => {
    if (!confirm('Are you sure you want to delete this admin?')) return;

    try {
      const response = await fetch(`/api/admins?id=${adminId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        onRowChange?.();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
      alert('Failed to delete admin');
    }
  };

  const handleOptionClick = (action: string, rowIndex: number) => {
    const admin = admins[rowIndex];
    switch (action) {
      case "edit":
        // Handle edit
        break;
      case "change-status":
        // Handle status change
        break;
      case "remove":
        handleDelete(admin.id).then();
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
