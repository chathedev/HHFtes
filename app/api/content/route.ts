import { getContent } from "@/lib/content-store"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const content = await getContent()
    return NextResponse.json(content)
  } catch (error) {
    console.error("Error fetching content:", error)
    return NextResponse.json({ message: "Failed to fetch content" }, { status: 500 })
  }
}
