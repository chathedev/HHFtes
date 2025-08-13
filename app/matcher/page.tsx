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
  const [allMatches, setAllMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<"all" | "home" | "away">("all")

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

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="h-24"></div>
        <div className="container px-4 md:px-6 py-12 md:py-16 lg:py-20">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4 text-center text-green-700">
            Kommande Matcher
          </h1>

          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg p-1 shadow-md">
              <Button
                variant={filter === "all" ? "default" : "ghost"}
                onClick={() => setFilter("all")}
                className="px-4 py-2 rounded-md"
              >
                Alla matcher
              </Button>
              <Button
                variant={filter === "home" ? "default" : "ghost"}
                onClick={() => setFilter("home")}
                className="px-4 py-2 rounded-md ml-1"
              >
                <Home className="w-4 h-4 mr-2" />
                Hemma
              </Button>
              <Button
                variant={filter === "away" ? "default" : "ghost"}
                onClick={() => setFilter("away")}
                className="px-4 py-2 rounded-md ml-1"
              >
                <Plane className="w-4 h-4 mr-2" />
                Borta
              </Button>
            </div>
          </div>

          {loading && <p className="text-center text-gray-600 mb-8">Laddar matcher...</p>}
          {error && (
            <p className="text-center text-red-500 mb-8">
              Fel: {error}. Detta kan bero på problem med att hämta data från källan.
            </p>
          )}
          {!loading && !error && Object.keys(sortedGroupedMatches).length === 0 && (
            <p className="text-lg text-gray-700 text-center mb-12">Inga matcher planerade för närvarande.</p>
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

          {/* New FAQ Section */}
          <section className="bg-white shadow-lg rounded-lg p-8 md:p-12 max-w-4xl mx-auto">
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
                  Absolut! Vi erbjuder alltid några kostnadsfria provträningar så att du kan känna efter om handboll är
                  något för dig. Detta ger dig en chans att träffa laget och tränarna innan du bestämmer dig.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-lg font-semibold text-gray-800 hover:no-underline">
                  Hur anmäler jag mig?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 text-base">
                  Efter dina provträningar får du information om hur du enkelt anmäler dig och blir en fullvärdig medlem
                  i Härnösands HF. Vi ser fram emot att välkomna dig till vår handbollsfamilj!
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
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
