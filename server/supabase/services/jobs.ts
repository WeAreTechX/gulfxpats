import { SupabaseClient } from '@supabase/supabase-js';
import { Database, JobUpdate } from '@/types/supabase';
import {QueryResponse, QueryStats} from "@/types/api";
import {JobQuery, Job, JobCreate} from "@/types/jobs";
import {Status} from "@/types";

export class JobsService {
  constructor(private supabase: SupabaseClient<Database>) {}

  async index(options?: JobQuery): Promise<QueryResponse<Job>> {
    let query = this.supabase
      .from('jobs')
      .select(`
        *,
        company:companies(*),
        job_type:job_types(*),
        :industries(*),
        currency:currencies(*),
        status:statuses(*)
      `, { count: 'exact' });

    if (options?.job_type_id) query = query.eq('job_type_id', options.job_type_id);
    if (options?.industry_id) query = query.eq('industry_id', options.industry_id);

    if (options?.location) query = query.ilike('location', `%${options.location}%`);
    if (options?.search) query = query.or(`title.ilike.%${options.search}%,description.ilike.%${options.search}%`);

    // Apply pagination
    if (options?.limit) query = query.limit(options.limit);
    if (options?.offset) query = query.range(options.offset, options.offset + (options.limit || 10) - 1);

    query = query.order('modified_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) throw error;
    return {
      pagination: { count: count || 0, current_page: 1, total_count: count || 0, total_pages: 1 },
      list: data || []
    };
  }

  async getById(id: string): Promise<Job | null> {
    const { data, error } = await this.supabase
      .from('jobs')
      .select(`
        *,
        company:companies(*),
        job_type:job_types(*),
        currency:currencies(*),
        status:statuses(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Job;
  }

  async store(job: JobCreate): Promise<Job> {
    const { data, error } = await this.supabase
      .from('jobs')
      .insert(job)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, job: JobUpdate): Promise<Job> {
    const { data, error } = await this.supabase
      .from('jobs')
      .update(job)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('jobs')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async getByCompany(companyId: string): Promise<Job[]> {
    const { data, error } = await this.supabase
      .from('jobs')
      .select(`
        *,
        company:companies(*),
        job_type:job_types(*),
        currency:currencies(*),
        status:statuses(*)
      `)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Job[];
  }

  async getFeatured(limit: number = 6): Promise<Job[]> {
    const { data, error } = await this.supabase
      .from('jobs')
      .select(`
        *,
        company:companies(*),
        job_type:job_types(*),
        currency:currencies(*),
        status:statuses(*)
      `)
      .eq('status_id', 1) // Assuming 1 is 'active' status
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as Job[];
  }

  async getStats(): Promise<QueryStats> {
    const { data: statuses } = await this.supabase
      .from('statuses')
      .select('id, code');

    const statusMap = new Map(statuses?.map((s: Status) => [s.code, s.id]) || []);
    const stats: QueryStats = {};

    const { count: total } = await this.supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true });
    stats.total = total || 0;

    const publishedId = statusMap.get('published');
    if (publishedId) {
      const { count: published } = await this.supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('status_id', publishedId);
      stats.published = published || 0;
    }

    const unpublishedId = statusMap.get('unpublished');
    if (unpublishedId) {
      const { count: unpublished } = await this.supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('status_id', unpublishedId);
      stats.unpublished = unpublished || 0;
    }

    const pendingId = statusMap.get('pending');
    if (pendingId) {
      const { count: pending } = await this.supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('status_id', pendingId);
      stats.pending = pending || 0;
    }

    const archivedId = statusMap.get('archived');
    if (archivedId) {
      const { count: archived } = await this.supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('status_id', archivedId);
      stats.archived = archived || 0;
    }

    return stats;
  }
}
