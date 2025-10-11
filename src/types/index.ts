export interface Job {
  title: string;
  company: string;
  role: string;
  description: string;
  salary?: string;
  location: string;
  postedDate?: string;
  source: string;
  directLink: string;
}

export interface ScrapedData {
  datePulled: string;
  period: string;
  totalJobs: number;
  jobs: Job[];
}

export interface ScraperConfig {
  name: string;
  baseUrl: string;
  enabled: boolean;
  scraper: (period: string) => Promise<Job[]>;
}

export type JobType = 'full-time' | 'contract' | 'part-time' | 'internship';
export type JobStatus = 'open' | 'paused' | 'closed';
export interface JobN {
  uid: string;
  title: string;
  description: string;
  basicRequirements: string;
  preferredRequirements: string;
  status: 'open' | 'closed' | 'paused';
  postedDate: string;
  location: string;
  type: JobType,
  remote: boolean;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  companyId: string;
  companyName: string;
  companyIndustry: string;
  companySize: string;
  hiringManager: string;
  hiringManagerContact: string;
  sourceUrl?: string;
  company: string;
  role: string;
  source: string;
  directLink: string;
}

export interface Company {
  uid: string;
  name: string;
  email: string;
  website: string;
  logo: string;
  location: string;
  address: string;
  rawAddress: string;
  phone: string;
  description: string;
  linkedIn?: string;
  openJobs?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  resume?: string;
  address: string;
  phone?: string;
  preferences: {
    jobTypes: string[];
    locations: string[];
    remote: boolean;
  };
}

export interface Resource {
  id: string;
  title: string;
  type: 'audio' | 'video' | 'article';
  url: string;
  description: string;
  duration?: string;
  author: string;
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

