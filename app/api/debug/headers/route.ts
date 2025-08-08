import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  return new NextResponse(
    JSON.stringify(
      {
        hasHeader: !!req.headers.get("cf-access-jwt-assertion"),
        hasCookie: /CF_Authorization=/.test(req.headers.get("cookie") || ""),
        allHeaders: Object.fromEntries(req.headers.entries()),
      },
      null,
      2
    ),
    { headers: { "content-type": "application/json" } }
  )
}
