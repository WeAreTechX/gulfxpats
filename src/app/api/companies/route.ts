import { NextRequest, NextResponse } from 'next/server';
import { getCompanies } from '@/lib/data-service';

// GET /api/companies - Get all companies
export async function GET(request: NextRequest) {
  try {
    const companies = await getCompanies();
    
    return NextResponse.json({
      success: true,
      companies,
      totalCompanies: companies.length
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      companies: [],
      totalCompanies: 0
    }, { status: 500 });
  }
}
