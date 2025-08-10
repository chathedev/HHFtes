import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname, host } = request.nextUrl

  // Redirection logic for specific domains
  const redirectDomains = ["harnosandshf.se", "www.harnosandshf.se"]
  const targetDomain = "www.laget.se"
  const targetPath = "/HarnosandsHF"

  if (redirectDomains.includes(host)) {
    const redirectUrl = new URL(`https://${targetDomain}${targetPath}`)
    return NextResponse.redirect(redirectUrl)
  }

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
    pathname === "/login" || // Allow login page
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

  // For the /editor route, check for authentication token
  if (pathname.startsWith("/editor")) {
    const token = request.cookies.get("editor-auth")?.value // Correct cookie name

    if (!token) {
      // Redirect to login page if no token is found
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", pathname) // Pass current path as redirect param
      return NextResponse.redirect(loginUrl)
    }

    // If token exists, allow access to /editor
    return NextResponse.next()
  }

  // For any other path not explicitly handled, allow access (or redirect to home)
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|logo.png|opengraph-image.png|robots.txt|sitemap.xml).*)"],
}
