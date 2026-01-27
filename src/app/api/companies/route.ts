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
    const includeStats = searchParams.get('includeStats') === 'true';

    const supabase = await createServerSupabaseClient();
    const companiesService = new CompaniesService(supabase);
    
    const { list, pagination } = await companiesService.index({
      location,
      search,
      limit,
      offset,
    });

    // Optionally include stats
    let stats = null;
    if (includeStats) {
      stats = await companiesService.getStats();
    }

    return NextResponse.json({
      success: true,
      data: { list, pagination, ...(stats && { stats }) }
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

    const { data: { session } } = await supabase.auth.getSession();
    const company = await companiesService.store({
      name: body.name,
      short_description: body.short_description,
      long_description: body.long_description || "-",
      website_url: body.website,
      logo_url: body.logoUrl,
      location: body.location,
      address: body.address,
      contact: body.contact,
      metadata: body.metadata,
      created_by_id: session?.user.id || undefined
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
