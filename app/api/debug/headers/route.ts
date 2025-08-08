import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const hasHeader = !!(req.headers.get("cf-access-jwt-assertion"))
  const hasCookie = /CF_Authorization=/.test(req.headers.get("cookie") || "")

  return new NextResponse(JSON.stringify({
    hasHeader: hasHeader,
    hasCookie: hasCookie
  }), { headers: { "content-type": "application/json" } })
}
