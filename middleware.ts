import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/editor")) {
    const isAuthed = request.cookies.get("editor-auth")?.value === "true"
    if (!isAuthed) {
      const login = new URL("/login", request.url)
      login.searchParams.set("redirect", request.nextUrl.pathname)
      return NextResponse.redirect(login)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/editor/:path*"],
}
