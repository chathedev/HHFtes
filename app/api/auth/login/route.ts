"use server"

import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

/**
 * POST /api/auth/login
 * Body: { username: string; password: string }
 * Sets a signed cookie if the credentials match the env vars.
 */
export async function POST(req: NextRequest) {
  const { username, password } = await req.json()

  const envUser = process.env.EDITOR_USERNAME
  const envPass = process.env.EDITOR_PASSWORD

  if (username === envUser && password === envPass) {
    cookies().set({
      name: "editor-auth",
      value: "true",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 8, // 8 h
      path: "/",
    })
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
}
