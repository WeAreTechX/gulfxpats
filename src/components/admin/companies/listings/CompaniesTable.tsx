import { useMemo } from "react";
import DataTable from "@/components/custom/DataTable";
import Status from "@/components/ui/Status";
import {QueryPagination, Company} from "@/types";
import {formatDate} from "@/lib/date";
import {getCountryByIso3} from "@/lib/countries";

interface CompaniesTableProps {
  loading: boolean;
  error: string | null;
  companies: Company[];
  pagination: QueryPagination | undefined
  onPageChange: (page: number) => void;
  onRowChange: () => void;
}

export default function CompaniesTable(props: CompaniesTableProps) {
  const { loading, error, companies, pagination, onPageChange, onRowChange } = props;

  const headers = useMemo(() => {
    return ["Name", "Location", "Created on", "Updated on", "Status"];
  }, []);

  const rows = useMemo(() => {
    return companies.map((company) => {
      const cells = [
        <div key="title" className="max-w-[160px]">
          <p className="font-medium text-gray-900">{company.name}</p>
          <p key="description" className="text-gray-700 truncate">{company.short_description || '-'}</p>
        </div>,
        <div key="location" className="max-w-[160px]">
          {company.location && <p className="font-medium text-gray-900">{company.location}</p>}
          {company.country && (
            <p className="text-gray-500 flex items-center gap-1 mt-1">{getCountryByIso3(company.country)?.name}</p>
          )}
        </div>,
        <p key="created_at" className="text-gray-600">{formatDate(company.created_at)}</p>,
        <p key="modified_at" className="text-gray-600">{formatDate(company.modified_at)}</p>,
        <Status key="status" {...company.status} />
      ];
      return { cells };
    });
  }, [companies]);

  const dropdownOptions = [
    { label: "Edit information", action: "edit" },
    { label: "Change status", action: "change-status" },
    { label: "Remove", action: "remove" },
  ]

  const handleOptionClick = (action: string, rowIndex: number) => {
    const company = companies[rowIndex];
    switch (action) {
      case "edit":
        //
        break;
      case "change-status":
        //
        break;
      case "remove":
        //
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
      hidePagination={true}
      onPageChange={onPageChange}
      dropdownOptions={dropdownOptions}
      onOptionClick={handleOptionClick}
      onRetryAction={onRowChange}
    />
  );
}

