import { NextRequest, NextResponse } from "next/server";
export function middleware(request: NextRequest) {
  // Can go to /auth/:path* only if user is not logged in
  if (request.nextUrl.pathname.startsWith("/auth")) {
    return request.cookies.get("next-auth.session-token") && NextResponse.redirect(new URL('/', request.url));
  }
}
export const config = {
  matcher: ["/auth/:path*"]
}
