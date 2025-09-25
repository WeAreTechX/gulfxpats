import { NextRequest, NextResponse } from 'next/server';
import { getJobs, getJobStatistics } from '@/lib/data-service';

// GET /api/jobs - Get all jobs (including Gulf jobs)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeStats = searchParams.get('includeStats') === 'true';

    // Get jobs from data service (includes Gulf jobs)
    const jobs = await getJobs();
    
    let response: any = {
      success: true,
      jobs,
      totalJobs: jobs.length
    };

    // Include statistics if requested
    if (includeStats) {
      try {
        const stats = await getJobStatistics();
        response.statistics = stats;
      } catch (error) {
        console.log('Statistics not available:', error);
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      jobs: [],
      totalJobs: 0
    }, { status: 500 });
  }
}
