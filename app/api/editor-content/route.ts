import { saveContent } from "@/lib/content-store"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const newContent = await req.json()
    const result = await saveContent(newContent)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error saving content:", error)
    return NextResponse.json({ success: false, message: "Failed to save content" }, { status: 500 })
  }
}
