import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/server/supabase/server';
import { CompaniesService } from '@/server/supabase/services/companies';

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const search = params.get('search') || undefined;
    const country = params.get('country') || undefined;
    const page_size = params.get('page_size') ? parseInt(params.get('page_size')!) : undefined;
    const page = params.get('page') ? parseInt(params.get('page')!) : undefined;
    const order_by = params.get('order_by') || undefined;
    const order_asc = params.get('order_asc') || "1";

    const includeStats = params.get('includeStats') === 'true';

    const supabase = await createServerSupabaseClient();
    const companiesService = new CompaniesService(supabase);
    
    const { list, pagination } = await companiesService.index({
      search,
      country,
      page,
      page_size,
      order_by,
      order_asc
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
      website_url: body.website_url,
      logo_url: body.logo_url,
      location: body.location,
      country: body.country,
      contact: body.contact,
      metadata: body.metadata,
      rank: body.rank || 5,
      is_premium: body.is_premium,
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
