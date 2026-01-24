import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../../../../server/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json({
        success: true,
        isAuthenticated: false,
        isAdmin: false,
      });
    }

    // Check if user is an admin
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .select('id, email, first_name, last_name, role, status_id')
      .eq('id', session.user.id)
      .single();

    if (adminError || !adminData) {
      return NextResponse.json({
        success: true,
        isAuthenticated: true,
        isAdmin: false,
      });
    }

    // Check if admin is active
    if (adminData.status_id !== 1) {
      return NextResponse.json({
        success: true,
        isAuthenticated: true,
        isAdmin: false,
        message: 'Admin account is deactivated'
      });
    }

    return NextResponse.json({
      success: true,
      isAuthenticated: true,
      isAdmin: true,
      admin: {
        id: adminData.id,
        email: adminData.email,
        firstName: adminData.first_name,
        lastName: adminData.last_name,
        role: adminData.role,
      }
    });

  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      isAuthenticated: false,
      isAdmin: false,
    }, { status: 500 });
  }
}
