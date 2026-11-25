import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED = ['/dashboard', '/counselor', '/admin', '/call'];
const AUTH_PAGES = ['/auth/login', '/auth/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));

  // Tokens live in localStorage (client-only), so middleware can't inspect them.
  // AuthContext sets this cookie on login purely so we can gate routes quickly; the real
  // authorisation always happens on the API.
  const hasSession = request.cookies.get('jalimind_session')?.value === '1';

  if (isProtected && !hasSession) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  // Auth pages bounce signed-in people home; the role-aware redirect happens client-side.
  if (isAuthPage && hasSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/counselor/:path*', '/admin/:path*', '/call/:path*', '/auth/:path*'],
};
