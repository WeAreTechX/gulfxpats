import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../../server/supabase/server';
import { CompaniesService } from '../../../../server/supabase/services/companies';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const location = searchParams.get('location') || undefined;
    const search = searchParams.get('search') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;

    const supabase = await createServerSupabaseClient();
    const companiesService = new CompaniesService(supabase);
    
    const { data: companies, count } = await companiesService.index({
      location,
      search,
      limit,
      offset,
    });

    // Get job counts for each company
    const companiesWithJobCounts = await Promise.all(
      companies.map(async (company) => {
        const jobCount = await companiesService.getJobCount(company.id);
        return {
          ...company,
          openJobs: jobCount,
        };
      })
    );

    return NextResponse.json({
      success: true,
      companies: companiesWithJobCounts,
      count: count || companiesWithJobCounts.length,
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const supabase = await createServerSupabaseClient();
    const companiesService = new CompaniesService(supabase);
    
    const company = await companiesService.store({
      name: body.name,
      short_description: body.short_description,
      long_description: body.long_description || "-",
      website_url: body.website,
      logo_url: body.logoUrl,
      location: body.location,
      contact_person: body.contact_person,
      metadata: body.metadata,
      status_id: 11
    });

    return NextResponse.json({
      success: true,
      company,
    });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create company' },
      { status: 500 }
    );
  }
}
