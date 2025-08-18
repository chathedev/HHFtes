import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch("https://api.harnosandshf.se/api/news?limit=20", {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; HHF/1.0)",
        Accept: "application/json",
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch news: ${response.statusText}`)
    }

    const newsData = await response.json()

    return NextResponse.json(newsData)
  } catch (error) {
    console.error("Error fetching news:", error)
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
  }
}
