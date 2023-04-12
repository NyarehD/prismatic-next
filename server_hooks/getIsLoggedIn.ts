import { NextRequest } from "next/server";

/**
 * Get the user data stored in cookies
 * @param request A NextRequest
 * @returns The cookies for session-token
 */
export default function getIsLoggedIn(request: NextRequest) {
  return request.cookies.get("next-auth.session-token") || request.cookies.get("__Secure-next-auth.session-token")
}