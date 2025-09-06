export interface Job {
  id: string;
  title: string;
  company: string;
  companyId: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  remote: boolean;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirements: string[];
  benefits: string[];
  postedAt: string;
  applicationUrl: string;
  tags: string[];
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  description: string;
  website: string;
  address: string;
  industry: string;
  size: string;
  founded: number;
  openJobs: number;
  socialMedia: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
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
  salary: {
    min: number;
    max: number;
  };
  company: string;
}

export interface SortOption {
  field: 'postedAt' | 'salary' | 'title' | 'company';
  direction: 'asc' | 'desc';
}

