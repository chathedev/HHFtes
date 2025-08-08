import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const headers = req.headers
  const cookieHeader = headers.get("cookie") || ""

  return new NextResponse(
    JSON.stringify(
      {
        hasHeader: !!headers.get("cf-access-jwt-assertion"),
        hasCookie: /CF_Authorization=/.test(cookieHeader),
        allHeaders: Object.fromEntries(headers.entries()), // For full debugging
        allCookies: cookieHeader, // For full debugging
      },
      null,
      2
    ),
    {
      headers: { "content-type": "application/json" },
    }
  )
}
