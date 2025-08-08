import { cookies, draftMode } from "next/headers"
import { verifyCloudflareAccess } from "@/lib/security/verify-cloudflare-access"
import { redirect } from "next/navigation"

export default async function EditorPage() {
  const tokenFromHeader = headers().get("cf-access-jwt-assertion")
  const tokenFromCookie = cookies().get("CF_Authorization")?.value

  const token = tokenFromHeader || tokenFromCookie

  if (!token) {
    redirect("/login?error=no_token")
  }

  const isValid = await verifyCloudflareAccess(token)

  if (!isValid) {
    redirect("/login?error=invalid_token")
  }

  // If verification is successful, set the 'edit' cookie and enable draft mode
  cookies().set({
    name: "edit",
    value: "1",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    domain: ".harnosandshf.se", // Set domain for apex and www
    maxAge: 3600, // 1 hour
  })
  draftMode().enable()

  return <p>Edit mode enabled. You can close this tab.</p>
}
