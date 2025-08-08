import { NextRequest, NextResponse } from 'next/server'
import { verifyCloudflareAccess } from '@/lib/security/verify-cloudflare-access'

export const config = {
  matcher: ["/editor/:path*", "/api/edit/:path*"],
}

export async function middleware(request: NextRequest) {
  const cfAccessJwtAssertion = request.headers.get("cf-access-jwt-assertion")
  const cfAuthorizationCookie = request.cookies.get("CF_Authorization")?.value

  let token: string | undefined

  if (cfAccessJwtAssertion) {
    token = cfAccessJwtAssertion
  } else if (cfAuthorizationCookie) {
    token = cfAuthorizationCookie
  }

  if (!token) {
    return new NextResponse("Unauthorized (no CF token)", { status: 401 })
  }

  try {
    const isValid = await verifyCloudflareAccess(token)
    if (!isValid) {
      return new NextResponse("Unauthorized (invalid CF token)", { status: 401 })
    }
  } catch (error) {
    console.error("Cloudflare Access verification error:", error)
    return new NextResponse("Unauthorized (invalid CF token)", { status: 401 })
  }

  return NextResponse.next()
}
