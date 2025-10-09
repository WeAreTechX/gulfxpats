import { NextRequest, NextResponse } from 'next/server';
import { getResources } from '@/lib/data-service';

// GET /api/resources - Get all resources
export async function GET(request: NextRequest) {
  try {
    const resources = await getResources();
    
    return NextResponse.json({
      success: true,
      resources,
      totalResources: resources.length
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      resources: [],
      totalResources: 0
    }, { status: 500 });
  }
}
