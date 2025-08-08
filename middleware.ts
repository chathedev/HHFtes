import { NextRequest, NextResponse } from "next/server"
import { verifyCloudflareAccess } from "@/lib/security/verify-cloudflare-access"

export const config = {
  matcher: ["/editor/:path*", "/api/edit/:path*"],
}

export async function middleware(req: NextRequest) {
  let token: string | undefined

  // Try to get token from header (lowercase)
  token = req.headers.get("cf-access-jwt-assertion")

  // If not in header, try to get from cookie
  if (!token) {
    token = req.cookies.get("CF_Authorization")?.value
  }

  if (!token) {
    return new NextResponse("Unauthorized (no CF token)", { status: 401 })
  }

  const isTokenValid = await verifyCloudflareAccess(token)

  if (!isTokenValid) {
    return new NextResponse("Unauthorized (invalid CF token)", { status: 401 })
  }

  return NextResponse.next()
}
