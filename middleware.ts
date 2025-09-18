import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Check if user is trying to access admin routes
    if (pathname.startsWith('/admin')) {
      if (token?.role !== 'Administrator' && token?.role !== 'Admin') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    // Check if user is trying to access dashboard routes
    if (pathname.startsWith('/dashboard')) {
      if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }

    // Check if authenticated user is trying to access auth pages
    if (pathname === '/login' || pathname === '/signup') {
      if (token) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        
        // Allow access to public pages
        if (pathname === '/' || 
            pathname === '/login' || 
            pathname === '/signup' || 
            pathname === '/forgot-password'||
            pathname === '/reset-password' ||
            pathname.startsWith('/api/auth') ||
            pathname.startsWith('/api/signup') ||
            pathname.startsWith('/home-collection') ||
            pathname.startsWith('/services') ||
            pathname.startsWith('/packages') ||
            pathname.startsWith('/faq')) {
          return true;
        }

        // For protected routes, require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    // Exclude Next internals, favicon, and all static files in /public by extension
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)|public|api/*).*)',
  ],
};
