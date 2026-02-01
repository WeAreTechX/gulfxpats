import { useMemo } from "react";
import DataTable from "@/components/custom/DataTable";
import Status from "@/components/ui/Status";
import { QueryPagination, User } from "@/types";
import { formatDate } from "@/lib/date";
import { Mail } from "lucide-react";
import {getCountryByIso3} from "@/lib/countries";


interface UsersTableProps {
  loading: boolean;
  error: string | null;
  users: User[];
  pagination: QueryPagination | undefined;
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
    return users.map((user: User) => {
      const cells = [
        <div key="user" className="flex items-center min-w-[200px]">
          <div className="ml-3">
            <p className="font-medium text-gray-900">
              {user.first_name} {user.last_name || ''}
            </p>
            <p className="text-sm text-gray-500 flex items-center">{user.email}</p>
          </div>
        </div>,
        <div key="location" className="max-w-[160px]">
          {user.location ? (
            <>
              <p className="text-gray-700 flex items-center">{user.location}</p>
              <span className="text--700 flex items-center">{getCountryByIso3(user.country)?.name}</span>
            </>
            ) :
            (<p className="text-gray-600 flex items-center">{getCountryByIso3(user.country)?.name}</p>)
          }
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
