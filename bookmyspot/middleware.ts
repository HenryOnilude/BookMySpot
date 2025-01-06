// middleware.ts
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequestWithAuth } from 'next-auth/middleware';

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/about',
  '/contact',
  '/services',
  '/api/auth'
];

// Define route permissions by user type
const routePermissions = {
  DRIVER: ['/dashboard', '/bookings', '/search'],
  OWNER: ['/dashboard', '/spots'],
  ADMIN: ['/dashboard', '/admin']
};

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Allow access to public routes
    if (publicRoutes.some(route => path.startsWith(route))) {
      return NextResponse.next();
    }

    // No token means not authenticated
    if (!token) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', encodeURIComponent(path));
      return NextResponse.redirect(loginUrl);
    }

    // Get user type from token
    const userType = token.type as keyof typeof routePermissions;

    // If no user type or invalid user type, redirect to login
    if (!userType || !routePermissions[userType]) {
      const loginUrl = new URL('/login', req.url);
      return NextResponse.redirect(loginUrl);
    }

    const allowedRoutes = routePermissions[userType];

    // Check if user has access to this route
    if (!allowedRoutes.some(route => path.startsWith(route))) {
      // Redirect to dashboard if trying to access unauthorized route
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
    pages: {
      signIn: '/login',
    }
  }
);

// Specify which routes should be protected
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/bookings/:path*',
    '/spots/:path*',
    '/admin/:path*',
    '/search/:path*'
  ]
};