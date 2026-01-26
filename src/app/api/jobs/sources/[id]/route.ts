import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../../../../server/supabase/server';
import { SourcesService } from '../../../../../../server/supabase/services/sources';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();
    const sourcesService = new SourcesService(supabase);
    
    const source = await sourcesService.show(parseInt(id));

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
    const sourcesService = new SourcesService(supabase);

    // Check if code already exists for a different source
    if (body.code) {
      const existing = await sourcesService.getByCode(body.code);
      if (existing && existing.id !== parseInt(id)) {
        return NextResponse.json(
          { success: false, error: 'A source with this code already exists' },
          { status: 400 }
        );
      }
    }
    
    const source = await sourcesService.update(parseInt(id), {
      name: body.name,
      code: body.code,
      description: body.description,
      website_url: body.website_url,
      logo_url: body.logo_url,
      is_active: body.is_active,
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
    const sourcesService = new SourcesService(supabase);
    
    await sourcesService.delete(parseInt(id));

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
