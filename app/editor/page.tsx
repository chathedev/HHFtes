import { cookies, draftMode } from "next/headers"
import { verifyCloudflareAccess } from "@/lib/security/verify-cloudflare-access"
import { redirect } from "next/navigation"

export default async function EditorPage() {
  const token = cookies().get("CF_Authorization")?.value || headers().get("cf-access-jwt-assertion")

  if (!token || !(await verifyCloudflareAccess(token))) {
    // Redirect to login or show an error if not authorized
    redirect("/login?error=unauthorized")
  }

  // Set the "edit" cookie for the entire domain, including subdomains
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
