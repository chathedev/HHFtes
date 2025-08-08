import { NextRequest, NextResponse } from 'next/server'
import { verifyCloudflareAccess } from '@/lib/security/verify-cloudflare-access'

// Protect only the editor and edit APIs. Do nothing for other routes.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const needsAccess =
    pathname.startsWith('/editor') || pathname.startsWith('/api/edit')

  if (!needsAccess) return NextResponse.next()

  const token = req.headers.get('CF-Access-Jwt-Assertion') || ''
  const valid = await verifyCloudflareAccess(token).catch(() => false)

  if (!valid) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  return NextResponse.next()
}

// Run on /editor and /api/edit/*
export const config = {
  matcher: ['/editor/:path*', '/api/edit/:path*'],
}
