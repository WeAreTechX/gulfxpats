import { SupabaseClient } from '@supabase/supabase-js';
import { Database, CompanyUpdate } from '@/types/supabase';
import {Company, CompanyCreate} from '@/types/companies';
import {QueryResponse, QueryStats} from "@/types/api";
import {CompanyQuery} from "@/types/companies";
import {Status} from "@/types";

export class CompaniesService {
  constructor(private supabase: SupabaseClient<Database>) {}

  async index(options?: CompanyQuery): Promise<QueryResponse<Company>> {
    let query = this.supabase
      .from('companies')
      .select(`*, status:statuses(*)`);

    // Apply filters
    if (options?.location) query = query.ilike('location', `%${options.location}%`);
    if (options?.search) query = query.or(`name.ilike.%${options.search}%,short_description.ilike.%${options.search}%,long_description.ilike.%${options.search}%`);

    // Apply pagination
    if (options?.limit) query = query.limit(options.limit);
    if (options?.offset) query = query.range(options.offset, options.offset + (options.limit || 10) - 1);

    // Order by
    if (options?.order) {
      query = query.order(options.order, { ascending: false });
    } else {
      query = query.order('name', { ascending: true });
    }

    const { data, error, count } = await query;

    if (error) throw error;
    return {
      pagination: { count: count || 0, current_page: 1, total_count: count || 0, total_pages: 1 },
      list: data || []
    };
  }

  async show(id: string): Promise<Company | null> {
    const { data, error } = await this.supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async store(company: CompanyCreate): Promise<Company> {
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

  async getStats(): Promise<QueryStats> {
    const { data: statuses } = await this.supabase
      .from('statuses')
      .select('id, code');

    const statusMap = new Map(statuses?.map((s: Status) => [s.code, s.id]) || []);
    const stats: QueryStats = {};

    const { count: total } = await this.supabase
      .from('companies')
      .select('*', { count: 'exact', head: true });
    stats.total = total || 0;

    const publishedId = statusMap.get('published');
    if (publishedId) {
      const { count: published } = await this.supabase
        .from('companies')
        .select('*', { count: 'exact', head: true })
        .eq('status_id', publishedId);
      stats.published = published || 0;
    }

    const unpublishedId = statusMap.get('unpublished');
    if (unpublishedId) {
      const { count: unpublished } = await this.supabase
        .from('companies')
        .select('*', { count: 'exact', head: true })
        .eq('status_id', unpublishedId);
      stats.unpublished = unpublished || 0;
    }
    return stats;
  }
}
