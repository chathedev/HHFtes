import { parseStringPromise } from "xml2js"
import { format, parse } from "date-fns"
import { sv } from "date-fns/locale"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Utility function to strip HTML and format text
function stripHtmlAndFormat(html: string): string {
  let text = html.replace(/<[^>]*>/g, "") // Remove HTML tags
  text = text.replace(/&nbsp;/g, " ") // Replace non-breaking spaces
  text = text.replace(/&amp;/g, "&") // Replace ampersand entities
  text = text.replace(/&quot;/g, '"') // Replace quote entities
  text = text.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec)) // Decode HTML entities
  return text.trim()
}

const hardcodedRssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Härnösands HF - Nyheter</title>
    <link>https://www.laget.se/harnosandshf/News</link>
    <description>Senaste nyheterna från Härnösands HF</description>
    <language>sv-se</language>
    <lastBuildDate>Mon, 05 Aug 2024 10:00:00 GMT</lastBuildDate>
    <item>
      <title>Säsongen 2024/2025 drar igång!</title>
      <link>https://www.laget.se/harnosandshf/News/7890123/sasongen-2024-2025-drar-igang</link>
      <description>&lt;p&gt;Vi är glada att meddela att förberedelserna inför den nya säsongen är i full gång! Träningarna startar vecka 34 för de flesta lagen. Håll utkik på lagens sidor för exakta tider och platser.&lt;/p&gt;&lt;p&gt;&lt;img src="https://www.laget.se/harnosandshf/Image/2345678.jpg" alt="Handbollsträning" /&gt;&lt;/p&gt;</description>
      <pubDate>Mon, 05 Aug 2024 10:00:00 GMT</pubDate>
      <guid>https://www.laget.se/harnosandshf/News/7890123/sasongen-2024-2025-drar-igang</guid>
      <enclosure url="https://www.laget.se/harnosandshf/Image/2345678.jpg" type="image/jpeg" length="12345" />
    </item>
    <item>
      <title>Framgångar i sommarcupen!</title>
      <link>https://www.laget.se/harnosandshf/News/7890124/framgangar-i-sommarcupen</link>
      <description>&lt;p&gt;Vårt P16-lag visade storform i helgens sommarcup och tog hem en imponerande andraplats! Stort grattis till alla spelare och ledare för en fantastisk insats.&lt;/p&gt;&lt;p&gt;&lt;img src="https://www.laget.se/harnosandshf/Image/2345679.jpg" alt="P16-laget" /&gt;&lt;/p&gt;</description>
      <pubDate>Fri, 02 Aug 2024 14:30:00 GMT</pubDate>
      <guid>https://www.laget.se/harnosandshf/News/7890124/framgangar-i-sommarcupen</guid>
      <enclosure url="https://www.laget.se/harnosandshf/Image/2345679.jpg" type="image/jpeg" length="12345" />
    </item>
    <item>
      <title>Nya tränare klara för damlaget</title>
      <link>https://www.laget.se/harnosandshf/News/7890125/nya-tranare-klara-for-damlaget</link>
      <description>&lt;p&gt;Vi välkomnar två nya ansikten till tränarstaben för damlaget! Med deras erfarenhet och engagemang ser vi fram emot en spännande säsong.&lt;/p&gt;&lt;p&gt;&lt;img src="https://www.laget.se/harnosandshf/Image/2345680.jpg" alt="Nya tränare" /&gt;&lt;/p&gt;</description>
      <pubDate>Wed, 31 Jul 2024 09:00:00 GMT</pubDate>
      <guid>https://www.laget.se/harnosandshf/News/7890125/nya-tranare-klara-for-damlaget</guid>
      <enclosure url="https://www.laget.se/harnosandshf/Image/2345680.jpg" type="image/jpeg" length="12345" />
    </item>
    <item>
      <title>Anmälan till Handbollsskolan öppnar snart!</title>
      <link>https://www.laget.se/harnosandshf/News/7890126/anmalan-till-handbollsskolan-oppnar-snart</link>
      <description>&lt;p&gt;För alla unga handbollsentusiaster: anmälan till årets handbollsskola öppnar den 15 augusti! Mer information kommer på hemsidan.&lt;/p&gt;&lt;p&gt;&lt;img src="https://www.laget.se/harnosandshf/Image/2345681.jpg" alt="Handbollsskola" /&gt;&lt;/p&gt;</description>
      <pubDate>Mon, 29 Jul 2024 11:45:00 GMT</pubDate>
      <guid>https://www.laget.se/harnosandshf/News/7890126/anmalan-till-handbollsskolan-oppnar-snart</guid>
      <enclosure url="https://www.laget.se/harnosandshf/Image/2345681.jpg" type="image/jpeg" length="12345" />
    </item>
    <item>
      <title>Styrelsen informerar: Årsmöte 2024</title>
      <link>https://www.laget.se/harnosandshf/News/7890127/styrelsen-informerar-arsmote-2024</link>
      <description>&lt;p&gt;Kallelse till årsmöte för Härnösands HF kommer att skickas ut inom kort. Datum och plats meddelas via e-post och på hemsidan.&lt;/p&gt;&lt;p&gt;&lt;img src="https://www.laget.se/harnosandshf/Image/2345682.jpg" alt="Årsmöte" /&gt;&lt;/p&gt;</description>
      <pubDate>Fri, 26 Jul 2024 16:00:00 GMT</pubDate>
      <guid>https://www.laget.se/harnosandshf/News/7890127/styrelsen-informerar-arsmote-2024</guid>
      <enclosure url="https://www.laget.se/harnosandshf/Image/2345682.jpg" type="image/jpeg" length="12345" />
    </item>
  </channel>
</rss>`

interface NewsItem {
  title: string[]
  link: string[]
  description: string[]
  pubDate: string[]
  guid: string[]
  enclosure?: {
    $: {
      url: string
      type: string
      length: string
    }
  }[]
}

interface RssChannel {
  title: string[]
  link: string[]
  description: string[]
  language: string[]
  lastBuildDate: string[]
  item: NewsItem[]
}

interface RssFeed {
  rss: {
    channel: RssChannel[]
  }
}

export default async function NyheterPage() {
  let news: NewsItem[] = []
  let error: string | null = null

  try {
    const result: RssFeed = await parseStringPromise(hardcodedRssFeed)
    news = result.rss.channel[0].item
  } catch (e) {
    console.error("Failed to parse RSS feed:", e)
    error = "Kunde inte ladda nyheter. Försök igen senare."
  }

  return (
    <main className="flex-1 py-8 md:py-12 lg:py-16">
      <div className="container px-4 md:px-6">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">Senaste Nyheterna</h1>
        {error ? (
          <div className="text-center text-red-500 text-lg">{error}</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {news.map((item, index) => {
              const pubDate = parse(item.pubDate[0], "EEE, dd MMM yyyy HH:mm:ss 'GMT'", new Date(), { locale: sv })
              const formattedDate = format(pubDate, "d MMMM yyyy", { locale: sv })
              const descriptionText = stripHtmlAndFormat(item.description[0])
              const imageUrl =
                item.enclosure && item.enclosure[0] ? item.enclosure[0].$.url : "/placeholder.svg?height=400&width=600"

              return (
                <Card key={index} className="flex flex-col">
                  <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                    <Image
                      src={imageUrl || "/placeholder.svg"}
                      alt={item.title[0]}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold leading-tight">
                      <Link href={item.link[0]} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {item.title[0]}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                      {formattedDate}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">{descriptionText}</p>
                  </CardContent>
                  <div className="p-4 pt-0">
                    <Link
                      href={item.link[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-orange-600 hover:underline"
                    >
                      Läs mer
                    </Link>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
