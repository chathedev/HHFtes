import { NextResponse, type NextRequest } from "next/server"
import * as jose from "jose"

// Protect ONLY /editor routes via Cloudflare Access
export async function middleware(request: NextRequest) {
  // Only match /editor paths (config.matcher enforces this as well)
  if (!request.nextUrl.pathname.startsWith("/editor")) {
    return NextResponse.next()
  }

  // Read token from header or cookie
  const token = request.headers.get("cf-access-jwt-assertion") || request.cookies.get("CF_Authorization")?.value || ""

  if (!token) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const teamDomain = process.env.CF_TEAM_DOMAIN
  const expectedAud = process.env.CF_ACCESS_AUD

  // If config is missing, treat as unauthorized per requirements
  if (!teamDomain || !expectedAud) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const issuer = `https://${teamDomain}`
  const jwksUrl = `${issuer}/cdn-cgi/access/certs`

  try {
    const JWKS = jose.createRemoteJWKSet(new URL(jwksUrl))

    // jose will validate 'aud' claim whether it's a string or array when we pass a string or array here.
    await jose.jwtVerify(token, JWKS, {
      issuer,
      audience: expectedAud,
    })

    // Valid
    return NextResponse.next()
  } catch (err) {
    // Invalid/missing → 401
    return new NextResponse("Unauthorized", { status: 401 })
  }
}

export const config = {
  matcher: ["/editor/:path*"],
}
