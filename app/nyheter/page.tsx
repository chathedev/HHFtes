"use client"

import Link from "next/link"
import { ChevronLeft, CalendarDays, LinkIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { useState } from "react" // Keep useState for client-side interactivity if needed

interface NewsItem {
  title: string
  link: string
  pubDate: string
  description: string
  imageUrl?: string // Optional image URL
}

// Client component to render news
function NewsDisplay({ initialNews }: { initialNews: NewsItem[] }) {
  const [news, setNews] = useState<NewsItem[]>(initialNews) // Initialize with server-fetched data

  // No need for useEffect to fetch data here anymore

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

        {news.length === 0 && <p className="text-center text-gray-600">Inga nyheter att visa just nu.</p>}

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

// Main Server Component for the page
export default async function NyheterPageWrapper() {
  const initialNews = await getNewsItems()
  return <NewsDisplay initialNews={initialNews} />
}

// Server-side data fetching function
async function getNewsItems(): Promise<NewsItem[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000"}/api/news`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: NewsItem[] = await response.json()
    return data
  } catch (e: any) {
    console.error("Server-side fetch error for news:", e)
    return [] // Return empty array on error
  }
}
