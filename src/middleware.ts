import { NextRequest, NextResponse } from "next/server";
export function middleware(request: NextRequest) {
  /**
   * If the user is logged in and tries to go to /auth, redirect back to home
   */
  if (request.nextUrl.pathname.startsWith("/auth")) {
    return request.cookies.get("next-auth.session-token") && NextResponse.redirect(new URL('/', request.url));
  }
  /**
   * Can go to /category and /item only if user is logged in
   * If not redirect to login
   */
  if (request.nextUrl.pathname.startsWith("/category") || request.nextUrl.pathname.startsWith("/item")) {
    return !request.cookies.get("next-auth.session-token") && NextResponse.redirect(new URL("/auth/login", request.url))
  }
}
export const config = {
  matcher: ["/auth/:path*", "/category", "/item"]
}
