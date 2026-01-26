import {Query} from "@/types/api";

export type JobType = 'full-time' | 'contract' | 'part-time' | 'internship';
export type JobStatus = 'open' | 'paused' | 'closed';

export interface Job {
  id: string;
  uid?: string;
  title: string;
  description: string | null;
  location: string | null;
  type: JobType;
  remote: boolean;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string;
  currencySymbol?: string;
  applyUrl: string;
  companyId: string;
  companyName: string | null;
  companyLogo?: string | null;
  companyWebsite?: string | null;
  companyDescription?: string | null;
  postedDate: string;
  status?: string;
  metadata?: Record<string, unknown> | null;
}

export interface Company {
  id: string;
  uid?: string;
  name: string;
  email?: string;
  website: string | null;
  logo: string | null;
  location: string | null;
  address?: string;
  phone?: string;
  short_description: string | null;
  long_description: string | null;
  linkedIn?: string;
  openJobs?: number;
  contactPerson?: Record<string, unknown> | null;
}

export interface Resource {
  id: string;
  title: string;
  type: 'audio' | 'video' | 'article' | 'guide' | 'tutorial' | 'template' | 'ebook' | 'podcast';
  url: string;
  description: string | null;
  duration?: string;
  author?: string;
  publishedAt: string;
  tags: string[];
}

export interface SearchFilters {
  query: string;
  location: string;
  jobType: string;
  remote: boolean;
  salaryMin: number;
  salaryMax: number;
  company: string;
}

export interface SortOption {
  field: 'postedAt' | 'salary' | 'title' | 'company';
  direction: 'asc' | 'desc';
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: "user";
  status_id: number;
}

export interface UserQuery extends Query {
  status?: string;
}

export type Admin = Omit<User, "role"> & {
  role: "admin" | "super_admin";
}

export enum StatusesType {
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

export interface Status {
  id?: number;
  name: string;
  code: string;
}

export interface Pagination {
  count: number;
  current_page: number;
  total_count: number;
  total_pages: number;
}

export interface Currency {
  id: number;
  code: string;
  symbol: string;
  name: string;
}