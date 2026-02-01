import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/server/supabase/server';
import { JobsSourcesService } from '@/server/supabase/services/jobs-sources';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();
    const jobsSourcesService = new JobsSourcesService(supabase);
    
    const source = await jobsSourcesService.show(parseInt(id));

    if (!source) {
      return NextResponse.json(
        { success: false, error: 'Source not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      source,
    });
  } catch (error) {
    console.error('Error fetching source:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch source' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const supabase = await createServerSupabaseClient();
    const jobsSourcesService = new JobsSourcesService(supabase);

    // Check if code already exists for a different source
    if (body.code) {
      const existing = await jobsSourcesService.getByCode(body.code);
      if (existing && existing.id !== parseInt(id)) {
        return NextResponse.json(
          { success: false, error: 'A source with this code already exists' },
          { status: 400 }
        );
      }
    }

    const source = await jobsSourcesService.update(parseInt(id), {
      name: body.name,
      code: body.code,
      base_url: body.base_url
    });

    return NextResponse.json({
      success: true,
      source,
    });
  } catch (error) {
    console.error('Error updating source:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update source' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();
    const jobsSourcesService = new JobsSourcesService(supabase);
    
    await jobsSourcesService.delete(parseInt(id));

    return NextResponse.json({
      success: true,
      message: 'Source deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting source:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete source' },
      { status: 500 }
    );
  }
}
