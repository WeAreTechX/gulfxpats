import { SupabaseClient } from '@supabase/supabase-js';
import { Database, UserInsert, UserUpdate, UserWithRelations } from '@/types/supabase';
import {QueryResponse, QueryStats} from "@/types/api";
import {Status, User, UserQuery} from "@/types";

export class UsersService {
  constructor(private supabase: SupabaseClient<Database>) {}

  async index(options?: UserQuery): Promise<QueryResponse<User>> {
    let query = this.supabase
      .from('users')
      .select(`
        *,
        status:statuses(*)
      `, { count: 'exact' });

    // Apply filters
    if (options?.status) query = query.eq('status.code', options.status);
    if (options?.search) query = query.or(`first_name.ilike.%${options.search}%,last_name.ilike.%${options.search}%,email.ilike.%${options.search}%`);

    // Apply pagination
    if (options?.limit) query = query.limit(options.limit);
    if (options?.offset) query = query.range(options.offset, options.offset + (options.limit || 10) - 1);

    // Order by created_at desc
    query = query.order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) throw error;
    return {
      pagination: { count: count || 0, current_page: 1, total_count: count || 0, total_pages: 1 },
      list: data || []
    };
  }

  async getById(id: string): Promise<UserWithRelations | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select(`
        *,
        status:statuses(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as UserWithRelations;
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
      .insert(user)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, user: UserUpdate): Promise<User> {
    const { data, error } = await this.supabase
      .from('users')
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

  async updateStatus(id: string, statusId: number): Promise<User> {
    return this.update(id, { status_id: statusId });
  }

  async getStats(): Promise<QueryStats> {
    const { data: statuses } = await this.supabase
      .from('statuses')
      .select('id, code');

    const statusMap = new Map(statuses?.map((s: Status) => [s.code, s.id]) || []);
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
