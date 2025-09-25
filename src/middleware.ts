import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // For sessionStorage-based auth, we'll handle redirects on the client side
  // The middleware will just pass through and let the client handle authentication
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};
