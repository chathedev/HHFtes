"use client"

import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

function formatDate(dateStr?: string) {
  try {
    if (!dateStr) return ""
    const d = new Date(dateStr)
    if (Number.isNaN(d.getTime())) return dateStr
    return new Intl.DateTimeFormat("sv-SE", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d)
  } catch {
    return dateStr ?? ""
  }
}

interface NewsItem {
  guid: string
  title: string
  link: string
  description: string
  cleanDescription: string // Added cleanDescription field
  pubDate: string
  image?: string
}

export default function NyheterPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch("/api/news-rss")
        if (!response.ok) {
          throw new Error("Failed to fetch news")
        }
        const newsData = await response.json()
        setNews(newsData)
      } catch (err) {
        console.error("Error fetching news:", err)
        setError("Kunde inte ladda nyheter. Försök igen senare.")
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  const filteredNews = news.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cleanDescription.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <div className="h-24"></div> {/* Spacer for fixed header */}
        <div className="container px-4 md:px-6 py-8 md:py-12 lg:py-16">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-green-700">
            Senaste Nyheterna
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Här hittar du de senaste nyheterna och uppdateringarna från Härnösands HF.
          </p>

          <div className="flex justify-center mb-8">
            <div className="relative w-full max-w-md">
              <Input
                type="text"
                placeholder="Sök nyheter..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {loading && (
            <div className="text-center py-8">
              <p className="text-gray-600">Laddar nyheter...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map((item) => (
                <li
                  key={item.guid}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {item.image && (
                    <div className="relative overflow-hidden">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        width={600}
                        height={300}
                        className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                        loading="lazy" // Added lazy loading for news images
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold leading-tight text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                    {item.pubDate && (
                      <p className="text-sm text-green-600 font-medium mb-3">{formatDate(item.pubDate)}</p>
                    )}
                    <p className="text-gray-700 mb-4 line-clamp-3">{item.cleanDescription}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <Button
                        asChild
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
                      >
                        <Link href={item.link} target="_blank" rel="noopener noreferrer">
                          Läs mer
                        </Link>
                      </Button>
                      <span className="text-xs text-gray-400">Extern länk</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {!loading && !error && filteredNews.length === 0 && searchTerm && (
            <div className="text-center py-8">
              <p className="text-gray-600">Inga nyheter hittades för "{searchTerm}"</p>
            </div>
          )}

          <section className="mt-16">
            <div className="bg-white shadow-lg rounded-lg p-8 md:p-12 max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">Vanliga frågor om att börja träna</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-lg font-semibold text-gray-800 hover:no-underline">
                    Hur börjar jag spela handboll i Härnösands HF?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 text-base">
                    Det enklaste sättet att börja är att kontakta oss! Vi hjälper dig att hitta rätt lag baserat på din
                    ålder och erfarenhet. Du kan fylla i vårt kontaktformulär eller skicka ett mejl direkt till oss.
                    <Link href="/kontakt" className="text-orange-500 hover:underline ml-2">
                      Kontakta oss här.
                    </Link>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-lg font-semibold text-gray-800 hover:no-underline">
                    Vilken utrustning behöver jag?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 text-base">
                    Till en början behöver du bara bekväma träningskläder, inomhusskor och en vattenflaska. Handbollar
                    finns att låna under träningarna. När du väl bestämmer dig för att fortsätta kan du behöva
                    klubbkläder.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-lg font-semibold text-gray-800 hover:no-underline">
                    Finns det provträningar?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 text-base">
                    Absolut! Vi erbjuder alltid några kostnadsfria provträningar så att du kan känna efter om handboll
                    är något för dig. Detta ger dig en chans att träffa laget och tränarna innan du bestämmer dig.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-lg font-semibold text-gray-800 hover:no-underline">
                    Hur anmäler jag mig?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 text-base">
                    Efter dina provträningar får du information om hur du enkelt anmäler dig och blir en fullvärdig
                    medlem i Härnösands HF. Vi ser fram emot att välkomna dig till vår handbollsfamilj!
                    <Link href="/kontakt" className="text-orange-500 hover:underline ml-2">
                      Anmäl dig via kontaktformuläret.
                    </Link>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <div className="text-center mt-8">
                <Button
                  asChild
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-md text-lg font-semibold transition-colors"
                >
                  <Link href="/kontakt">Kontakta oss för mer information</Link>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
