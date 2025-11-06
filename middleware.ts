import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Handles both Edge runtime and Node runtime session cookie formats
  const session =
    req.cookies.get("next-auth.session-token") ||
    req.cookies.get("__Secure-next-auth.session-token");

  // If no session → redirect to signin
  if (!session) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // Otherwise, continue to dashboard
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
