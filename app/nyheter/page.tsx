import { defaultContent } from "@/lib/default-content"
import NewsCard from "@/components/news-card" // Ensure this import is correct

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "https://api.nuredo.se"

interface NewsItem {
  id: string
  title: string
  date: string
  imageUrl: string
  link: string
  description: string
}

async function getNewsContent(): Promise<NewsItem[]> {
  try {
    const res = await fetch(`${BACKEND_API_URL}/api/news`, { cache: "no-store" })
    if (!res.ok) {
      console.error(`Failed to fetch news from backend: ${res.statusText}`)
      return defaultContent.news // Fallback to default news if fetch fails
    }
    const data = (await res.json()) as NewsItem[]
    return data
  } catch (err) {
    console.error("Error fetching news content:", err)
    return defaultContent.news // Fallback to default news on error
  }
}

export default async function NewsPage() {
  const news = await getNewsContent()

  return (
    <div className="min-h-screen bg-gray-100 py-12 pt-24">
      {" "}
      {/* Added pt-24 to push content below fixed header */}
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Senaste Nyheterna</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {news.map((item) => (
            <NewsCard
              key={item.id}
              title={item.title}
              date={item.date}
              imageUrl={item.imageUrl}
              link={item.link}
              description={item.description}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
