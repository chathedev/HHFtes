import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays } from "lucide-react"

interface NewsArticle {
  id: string
  date: string
  title: string
  summary: string
  imageUrl: string
  link: string
}

async function getNews(): Promise<NewsArticle[]> {
  // In a real application, this would fetch from a database or external API
  // For now, we'll use a mock API route
  const res = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/news`, {
    next: { revalidate: 3600 }, // Revalidate every hour
  })
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch news")
  }
  return res.json()
}

export default async function NyheterPage() {
  const newsArticles = await getNews()

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-4xl font-bold text-center text-green-700 mb-8">Nyheter</h1>

      {newsArticles.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">Inga nyheter att visa just nu.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {newsArticles.map((article) => (
            <Card key={article.id} className="shadow-md hover:shadow-lg transition-shadow flex flex-col">
              <div className="relative w-full h-48">
                <Image
                  src={article.imageUrl || "/placeholder.svg"}
                  alt={article.title}
                  fill
                  className="object-cover rounded-t-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <CardHeader className="flex-grow">
                <CardTitle className="text-green-600 text-xl">{article.title}</CardTitle>
                <CardDescription className="flex items-center gap-1 text-sm text-gray-500">
                  <CalendarDays className="w-4 h-4" />
                  {new Date(article.date).toLocaleDateString("sv-SE", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col justify-between">
                <p className="text-gray-700 mb-4">{article.summary}</p>
                <Link
                  href={article.link}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-orange-500 text-white hover:bg-orange-600 h-10 px-4 py-2 self-start"
                >
                  Läs mer
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
