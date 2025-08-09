import { NextResponse, type NextRequest } from "next/server"
import { createRemoteJWKSet, jwtVerify } from "jose"

function normalizeIssuer(input: string) {
  const hasScheme = /^https?:\/\//i.test(input)
  const base = hasScheme ? input : `https://${input}`
  return base.replace(/\/+$/, "")
}

export async function middleware(request: NextRequest) {
  // Only protect /editor (config.matcher also enforces this)
  if (!request.nextUrl.pathname.startsWith("/editor")) {
    return NextResponse.next()
  }

  // Allow Next.js prefetch requests through (they may not include auth headers)
  // This avoids false 401s on prefetch requests and aligns with Next.js guidance. [^2][^3][^5]
  if (request.headers.get("next-router-prefetch") === "1" || request.headers.get("purpose") === "prefetch") {
    return NextResponse.next()
  }

  // Token from header or cookie (header takes precedence)
  const token = request.headers.get("cf-access-jwt-assertion") || request.cookies.get("CF_Authorization")?.value

  if (!token) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const rawTeamDomain = process.env.CF_TEAM_DOMAIN
  const audEnv = process.env.CF_ACCESS_AUD

  if (!rawTeamDomain || !audEnv) {
    // Missing required config -> Unauthorized
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const issuer = normalizeIssuer(rawTeamDomain)
  const jwksUrl = `${issuer}/cdn-cgi/access/certs`
  const JWKS = createRemoteJWKSet(new URL(jwksUrl))

  // Accept single or multiple audiences from env (comma-separated)
  const expectedAudiences = audEnv
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)

  try {
    // Verify signature and claims against CF Access
    await jwtVerify(token, JWKS, {
      issuer, // verify iss matches the normalized issuer
      audience: expectedAudiences.length > 1 ? expectedAudiences : expectedAudiences[0],
    })

    return NextResponse.next()
  } catch {
    return new NextResponse("Unauthorized", { status: 401 })
  }
}

export const config = {
  matcher: ["/editor/:path*"],
}
