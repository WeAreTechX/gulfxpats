import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { CompaniesService } from '@/lib/supabase/services/companies';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const location = searchParams.get('location') || undefined;
    const search = searchParams.get('search') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;

    const supabase = await createServerSupabaseClient();
    const companiesService = new CompaniesService(supabase);
    
    const { data: companies, count } = await companiesService.getAll({
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
          uid: company.id,
          name: company.name,
          email: '',
          website: company.website || '',
          logo: company.logo_url || '',
          location: company.location || '',
          address: company.location || '',
          rawAddress: company.location || '',
          phone: '',
          description: company.description || '',
          linkedIn: (company.additional_data as any)?.social?.linkedin || '',
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
    
    const company = await companiesService.create({
      name: body.name,
      description: body.description,
      website: body.website,
      logo_url: body.logoUrl,
      location: body.location,
      contact_person: body.contactPerson,
      additional_data: body.additionalData,
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
