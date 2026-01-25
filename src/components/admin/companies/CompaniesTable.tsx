import { useMemo } from "react";
import DataTable from "@/components/custom/DataTable";
import Status from "@/components/ui/Status";
import {Pagination} from "@/types";
import {formatDate} from "@/lib/date";
import {Company} from "@/types/companies";

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
    return ["Name", "Location", "Industry", "Short Description", "Date Added"];
  }, []);

  const rows = useMemo(() => {
    return companies.map((company) => {
      const cells = [
        <Status key="status" {...company.status} />,
        <div key="company" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#00A558] flex items-center justify-center text-white font-medium text-sm">
            {company.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {company.name}
            </p>
          </div>
        </div>,
        <p key="location" className="text-sm text-gray-600">
          {company.location}
        </p>,
        <p key="industry" className="text-sm text-gray-600">
          {company.metadata.industry}
        </p>,
        <p key="short_description" className="text-sm text-gray-600">
          {company.short_description}
        </p>,
        <p key="date" className="text-sm text-gray-600">
          {formatDate(company.created_at)}
        </p>
      ];

      return { cells };
    });
  }, [companies]);

  const dropdownOptions = [
    { label: "Edit company", action: "edit" },
    { label: "Change status", action: "change-status" },
    { label: "Remove company", action: "remove" },
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

