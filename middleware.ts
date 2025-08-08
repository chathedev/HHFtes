import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()

  // Paths that require editor authentication
  const protectedPaths = ["/editor", "/api/edit"]

  const isProtectedPath = protectedPaths.some((path) => url.pathname.startsWith(path))

  if (isProtectedPath) {
    const cfAccessJwt = request.headers.get("cf-access-jwt-assertion")
    const cfAuthorizationCookie = request.cookies.get("CF_Authorization")

    // Check for Cloudflare Access JWT in header or cookie
    if (cfAccessJwt || cfAuthorizationCookie) {
      // If authenticated, set a cookie to indicate editor access
      const response = NextResponse.next()
      response.cookies.set("edit", "1", {
        path: "/",
        domain: ".harnosandshf.se", // Adjust to your domain
        sameSite: "strict",
        secure: true,
        httpOnly: true,
        maxAge: 3600, // 1 hour
      })
      return response
    } else {
      // Redirect to Cloudflare Access login if not authenticated
      // This assumes Cloudflare Access is configured to handle the redirect
      // For local development, you might need a different authentication mechanism
      // or bypass this check.
      return NextResponse.redirect(new URL("/login", request.url)) // Or a specific Cloudflare Access login URL
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/editor/:path*", "/api/edit/:path*"], // Protect /editor and /api/edit routes
}
