import { useMemo } from "react";
import DataTable from "@/components/custom/DataTable";
import Status from "@/components/ui/Status";
import {Pagination} from "@/types";
import {formatDate} from "@/lib/date";
import {Company} from "@/types/companies";
import {getCountryByIso3} from "@/lib/countries";

interface CompaniesTableProps {
  loading: boolean;
  companies: Company[];
  pageSize: number;
  pagination: Pagination | undefined
  onPageChange: (page: number) => void;
}

export default function CompaniesTable({
   loading,
   companies,
   pageSize,
   pagination,
   onPageChange,
 }: CompaniesTableProps) {

  const headers = useMemo(() => {
    return ["Name", "Location", "Created on", "Updated on", "Status"];
  }, []);

  const rows = useMemo(() => {
    return companies.map((company) => {
      const cells = [
        <div key="title" className="max-w-[140px]">
          <p className="font-medium text-gray-900">{company.name}</p>
          <p key="description" className="text-gray-700 text-sm truncate">{company.short_description || '-'}</p>
        </div>,
        <div key="location" className="max-w-[120px]">
          {company.location && <p className="font-medium text-gray-900">{getCountryByIso3(company.location)?.name}</p>}
          {company.address && (
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">{company.address}</p>
          )}
        </div>,
        <span key="created_at" className="text-sm text-gray-600">{formatDate(company.created_at)}</span>,
        <span key="modified_at" className="text-sm text-gray-600">{formatDate(company.modified_at)}</span>,
        <Status key="status" {...company.status} />,
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

