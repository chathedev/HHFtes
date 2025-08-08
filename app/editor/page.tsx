import { cookies, draftMode, headers } from "next/headers"
import { verifyCloudflareAccess } from "@/lib/security/verify-cloudflare-access"
import { redirect } from "next/navigation"

export default async function EditorPage() {
  const cfAccessJwtAssertion = headers().get("cf-access-jwt-assertion")
  const cfAuthorizationCookie = cookies().get("CF_Authorization")?.value

  let token: string | undefined

  if (cfAccessJwtAssertion) {
    token = cfAccessJwtAssertion
  } else if (cfAuthorizationCookie) {
    token = cfAuthorizationCookie
  }

  if (!token) {
    redirect("/login?error=no_cf_token")
  }

  const isValid = await verifyCloudflareAccess(token)

  if (!isValid) {
    redirect("/login?error=invalid_cf_token")
  }

  // If verification is successful, enable draft mode and set the edit cookie
  draftMode().enable()
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

  return <p>Edit mode enabled. You can close this tab.</p>
}
