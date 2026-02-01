import { SupabaseClient } from '@supabase/supabase-js';
import { Database, UserInsert, UserUpdate } from '@/types/supabase';
import {QueryResponse, QueryStats, Entity, User, UserQuery } from "@/types";

export class UsersService {
  constructor(private supabase: SupabaseClient<Database>) {}

  async index(options?: UserQuery): Promise<QueryResponse<User>> {
    let query = this.supabase
      .from('users')
      .select(`*, status:statuses(*)`, { count: 'exact' });

    // Apply filters
    if (options?.status_code) query = query.eq('status.code', options.status_code);
    if (options?.search) query = query.or(`first_name.ilike.%${options.search}%,last_name.ilike.%${options.search}%,email.ilike.%${options.search}%`);

    // Apply pagination
    if (options?.page_size) query = query.limit(options.page_size);
    if (options?.page) query = query.range(options.page, options.page + (options.page_size || 10) - 1);

    // Order by created_at desc
    query = query.order(options?.order_by || 'created_at' , { ascending: options && options.order_asc === '1' });

    const { data, error, count } = await query;

    if (error) throw error;
    return {
      pagination: { count: count || 0, current_page: 1, total_count: count || 0, total_pages: 1 },
      list: data || []
    };
  }

  async show(id: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select(`first_name, last_name, role, status_id, status:statuses(*)`)
      .eq('email', id)
      .single();

    if (error) throw error;
    return data as User;
  }

  async getByEmail(email: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async create(user: UserInsert): Promise<User> {
    const { data, error } = await this.supabase
      .from('users')
      // @ts-expect-error - This would not be an issue
      .insert(user)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, user: UserUpdate): Promise<User> {
    const { data, error } = await this.supabase
      .from('users')
      // @ts-expect-error - This would not be an issue
      .update(user)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('users')
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
      .from('users')
      .select('*', { count: 'exact', head: true });
    stats.total = total || 0;

    const verifiedId = statusMap.get('verified');
    if (verifiedId) {
      const { count: verified } = await this.supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('status_id', verifiedId);
      stats.verified = verified || 0;
    }

    const unverifiedId = statusMap.get('unverified');
    if (unverifiedId) {
      const { count: unverified } = await this.supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('status_id', unverifiedId);
      stats.unverified = unverified || 0;
    }

    const disabledId = statusMap.get('disabled');
    if (disabledId) {
      const { count: disabled } = await this.supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('status_id', disabledId);
      stats.disabled = disabled || 0;
    }
    return stats;
  }
}
