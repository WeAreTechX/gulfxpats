import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/server/supabase/server';
import { LookupsService } from '@/server/supabase/services/lookups';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');

    const supabase = await createServerSupabaseClient();
    const lookupsService = new LookupsService(supabase);
    
    let data: any = {};

    switch (type) {
      case 'statuses':
        data = await lookupsService.getStatuses();
        break;
      case 'job-types':
        data = await lookupsService.getJobTypes();
        break;
      case 'industries':
        data = await lookupsService.getIndustries();
        break;
      case 'resource-types':
        data = await lookupsService.getResourceTypes();
        break;
      case 'currencies':
        data = await lookupsService.getCurrencies();
        break;
      case 'job-locations':
        data = await lookupsService.getJobLocations();
        break;
      case 'company-locations':
        data = await lookupsService.getCompanyLocations();
        break;
      case 'job-sources':
        data = await lookupsService.getJobSources();
        break;
      case 'companies':
        data = await lookupsService.getCompanies();
        break;
      case 'all':
        // Get all lookups at once
        const [statuses, jobTypes, industries, resourceTypes, currencies, jobSources] = await Promise.all([
          lookupsService.getStatuses(),
          lookupsService.getJobTypes(),
          lookupsService.getIndustries(),
          lookupsService.getResourceTypes(),
          lookupsService.getCurrencies(),
          lookupsService.getJobSources(),
        ]);
        data = {
          statuses,
          jobTypes,
          industries,
          resourceTypes,
          currencies,
          jobSources,
        };
        break;
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid lookup type. Use: statuses, job-types, industries, resource-types, currencies, job-locations, company-locations, job-ssources, or all' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      list: data,
    });
  } catch (error) {
    console.error('Error fetching lookups:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch lookups' },
      { status: 500 }
    );
  }
}
