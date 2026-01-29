import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../../server/supabase/server';
import { JobsService } from '../../../../server/supabase/services/jobs';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type_id = searchParams.get('type_id') || undefined;
    const industry_id = searchParams.get('industry_id') || undefined;
    const country = searchParams.get('country') || undefined;
    const search = searchParams.get('search') || undefined;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : undefined;
    const page_size = searchParams.get('page_size') ? parseInt(searchParams.get('page_size')!) : undefined;
    const order_by = searchParams.get('order_by') || undefined;

    const includeStats = searchParams.get('includeStats') === 'true';

    const supabase = await createServerSupabaseClient();
    const jobsService = new JobsService(supabase);
    
    const { list, pagination } = await jobsService.index({
      type_id,
      industry_id,
      country,
      search,
      page,
      page_size,
      order_by
    });

    let stats = null;
    if (includeStats) {
      stats = await jobsService.getStats();
    }

    return NextResponse.json({
      success: true,
      data: { list, pagination, ...(stats && { stats }) },
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const supabase = await createServerSupabaseClient();
    const jobsService = new JobsService(supabase);

    const { data: { session } } = await supabase.auth.getSession();
    const job = await jobsService.store({
      title: body.title,
      description: body.description,
      job_type_id: body.job_type_id,
      industry_id: body.industry_id,
      location: body.location,
      salary_min: body.salary_min,
      salary_max: body.salary_max,
      salary_frequency: body.salary_frequency,
      currency_id: body.currency_id,
      apply_url: body.apply_url,
      metadata: body.metadata,
      created_by_id: session?.user.id || undefined
    });

    return NextResponse.json({
      success: true,
      job,
    });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create job' },
      { status: 500 }
    );
  }
}
