/**
 * Augmented middleware to protect /editor and /api/edit/* with Cloudflare Access.
 * Does nothing for other routes to keep behavior backward compatible.
 */
import { NextResponse, type NextRequest } from "next/server"
import { verifyCloudflareAccess } from "@/lib/security/verify-cloudflare-access"

// Only enforce Cloudflare Access for these paths.
const PROTECTED_PREFIXES = ["/editor", "/api/edit"]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const needsProtection = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))
  if (!needsProtection) {
    return NextResponse.next()
  }

  const cfJwt = req.headers.get("CF-Access-Jwt-Assertion") || ""

  const ok = await verifyCloudflareAccess(cfJwt)
  if (!ok) {
    return new NextResponse("Unauthorized (Cloudflare Access required)", { status: 401 })
  }

  return NextResponse.next()
}

export const config = {
  // Run only on editor and edit-API routes.
  matcher: ["/editor/:path*", "/api/edit/:path*"],
}
