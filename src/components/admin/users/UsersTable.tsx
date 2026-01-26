import { useMemo } from "react";
import DataTable from "@/components/custom/DataTable";
import Status from "@/components/ui/Status";
import { Pagination, Status as StatusType } from "@/types";
import { formatDate } from "@/lib/date";
import { Mail, MapPin } from "lucide-react";

export interface User {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  location: string | null;
  status?: StatusType;
  created_at: string;
  modified_at: string;
}

interface UsersTableProps {
  loading: boolean;
  error: string | null;
  users: User[];
  pagination: Pagination | undefined;
  onPageChange: (page: number) => void;
  onRowChange: () => void;
}

export default function UsersTable({
  loading,
  error,
  users,
  pagination,
  onPageChange,
  onRowChange,
}: UsersTableProps) {

  const headers = useMemo(() => {
    return ["User", "Location", "Created on", "Updated on", "Status"];
  }, []);

  const rows = useMemo(() => {
    return users.map((user) => {
      const cells = [
        <div key="user" className="flex items-center min-w-[200px]">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full flex items-center justify-center text-white font-medium">
            {user.first_name.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3">
            <p className="font-medium text-gray-900">
              {user.first_name} {user.last_name || ''}
            </p>
            <p className="text-sm text-gray-500 flex items-center">
              <Mail className="h-3 w-3 mr-1" />
              {user.email}
            </p>
          </div>
        </div>,
        <div key="location" className="max-w-[160px]">
          {user.location ? (
            <p className="text-gray-700 flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {user.location}
            </p>
          ) : (
            <span className="text-gray-400">—</span>
          )}
        </div>,
        <p key="created_at" className="text-gray-600">{formatDate(user.created_at)}</p>,
        <p key="modified_at" className="text-gray-600">{formatDate(user.modified_at)}</p>,
        user.status ? <Status key="status" {...user.status} /> : <span key="status" className="text-gray-400">—</span>
      ];
      return { cells };
    });
  }, [users]);

  const dropdownOptions = [
    { label: "Edit", action: "edit" },
    { label: "Change status", action: "change-status" },
    { label: "Remove", action: "remove" },
  ];

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`/api/users?id=${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        onRowChange?.();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const handleOptionClick = (action: string, rowIndex: number) => {
    const user = users[rowIndex];
    switch (action) {
      case "edit":
        // Handle edit
        break;
      case "change-status":
        // Handle status change
        break;
      case "remove":
        handleDelete(user.id).then();
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
