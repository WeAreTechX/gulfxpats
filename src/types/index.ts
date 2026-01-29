
/**
 * =================
 * QUERY, LOOKUPS
 * =================
 */
export interface Query {
  search?: string;
  page?: number;
  page_size?: number;
  order_by?: string;
  order_dir?: "asc" | "desc";
}

export interface QueryStats {
  [key: string]: number
}

export interface QueryPagination {
  count: number;
  current_page: number;
  total_count: number;
  total_pages: number;
}

export interface QueryResponse<T> {
  pagination: QueryPagination;
  list: T[]
}

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export enum Statuses {
  Active = 1,
  Inactive ,
  Pending,
  Published,
  Unpublished,
  Archived,
  Enabled,
  Disabled,
  Verified,
  Unverified,
  Deleted
}

export interface EntityCreate {
  name: string;
  code: string;
}

export interface Entity extends EntityCreate {
  id: number;
  created_at: Date | string;
  modified_at: Date | string;
}

export interface EntityUpdate extends EntityCreate {
  id: number;
  name: string;
  code: string;
}

export interface Currency extends Entity {
  symbol: string;
}


/**
 * =================
 * ADMIN et USERS
 * =================
 */

export interface UserCreate {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  country: string;
}

export interface User extends UserCreate {
  id: string;
  user: string;
  status_id: number;
  created_at: Date | string;
  modified_at: Date | string;
}

export interface UserUpdate extends UserCreate {
  first_name: string;
  last_name: string;
  location?: string;
  country: string;
  status_id?: number;
}

export interface UserQuery extends Query {
  status_code?: string;
}

export interface Admin {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: "admin" | "super_admin" | "member";
  status_id: number;
  created_at: Date | string;
  modified_at: Date | string;
}

export interface AdminUpdate {
  first_name?: string;
  last_name?: string;
  role?: string;
  status_id?: number;
}


/**
 * =================
 * COMPANIES
 * =================
 */

export interface CompanyCreate {
  name: string;
  short_description: string;
  long_description: string;
  website_url: string;
  logo_url: string;
  location: string;
  country: string;
  metadata?: { [key: string]: Json };
  contact?: { [key: string]: Json };
  tags?: string[];
  rank?: number;
  is_premium: boolean;
  created_by_id?: string;
}

export interface Company extends CompanyCreate {
  id: string;
  status_id: number;
  status: Entity;
  created_by: Admin;
  created_at: Date | string;
  modified_at: Date | string;
}

export interface CompanyUpdate extends CompanyCreate {
  id: string;
  status_id: number;
}

export interface CompaniesQuery extends Query {
  country?: string;
  status_code?: string;
  is_premium?: boolean;
  tags?: string[];
}

export interface CompanyJobSourceCreate {
  company_code: string;
  company_id: string;
  jobs_source_id: number
  created_by_id: string;
}

export interface CompanyJobSource extends  CompanyJobSourceCreate {
  id: string;
  created_at: Date | string;
  modified_at: Date | string;
}

export interface CompanyJobSourceUpdate {
  id: string;
  company_code: string;
}

/**
 * =================
 * RESOURCES
 * =================
 */

export interface ResourceCreate {
  type_id: number;
  title: string;
  description: string;
  url: string;
  is_premium: boolean;
  rank?: number;
  metadata?: { [key: string]: Json };
  tags?: string[];
}

export interface Resource extends ResourceCreate {
  id: string;
  type: Entity;
  status_id: number;
  status: Entity;
  created_by: Admin;
}

export interface ResourceUpdate {
  type_id?: number;
  title?: string;
  description?: string;
  url?: string;
  is_premium?: boolean;
  rank?: number;
  metadata?: { [key: string]: Json };
  tags?: string[];
}

export interface ResourcesQuery extends Query {
  type_id?: string;
  status_code?: string;
  is_premium?: boolean;
  tags?: string[];
}

/**
 * =================
 * JOBS SOURCES
 * =================
 */
export interface JobSourceCreate extends EntityCreate {
  base_url: string;
}

export interface JobSource extends Entity {
  base_url: string
}

/**
 * ========================
 * JOBS SCRAPINGS
 * ========================
 */
export interface JobsScrapingsCreate {
  batch_id: number;
  company_name: string;
  company_id: string;
  jobs_source_id?: number;
  started_at: Date | string;
  ended_at: Date | string;
  created_by_id: string;
}

export interface JobsScrapings extends  JobsScrapingsCreate {
  id: string;
  status: Entity;
  created_by: Admin;
  created_at: Date | string;
  modified_at: Date | string;
}

/**
 * ========================
 * JOBS
 * ========================
 */
export interface JobCreate {
  type_id: number;
  title: string;
  description: string;
  company_id: string;
  company_name: string;
  jobs_scrapings_id: string;
  location?: string;
  country: string;
  salary_min: number;
  salary_max: number;
  salary_frequency: 'monthly' | 'annually';
  currency_id: number;
  industry_id: number;
  apply_url: string;
  metadata?: { [key: string]: Json };
  tags?: string[];
  rank?: number;
  is_premium: boolean;
  created_by_id: string;
}

export interface Job extends JobCreate {
  id: string;
  status_id: number;
  status: Entity;
  created_by: Admin;
  created_at: Date | string;
  modified_at: Date | string;
}

export type JobUpdate = JobCreate

export interface JobsQuery extends Query {
  type_id?: string;
  country?: string;
  salary_min?: string;
  salary_max?: string;
  currency_id?: string;
  industry_id?: string;
  status_code?: string;
  is_premium?: boolean;
  tags?: string[];
}