import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ResourcesService } from '@/lib/supabase/services/resources';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const resourceTypeId = searchParams.get('resourceTypeId') || undefined;
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;

    const supabase = await createServerSupabaseClient();
    const resourcesService = new ResourcesService(supabase);
    
    const { data: resources, count } = await resourcesService.getAll({
      resourceTypeId,
      status,
      search,
      limit,
      offset,
    });

    // Transform resources to match the existing frontend format
    const transformedResources = resources.map(resource => ({
      id: resource.id,
      title: resource.title,
      type: resource.resource_type?.code || 'article',
      url: resource.url,
      description: resource.description || '',
      duration: '',
      author: '',
      publishedAt: resource.created_at,
      tags: [],
    }));

    return NextResponse.json({
      success: true,
      resources: transformedResources,
      count: count || transformedResources.length,
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const supabase = await createServerSupabaseClient();
    const resourcesService = new ResourcesService(supabase);
    
    const resource = await resourcesService.create({
      title: body.title,
      description: body.description,
      url: body.url,
      resource_type_id: body.resourceTypeId,
      status_id: body.statusId || 1, // Default to active
    });

    return NextResponse.json({
      success: true,
      resource,
    });
  } catch (error) {
    console.error('Error creating resource:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create resource' },
      { status: 500 }
    );
  }
}
