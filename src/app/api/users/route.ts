import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../../server/supabase/server';
import { UsersService } from '../../../../server/supabase/services/users';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;

    const supabase = await createServerSupabaseClient();
    const usersService = new UsersService(supabase);
    
    const { data: users, count } = await usersService.getAll({
      status,
      search,
      limit,
      offset,
    });

    return NextResponse.json({
      success: true,
      users,
      count: count || users.length,
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
      first_name: updateData.firstName,
      last_name: updateData.lastName,
      location: updateData.location,
      status_id: updateData.statusId,
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
