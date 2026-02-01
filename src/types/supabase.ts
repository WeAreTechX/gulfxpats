import {
  Entity, EntityCreate, EntityUpdate,
  User, UserCreate, UserUpdate as UserUpdateRef,
  Admin, AdminUpdate, Currency,
  Resource, ResourceCreate, ResourceUpdate as ResourceUpdateRef,
  JobSourceCreate, JobSource, JobSourceUpdate as JobSourceUpdateRef,
  Company, CompanyCreate, CompanyUpdate as CompanyUpdateRef, CompanyJobSource, CompanyJobSourceCreate,
  JobsScrapings, JobsScrapingsCreate, Job, JobCreate, JobUpdate as JobUpdateRef
} from "@/types/index";

export interface Database {
  public: {
    Tables: {
      statuses: {
        Row: Entity;
        Insert: EntityCreate;
        Update: EntityUpdate;
      };
      locales: {
        Row: Entity;
        Insert: EntityCreate;
        Update: EntityUpdate;
      };
      users: {
        Row: User;
        Insert: UserCreate;
        Update: UserUpdateRef;
      };
      admins: {
        Row: Admin;
        Update: AdminUpdate;
      };
      currencies: {
        Row: Currency;
        Insert: EntityCreate;
        Update: EntityUpdate;
      };
      industries: {
        Row: Entity;
        Insert: EntityCreate;
        Update: EntityUpdate;
      };
      tags: {
        Row: Entity;
        Insert: EntityCreate;
        Update: EntityUpdate;
      };
      resource_types: {
        Row: Entity;
        Insert: EntityCreate;
        Update: EntityUpdate;
      };
      resources: {
        Row: Resource;
        Insert: ResourceCreate;
        Update: ResourceUpdateRef;
      };
      jobs_sources: {
        Row: JobSource;
        Insert: JobSourceCreate;
        Update: JobSourceUpdateRef;
      };
      companies: {
        Row: Company;
        Insert: CompanyCreate;
        Update: CompanyUpdateRef;
      };
      companies_jobs_sources: {
        Row: CompanyJobSource;
        Insert: CompanyJobSourceCreate;
        Update: CompanyJobSourceCreate;
      };
      job_types: {
        Row: Entity;
        Insert: EntityCreate;
        Update: EntityUpdate;
      };
      jobs_scrapings: {
        Row: JobsScrapings;
        Insert: JobsScrapingsCreate;
      };
      jobs: {
        Row: Job;
        Insert: JobCreate;
        Update: JobUpdateRef;
      };

    };
  };
}

// // Convenience types for common use
// export type Status = Database['public']['Tables']['statuses']['Row'];
// export type User = Database['public']['Tables']['users']['Row'];
// export type Admin = Database['public']['Tables']['admins']['Row'];
// export type Company = Database['public']['Tables']['companies']['Row'];
// export type JobType = Database['public']['Tables']['job_types']['Row'];
// export type JobIndustry = Database['public']['Tables']['job_industries']['Row'];
// export type Currency = Database['public']['Tables']['currencies']['Row'];
// export type Job = Database['public']['Tables']['jobs']['Row'];
// export type ResourceType = Database['public']['Tables']['resource_types']['Row'];
// export type Resource = Database['public']['Tables']['resources']['Row'];
// export type Locale = Database['public']['Tables']['locales']['Row'];
// export type Source = Database['public']['Tables']['sources']['Row'];
// export type CompanySource = Database['public']['Tables']['companies_sources']['Row'];
//
// // Insert types
// export type StatusInsert = Database['public']['Tables']['statuses']['Insert'];
export type UserInsert = Database['public']['Tables']['users']['Insert'];
// export type AdminInsert = Database['public']['Tables']['admins']['Insert'];
export type CompanyInsert = Database['public']['Tables']['companies']['Insert'];
// export type JobTypeInsert = Database['public']['Tables']['job_types']['Insert'];
// export type JobIndustryInsert = Database['public']['Tables']['job_industries']['Insert'];
// export type CurrencyInsert = Database['public']['Tables']['currencies']['Insert'];
export type JobInsert = Database['public']['Tables']['jobs']['Insert'];
// export type ResourceTypeInsert = Database['public']['Tables']['resource_types']['Insert'];
export type ResourceInsert = Database['public']['Tables']['resources']['Insert'];
// export type LocaleInsert = Database['public']['Tables']['locales']['Insert'];
export type JobSourceInsert = Database['public']['Tables']['jobs_sources']['Insert'];
// export type CompanySourceInsert = Database['public']['Tables']['companies_sources']['Insert'];
//
// // Update types
// export type StatusUpdate = Database['public']['Tables']['statuses']['Update'];
export type UserUpdate = Database['public']['Tables']['users']['Update'];
// export type AdminUpdate = Database['public']['Tables']['admins']['Update'];
export type CompanyUpdate = Database['public']['Tables']['companies']['Update'];
// export type JobTypeUpdate = Database['public']['Tables']['job_types']['Update'];
// export type JobIndustryUpdate = Database['public']['Tables']['job_industries']['Update'];
// export type CurrencyUpdate = Database['public']['Tables']['currencies']['Update'];
export type JobUpdate = Database['public']['Tables']['jobs']['Update'];
// export type ResourceTypeUpdate = Database['public']['Tables']['resource_types']['Update'];
export type ResourceUpdate = Database['public']['Tables']['resources']['Update'];
// export type LocaleUpdate = Database['public']['Tables']['locales']['Update'];
export type JobSourceUpdate = Database['public']['Tables']['jobs_sources']['Update'];
// export type CompanySourceUpdate = Database['public']['Tables']['companies_sources']['Update'];
//
// // Extended types with relations
// export interface JobWithRelations extends Job {
//   company?: Company;
//   job_type?: JobType;
//   job_industry?: JobIndustry;
//   currency?: Currency;
//   status?: Status;
// }
//
// export interface ResourceWithRelations extends Resource {
//   resource_type?: ResourceType;
//   status?: Status;
// }
//
// export interface UserWithRelations extends User {
//   status?: Status;
// }
//
// export interface CompanySourceWithRelations extends CompanySource {
//   company?: Company;
//   source?: Source;
// }
//
// export interface CompanyWithSources extends Company {
//   sources?: CompanySourceWithRelations[];
// }
//
// // Contact person JSON structure
// export interface ContactPerson {
//   name?: string;
//   email?: string;
//   phone?: string;
//   position?: string;
// }
//
// // Additional company data JSON structure
// export interface CompanyAdditionalData {
//   industry?: string;
//   size?: string;
//   founded?: number;
//   social?: {
//     linkedin?: string;
//     twitter?: string;
//     facebook?: string;
//   };
// }
