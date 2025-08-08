import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { User } from '../types/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export async function middleware(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '') || request.cookies.get('accessToken')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const payload = verify(token, JWT_SECRET) as { userId: string; userType: User['userType'] };
    const { userType } = payload;
    const { pathname } = request.nextUrl;

    // Define allowed routes per user type
    const roleRoutes: Record<User['userType'], string> = {
      patient: '/patient',
      admin: '/admin',
      doctor: '/doctor',
    };

    // Check if user is accessing their designated route
    if (
      (pathname === '/patient' && userType !== 'patient') ||
      (pathname === '/admin' && userType !== 'admin') ||
      (pathname === '/doctor' && userType !== 'doctor') ||
      (pathname === '/profile' && userType !== 'patient') // Only patients access /profile
    ) {
      return NextResponse.redirect(new URL(userType === 'patient' ? '/profile' : roleRoutes[userType], request.url));
    }

    // Add user data to headers for downstream use
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('userId', payload.userId);
    requestHeaders.set('userType', payload.userType);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/patient/:path*', '/admin/:path*', '/doctor/:path*', '/profile/:path*'],
};