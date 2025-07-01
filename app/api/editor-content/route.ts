import { NextResponse } from "next/server"
import { saveContent } from "@/lib/content-store"

export async function POST(req: Request) {
  try {
    const content = await req.json()
    // In a real application, you would save this to a database or CMS
    // For this demo, we'll simulate saving
    saveContent(content) // This will update the in-memory content
    return NextResponse.json({ success: true, message: "Content saved successfully!" })
  } catch (error) {
    console.error("Error saving content:", error)
    return NextResponse.json(
      { success: false, message: "Failed to save content", error: (error as Error).message },
      { status: 500 },
    )
  }
}
