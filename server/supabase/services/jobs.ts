import { SupabaseClient } from '@supabase/supabase-js';
import { Database, Job, JobInsert, JobUpdate, JobWithRelations } from '@/types/supabase';

export class JobsService {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getAll(options?: {
    status?: string;
    companyId?: string;
    jobTypeId?: string;
    location?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ data: JobWithRelations[]; count: number }> {
    let query = this.supabase
      .from('jobs')
      .select(`
        *,
        company:companies(*),
        job_type:job_types(*),
        currency:currencies(*),
        status:statuses(*)
      `, { count: 'exact' });

    // Apply filters
    if (options?.status) {
      query = query.eq('status.code', options.status);
    }
    if (options?.companyId) {
      query = query.eq('company_id', options.companyId);
    }
    if (options?.jobTypeId) {
      query = query.eq('job_type_id', options.jobTypeId);
    }
    if (options?.location) {
      query = query.ilike('location', `%${options.location}%`);
    }
    if (options?.search) {
      query = query.or(`title.ilike.%${options.search}%,description.ilike.%${options.search}%`);
    }

    // Apply pagination
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    // Order by created_at desc
    query = query.order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) throw error;
    return { data: data as JobWithRelations[], count: count || 0 };
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

  async create(job: JobInsert): Promise<Job> {
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
      .update({ ...job, modified_at: new Date().toISOString() })
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
