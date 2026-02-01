import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/server/supabase';
import { AdminsService } from "@/server/supabase/services";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();
    const adminsService = new AdminsService(supabase);

    const admin = await adminsService.show(id);

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Admin not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: admin,
    });
  } catch (error) {
    console.error('Error fetching admin:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch admin' },
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
    const adminsService = new AdminsService(supabase);

    // Check if admin exists
    const existingAdmin = await adminsService.showById(id);
    if (!existingAdmin) {
      return NextResponse.json(
        { success: false, error: 'Admin not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};
    
    if (body.first_name !== undefined) updateData.first_name = body.first_name;
    if (body.last_name !== undefined) updateData.last_name = body.last_name;
    if (body.role !== undefined) updateData.role = body.role;
    if (body.status_id !== undefined) updateData.status_id = body.status_id;

    const admin = await adminsService.update(id, updateData);

    return NextResponse.json({
      success: true,
      data: admin,
    });
  } catch (error) {
    console.error('Error updating admin:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update admin' },
      { status: 500 }
    );
  }
}