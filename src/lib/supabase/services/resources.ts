import { SupabaseClient } from '@supabase/supabase-js';
import { Database, Resource, ResourceInsert, ResourceUpdate, ResourceWithRelations } from '@/types/supabase';

export class ResourcesService {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getAll(options?: {
    resourceTypeId?: string;
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ data: ResourceWithRelations[]; count: number }> {
    let query = this.supabase
      .from('resources')
      .select(`
        *,
        resource_type:resource_types(*),
        status:statuses(*)
      `, { count: 'exact' });

    // Apply filters
    if (options?.resourceTypeId) {
      query = query.eq('resource_type_id', options.resourceTypeId);
    }
    if (options?.status) {
      query = query.eq('status.code', options.status);
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
    return { data: data as ResourceWithRelations[], count: count || 0 };
  }

  async getById(id: string): Promise<ResourceWithRelations | null> {
    const { data, error } = await this.supabase
      .from('resources')
      .select(`
        *,
        resource_type:resource_types(*),
        status:statuses(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as ResourceWithRelations;
  }

  async create(resource: ResourceInsert): Promise<Resource> {
    const { data, error } = await this.supabase
      .from('resources')
      .insert(resource)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, resource: ResourceUpdate): Promise<Resource> {
    const { data, error } = await this.supabase
      .from('resources')
      .update(resource)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('resources')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
