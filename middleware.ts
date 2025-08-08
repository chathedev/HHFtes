import { NextRequest, NextResponse } from "next/server"
import { verifyCloudflareAccess } from "@/lib/security/verify-cloudflare-access"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const protectedPath = pathname.startsWith("/editor") || pathname.startsWith("/api/edit")
  if (!protectedPath) return NextResponse.next()

  // Read token from EITHER header "cf-access-jwt-assertion" (lowercase!) OR cookie "CF_Authorization".
  const headerToken = req.headers.get("cf-access-jwt-assertion")
  const cookieToken = req.cookies.get("CF_Authorization")?.value
  const token = headerToken || cookieToken

  if (!token) {
    return new NextResponse("Unauthorized (no CF token)", { status: 401 })
  }

  const ok = await verifyCloudflareAccess(token).catch(() => false)
  if (!ok) {
    return new NextResponse("Unauthorized (invalid CF token)", { status: 401 })
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/editor/:path*", "/api/edit/:path*"],
}
