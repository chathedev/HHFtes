import { NextResponse, type NextRequest } from "next/server"

// Cloudflare Access removed. Middleware now allows /editor through without CF checks.
// Keeping the file to avoid Next.js errors if it was previously present.
export function middleware(_req: NextRequest) {
  return NextResponse.next()
}

// Only attach to /editor if Next.js decides to invoke it
export const config = {
  matcher: ["/editor/:path*"],
}
