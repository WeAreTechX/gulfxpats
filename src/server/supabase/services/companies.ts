import { SupabaseClient } from '@supabase/supabase-js';
import {CompanyInsert, CompanyUpdate, Database} from '@/types/supabase';
import { QueryResponse, QueryStats, Company, CompaniesQuery, Entity } from "@/types";

export class CompaniesService {
  constructor(private supabase: SupabaseClient<Database>) {}

  async index(options?: CompaniesQuery): Promise<QueryResponse<Company>> {
    let query = this.supabase
      .from('companies')
      .select(`*, status:statuses(*)`);

    // Apply filters
    if (options?.search) query = query.or(`name.ilike.%${options.search}%,short_description.ilike.%${options.search}%,long_description.ilike.%${options.search}%`);
    if (options?.country) query = query.ilike('country', `%${options.country}%`);

    // Apply pagination
    if (options?.page_size) query = query.limit(options.page_size);
    if (options?.page) query = query.range(options.page, options.page + (options.page_size || 10) - 1);

    // Order by
    query = query.order(options?.order_by || 'name', { ascending: options && options.order_asc === '1' });

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

  async store(company: CompanyInsert): Promise<Company> {
    const { data, error } = await this.supabase
      .from('companies')
      // @ts-expect-error - This would not be an issue
      .insert(company)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, company: CompanyUpdate): Promise<Company> {
    const { data, error } = await this.supabase
      .from('companies')
      // @ts-expect-error - This would not be an issue
      .update(company)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Company;
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

    const statusMap = new Map(statuses?.map((s: Entity) => [s.code, s.id]) || []);
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
