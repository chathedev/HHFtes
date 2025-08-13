import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow API routes, static assets, and public pages to pass through
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/static/") ||
    pathname.startsWith("/_next/image/") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/logo.png") ||
    pathname.startsWith("/opengraph-image.png") ||
    pathname.startsWith("/robots.txt") ||
    pathname.startsWith("/sitemap.xml") ||
    pathname === "/" ||
    pathname === "/nyheter" ||
    pathname === "/partners" ||
    pathname === "/lag" ||
    pathname === "/kontakt" ||
    pathname === "/kalender" ||
    pathname === "/matcher"
  ) {
    return NextResponse.next()
  }

  // For the /editor route, check Cloudflare Access authentication
  if (pathname.startsWith("/editor")) {
    // Check for Cloudflare Access JWT token
    const cfAccessJwt = request.headers.get("cf-access-jwt-assertion")
    const cfAccessEmail = request.headers.get("cf-access-authenticated-user-email")

    // If no Cloudflare Access headers, redirect to Cloudflare Access login
    if (!cfAccessJwt || !cfAccessEmail) {
      // Cloudflare Access will handle the authentication flow
      const accessUrl = new URL(
        `https://${process.env.CF_TEAM_DOMAIN}/cdn-cgi/access/login/${process.env.CF_ACCESS_AUD}`,
      )
      accessUrl.searchParams.set("redirect_url", request.url)
      return NextResponse.redirect(accessUrl)
    }

    // If authenticated via Cloudflare Access, allow access
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|logo.png|opengraph-image.png|robots.txt|sitemap.xml).*)"],
}
