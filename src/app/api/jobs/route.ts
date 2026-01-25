import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../../server/supabase/server';
import { JobsService } from '../../../../server/supabase/services/jobs';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeStats = searchParams.get('includeStats') === 'true';
    const job_type_id = searchParams.get('job_type_id') || undefined;
    const job_industry_id = searchParams.get('job_industry_id') || undefined;
    const location = searchParams.get('location') || undefined;
    const search = searchParams.get('search') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;

    const supabase = await createServerSupabaseClient();
    const jobsService = new JobsService(supabase);
    
    const { list, pagination } = await jobsService.index({
      job_type_id,
      job_industry_id,
      location,
      search,
      limit,
      offset,
    });

    // Calculate statistics if requested
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
    
    const job = await jobsService.store({
      title: body.title,
      description: body.description,
      company_id: body.company_id,
      job_type_id: body.job_type_id,
      job_industry_id: body.job_industry_id,
      location: body.location,
      salary_min: body.salary_min,
      salary_max: body.salary_max,
      salary_frequency: body.salary_frequency,
      currency_id: body.currency_id,
      apply_url: body.apply_url,
      status_id: body.status_id || 8,
      metadata: body.metadata
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
