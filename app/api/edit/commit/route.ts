import { NextRequest, NextResponse } from "next/server"
import { cookies, headers } from "next/headers"
import { z } from "zod"
import { verifyCloudflareAccess } from "@/lib/security/verify-cloudflare-access"
import { openPullRequestWithChanges } from "@/lib/git/commit-changes"

// Simple in-memory rate limit: 10/min per IP
const WINDOW = 60_000
const LIMIT = 10
const bucket = new Map<string, number[]>()

function rateLimited(ip: string) {
  const now = Date.now()
  const arr = (bucket.get(ip) || []).filter((t) => now - t < WINDOW)
  arr.push(now)
  bucket.set(ip, arr)
  return arr.length > LIMIT
}

const Body = z.object({
  changes: z
    .array(
      z.object({
        filePath: z
          .string()
          .min(1)
          .refine((p) => p.startsWith("content/"), "filePath must be under content/")
          .refine((p) => !p.includes(".."), "Path traversal blocked"),
        content: z.string(),
      })
    )
    .min(1)
    .max(50),
})

export async function POST(req: NextRequest) {
  const contentLength = Number(req.headers.get("content-length") || "0")
  if (contentLength > 1_000_000) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 })
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })
  }

  const hdrs = await headers()
  const token = hdrs.get("CF-Access-Jwt-Assertion") || ""
  const jar = await cookies()
  const hasEdit = jar.get("edit")?.value === "1"
  const ok = hasEdit && (await verifyCloudflareAccess(token).catch(() => false))
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
  const parse = Body.safeParse(body)
  if (!parse.success) {
    return NextResponse.json({ error: parse.error.flatten() }, { status: 400 })
  }

  try {
    const prUrl = await openPullRequestWithChanges(parse.data.changes)
    return NextResponse.json({ ok: true, url: prUrl })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Commit failed" }, { status: 500 })
  }
}
