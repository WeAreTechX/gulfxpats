import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email and password are required'
      }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();

    // Authenticate with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return NextResponse.json({
        success: false,
        error: authError?.message || 'Invalid credentials'
      }, { status: 401 });
    }

    // Check if user is an admin
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (adminError || !adminData) {
      // User is not an admin, sign them out
      await supabase.auth.signOut();
      return NextResponse.json({
        success: false,
        error: 'You do not have admin access'
      }, { status: 403 });
    }

    // Check if admin account is active (status_id = 1)
    if (adminData.status_id !== 1) {
      await supabase.auth.signOut();
      return NextResponse.json({
        success: false,
        error: 'Your admin account is deactivated'
      }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      admin: {
        id: adminData.id,
        email: adminData.email,
        firstName: adminData.first_name,
        lastName: adminData.last_name,
        role: adminData.role,
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
