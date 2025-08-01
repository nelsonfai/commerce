// middleware.ts 
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const customerAccessToken = request.cookies.get('customerAccessToken');
  const { pathname } = request.nextUrl;

  // Protected routes
  const protectedRoutes = ['/account'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Auth routes
  const authRoutes = ['/auth/login', '/auth/register'];
  const isAuthRoute = authRoutes.includes(pathname);

  if (isProtectedRoute && !customerAccessToken) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (isAuthRoute && customerAccessToken) {
    return NextResponse.redirect(new URL('/account', request.url));
  }

  // Add security headers
  const response = NextResponse.next();
  
  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');
  
  // XSS protection
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: ['/account/:path*', '/auth/:path*']
};
