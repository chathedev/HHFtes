import Link from "next/link"
import { ChevronLeft, CalendarDays, LinkIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

interface NewsItem {
  title: string
  link: string
  pubDate: string
  description: string
  imageUrl?: string // Optional image URL
}

// Make this a Server Component
export default async function NyheterPage() {
  const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "https://api.nuredo.se"
  let news: NewsItem[] = []
  let error: string | null = null

  try {
    const response = await fetch(`${BACKEND_API_URL}/api/news`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    news = await response.json()
  } catch (e: any) {
    error = e.message || "Failed to fetch news."
    console.error("Server-side fetch error for news:", e)
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 py-8 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <Link href="/" className="inline-flex items-center text-green-700 hover:underline mb-8">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Tillbaka till startsidan
        </Link>

        <h1 className="text-5xl font-bold text-green-700 mb-4 text-center">Nyheter</h1>
        <p className="text-xl text-gray-700 mb-12 text-center max-w-3xl mx-auto">
          Håll dig uppdaterad med de senaste nyheterna från Härnösands HF!
        </p>

        {error && <p className="text-center text-red-500">Fel: {error}</p>}

        {!error && news.length === 0 && <p className="text-center text-gray-600">Inga nyheter att visa just nu.</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item, index) => (
            <Card key={index} className="bg-white/80 shadow-lg rounded-lg flex flex-col">
              {item.imageUrl && (
                <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                  <Image
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.title}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 hover:scale-105"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800 mb-2">{item.title}</CardTitle>
                <div className="flex items-center text-sm text-gray-500">
                  <CalendarDays className="w-4 h-4 mr-1" />
                  <span>
                    {new Date(item.pubDate).toLocaleDateString("sv-SE", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between">
                <p className="text-gray-700 mb-4 line-clamp-3">{item.description}</p>
                <Link
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-orange-500 hover:underline font-medium mt-auto"
                >
                  Läs mer
                  <LinkIcon className="w-4 h-4 ml-2" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
