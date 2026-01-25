import { SupabaseClient } from '@supabase/supabase-js';
import { Database, Source, SourceInsert, SourceUpdate } from '@/types/supabase';

export class SourcesService {
  constructor(private supabase: SupabaseClient<Database>) {}

  async index(): Promise<{ list: Source[]; pagination: { count: number; current_page: number; total_count: number; total_pages: number } }> {
    const { data, error } = await this.supabase
      .from('sources')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    
    const list = data || [];
    return {
      list,
      pagination: {
        count: list.length,
        current_page: 1,
        total_count: list.length,
        total_pages: 1,
      },
    };
  }

  async show(id: number): Promise<Source | null> {
    const { data, error } = await this.supabase
      .from('sources')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async getByCode(code: string): Promise<Source | null> {
    const { data, error } = await this.supabase
      .from('sources')
      .select('*')
      .eq('code', code)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async store(source: SourceInsert): Promise<Source> {
    const { data, error } = await this.supabase
      .from('sources')
      .insert(source)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: number, source: SourceUpdate): Promise<Source> {
    const { data, error } = await this.supabase
      .from('sources')
      .update(source)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: number): Promise<void> {
    const { error } = await this.supabase
      .from('sources')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async getStats(): Promise<{ total: number; active: number; inactive: number }> {
    const { count: total } = await this.supabase
      .from('sources')
      .select('*', { count: 'exact', head: true });

    const { count: active } = await this.supabase
      .from('sources')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    return {
      total: total || 0,
      active: active || 0,
      inactive: (total || 0) - (active || 0),
    };
  }
}
