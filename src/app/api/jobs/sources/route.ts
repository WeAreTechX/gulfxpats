import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/server/supabase/server';
import { JobsSourcesService } from '@/server/supabase/services/jobs-sources';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeStats = searchParams.get('includeStats') === 'true';

    const supabase = await createServerSupabaseClient();
    const jobsSourcesService = new JobsSourcesService(supabase);
    
    const { list, pagination } = await jobsSourcesService.index();

    let stats = null;
    if (includeStats) {
      stats = await jobsSourcesService.getStats();
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
    const jobsSourcesService = new JobsSourcesService(supabase);

    // Check if code already exists
    const existing = await jobsSourcesService.getByCode(body.code);
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'A source with this code already exists' },
        { status: 400 }
      );
    }

    const { data: { session } } = await supabase.auth.getSession();

    const source = await jobsSourcesService.store({
      name: body.name,
      code: body.code,
      base_url: body.base_url,
      created_by_id: session?.user.id || undefined
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
