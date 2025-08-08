import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const hasHeader = request.headers.has('cf-access-jwt-assertion')
  const hasCookie = request.cookies.has('CF_Authorization')
  
  return NextResponse.json({
    hasHeader,
    hasCookie,
    headers: Object.fromEntries(request.headers.entries()),
    cookies: Object.fromEntries(
      Array.from(request.cookies.entries()).map(([name, cookie]) => [name, cookie.value])
    )
  })
}