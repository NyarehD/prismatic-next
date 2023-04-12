import { NextRequest, NextResponse } from "next/server";
import getIsLoggedIn from "../server_hooks/getIsLoggedIn";

export async function middleware(request: NextRequest) {
  const isLoggedIn = getIsLoggedIn(request);

  /**
   * If the user is logged in and tries to go to /auth, redirect back to home
   */
  if (request.nextUrl.pathname.startsWith("/auth")) {
    return isLoggedIn && NextResponse.redirect(new URL('/', request.url));
  }
  /**
   * Can go to /category and /item only if user is logged in
   * If not redirect to login
   */
  if (request.nextUrl.pathname.startsWith("/category") || request.nextUrl.pathname.startsWith("/item")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
  }
}
export const config = {
  matcher: ["/auth/:path*", "/category", "/item"]
}
