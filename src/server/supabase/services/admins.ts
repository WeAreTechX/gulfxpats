import { SupabaseClient } from '@supabase/supabase-js';
import { Database  } from '@/types/supabase';
import { Admin, AdminUpdate } from "@/types";

export class AdminsService {
  constructor(private supabase: SupabaseClient<Database>) {}

  async show(id: string): Promise<Admin | null> {
    const { data, error } = await this.supabase
      .from('admins')
      .select(`id, email, first_name, last_name, role, status_id, created_at, modified_at`)
      .eq('email', id)
      .single();

    if (error) throw error;
    return data as Admin;
  }

  async showById(id: string): Promise<Admin | null> {
    const { data, error } = await this.supabase
      .from('admins')
      .select(`id, email, first_name, last_name, role, status_id, created_at, modified_at`)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Admin;
  }

  async update(id: string, admin: AdminUpdate): Promise<Admin> {
    const { data, error } = await this.supabase
      .from('admins')
      .update(admin as Database['public']['Tables']['admins']['Update'])
      .eq('id', id)
      .select(`id, email, first_name, last_name, role, status_id, created_at, modified_at`)
      .single();

    if (error) throw error;
    return data as Admin;
  }
}
