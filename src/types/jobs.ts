import {Currency, Status} from "@/types";
import  { Company } from "@/types/companies";

export interface JobCreate {
  title: string;
  description: string;
  company_id: number;
  job_type_id: number;
  job_industry_id: number;
  location: string;
  salary_min: number;
  salary_max: number;
  salary_frequency: "monthly" | "annually";
  currency_id: number;
  apply_url: string;
  metadata: {
    [key: string]: string | undefined;
  };
  status_id: number;
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
  job_type?: JobType;
  job_industry?: JobIndustry;
  company?: Company;
  status?: Status;
  currency?: Currency;
}