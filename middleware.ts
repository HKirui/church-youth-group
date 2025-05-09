import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Simplified middleware that doesn't block any routes
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

// Only run middleware on specific paths if needed
export const config = {
  matcher: [
    // Skip all internal paths (_next, api, static files)
    "/((?!_next/|api/|images/|favicon.ico).*)",
  ],
}

