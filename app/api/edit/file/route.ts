// Read-only file fetcher for editor preview.
// Requires valid Cloudflare Access (middleware enforces), and only serves files under /content.
import { NextRequest, NextResponse } from "next/server"
import { verifyCloudflareAccess } from "@/lib/security/verify-cloudflare-access"
import { headers } from "next/headers"
import fs from "node:fs/promises"
import path from "node:path"

export async function GET(req: NextRequest) {
  // Defense-in-depth: also verify header here (middleware already enforces).
  const token = (await headers()).get("CF-Access-Jwt-Assertion") || ""
  const ok = await verifyCloudflareAccess(token).catch(() => false)
  if (!ok) return new NextResponse("Unauthorized", { status: 401 })

  const { searchParams } = new URL(req.url)
  const filePath = searchParams.get("filePath") || ""
  if (!filePath.startsWith("content/") || filePath.includes("..")) {
    return new NextResponse("Invalid path", { status: 400 })
  }

  const root = process.cwd()
  const abs = path.join(root, filePath)
  const normalized = path.normalize(abs)
  const contentRoot = path.join(root, "content")
  if (!normalized.startsWith(contentRoot)) {
    return new NextResponse("Invalid path", { status: 400 })
  }

  try {
    const data = await fs.readFile(normalized, "utf8")
    return NextResponse.json({ content: data })
  } catch {
    return new NextResponse("Not found", { status: 404 })
  }
}
