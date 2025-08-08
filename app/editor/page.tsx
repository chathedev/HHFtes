import { cookies, draftMode } from "next/headers"
import { verifyCloudflareAccess } from "@/lib/security/verify-cloudflare-access"
import { redirect } from "next/navigation"

export default async function EditorPage() {
  let token: string | undefined

  // Try to get token from header (lowercase)
  token = cookies().get("cf-access-jwt-assertion")?.value

  // If not in header, try to get from cookie
  if (!token) {
    token = cookies().get("CF_Authorization")?.value
  }

  if (!token) {
    // If no token, redirect to login or show unauthorized message
    redirect("/login?error=no_token")
  }

  const isTokenValid = await verifyCloudflareAccess(token)

  if (!isTokenValid) {
    // If token is invalid, redirect to login or show unauthorized message
    redirect("/login?error=invalid_token")
  }

  // If token is valid, enable draft mode and set the edit cookie
  cookies().set({
    name: "edit",
    value: "1",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    domain: ".harnosandshf.se", // Set domain for cross-subdomain access
    maxAge: 3600, // 1 hour
  })
  draftMode().enable()

  return <p>Edit mode enabled. You can close this tab.</p>
}
