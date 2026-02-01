import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/server/supabase/server';
import { ResourcesService } from '@/server/supabase/services/resources';
import {Statuses} from "@/types";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const type_id = params.get('type_id') || undefined;
    const search = params.get('search') || undefined;
    const page = params.get('page') ? parseInt(params.get('page')!) : undefined;
    const page_size = params.get('page_size') ? parseInt(params.get('page_size')!) : undefined;
    const order_by = params.get('order_by') || undefined;
    const order_asc = params.get('order_asc') || undefined;

    const includeStats = params.get('includeStats') === 'true';

    const supabase = await createServerSupabaseClient();
    const resourcesService = new ResourcesService(supabase);

    const { list, pagination } = await resourcesService.index({
      type_id,
      search,
      page,
      page_size,
      order_by,
      order_asc
    });

    let stats = null;
    if (includeStats) {
      stats = await resourcesService.getStats();
    }

    return NextResponse.json({
      success: true,
      data: { list, pagination, ...(stats && { stats }) },
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
      type_id: body.type_id,
      is_premium: body.is_premium || false,
      status_id: body.status_id || Statuses.Unpublished
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
