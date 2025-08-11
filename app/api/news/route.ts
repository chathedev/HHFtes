import { NextResponse } from "next/server"
import { parseStringPromise } from "xml2js"

export async function GET() {
  try {
    const rssFeedUrl = "https://www.laget.se/HarnosandsHF/Home/NewsRss"
    const response = await fetch(rssFeedUrl, { next: { revalidate: 3600 } }) // Revalidate every hour

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.statusText}`)
    }

    const xmlText = await response.text()
    const result = await parseStringPromise(xmlText, { explicitArray: false, ignoreAttrs: false })

    const newsItems = result.rss.channel.item.map((item: any) => {
      // Clean description: replace <br> with newline, remove all other HTML tags,
      // and remove the "Publicerad" line.
      let description = item.description || ""
      description = description.replace(/<br\s*\/?>/gi, "\n") // Replace <br> with newline
      description = description.replace(/<[^>]*>/g, "") // Remove all other HTML tags
      description = description.replace(/Publicerad: \d{4}-\d{2}-\d{2} \d{2}:\d{2}/, "").trim() // Remove "Publicerad" line

      const imageUrl = item.enclosure?.$?.url || null

      return {
        title: item.title || "No title",
        link: item.link || "#",
        pubDate: item.pubDate || new Date().toUTCString(), // Fallback to current date if missing
        description: description,
        imageUrl: imageUrl,
      }
    })

    return NextResponse.json(newsItems)
  } catch (error: any) {
    console.error("Error fetching or parsing news feed:", error)
    return NextResponse.json({ error: "Failed to fetch news", details: error.message }, { status: 500 })
  }
}
