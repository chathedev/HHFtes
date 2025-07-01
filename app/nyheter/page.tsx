import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface NewsArticle {
  id: string
  title: string
  date: string
  summary: string
  imageUrl: string
}

async function getNewsArticles(): Promise<NewsArticle[]> {
  // In a real application, you would fetch this from a database or API
  // For this example, we'll use a static array
  const response = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/news`, {
    next: { revalidate: 3600 }, // Revalidate every hour
  })
  if (!response.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch news articles")
  }
  return response.json()
}

export default async function NyheterPage() {
  const newsArticles = await getNewsArticles()

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Senaste Nyheterna</h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {newsArticles.map((article) => (
          <Card key={article.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="relative w-full h-48">
              <Image
                src={article.imageUrl || "/placeholder.svg"}
                alt={article.title}
                layout="fill"
                objectFit="cover"
                className="rounded-t-lg"
              />
            </div>
            <CardHeader className="p-4">
              <CardTitle className="text-2xl font-semibold text-gray-800">{article.title}</CardTitle>
              <CardDescription className="text-gray-600">{article.date}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-gray-700">
              <p className="mb-4">{article.summary}</p>
              <Link href={`/nyheter/${article.id}`} className="text-orange-500 hover:underline font-medium">
                Läs mer
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
