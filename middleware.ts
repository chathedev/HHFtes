// middleware.ts
// Cloudflare Access removed per request. This middleware is now a no-op.
// It only matches /editor to avoid affecting any other routes/pages.

import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export function middleware(_req: NextRequest) {
  // Always allow access to /editor (no auth here).
  return NextResponse.next()
}

export const config = {
  // IMPORTANT: Only match the editor route.
  matcher: ["/editor/:path*"],
}
