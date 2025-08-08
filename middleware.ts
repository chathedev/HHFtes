import { NextRequest, NextResponse } from "next/server"
import { verifyCloudflareAccess } from "@/lib/security/verify-cloudflare-access"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const protectedPath = pathname.startsWith("/editor") || pathname.startsWith("/api/edit")
  if (!protectedPath) return NextResponse.next()

  // Get JWT from header (case-insensitive) or cookie
  const headerToken = req.headers.get("CF-Access-Jwt-Assertion")
  const cookieToken = req.cookies.get("CF_Authorization")?.value
  const token = headerToken || cookieToken || ""

  const ok = await verifyCloudflareAccess(token).catch(() => false)
  if (!ok) {
    return new NextResponse("Unauthorized (Cloudflare Access required)", { status: 401 })
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/editor/:path*", "/api/edit/:path*"],
}
