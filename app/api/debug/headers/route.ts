import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const headers = req.headers
  const cookieHeader = headers.get("cookie") || ""

  return new NextResponse(
    JSON.stringify({
      hasHeader: !!headers.get("cf-access-jwt-assertion"),
      hasCookie: /CF_Authorization=/.test(cookieHeader),
    }),
    { headers: { "content-type": "application/json" } }
  )
}
