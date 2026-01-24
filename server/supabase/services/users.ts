import { SupabaseClient } from '@supabase/supabase-js';
import { Database, User, UserInsert, UserUpdate, UserWithRelations } from '@/types/supabase';

export class UsersService {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getAll(options?: {
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ data: UserWithRelations[]; count: number }> {
    let query = this.supabase
      .from('users')
      .select(`
        *,
        status:statuses(*)
      `, { count: 'exact' });

    // Apply filters
    if (options?.status) {
      query = query.eq('status.code', options.status);
    }
    if (options?.search) {
      query = query.or(`first_name.ilike.%${options.search}%,last_name.ilike.%${options.search}%,email.ilike.%${options.search}%`);
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
    return { data: data as UserWithRelations[], count: count || 0 };
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
      .update({ ...user, modified_at: new Date().toISOString() })
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
}
