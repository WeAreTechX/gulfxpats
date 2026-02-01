import { SupabaseClient } from '@supabase/supabase-js';
import { Database, Status, JobType, JobIndustry, ResourceType, Currency, Source } from '@/types/supabase';
import {Job} from "@/types/jobs";
import {Company} from "@/types/companies";

export class LookupsService {
  constructor(private supabase: SupabaseClient<Database>) {}

  // Statuses
  async getStatuses(): Promise<Status[]> {
    const { data, error } = await this.supabase
      .from('statuses')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async getStatusByCode(code: string): Promise<Status | null> {
    const { data, error } = await this.supabase
      .from('statuses')
      .select('*')
      .eq('code', code)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  // Job Types
  async getJobTypes(): Promise<JobType[]> {
    const { data, error } = await this.supabase
      .from('job_types')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async getJobTypeByCode(code: string): Promise<JobType | null> {
    const { data, error } = await this.supabase
      .from('job_types')
      .select('*')
      .eq('code', code)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  // Job Industries
  async getIndustries(): Promise<JobIndustry[]> {
    const { data, error } = await this.supabase
      .from('industries')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async getIndustryByCode(code: string): Promise<JobIndustry | null> {
    const { data, error } = await this.supabase
      .from('industries')
      .select('*')
      .eq('code', code)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  // Resource Types
  async getResourceTypes(): Promise<ResourceType[]> {
    const { data, error } = await this.supabase
      .from('resource_types')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async getResourceTypeByCode(code: string): Promise<ResourceType | null> {
    const { data, error } = await this.supabase
      .from('resource_types')
      .select('*')
      .eq('code', code)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  // Currencies
  async getCurrencies(): Promise<Currency[]> {
    const { data, error } = await this.supabase
      .from('currencies')
      .select('*')
      .order('code', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async getCurrencyByCode(code: string): Promise<Currency | null> {
    const { data, error } = await this.supabase
      .from('currencies')
      .select('*')
      .eq('code', code)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  // Get unique locations from jobs
  async getJobLocations(): Promise<string[]> {
    const { data, error } = await this.supabase
      .from('jobs')
      .select('location')
      .not('location', 'is', null);

    if (error) throw error;
    
    const locations = [...new Set(data?.map((j: Job) => j.location).filter(Boolean) as string[])];
    return locations.sort();
  }

  // Get unique locations from companies
  async getCompanyLocations(): Promise<string[]> {
    const { data, error } = await this.supabase
      .from('companies')
      .select('location')
      .not('location', 'is', null);

    if (error) throw error;
    
    const locations = [...new Set(data?.map((c: Company) => c.location).filter(Boolean) as string[])];
    return locations.sort();
  }

  // Sources
  async getJobSources(): Promise<Source[]> {
    const { data, error } = await this.supabase
      .from('jobs_sources')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  // Companies
  async getCompanies(): Promise<Source[]> {
    const { data, error } = await this.supabase
      .from('companies')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async getJobsSourceByCode(code: string): Promise<Source | null> {
    const { data, error } = await this.supabase
      .from('jobs_sources')
      .select('*')
      .eq('code', code)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async getJobsSourceById(id: number): Promise<Source | null> {
    const { data, error } = await this.supabase
      .from('jobs_sources')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }
}
