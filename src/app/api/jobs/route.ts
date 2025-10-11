import { NextRequest, NextResponse } from 'next/server';

// GET /api/companies - Get all companies
export async function GET(request: NextRequest) {
  try {
    // const companies = await getCompanies();
    
    return NextResponse.json({
      success: true,
      jobs: [],
      totalJobs: 0
    });
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
