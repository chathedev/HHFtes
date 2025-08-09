"use server"

import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

/**
 * POST /api/auth/login
 * Body: { password: string }
 * Sets a signed cookie if the password matches the env var.
 */
export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()

    // This environment variable should be set in your Vercel project settings
    // or .env.local for local development.
    const envPass = process.env.EDITOR_PASSWORD

    if (!password || password !== envPass) {
      return NextResponse.json({ success: false, error: "Invalid credentials." }, { status: 401 })
    }

    cookies().set({
      name: "editor-auth",
      value: "true",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 8, // 8 hours
      path: "/",
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json({ success: false, error: "An unexpected error occurred." }, { status: 500 })
  }
}
