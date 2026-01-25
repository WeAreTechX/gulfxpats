export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Status codes enum
export type StatusCode = 
  | 'active' 
  | 'inactive' 
  | 'disabled' 
  | 'enabled' 
  | 'pending' 
  | 'deleted' 
  | 'published' 
  | 'unpublished' 
  | 'removed';

// User role enum
export type UserRole = 'user' | 'admin';

// Job type enum
export type JobTypeCode = 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';

// Job industry enum
export type JobIndustryCode = 
  | 'it' 
  | 'energy' 
  | 'hospitality' 
  | 'healthcare' 
  | 'finance' 
  | 'education' 
  | 'manufacturing' 
  | 'retail' 
  | 'construction' 
  | 'transportation' 
  | 'real-estate' 
  | 'media-entertainment' 
  | 'telecommunications' 
  | 'agriculture' 
  | 'other';

// Resource type enum  
export type ResourceTypeCode = 'blog' | 'course' | 'tool' | 'video' | 'podcast' | 'ebook' | 'other';

export interface Database {
  public: {
    Tables: {
      statuses: {
        Row: {
          id: number;
          name: string;
          code: StatusCode;
          created_at: string;
          modified_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          code: StatusCode;
          created_at?: string;
          modified_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          code?: StatusCode;
          created_at?: string;
          modified_at?: string;
        };
      };
      locales: {
        Row: {
          id: number;
          code: string;
          name: string;
          native_name: string | null;
          is_default: boolean;
          is_active: boolean;
          created_at: string;
          modified_at: string;
        };
        Insert: {
          id?: number;
          code: string;
          name: string;
          native_name?: string | null;
          is_default?: boolean;
          is_active?: boolean;
          created_at?: string;
          modified_at?: string;
        };
        Update: {
          id?: number;
          code?: string;
          name?: string;
          native_name?: string | null;
          is_default?: boolean;
          is_active?: boolean;
          created_at?: string;
          modified_at?: string;
        };
      };
      sources: {
        Row: {
          id: number;
          name: string;
          code: string;
          description: string | null;
          website_url: string | null;
          logo_url: string | null;
          is_active: boolean;
          created_at: string;
          modified_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          code: string;
          description?: string | null;
          website_url?: string | null;
          logo_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          modified_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          code?: string;
          description?: string | null;
          website_url?: string | null;
          logo_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          modified_at?: string;
        };
      };
      companies_sources: {
        Row: {
          id: number;
          company_id: string;
          source_id: number;
          external_id: string | null;
          external_url: string | null;
          is_primary: boolean;
          synced_at: string | null;
          metadata: Json | null;
          created_at: string;
          modified_at: string;
        };
        Insert: {
          id?: number;
          company_id: string;
          source_id: number;
          external_id?: string | null;
          external_url?: string | null;
          is_primary?: boolean;
          synced_at?: string | null;
          metadata?: Json | null;
          created_at?: string;
          modified_at?: string;
        };
        Update: {
          id?: number;
          company_id?: string;
          source_id?: number;
          external_id?: string | null;
          external_url?: string | null;
          is_primary?: boolean;
          synced_at?: string | null;
          metadata?: Json | null;
          created_at?: string;
          modified_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          first_name: string;
          last_name: string | null;
          email: string;
          location: string | null;
          role: UserRole;
          status_id: number;
          created_at: string;
          modified_at: string;
        };
        Insert: {
          id?: string;
          first_name: string;
          last_name?: string | null;
          email: string;
          location?: string | null;
          role?: UserRole;
          status_id?: number;
          created_at?: string;
          modified_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string | null;
          email?: string;
          location?: string | null;
          role?: UserRole;
          status_id?: number;
          created_at?: string;
          modified_at?: string;
        };
      };
      admins: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          role: 'admin' | 'super_admin';
          status_id: number;
          created_at: string;
          modified_at: string;
        };
        Insert: {
          id: string; // Required - must match auth.users id
          first_name: string;
          last_name: string;
          email: string;
          role?: 'admin' | 'super_admin';
          status_id?: number;
          created_at?: string;
          modified_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          role?: 'admin' | 'super_admin';
          status_id?: number;
          created_at?: string;
          modified_at?: string;
        };
      };
      companies: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          website: string | null;
          logo_url: string | null;
          location: string | null;
          metadata: Json | null;
          contact: Json | null;
          status_id: number;
          created_at: string;
          modified_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          website?: string | null;
          logo_url?: string | null;
          location?: string | null;
          metadata?: Json | null;
          contact?: Json | null;
          status_id?: number;
          created_at?: string;
          modified_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          website?: string | null;
          logo_url?: string | null;
          location?: string | null;
          metadata?: Json | null;
          contact?: Json | null;
          status_id?: number;
          created_at?: string;
          modified_at?: string;
        };
      };
      job_types: {
        Row: {
          id: number;
          name: string;
          code: JobTypeCode;
          created_at: string;
          modified_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          code: JobTypeCode;
          created_at?: string;
          modified_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          code?: JobTypeCode;
          created_at?: string;
          modified_at?: string;
        };
      };
      job_industries: {
        Row: {
          id: number;
          name: string;
          code: JobIndustryCode;
          created_at: string;
          modified_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          code: JobIndustryCode;
          created_at?: string;
          modified_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          code?: JobIndustryCode;
          created_at?: string;
          modified_at?: string;
        };
      };
      currencies: {
        Row: {
          id: number;
          code: string;
          symbol: string;
          name: string;
          created_at: string;
          modified_at: string;
        };
        Insert: {
          id?: number;
          code: string;
          symbol: string;
          name: string;
          created_at?: string;
          modified_at?: string;
        };
        Update: {
          id?: number;
          code?: string;
          symbol?: string;
          name?: string;
          created_at?: string;
          modified_at?: string;
        };
      };
      jobs: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          company_id: string;
          job_type_id: number;
          job_industry_id: number | null;
          location: string | null;
          salary_min: number | null;
          salary_max: number | null;
          currency_id: number | null;
          apply_url: string;
          metadata: Json | null;
          status_id: number;
          created_at: string;
          modified_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          company_id: string;
          job_type_id: number;
          job_industry_id?: number | null;
          location?: string | null;
          salary_min?: number | null;
          salary_max?: number | null;
          currency_id?: number | null;
          apply_url: string;
          metadata?: Json | null;
          status_id?: number;
          created_at?: string;
          modified_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          company_id?: string;
          job_type_id?: number;
          job_industry_id?: number | null;
          location?: string | null;
          salary_min?: number | null;
          salary_max?: number | null;
          currency_id?: number | null;
          apply_url?: string;
          metadata?: Json | null;
          status_id?: number;
          created_at?: string;
          modified_at?: string;
        };
      };
      resource_types: {
        Row: {
          id: number;
          name: string;
          code: ResourceTypeCode;
          created_at: string;
          modified_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          code: ResourceTypeCode;
          created_at?: string;
          modified_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          code?: ResourceTypeCode;
          created_at?: string;
          modified_at?: string;
        };
      };
      resources: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          url: string;
          metadata: Json | null;
          resource_type_id: number;
          status_id: number;
          created_at: string;
          modified_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          url: string;
          metadata?: Json | null;
          resource_type_id: number;
          status_id?: number;
          created_at?: string;
          modified_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          url?: string;
          metadata?: Json | null;
          resource_type_id?: number;
          status_id?: number;
          created_at?: string;
          modified_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      status_code: StatusCode;
      user_role: UserRole;
      job_type_code: JobTypeCode;
      job_industry_code: JobIndustryCode;
      resource_type_code: ResourceTypeCode;
    };
  };
}

// Convenience types for common use
export type Status = Database['public']['Tables']['statuses']['Row'];
export type User = Database['public']['Tables']['users']['Row'];
export type Admin = Database['public']['Tables']['admins']['Row'];
export type Company = Database['public']['Tables']['companies']['Row'];
export type JobType = Database['public']['Tables']['job_types']['Row'];
export type JobIndustry = Database['public']['Tables']['job_industries']['Row'];
export type Currency = Database['public']['Tables']['currencies']['Row'];
export type Job = Database['public']['Tables']['jobs']['Row'];
export type ResourceType = Database['public']['Tables']['resource_types']['Row'];
export type Resource = Database['public']['Tables']['resources']['Row'];
export type Locale = Database['public']['Tables']['locales']['Row'];
export type Source = Database['public']['Tables']['sources']['Row'];
export type CompanySource = Database['public']['Tables']['companies_sources']['Row'];

// Insert types
export type StatusInsert = Database['public']['Tables']['statuses']['Insert'];
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type AdminInsert = Database['public']['Tables']['admins']['Insert'];
export type CompanyInsert = Database['public']['Tables']['companies']['Insert'];
export type JobTypeInsert = Database['public']['Tables']['job_types']['Insert'];
export type JobIndustryInsert = Database['public']['Tables']['job_industries']['Insert'];
export type CurrencyInsert = Database['public']['Tables']['currencies']['Insert'];
export type JobInsert = Database['public']['Tables']['jobs']['Insert'];
export type ResourceTypeInsert = Database['public']['Tables']['resource_types']['Insert'];
export type ResourceInsert = Database['public']['Tables']['resources']['Insert'];
export type LocaleInsert = Database['public']['Tables']['locales']['Insert'];
export type SourceInsert = Database['public']['Tables']['sources']['Insert'];
export type CompanySourceInsert = Database['public']['Tables']['companies_sources']['Insert'];

// Update types
export type StatusUpdate = Database['public']['Tables']['statuses']['Update'];
export type UserUpdate = Database['public']['Tables']['users']['Update'];
export type AdminUpdate = Database['public']['Tables']['admins']['Update'];
export type CompanyUpdate = Database['public']['Tables']['companies']['Update'];
export type JobTypeUpdate = Database['public']['Tables']['job_types']['Update'];
export type JobIndustryUpdate = Database['public']['Tables']['job_industries']['Update'];
export type CurrencyUpdate = Database['public']['Tables']['currencies']['Update'];
export type JobUpdate = Database['public']['Tables']['jobs']['Update'];
export type ResourceTypeUpdate = Database['public']['Tables']['resource_types']['Update'];
export type ResourceUpdate = Database['public']['Tables']['resources']['Update'];
export type LocaleUpdate = Database['public']['Tables']['locales']['Update'];
export type SourceUpdate = Database['public']['Tables']['sources']['Update'];
export type CompanySourceUpdate = Database['public']['Tables']['companies_sources']['Update'];

// Extended types with relations
export interface JobWithRelations extends Job {
  company?: Company;
  job_type?: JobType;
  job_industry?: JobIndustry;
  currency?: Currency;
  status?: Status;
}

export interface ResourceWithRelations extends Resource {
  resource_type?: ResourceType;
  status?: Status;
}

export interface UserWithRelations extends User {
  status?: Status;
}

export interface CompanySourceWithRelations extends CompanySource {
  company?: Company;
  source?: Source;
}

export interface CompanyWithSources extends Company {
  sources?: CompanySourceWithRelations[];
}

// Contact person JSON structure
export interface ContactPerson {
  name?: string;
  email?: string;
  phone?: string;
  position?: string;
}

// Additional company data JSON structure
export interface CompanyAdditionalData {
  industry?: string;
  size?: string;
  founded?: number;
  social?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}
