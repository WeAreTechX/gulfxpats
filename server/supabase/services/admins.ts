import { SupabaseClient } from '@supabase/supabase-js';
import { Database  } from '@/types/supabase';
import { Admin } from "@/types";

export class AdminsService {
  constructor(private supabase: SupabaseClient<Database>) {}

  async show(id: string): Promise<Admin | null> {
    const { data, error } = await this.supabase
      .from('admins')
      .select(`first_name, last_name, role, status_id`)
      .eq('email', id)
      .single();

    if (error) throw error;
    return data as Admin;
  }
}
