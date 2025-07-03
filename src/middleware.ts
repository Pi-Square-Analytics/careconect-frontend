import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /dashboard/admin)
  const path = request.nextUrl.pathname;

  // Define paths that require authentication
  const protectedPaths = ['/dashboard'];
  const isProtectedPath = protectedPaths.some(protectedPath => 
    path.startsWith(protectedPath)
  );

  // If it's a protected path, check for authentication
  if (isProtectedPath) {
    // In a real app, you would check for a valid JWT token or session
    // For now, we'll just check if there's a user in the request headers
    // This is a simplified example - in production, use proper authentication
    
    // You can add authentication logic here
    // For example, checking cookies or headers for valid tokens
    
    // For demo purposes, we'll allow access
    // In a real app, redirect to login if not authenticated:
    // return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
