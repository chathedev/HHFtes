import { NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import path from "path"

export async function POST(req: NextRequest) {
  // This route is protected by middleware.ts.
  // The middleware should have already verified the Cloudflare Access token
  // and set the 'edit=1' cookie. We can check for this cookie as an extra layer.
  const editCookie = req.cookies.get("edit")?.value

  if (editCookie !== "1") {
    return NextResponse.json({ message: "Unauthorized: Missing or invalid edit cookie" }, { status: 401 })
  }

  try {
    const data = await req.json()
    const filePath = path.join(process.cwd(), "content", "home.json")

    // IMPORTANT: Writing to the file system directly in a Vercel deployment
    // is generally not recommended for persistent storage, as the file system
    // is ephemeral and changes will be lost on subsequent deployments or restarts.
    // This approach is primarily suitable for local development or specific
    // build-time content generation. For production, consider a database
    // (e.g., Vercel Postgres, Supabase) or Vercel Blob Storage.
    await writeFile(filePath, JSON.stringify(data, null, 2))

    return NextResponse.json({ message: "Content saved successfully!" }, { status: 200 })
  } catch (error: any) {
    console.error("Error saving content:", error)
    return NextResponse.json({ message: "Failed to save content", error: error.message }, { status: 500 })
  }
}
