"use client"

import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { CalendarDays, Clock, Home, Plane } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

export default function MatcherPage() {
  const [content, setContent] = useState<any>(null)
  const [contentLoading, setContentLoading] = useState(true)
  const [allMatches, setAllMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<"all" | "home" | "away">("all")

  // Load static content from JSON
  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch("/content/matcher.json")
        if (response.ok) {
          const data = await response.json()
          setContent(data)
        } else {
          // Fallback to default content if JSON fails
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

  // Fetch matches from API
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const filterParam = filter !== "all" ? `?filter=${filter}` : ""
        const response = await fetch(`/api/matches${filterParam}`)
        if (!response.ok) {
          throw new Error("Failed to fetch matches")
        }
        const matches = await response.json()
        setAllMatches(matches)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [filter])

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

  const groupedMatches: GroupedMatches = allMatches.reduce((acc, match) => {
    const matchDate = new Date(match.date)
    const monthYearKey = matchDate.toLocaleDateString("sv-SE", { year: "numeric", month: "long" })
    if (!acc[monthYearKey]) acc[monthYearKey] = []
    acc[monthYearKey].push(match)
    return acc
  }, {} as GroupedMatches)

  // Sort months chronologically
  const sortedGroupedMatches: GroupedMatches = Object.keys(groupedMatches)
    .sort((a, b) => {
      const parseMonthYear = (str: string) => {
        const [monthName, year] = str.split(" ")
        const monthIndex = new Date(Date.parse(`${monthName} 1, 2000`)).getMonth()
        return new Date(Number(year), monthIndex, 1)
      }
      return parseMonthYear(a).getTime() - parseMonthYear(b).getTime()
    })
    .reduce((sorted, key) => {
      sorted[key] = groupedMatches[key].sort((a, b) => {
        const dateTimeA = new Date(`${a.date}T${a.time.replace("Okänd tid", "00:00").replace("Heldag", "00:00")}`)
        const dateTimeB = new Date(`${b.date}T${b.time.replace("Okänd tid", "00:00").replace("Heldag", "00:00")}`)
        return dateTimeA.getTime() - dateTimeB.getTime()
      })
      return sorted
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
            {content.pageTitle}
          </h1>

          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg p-1 shadow-md">
              <Button
                variant={filter === "all" ? "default" : "ghost"}
                onClick={() => setFilter("all")}
                className="px-4 py-2 rounded-md"
              >
                {content.filterLabels.all}
              </Button>
              <Button
                variant={filter === "home" ? "default" : "ghost"}
                onClick={() => setFilter("home")}
                className="px-4 py-2 rounded-md ml-1"
              >
                <Home className="w-4 h-4 mr-2" />
                {content.filterLabels.home}
              </Button>
              <Button
                variant={filter === "away" ? "default" : "ghost"}
                onClick={() => setFilter("away")}
                className="px-4 py-2 rounded-md ml-1"
              >
                <Plane className="w-4 h-4 mr-2" />
                {content.filterLabels.away}
              </Button>
            </div>
          </div>

          {loading && <p className="text-center text-gray-600 mb-8">{content.loadingMessage}</p>}
          {error && <p className="text-center text-red-500 mb-8">{content.errorMessage}</p>}
          {!loading && !error && Object.keys(sortedGroupedMatches).length === 0 && (
            <p className="text-lg text-gray-700 text-center mb-12">{content.noMatchesMessage}</p>
          )}
          {!loading && !error && Object.keys(sortedGroupedMatches).length > 0 && (
            <div className="space-y-12 mb-16">
              {Object.entries(sortedGroupedMatches).map(([monthYear, matches]) => (
                <section key={monthYear}>
                  <h2 className="text-2xl font-bold text-orange-500 mb-6 text-center md:text-left">{monthYear}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {matches.map((match) => (
                      <Card
                        key={match.id}
                        className="bg-white shadow-lg rounded-lg flex flex-col transition hover:shadow-xl p-6"
                      >
                        <CardHeader className="p-0 pb-4">
                          <CardTitle className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
                            {match.isHome ? (
                              <Home className="w-5 h-5 mr-2 text-green-600" />
                            ) : (
                              <Plane className="w-5 h-5 mr-2 text-blue-600" />
                            )}
                            {match.title}
                          </CardTitle>
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <CalendarDays className="w-4 h-4 mr-1" />
                            <span>{formatDate(match.date)}</span>
                            <Clock className="w-4 h-4 ml-4 mr-1" />
                            <span>{match.time}</span>
                          </div>
                          {match.opponent && (
                            <p className="text-sm text-gray-600 mb-1">
                              <strong>Motståndare:</strong> {match.opponent}
                            </p>
                          )}
                          {match.location && (
                            <p className="text-sm text-gray-600">
                              <strong>Plats:</strong> {match.location}
                            </p>
                          )}
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col justify-between p-0" />
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
                <Link href="/kontakt">Kontakta oss för mer information</Link>
              </Button>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
