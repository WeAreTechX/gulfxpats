import { SupabaseClient } from '@supabase/supabase-js';
import { Database, CompanyUpdate } from '@/types/supabase';
import {Company, CompanyCreate} from '@/types/companies';

export class CompaniesService {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getAll(options?: {
    location?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ data: Company[]; count: number }> {
    let query = this.supabase
      .from('companies')
      .select('*', { count: 'exact' });

    // Apply filters
    if (options?.location) {
      query = query.ilike('location', `%${options.location}%`);
    }
    if (options?.search) {
      query = query.or(`name.ilike.%${options.search}%,description.ilike.%${options.search}%`);
    }

    // Apply pagination
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    // Order by name
    query = query.order('name', { ascending: true });

    const { data, error, count } = await query;

    if (error) throw error;
    return { data: data || [], count: count || 0 };
  }

  async getById(id: string): Promise<Company | null> {
    const { data, error } = await this.supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async create(company: CompanyCreate): Promise<Company> {
    const { data, error } = await this.supabase
      .from('companies')
      .insert(company)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, company: CompanyUpdate): Promise<Company> {
    const { data, error } = await this.supabase
      .from('companies')
      .update(company)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('companies')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async getFeatured(limit: number = 6): Promise<Company[]> {
    const { data, error } = await this.supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  async getJobCount(companyId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId);

    if (error) throw error;
    return count || 0;
  }
}
