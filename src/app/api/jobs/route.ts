import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/server/supabase/server';
import { JobsService } from '@/server/supabase/services/jobs';

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const type_id = params.get('type_id') || undefined;
    const industry_id = params.get('industry_id') || undefined;
    const country = params.get('country') || undefined;
    const search = params.get('search') || undefined;
    const page = params.get('page') ? parseInt(params.get('page')!) : undefined;
    const page_size = params.get('page_size') ? parseInt(params.get('page_size')!) : undefined;
    const order_by = params.get('order_by') || undefined;
    const order_asc = params.get('order_asc') || undefined;

    const includeStats = params.get('includeStats') === 'true';

    const supabase = await createServerSupabaseClient();
    const jobsService = new JobsService(supabase);
    
    const { list, pagination } = await jobsService.index({
      type_id,
      industry_id,
      country,
      search,
      page,
      page_size,
      order_by,
      order_asc
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
      type_id: body.type_id,
      jobs_scrapings_id: body.jobs_scrapings_id,
      company_id: body.company_id,
      company_name: body.company_name,
      location: body.location,
      country: body.country,
      salary_min: body.salary_min,
      salary_max: body.salary_max,
      salary_frequency: body.salary_frequency,
      currency_id: body.currency_id,
      industry_id: body.industry_id,
      apply_url: body.apply_url,
      metadata: body.metadata,
      is_premium: body.is_premium || false,
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
