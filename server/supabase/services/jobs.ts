import { SupabaseClient } from '@supabase/supabase-js';
import { Database, JobUpdate, JobWithRelations } from '@/types/supabase';
import {Job, JobCreate} from "@/types/jobs";
import {JobQuery, QueryStats} from "@/types/api";

export class JobsService {
  constructor(private supabase: SupabaseClient<Database>) {}

  async index(options?: JobQuery): Promise<{ data: JobWithRelations[]; count: number }> {
    let query = this.supabase
      .from('jobs')
      .select(`
        *,
        company:companies(*),
        job_type:job_types(*),
        job_industry:job_industries(*),
        currency:currencies(*),
        status:statuses(*)
      `, { count: 'exact' });

    if (options?.job_type_id) query = query.eq('job_type_id', options.job_type_id);
    if (options?.job_industry_id) query = query.eq('job_industry_id', options.job_industry_id);

    if (options?.location) query = query.ilike('location', `%${options.location}%`);
    if (options?.search) query = query.or(`title.ilike.%${options.search}%,description.ilike.%${options.search}%`);

    // Apply pagination
    if (options?.limit) query = query.limit(options.limit);
    if (options?.offset) query = query.range(options.offset, options.offset + (options.limit || 10) - 1);

    // Order by created_at desc
    query = query.order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) throw error;
    return { data: data as JobWithRelations[], count: count || 0 };
  }

  async stats(): Promise<{ data: QueryStats; }> {
    const query = this.supabase
      .from('jobs')
      .select(`*`, { count: 'exact' });

    const { data, error, count } = await query;
    const total = count || 0;
    const published = data ? data.filter((job: Job) => job.status_id === 7) : []
    const unpublished = data ? data.filter((job: Job) => job.status_id === 8) : []
    const archived = data ? data.filter((job: Job) => job.status_id === 12) : []

    if (error) throw error;
    return { data: { total, published: published.length, unpublished: unpublished.length, archived: archived.length } };
  }

  async getById(id: string): Promise<JobWithRelations | null> {
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
    return data as JobWithRelations;
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

  async getByCompany(companyId: string): Promise<JobWithRelations[]> {
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
    return data as JobWithRelations[];
  }

  async getFeatured(limit: number = 6): Promise<JobWithRelations[]> {
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
    return data as JobWithRelations[];
  }
}
