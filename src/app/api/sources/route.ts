import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../../server/supabase/server';
import { SourcesService } from '../../../../server/supabase/services/sources';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeStats = searchParams.get('includeStats') === 'true';

    const supabase = await createServerSupabaseClient();
    const sourcesService = new SourcesService(supabase);
    
    const { list, pagination } = await sourcesService.index();

    let stats = null;
    if (includeStats) {
      stats = await sourcesService.getStats();
    }

    return NextResponse.json({
      success: true,
      data: { list, pagination, ...(stats && { stats }) },
    });
  } catch (error) {
    console.error('Error fetching sources:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sources' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const supabase = await createServerSupabaseClient();
    const sourcesService = new SourcesService(supabase);

    // Check if code already exists
    const existing = await sourcesService.getByCode(body.code);
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'A source with this code already exists' },
        { status: 400 }
      );
    }
    
    const source = await sourcesService.store({
      name: body.name,
      code: body.code,
      description: body.description || null,
      website_url: body.website_url || null,
      logo_url: body.logo_url || null,
      is_active: body.is_active ?? true,
    });

    return NextResponse.json({
      success: true,
      source,
    });
  } catch (error) {
    console.error('Error creating source:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create source' },
      { status: 500 }
    );
  }
}
