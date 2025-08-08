import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyCloudflareAccess } from "@/lib/security/verify-cloudflare-access"

export const config = {
  matcher: ["/editor/:path*", "/api/edit/:path*"],
}

export async function middleware(req: NextRequest) {
  const tokenFromHeader = req.headers.get("cf-access-jwt-assertion")
  const tokenFromCookie = req.cookies.get("CF_Authorization")?.value

  const token = tokenFromHeader || tokenFromCookie

  if (!token) {
    return new NextResponse("Unauthorized (no CF token)", { status: 401 })
  }

  const isValid = await verifyCloudflareAccess(token)

  if (!isValid) {
    return new NextResponse("Unauthorized (invalid CF token)", { status: 401 })
  }

  return NextResponse.next()
}
