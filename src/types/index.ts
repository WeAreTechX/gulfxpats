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
  description: string | null;
  linkedIn?: string;
  openJobs?: number;
  contactPerson?: Record<string, unknown> | null;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  location?: string;
  phone?: string;
  role: 'user' | 'admin';
  statusId: number;
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
