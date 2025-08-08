import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const cfAccessJwt = req.headers.get("cf-access-jwt-assertion")
  const cfAuthorizationCookie = req.cookies.get("CF_Authorization")
  const editCookie = req.cookies.get("edit")?.value

  return NextResponse.json({
    hasCfAccessJwtHeader: !!cfAccessJwt,
    hasCfAuthorizationCookie: !!cfAuthorizationCookie,
    hasEditCookie: editCookie === "1",
    // For debugging, you might want to return the values, but be careful with sensitive data
    // cfAccessJwt: cfAccessJwt,
    // cfAuthorizationCookie: cfAuthorizationCookie?.value,
    // editCookieValue: editCookie,
  })
}
