import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED = ['/dashboard', '/counselor', '/admin'];
const AUTH_PAGES = ['/auth/login', '/auth/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));

  // Tokens live in localStorage (client-only) — can't inspect from middleware.
  // Use a cookie set by AuthContext on login so middleware can gate routes.
  const hasSession = request.cookies.get('jalimind_session')?.value === '1';

  if (isProtected && !hasSession) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  if (isAuthPage && hasSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/counselor/:path*', '/admin/:path*', '/auth/:path*'],
};
