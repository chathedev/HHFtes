import { NextResponse } from "next/server"
import { defaultContent } from "@/lib/content-store"

export async function GET() {
  try {
    // In a real app, this would fetch from a database or external API
    // For now, we'll return the default content
    return NextResponse.json(defaultContent)
  } catch (error) {
    console.error("Error fetching content:", error)
    return NextResponse.json({ message: "Failed to fetch content" }, { status: 500 })
  }
}
