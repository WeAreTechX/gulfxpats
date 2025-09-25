import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // For sessionStorage, we'll handle authentication on the client side
    // This endpoint will always return not authenticated
    // The client will check sessionStorage directly
    return NextResponse.json({
      success: true,
      isAuthenticated: false,
      message: 'Use client-side sessionStorage for authentication'
    });

  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      isAuthenticated: false
    }, { status: 500 });
  }
}
