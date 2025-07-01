import { NextResponse } from "next/server"
import type { PageContent } from "@/lib/content-store"

const BACKEND_API_URL = "https://api.nuredo.se/api/content"

/**
 * POST /​api/editor-content
 * Forward the incoming JSON to the real backend using our secret.
 */
export async function POST(request: Request) {
  try {
    const content = (await request.json()) as PageContent

    const upstream = await fetch(BACKEND_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // token lives only on the server – safe here
        Authorization: `Bearer ${process.env.API_SECRET ?? ""}`,
      },
      body: JSON.stringify(content),
      cache: "no-store",
    })

    if (upstream.ok) {
      return NextResponse.json({ success: true })
    }

    const data = await upstream.json().catch(() => ({}))
    return NextResponse.json(
      { success: false, message: data.message ?? upstream.statusText },
      { status: upstream.status },
    )
  } catch (err) {
    console.error("editor-content POST failed", err)
    return NextResponse.json({ success: false, message: "Server-fel" }, { status: 500 })
  }
}
