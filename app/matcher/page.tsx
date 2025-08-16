"use client"

import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { CalendarDays, Clock } from "lucide-react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"

interface Match {
  id: string
  title: string
  date: string
  time: string
  opponent: string
  location: string
  isHome: boolean
  eventType: string
}

interface GroupedMatches {
  [monthYear: string]: Match[]
}

type FilterType = "all" | "home" | "away"

export default function MatcherPage() {
  const [content, setContent] = useState<any>(null)
  const [contentLoading, setContentLoading] = useState(true)
  const [allMatches, setAllMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterType>("all")

  // Load static content from JSON
  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch("/content/matcher.json")
        if (response.ok) {
          const data = await response.json()
          setContent(data)
        } else {
          setContent(getDefaultContent())
        }
      } catch (error) {
        console.error("Failed to load content:", error)
        setContent(getDefaultContent())
      } finally {
        setContentLoading(false)
      }
    }

    loadContent()
  }, [])

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log("[v0] Fetching matches from API...")

        const response = await fetch("https://api.harnosandshf.se/api/events?days=365&limit=500", {
          method: "GET",
          mode: "cors",
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
            Accept: "application/json",
          },
        })

        console.log("[v0] Response status:", response.status, "ok:", response.ok)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log("[v0] API response data:", data)

        const events = data.events || []
        console.log("[v0] Events array length:", events.length)

        if (!Array.isArray(events)) {
          throw new Error("No events found")
        }

        const transformedMatches: Match[] = events.map((event: any, index: number) => {
          const startDate = new Date(event.start || new Date())
          const date = startDate.toISOString().split("T")[0]
          const timeString = event.start || new Date().toISOString()
          const time = timeString.split("T")[1]?.split(".")[0]?.substring(0, 5) || "00:00"

          const isHome = event.home?.toLowerCase().includes("härnösand") || false
          const opponent = isHome ? event.away : event.home

          return {
            id: event.id || `event-${index}`,
            title: event.title, // Keep original title from API
            date: date,
            time: time,
            opponent: opponent || "Okänd motståndare",
            location: event.location || "",
            isHome: isHome,
            eventType: "match",
          }
        })

        console.log("[v0] Transformed matches:", transformedMatches.length)
        setAllMatches(transformedMatches)
      } catch (err) {
        console.error("[v0] Failed to fetch matches:", err)
        setError("Kunde inte ladda matcher. Försök igen senare.")
        setAllMatches([])
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, []) // Only fetch once, no dependency on filter

  const getDefaultContent = () => ({
    pageTitle: "Kommande Matcher",
    pageDescription: "Se alla kommande matcher för Härnösands HF",
    loadingMessage: "Laddar matcher...",
    errorMessage: "Fel: Detta kan bero på problem med att hämta data från källan.",
    noMatchesMessage: "Inga matcher planerade för närvarande.",
    filterLabels: {
      all: "Alla matcher",
      home: "Hemma",
      away: "Borta",
    },
    faq: [
      {
        question: "Hur börjar jag spela handboll i Härnösands HF?",
        answer:
          "Det enklaste sättet att börja är att kontakta oss! Vi hjälper dig att hitta rätt lag baserat på din ålder och erfarenhet. Du kan fylla i vårt kontaktformulär eller skicka ett mejl direkt till oss.",
      },
      {
        question: "Vilken utrustning behöver jag?",
        answer:
          "Till en början behöver du bara bekväma träningskläder, inomhusskor och en vattenflaska. Handbollar finns att låna under träningarna. När du väl bestämmer dig för att fortsätta kan du behöva klubbkläder.",
      },
      {
        question: "Finns det provträningar?",
        answer:
          "Absolut! Vi erbjuder alltid några kostnadsfria provträningar så att du kan känna efter om handboll är något för dig. Detta ger dig en chans att träffa laget och tränarna innan du bestämmer dig.",
      },
      {
        question: "Hur anmäler jag mig?",
        answer:
          "Efter dina provträningar får du information om hur du enkelt anmäler dig och blir en fullvärdig medlem i Härnösands HF. Vi ser fram emot att välkomna dig till vår handbollsfamilj!",
      },
    ],
  })

  const extractTeamFromTitle = (title: string): string => {
    return ""
  }

  const extractTeamFromLocation = (location: string): string => {
    if (!location) return ""

    const locationLower = location.toLowerCase()

    // Check for youth teams first (P10, P11, P12, P13, P14, P15, P16, etc.)
    const youthMatch = location.match(/p(\d{1,2})/i)
    if (youthMatch) {
      return `P${youthMatch[1]}`
    }

    // Check for men's team (herr)
    if (locationLower.includes("herr")) {
      return "Herr"
    }

    // Check for women's team (dam)
    if (locationLower.includes("dam")) {
      return "Dam"
    }

    return ""
  }

  const filteredMatches = allMatches.filter((match) => {
    if (filter === "home") return match.isHome
    if (filter === "away") return !match.isHome
    return true // "all"
  })

  const groupedMatches: GroupedMatches = filteredMatches.reduce((acc, match) => {
    const matchDate = new Date(match.date)
    const monthYearKey = matchDate.toLocaleDateString("sv-SE", { year: "numeric", month: "long" })
    if (!acc[monthYearKey]) acc[monthYearKey] = []
    acc[monthYearKey].push(match)
    return acc
  }, {} as GroupedMatches)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("sv-SE", { day: "numeric", month: "short" })
  }

  if (contentLoading) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-gray-50">
          <div className="h-24"></div>
          <div className="container px-4 md:px-6 py-12 md:py-16 lg:py-20">
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-600">Laddar sida...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!content) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-gray-50">
          <div className="h-24"></div>
          <div className="container px-4 md:px-6 py-12 md:py-16 lg:py-20">
            <div className="flex items-center justify-center py-8">
              <p className="text-red-600">Kunde inte ladda sida. Försök igen senare.</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="h-24"></div>
        <div className="container px-4 md:px-6 py-12 md:py-16 lg:py-20">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4 text-center text-green-700">
            {content?.pageTitle || "Kommande Matcher"}
          </h1>

          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-xl p-2 shadow-lg border border-gray-100">
              <div className="flex gap-1">
                <Button
                  variant={filter === "all" ? "default" : "ghost"}
                  onClick={() => setFilter("all")}
                  className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                    filter === "all" ? "bg-green-600 text-white shadow-md" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Alla Matcher
                </Button>
                <Button
                  variant={filter === "home" ? "default" : "ghost"}
                  onClick={() => setFilter("home")}
                  className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                    filter === "home" ? "bg-green-600 text-white shadow-md" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Hemma
                </Button>
                <Button
                  variant={filter === "away" ? "default" : "ghost"}
                  onClick={() => setFilter("away")}
                  className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                    filter === "away" ? "bg-green-600 text-white shadow-md" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Borta
                </Button>
              </div>
            </div>
          </div>

          {loading && <p className="text-center text-gray-600 mb-8">Laddar matcher...</p>}
          {error && (
            <div className="text-center mb-8">
              <p className="text-red-500 mb-2">{error}</p>
            </div>
          )}
          {!loading && !error && Object.keys(groupedMatches).length === 0 && (
            <p className="text-lg text-gray-700 text-center mb-12">Inga matcher hittades</p>
          )}
          {!loading && !error && Object.keys(groupedMatches).length > 0 && (
            <div className="space-y-12 mb-16">
              {Object.entries(groupedMatches).map(([monthYear, matches]) => (
                <section key={monthYear}>
                  <h2 className="text-2xl font-bold text-orange-500 mb-6 text-center md:text-left">{monthYear}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {matches.map((match) => (
                      <Card
                        key={match.id}
                        className="bg-white shadow-lg rounded-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative"
                      >
                        {extractTeamFromLocation(match.location) && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                            <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                              {extractTeamFromLocation(match.location)}
                            </div>
                          </div>
                        )}
                        <CardHeader className="p-6 pt-8">
                          <CardTitle className="text-lg font-bold text-gray-900 mb-3 leading-tight">
                            {match.title}
                          </CardTitle>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-gray-600">
                                <CalendarDays className="w-4 h-4 mr-2 text-green-600" />
                                <span className="font-medium">{formatDate(match.date)}</span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <Clock className="w-4 h-4 mr-2 text-green-600" />
                                <span className="font-medium">{match.time}</span>
                              </div>
                            </div>
                            {match.location && (
                              <div className="pt-2 border-t border-gray-100">
                                <p className="text-sm text-gray-600 flex items-start">
                                  <span className="font-semibold text-gray-800 mr-2">Plats:</span>
                                  <span className="flex-1">{match.location}</span>
                                </p>
                              </div>
                            )}
                            <div className="pt-2">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                  match.isHome ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {match.isHome ? "Hemma" : "Borta"}
                              </span>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}

          {/* FAQ Section */}
          <section className="bg-white shadow-lg rounded-lg p-8 md:p-12 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">Vanliga frågor om att börja träna</h2>
            <Accordion type="single" collapsible className="w-full">
              {content.faq.map((faqItem: any, index: number) => (
                <AccordionItem key={index} value={`item-${index + 1}`}>
                  <AccordionTrigger className="text-lg font-semibold text-gray-800 hover:no-underline">
                    {faqItem.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 text-base">
                    {faqItem.answer}
                    {faqItem.question.includes("anmäler") && (
                      <Link href="/kontakt" className="text-orange-500 hover:underline ml-2">
                        Anmäl dig via kontaktformuläret.
                      </Link>
                    )}
                    {faqItem.question.includes("börjar") && (
                      <Link href="/kontakt" className="text-orange-500 hover:underline ml-2">
                        Kontakta oss här.
                      </Link>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="text-center mt-8">
              <Button
                asChild
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-md text-lg font-semibold transition-colors"
              >
                <a href="/kontakt">Kontakta oss för mer information</a>
              </Button>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
