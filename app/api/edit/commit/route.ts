import { NextResponse, type NextRequest } from "next/server"
import { z } from "zod"
import { cookies, headers } from "next/headers"
import { verifyCloudflareAccess } from "@/lib/security/verify-cloudflare-access"
import { commitChanges } from "@/lib/git/commit-changes"

const bodySchema = z.object({
  changes: z
    .array(
      z.object({
        filePath: z
          .string()
          .min(1)
          .refine((p) => p.startsWith("content/"), "filePath must be under content/")
          .refine((p) => !p.includes(".."), "Path traversal not allowed"),
        content: z.string(),
      })
    )
    .min(1),
})

/**
 * Very simple in-memory rate limit: 10/min per IP.
 * Note: Not shared across serverless instances.
 */
const WINDOW_MS = 60_000
const LIMIT = 10
const bucket = new Map<string, number[]>()

function rateLimited(ip: string) {
  const now = Date.now()
  const arr = bucket.get(ip) ?? []
  const fresh = arr.filter((t) => now - t < WINDOW_MS)
  fresh.push(now)
  bucket.set(ip, fresh)
  return fresh.length > LIMIT
}

export async function POST(req: NextRequest) {
  const hdrs = await headers()
  const cfJwt = hdrs.get("CF-Access-Jwt-Assertion") || ""
  const ok = await verifyCloudflareAccess(cfJwt)
  if (!ok) return new NextResponse("Unauthorized", { status: 401 })

  const cookieStore = await cookies()
  const hasEditCookie = cookieStore.get("edit")?.value === "1"
  if (!hasEditCookie) return new NextResponse("Edit mode cookie missing", { status: 401 })

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    (req as any).ip ||
    "unknown"

  if (rateLimited(ip)) {
    return new NextResponse("Rate limit exceeded", { status: 429 })
  }

  // Size guard (1MB)
  const raw = await req.text()
  if (new TextEncoder().encode(raw).length > 1_000_000) {
    return new NextResponse("Payload too large", { status: 413 })
  }

  let parsed
  try {
    parsed = bodySchema.parse(JSON.parse(raw))
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Invalid body" }, { status: 400 })
  }

  try {
    const prUrl = await commitChanges(parsed.changes)
    return NextResponse.json({ ok: true, prUrl })
  } catch (err: any) {
    console.error("Commit error:", err)
    return NextResponse.json({ error: err?.message ?? "Failed to commit" }, { status: 500 })
  }
}
