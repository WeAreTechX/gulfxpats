import { SupabaseClient } from '@supabase/supabase-js';
import { Database, ResourceInsert, ResourceUpdate } from '@/types/supabase';
import {QueryResponse, ResourcesQuery, Resource, QueryStats, Entity} from "@/types";

export class ResourcesService {
  constructor(private supabase: SupabaseClient<Database>) {}

  async index(options?: ResourcesQuery): Promise<QueryResponse<Resource>> {
    let query = this.supabase
      .from('resources')
      .select(`
        *,
        resource_type:resource_types(*),
        status:statuses(*)
      `, { count: 'exact' });

    // Apply filters
    if (options?.type_id) query = query.eq('type_id', options.type_id);
    if (options?.search) query = query.or(`title.ilike.%${options.search}%,description.ilike.%${options.search}%`);

    // Apply pagination
    if (options?.page_size) query = query.limit(options.page_size);
    if (options?.page) query = query.range(options.page, options.page + (options.page_size || 10) - 1);

    // Order by created_at desc
    query = query.order(options?.order_by || 'created_at', { ascending: options && options.order_asc === '1' });

    const { data, error, count } = await query;

    if (error) throw error;
    return {
      pagination: { count: count || 0, current_page: 1, total_count: count || 0, total_pages: 1 },
      list: data || []
    };
  }

  async create(resource: ResourceInsert): Promise<Resource> {
    const { data, error } = await this.supabase
      .from('resources')
      // @ts-expect-error - This would not be an issue
      .insert(resource)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, resource: ResourceUpdate): Promise<Resource> {
    const { data, error } = await this.supabase
      .from('resources')
      // @ts-expect-error - This would not be an issue
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

  async getStats(): Promise<QueryStats> {
    const { data: statuses } = await this.supabase
      .from('statuses')
      .select('id, code');

    const statusMap = new Map(statuses?.map((s: Entity) => [s.code, s.id]) || []);
    const stats: QueryStats = {};

    const { count: total } = await this.supabase
      .from('resources')
      .select('*', { count: 'exact', head: true });
    stats.total = total || 0;

    const publishedId = statusMap.get('published');
    if (publishedId) {
      const { count: published } = await this.supabase
        .from('resources')
        .select('*', { count: 'exact', head: true })
        .eq('status_id', publishedId);
      stats.published = published || 0;
    }

    const unpublishedId = statusMap.get('unpublished');
    if (unpublishedId) {
      const { count: unpublished } = await this.supabase
        .from('resources')
        .select('*', { count: 'exact', head: true })
        .eq('status_id', unpublishedId);
      stats.unpublished = unpublished || 0;
    }

    const archivedId = statusMap.get('archived');
    if (archivedId) {
      const { count: archived } = await this.supabase
        .from('resources')
        .select('*', { count: 'exact', head: true })
        .eq('status_id', archivedId);
      stats.archived = archived || 0;
    }

    return stats;
  }
}
