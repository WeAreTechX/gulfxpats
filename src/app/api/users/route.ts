import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/server/supabase/server';
import { UsersService } from '@/server/supabase/services/users';

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const search = params.get('search') || undefined;
    const status_code = params.get('status_code') || undefined;
    const page = params.get('page') ? parseInt(params.get('page')!) : undefined;
    const page_size = params.get('page_size') ? parseInt(params.get('page_size')!) : undefined;
    const order_by = params.get('order_by') || undefined;
    const order_asc = params.get('order_asc') || undefined;

    const includeStats = params.get('includeStats') === 'true';

    const supabase = await createServerSupabaseClient();
    const usersService = new UsersService(supabase);

    const { list, pagination } = await usersService.index({
      search,
      status_code,
      page,
      page_size,
      order_by,
      order_asc
    });

    let stats = null;
    if (includeStats) {
      stats = await usersService.getStats();
    }

    return NextResponse.json({
      success: true,
      data: { list, pagination, ...(stats && { stats }) },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    const supabase = await createServerSupabaseClient();
    const usersService = new UsersService(supabase);
    
    const user = await usersService.update(id, {
      first_name: updateData.first_name,
      last_name: updateData.last_name,
      location: updateData.location,
      country: updateData.country,
      status_id: updateData.status_id
    });

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    const supabase = await createServerSupabaseClient();
    const usersService = new UsersService(supabase);
    
    await usersService.delete(id);

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
