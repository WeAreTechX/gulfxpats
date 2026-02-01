import { SupabaseClient } from '@supabase/supabase-js';
import { Database, AdminUpdate  } from '@/types/supabase';
import { Admin  } from "@/types";

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
      // @ts-expect-error - This would not be an issue
      .update(admin)
      .eq('id', id)
      .select(`id, email, first_name, last_name, role, status_id, created_at, modified_at`)
      .single();

    if (error) throw error;
    return data as Admin;
  }
}
