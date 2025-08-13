import { type NextRequest, NextResponse } from "next/server"
import { loadContent, saveContent } from "@/lib/content-loader"

export async function GET(request: NextRequest, { params }: { params: { filename: string } }) {
  try {
    const filename = params.filename
    if (!filename.endsWith(".json")) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    const content = await loadContent(filename)
    return NextResponse.json(content)
  } catch (error) {
    console.error("Error loading content:", error)
    return NextResponse.json({ error: "Failed to load content" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { filename: string } }) {
  try {
    const filename = params.filename
    if (!filename.endsWith(".json")) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    const content = await request.json()
    const success = await saveContent(filename, content)

    if (success) {
      return NextResponse.json({ message: "Content saved successfully" })
    } else {
      return NextResponse.json({ error: "Failed to save content" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error saving content:", error)
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 })
  }
}
