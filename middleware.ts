import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check if the request is for editor or edit API routes
  if (request.nextUrl.pathname.startsWith('/editor') || request.nextUrl.pathname.startsWith('/api/edit/')) {
    // Check for Cloudflare Access authentication
    const cfJwtHeader = request.headers.get('cf-access-jwt-assertion')
    const cfAuthCookie = request.cookies.get('CF_Authorization')
    
    if (cfJwtHeader || cfAuthCookie) {
      // Authentication successful, set edit cookie
      const response = NextResponse.next()
      response.cookies.set({
        name: 'edit',
        value: '1',
        path: '/',
        domain: '.harnosandshf.se',
        sameSite: 'strict',
        secure: true,
        httpOnly: true,
        maxAge: 3600, // 1 hour
      })
      return response
    } else {
      // No authentication, deny access
      return new NextResponse('Unauthorized', { status: 401 })
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ["/editor/:path*", "/api/edit/:path*"],
}
