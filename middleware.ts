import { NextRequest, NextResponse } from "next/server"
import { verifyCloudflareAccess } from "@/lib/security/verify-cloudflare-access"

export const config = {
  matcher: ["/editor/:path*", "/api/edit/:path*"],
}

export async function middleware(req: NextRequest) {
  // Try to get the token from the 'cf-access-jwt-assertion' header (lowercase)
  let token = req.headers.get("cf-access-jwt-assertion")

  // If not found in header, try to get it from the 'CF_Authorization' cookie
  if (!token) {
    token = req.cookies.get("CF_Authorization")?.value
  }

  if (!token) {
    return new NextResponse("Unauthorized (no CF token)", { status: 401 })
  }

  const ok = await verifyCloudflareAccess(token)

  if (!ok) {
    return new NextResponse("Unauthorized (invalid CF token)", { status: 401 })
  }

  return NextResponse.next()
}
