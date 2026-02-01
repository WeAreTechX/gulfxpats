import {useMemo} from "react";
import DataTable from "@/components/custom/DataTable";
import Status from "@/components/custom/Status";
import {QueryPagination, Job} from "@/types";
import {formatDate} from "@/lib/date";
import {formatSalary} from "@/lib/utils";

interface JobsTableProps {
  loading: boolean;
  error: string | null;
  jobs: Job[];
  pagination: QueryPagination | undefined
  onPageChange: (page: number) => void;
  onRowChange: () => void;
}

export default function JobsTable(props: JobsTableProps) {

  const { loading, error, jobs, pagination, onPageChange, onRowChange } = props;

  const headers = useMemo(() => {
    return ["Title", "Description", "Company", "Type", "Location", "Industry", "Added", "Updated", "Status"];
  }, []);

  const rows = useMemo(() => {
    return jobs.map((job) => {
      const cells = [
        <div key="title" className="min-w-[180px]">
          <p className="font-medium text-gray-900">{job.title}</p>
          {job.salary_min && job.salary_max && (
            <p className="text-gray-500 flex items-center gap-1 mt-1">
              {formatSalary(job.salary_min, job.salary_max, job.currency?.code)}
            </p>
          )}
        </div>,
        <p key="description" className="text-gray-700  truncate max-w-[100px]">{job.description || '-'}</p>,
        <p key="company" className="text-gray-700 max-w-[160px]">{job.company_name || (job.company?.name || '-')}</p>,
        <p key="type"  className="min-w-[80px]">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
          {job.type?.name || '-'}
        </span>
        </p>,
        <span key="location" className="text-gray-700">{job.location || '-'}</span>,
        <p key="industry" className="text-gray-700 max-w-[100px]">{job.industry?.name || '-'}</p>,
        <p key="created_at" className="text-gray-700 w-[160px]">{formatDate(job.created_at, 'medium', '-')}</p>,
        <p key="modified_at" className="text-gray-700 w-[160px]">{formatDate(job.modified_at, 'medium', '-')}</p>,
        <Status key="status" {...job.status!} />
      ];

      return { cells };
    });
  }, [jobs]);

  const dropdownOptions = [
    { label: "View", action: "view" },
    { label: "Edit", action: "edit" },
    { label: "Publish", action: "publish" },
    { label: "Archive", action: "archive" },
    { label: "Remove", action: "remove" }
  ]

  const handleDelete = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        onRowChange?.();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job');
    }
  };

  const handleOptionClick = (action: string, rowIndex: number) => {
    const job = jobs[rowIndex];
    switch (action) {
      case "view":
        //
        break;
      case "edit":
        //
        break;
      case "publish":
        //
        break;
      case "archive":
        //
        break;
      case "remove":
        handleDelete(job.id).then()
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

