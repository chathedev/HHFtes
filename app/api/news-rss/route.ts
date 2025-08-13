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
    let cleanText = html

    console.log("=== HTML CLEANING DEBUG ===")
    console.log("Raw HTML:", html.substring(0, 200) + "...")

    // First, handle CDATA sections
    cleanText = cleanText.replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1")
    console.log("After CDATA removal:", cleanText.substring(0, 200) + "...")

    // Remove all HTML tags more aggressively
    cleanText = cleanText.replace(/<\/?[^>]+(>|$)/g, "")
    console.log("After tag removal:", cleanText.substring(0, 200) + "...")

    // Handle self-closing tags specifically
    cleanText = cleanText.replace(/<[^>]*\/>/g, "")

    // Remove any remaining < or > characters that might be malformed HTML
    cleanText = cleanText.replace(/</g, "").replace(/>/g, "")

    // Decode HTML entities
    cleanText = cleanText
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&#x27;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&hellip;/g, "...")
      .replace(/&mdash;/g, "—")
      .replace(/&ndash;/g, "–")
      .replace(/&rsquo;/g, "'")
      .replace(/&lsquo;/g, "'")
      .replace(/&rdquo;/g, '"')
      .replace(/&ldquo;/g, '"')

    // Clean up whitespace and line breaks
    cleanText = cleanText.replace(/\s+/g, " ").replace(/\n+/g, " ").replace(/\r+/g, " ").replace(/\t+/g, " ").trim()

    console.log("Final cleaned text:", cleanText.substring(0, 200) + "...")
    console.log("=== END DEBUG ===")

    return cleanText
  } catch (error) {
    console.error("Error cleaning HTML content:", error)
    // Fallback: very aggressive cleaning
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/</g, "")
      .replace(/>/g, "")
      .replace(/&[^;]+;/g, " ")
      .replace(/\s+/g, " ")
      .trim()
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
