import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../../server/supabase/server';
import { LookupsService } from '../../../../server/supabase/services/lookups';

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
      case 'job-industries':
        data = await lookupsService.getJobIndustries();
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
      case 'sources':
        data = await lookupsService.getSources();
        break;
      case 'companies':
        data = await lookupsService.getCompanies();
        break;
      case 'all':
        // Get all lookups at once
        const [statuses, jobTypes, jobIndustries, resourceTypes, currencies, sources] = await Promise.all([
          lookupsService.getStatuses(),
          lookupsService.getJobTypes(),
          lookupsService.getJobIndustries(),
          lookupsService.getResourceTypes(),
          lookupsService.getCurrencies(),
          lookupsService.getSources(),
        ]);
        data = {
          statuses,
          jobTypes,
          jobIndustries,
          resourceTypes,
          currencies,
          sources,
        };
        break;
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid lookup type. Use: statuses, job-types, job-industries, resource-types, currencies, job-locations, company-locations, sources, or all' },
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
