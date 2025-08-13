import { NextResponse } from "next/server"

interface NewsItem {
  guid: string
  title: string
  link: string
  description: string
  cleanDescription: string
  pubDate: string
  image?: string
}

function cleanHtmlContent(html: string): string {
  try {
    const cleanText = html
      // Remove all HTML tags
      .replace(/<[^>]*>/g, "")
      // Decode HTML entities
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&#x27;/g, "'")
      .replace(/&apos;/g, "'")
      // Clean up whitespace
      .replace(/\s+/g, " ")
      .replace(/\n+/g, " ")
      .trim()

    return cleanText
  } catch (error) {
    console.error("Error cleaning HTML content:", error)
    return html.replace(/<[^>]*>/g, "").trim()
  }
}

function parseRSSFeed(xmlText: string): NewsItem[] {
  const items: NewsItem[] = []

  // Extract all <item> blocks from the RSS feed
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi
  let itemMatch

  while ((itemMatch = itemRegex.exec(xmlText)) !== null) {
    const itemContent = itemMatch[1]

    // Extract individual fields from each item
    const titleMatch =
      itemContent.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/i) || itemContent.match(/<title>(.*?)<\/title>/i)
    const linkMatch = itemContent.match(/<link>(.*?)<\/link>/i)
    const descriptionMatch =
      itemContent.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/i) ||
      itemContent.match(/<description>([\s\S]*?)<\/description>/i)
    const pubDateMatch = itemContent.match(/<pubDate>(.*?)<\/pubDate>/i)
    const guidMatch = itemContent.match(/<guid.*?>(.*?)<\/guid>/i)

    // Extract image from description if present
    const imageMatch = descriptionMatch?.[1]?.match(/<img[^>]+src="([^"]+)"/i)

    if (titleMatch && linkMatch && descriptionMatch && pubDateMatch) {
      const rawDescription = descriptionMatch[1].trim()
      const cleanDescription = cleanHtmlContent(rawDescription)

      items.push({
        guid: guidMatch?.[1] || `${Date.now()}-${Math.random()}`,
        title: titleMatch[1].trim(),
        link: linkMatch[1].trim(),
        description: rawDescription,
        cleanDescription: cleanDescription,
        pubDate: pubDateMatch[1].trim(),
        image: imageMatch?.[1],
      })
    }
  }

  return items
}

export async function GET() {
  try {
    const response = await fetch("https://www.laget.se/HarnosandsHF/Home/NewsRss", {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; HHF/1.0)",
        Accept: "application/rss+xml, application/xml, text/xml",
      },
      next: { revalidate: 1800 }, // Revalidate every 30 minutes
    })

    if (!response.ok) {
      console.error(`Failed to fetch RSS feed: ${response.statusText}`)
      return NextResponse.json({ error: "Failed to fetch RSS feed" }, { status: 500 })
    }

    const xmlText = await response.text()
    const newsItems = parseRSSFeed(xmlText)

    // Sort by publication date (newest first)
    newsItems.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())

    return NextResponse.json(newsItems)
  } catch (error) {
    console.error("Error fetching RSS feed:", error)
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
  }
}
