import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/register', '/verify', '/'];

function isValidToken(token: string | undefined): boolean {
  // Add your token validation logic here
  // For example, check token length, format, etc.
  return !!token && token.length > 10;
}

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /dashboard)
  const path = request.nextUrl.pathname;

  // Check if the path is a public path
  const isPublicPath = PUBLIC_PATHS.includes(path);

  // Get the token from the cookies
  const token = request.cookies.get('token')?.value;

  // Validate token
  const hasValidToken = isValidToken(token);

  // Enhanced logging
  console.log('Middleware Details:', {
    path,
    isPublicPath,
    hasToken: !!token,
    hasValidToken,
  });

  // If the path is public and the user is already logged in, redirect to dashboard
  if (isPublicPath && hasValidToken) {
    console.log('Redirecting logged-in user from public path');
    return NextResponse.redirect(new URL('/menu', request.url));
  }

  // If the path is not public and the user is not logged in or has invalid token, redirect to login
  if (!isPublicPath && !hasValidToken) {
    console.log('Redirecting unauthenticated user to login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If no redirection occurs, continue the request
  return NextResponse.next();
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
