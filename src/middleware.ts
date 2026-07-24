import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect /admin routes, except /admin/login
  if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
    // Check for the admin session cookie
    const authCookie = request.cookies.get('eundeur_admin_session');

    // If no cookie exists, redirect to login
    if (!authCookie || !authCookie.value) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      const JWT_SECRET = process.env.JWT_SECRET;
      
      if (!JWT_SECRET) {
        console.error("CRITICAL: JWT_SECRET is not set in environment variables.");
        return new NextResponse("Internal Server Error: Missing Auth Configuration", { status: 500 });
      }

      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(authCookie.value, secret);
      const role = payload.role as string;

      // Basic RBAC Example
      if (path.startsWith('/admin/users') || path.startsWith('/admin/settings')) {
        if (role !== 'SUPER_ADMIN') {
          return new NextResponse("Forbidden: Super Admin Only", { status: 403 });
        }
      }

      if (path.startsWith('/admin/tickets/scan')) {
        if (role !== 'SUPER_ADMIN' && role !== 'ORGANISER') {
          return new NextResponse("Forbidden: Organiser Only", { status: 403 });
        }
      }
    } catch (err) {
      // JWT is invalid or expired
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
