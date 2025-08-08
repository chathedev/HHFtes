import { NextResponse, type NextRequest } from "next/server"
import { headers } from "next/headers"
import { verifyCloudflareAccess } from "@/lib/security/verify-cloudflare-access"
import { promises as fs } from "node:fs"
import path from "node:path"

export async function GET(req: NextRequest) {
  const hdrs = await headers()
  const cfJwt = hdrs.get("CF-Access-Jwt-Assertion") || ""
  const ok = await verifyCloudflareAccess(cfJwt)
  if (!ok) return new NextResponse("Unauthorized", { status: 401 })

  const { searchParams } = new URL(req.url)
  const filePath = searchParams.get("filePath") || ""
  if (!filePath.startsWith("content/") || filePath.includes("..")) {
    return new NextResponse("Invalid filePath", { status: 400 })
  }

  const abs = path.join(process.cwd(), filePath)
  try {
    const content = await fs.readFile(abs, "utf8")
    return NextResponse.json({ content })
  } catch (err) {
    return new NextResponse("Not found", { status: 404 })
  }
}
