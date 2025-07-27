// middleware.ts (Optional - for protecting routes at the edge)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const customerAccessToken = request.cookies.get('customerAccessToken');
  const { pathname } = request.nextUrl;

  // Protected routes that require authentication
  const protectedRoutes = ['/account'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Auth routes that should redirect if already logged in
  const authRoutes = ['/auth/login', '/auth/register'];
  const isAuthRoute = authRoutes.includes(pathname);

  if (isProtectedRoute && !customerAccessToken) {
    // Redirect to login if trying to access protected route without token
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (isAuthRoute && customerAccessToken) {
    // Redirect to account if trying to access auth pages while logged in
    return NextResponse.redirect(new URL('/account', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/account/:path*', '/auth/:path*']
};