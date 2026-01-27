import {Query } from "@/types/api";
import {Status } from "@/types/index";

export interface CompanyCreate {
  name: string;
  short_description: string;
  long_description?: string | null;
  website_url: string;
  logo_url: string | undefined;
  location: string;
  address: string;
  tags: string[];
  metadata: {
    [key: string]: string | undefined;
  };
  contact?: {
    [key: string]: string | undefined;
  };
  created_by_id?: string;
}

export interface Company extends CompanyCreate {
  id: string;
  created_at: Date | string;
  modified_at: Date | string;
  status_id: number;
  status: Status
  rank: number;
  jobs_count?: number;
}

export interface CompanyQuery extends Query {
  location?: string;
  order?: string;
}

export interface SourceCreate {
  name: string;
  code: string;
  base_url: string;
}

export interface Source extends SourceCreate{
  id: string;
  created_at: Date | string;
  modified_at: Date | string;
}

export interface CompaniesSources {
  id: number;
  company_id: string;
  source_id: number;
  synced_at: Date | string;
  created_at: Date | string;
  modified_at: Date | string;
  company: Company | null;
  source: Source | null;
}