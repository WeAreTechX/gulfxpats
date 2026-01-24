import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { JobsService } from './jobs';
import { CompaniesService } from './companies';
import { ResourcesService } from './resources';
import { UsersService } from './users';
import { AdminsService } from './admins';
import { LookupsService } from './lookups';

export class SupabaseServices {
  public jobs: JobsService;
  public companies: CompaniesService;
  public resources: ResourcesService;
  public users: UsersService;
  public admins: AdminsService;
  public lookups: LookupsService;

  constructor(supabase: SupabaseClient<Database>) {
    this.jobs = new JobsService(supabase);
    this.companies = new CompaniesService(supabase);
    this.resources = new ResourcesService(supabase);
    this.users = new UsersService(supabase);
    this.admins = new AdminsService(supabase);
    this.lookups = new LookupsService(supabase);
  }
}

export { JobsService } from './jobs';
export { CompaniesService } from './companies';
export { ResourcesService } from './resources';
export { UsersService } from './users';
export { AdminsService } from './admins';
export { LookupsService } from './lookups';
