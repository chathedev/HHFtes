import 'server-only'

import { NextRequest, NextResponse } from 'next/server'
import { cookies, headers } from 'next/headers'
import { z } from 'zod'
import { verifyCloudflareAccess } from '@/lib/security/verify-cloudflare-access'
import { openPullRequestWithChanges } from '@/lib/git/commit-changes'

// simple in-memory rate limit: 10/min/IP (best-effort)
const bucket = new Map<string, { count: number; ts: number }>()

const BodySchema = z.object({
  changes: z
    .array(
      z.object({
        filePath: z
          .string()
          .refine((p) => p.startsWith('content/'), 'filePath must start with content/')
          .refine((p) => !p.includes('..'), 'No directory traversal'),
        content: z.string(),
      })
    )
    .min(1)
    .max(50),
})

export async function POST(req: NextRequest) {
  // size guard ~1MB
  const contentLength = Number(req.headers.get('content-length') || '0')
  if (contentLength > 1_000_000) {
    return NextResponse.json({ error: 'Payload too large' }, { status: 413 })
  }

  // rate limit
  const ip =
    req.ip ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  const now = Date.now()
  const b = bucket.get(ip) || { count: 0, ts: now }
  if (now - b.ts > 60_000) {
    b.count = 0
    b.ts = now
  }
  b.count++
  bucket.set(ip, b)
  if (b.count > 10) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }

  // security checks
  const token = (await headers()).get('CF-Access-Jwt-Assertion') || ''
  const cookieJar = await cookies()
  const hasEditCookie = cookieJar.get('edit')?.value === '1'
  const valid = hasEditCookie && (await verifyCloudflareAccess(token).catch(() => false))
  if (!valid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const json = await req.json().catch(() => null)
  const parsed = BodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  try {
    const prUrl = await openPullRequestWithChanges(parsed.data.changes)
    return NextResponse.json({ ok: true, url: prUrl })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Commit failed' }, { status: 500 })
  }
}
