import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Ensure content directory exists
    const contentDir = join(process.cwd(), 'content')
    await mkdir(contentDir, { recursive: true })
    
    // Write updated JSON to content/home.json
    const filePath = join(contentDir, 'home.json')
    await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
    
    return NextResponse.json({ success: true, message: 'Content updated successfully' })
  } catch (error) {
    console.error('Error saving content:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to save content' },
      { status: 500 }
    )
  }
}