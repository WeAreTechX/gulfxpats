import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../../server/supabase/server';
import { JobsService } from '../../../../server/supabase/services/jobs';
import { LookupsService } from '../../../../server/supabase/services/lookups';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeStats = searchParams.get('includeStats') === 'true';
    const status = searchParams.get('status') || undefined;
    const companyId = searchParams.get('companyId') || undefined;
    const jobTypeId = searchParams.get('jobTypeId') || undefined;
    const location = searchParams.get('location') || undefined;
    const search = searchParams.get('search') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;

    const supabase = await createServerSupabaseClient();
    const jobsService = new JobsService(supabase);
    
    const { data: jobs, count } = await jobsService.getAll({
      status,
      companyId,
      jobTypeId,
      location,
      search,
      limit,
      offset,
    });

    // Transform jobs to match the existing frontend format
    const transformedJobs = jobs.map(job => ({
      uid: job.id,
      title: job.title,
      description: job.description || '',
      basicRequirements: '',
      preferredRequirements: '',
      status: job.status?.code || 'open',
      postedDate: job.created_at,
      location: job.location || '',
      type: job.job_type?.code || 'full-time',
      remote: job.location?.toLowerCase().includes('remote') || false,
      salaryMin: job.salary_min || 0,
      salaryMax: job.salary_max || 0,
      currency: job.currency?.code || 'USD',
      companyId: job.company_id,
      companyName: job.company?.name || '',
      companyIndustry: '',
      companySize: '',
      hiringManager: '',
      hiringManagerContact: '',
      sourceUrl: job.apply_url,
      company: job.company?.name || '',
      role: job.job_type?.name || 'Full Time',
      source: 'jingu',
      directLink: job.apply_url,
    }));

    // Calculate statistics if requested
    let statistics = null;
    if (includeStats) {
      const byCountry: Record<string, number> = {};
      const bySource: Record<string, number> = { jingu: transformedJobs.length };
      
      transformedJobs.forEach(job => {
        const country = job.location?.split(',').pop()?.trim() || 'Unknown';
        byCountry[country] = (byCountry[country] || 0) + 1;
      });

      // Count recent jobs (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentJobs = transformedJobs.filter(job => 
        new Date(job.postedDate) >= sevenDaysAgo
      ).length;

      statistics = {
        totalJobs: count || transformedJobs.length,
        recentJobs,
        byCountry,
        bySource,
      };
    }

    return NextResponse.json({
      success: true,
      jobs: transformedJobs,
      count: count || transformedJobs.length,
      ...(statistics && { statistics }),
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
    
    const job = await jobsService.create({
      title: body.title,
      description: body.description,
      company_id: body.companyId,
      job_type_id: body.jobTypeId,
      location: body.location,
      salary_min: body.salaryMin,
      salary_max: body.salaryMax,
      currency_id: body.currencyId,
      apply_url: body.applyUrl,
      status_id: body.statusId || 1, // Default to active
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
