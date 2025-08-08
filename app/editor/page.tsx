import { cookies, draftMode, headers } from "next/headers"
import { verifyCloudflareAccess } from "@/lib/security/verify-cloudflare-access"

export const dynamic = "force-dynamic"

export default async function EditorPage() {
  const hdrs = await headers()
  const cfJwt = hdrs.get("CF-Access-Jwt-Assertion") || ""

  const ok = await verifyCloudflareAccess(cfJwt).catch(() => false)
  if (!ok) {
    return (
      <main className="min-h-[60vh] grid place-items-center p-8">
        <div className="max-w-lg text-center space-y-4">
          <h1 className="text-2xl font-semibold">401 – Åtkomst nekad</h1>
          <p className="text-muted-foreground">
            Cloudflare Access-token saknas eller är ogiltigt. Logga in via Cloudflare Access och försök igen.
          </p>
        </div>
      </main>
    )
  }

  // Enable preview for editors so changes are visible to them only.
  const draft = await draftMode()
  draft.enable()

  // Set HttpOnly cookie for 60 minutes.
  const jar = await cookies()
  jar.set({
    name: "edit",
    value: "1",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60,
    domain: ".harnosandshf.se", // Set domain for cross-subdomain access
  })

  return (
    <main className="min-h-[60vh] grid place-items-center p-8">
      <div className="max-w-lg text-center space-y-4">
        <h1 className="text-3xl font-bold">Redigeringsläge aktiverat</h1>
        <p className="text-muted-foreground">
          Du kan nu redigera innehåll på sajten. Stäng denna flik och använd “Edit”-knappen på valfri sida.
        </p>
        <a
          href="/"
          className="inline-flex items-center rounded-full bg-black text-white px-5 py-2 text-sm hover:opacity-90"
        >
          Gå till startsidan
        </a>
        <p className="text-xs text-muted-foreground">
          Läget varar i 60 minuter eller tills du tar bort kakan “edit”.
        </p>
      </div>
    </main>
  )
}
