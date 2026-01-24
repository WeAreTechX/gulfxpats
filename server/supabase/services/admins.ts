import { SupabaseClient } from '@supabase/supabase-js';
import { Database, Admin, AdminInsert, AdminUpdate } from '@/types/supabase';

export class AdminsService {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getAll(options?: {
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ data: Admin[]; count: number }> {
    let query = this.supabase
      .from('admins')
      .select('*', { count: 'exact' });

    // Apply filters
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
    return { data: data || [], count: count || 0 };
  }

  async getById(id: string): Promise<Admin | null> {
    const { data, error } = await this.supabase
      .from('admins')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async getByEmail(email: string): Promise<Admin | null> {
    const { data, error } = await this.supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async create(admin: AdminInsert): Promise<Admin> {
    const { data, error } = await this.supabase
      .from('admins')
      .insert(admin)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, admin: AdminUpdate): Promise<Admin> {
    const { data, error } = await this.supabase
      .from('admins')
      .update({ ...admin, modified_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('admins')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
