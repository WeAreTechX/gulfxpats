import {Currency, Status} from "@/types";
import  { Company } from "@/types/companies";
import {Query} from "@/types/api";

export interface JobCreate {
  title: string;
  description: string;
  company_id?: number;
  job_type_id: number;
  industry_id: number;
  location: string;
  salary_min: number;
  salary_max: number;
  salary_frequency: "monthly" | "annually";
  currency_id: number;
  apply_url: string;
  metadata: {
    [key: string]: string | undefined;
  };
}

export interface JobType {
  id: number;
  name: string;
  code: string;
}

export interface JobIndustry {
  id: number;
  name: string;
  code: string;
}

export interface Job extends JobCreate {
  id: string;
  created_at: Date | string;
  modified_at: Date | string;
  status_id: number;
  company?: Company;
  job_type?: JobType;
  industry?: JobIndustry;
  currency?: Currency;
  status?: Status;
}

export interface JobQuery extends Query {
  location?: string;
  job_type_id?: string | number;
  industry_id?: string | number;
}

export interface Source {
  name: string;
  code: string;
  base_url: string;
  created_by_id?: string;
}