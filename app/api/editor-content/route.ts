import { NextResponse } from "next/server"
import type { PageContent } from "@/lib/content-store"

// In-memory store for content (for demo purposes)
let savedContent: PageContent | null = null

export async function POST(request: Request) {
  try {
    const content = await request.json()

    // In a real app, this would save to a database
    // For now, we'll just store it in memory
    savedContent = content

    return NextResponse.json({ success: true, message: "Content saved successfully" })
  } catch (error) {
    console.error("Error saving content:", error)
    return NextResponse.json({ success: false, message: "Failed to save content" }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Return the saved content or null if none exists
    return NextResponse.json(savedContent)
  } catch (error) {
    console.error("Error fetching saved content:", error)
    return NextResponse.json({ message: "Failed to fetch saved content" }, { status: 500 })
  }
}
