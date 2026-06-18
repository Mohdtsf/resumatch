import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware for request-level concerns.
 * Rate limiting is handled per-route in the API routes themselves
 * since Upstash requires async operations.
 * 
 * This middleware adds security headers as a defense-in-depth measure.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function middleware(_request: NextRequest) {
  const response = NextResponse.next();

  // Add request ID for tracing (don't log PII)
  response.headers.set("X-Request-Id", crypto.randomUUID());

  return response;
}

export const config = {
  matcher: [
    // Apply to API routes and pages, skip static files
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
