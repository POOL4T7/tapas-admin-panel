import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/register', '/'];

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /dashboard)
  const path = request.nextUrl.pathname;

  // Check if the path is a public path
  const isPublicPath = PUBLIC_PATHS.includes(path);

  // Get the token from the cookies
  const token = request.cookies.get('token')?.value || '';

  // If the path is public and the user is already logged in, redirect to dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/menu', request.url));
  }

  // If the path is not public and the user is not logged in, redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/menu/:path*',
    '/categories/:path*',
    '/sub-categories/:path*',
    '/products/:path*',
    '/offers/:path*',
  ],
};
