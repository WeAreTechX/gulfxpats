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
  metadata: {
    [key: string]: string | undefined;
  };
  contact?: {
    [key: string]: string | undefined;
  };
}

export interface Company extends CompanyCreate {
  id: string;
  created_at: Date | string;
  modified_at: Date | string;
  status_id: number;
  status: Status
}

export interface CompanyQuery extends Query {
  location?: string;
}