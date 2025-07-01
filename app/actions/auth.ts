"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const AUTH_COOKIE_NAME = "hhf_auth_session"

export async function login(formData: FormData) {
  const password = formData.get("password")

  // In a real application, you would hash the password and compare it securely.
  // For this demo, we're directly comparing against API_SECRET.
  if (password === process.env.API_SECRET) {
    // Set a simple session cookie. For production, use a more robust session management.
    cookies().set(AUTH_COOKIE_NAME, "authenticated", {
      httpOnly: true, // Important for security
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    })
    redirect("/editor")
  } else {
    return { success: false, message: "Felaktigt lösenord." }
  }
}

export async function logout() {
  cookies().delete(AUTH_COOKIE_NAME)
  redirect("/login")
}

export async function isAuthenticatedServer(): Promise<boolean> {
  return cookies().get(AUTH_COOKIE_NAME)?.value === "authenticated"
}
