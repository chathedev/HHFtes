import { NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'content', 'home.json')
    const fileContent = await readFile(filePath, 'utf-8')
    const data = JSON.parse(fileContent)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error loading content:', error)
    
    // Return default data if file doesn't exist
    const defaultData = {
      content: [],
      root: { props: { title: "Härnösands HF - Hem" } }
    }
    
    return NextResponse.json(defaultData)
  }
}