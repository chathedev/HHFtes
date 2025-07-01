import { NextResponse } from "next/server"
import { defaultContent } from "@/lib/content-store"

export async function GET() {
  try {
    // In a real application, you might fetch this from a database or CMS
    // For now, we return the default content
    return NextResponse.json(defaultContent)
  } catch (error) {
    console.error("Error fetching content:", error)
    return NextResponse.json({ message: "Failed to fetch content", error: (error as Error).message }, { status: 500 })
  }
}
