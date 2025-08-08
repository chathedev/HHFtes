// Protect only /editor and /api/edit/* with Cloudflare Access.
// No changes for other routes, preserving backward compatibility [^5].
import { NextRequest, NextResponse } from "next/server"
import { verifyCloudflareAccess } from "@/lib/security/verify-cloudflare-access"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const protectedPath = pathname.startsWith("/editor") || pathname.startsWith("/api/edit")
  if (!protectedPath) return NextResponse.next()

  const token = req.headers.get("CF-Access-Jwt-Assertion") || ""
  const ok = await verifyCloudflareAccess(token).catch(() => false)
  if (!ok) {
    return new NextResponse("Unauthorized (Cloudflare Access required)", { status: 401 })
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/editor/:path*", "/api/edit/:path*"],
}
