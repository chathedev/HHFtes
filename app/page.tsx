"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  CalendarDays,
  Clock,
  Goal,
  Heart,
  TrendingUp,
  Users,
  Star,
  Plus,
  Minus,
  Trophy,
  Award,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { allPartners, type Partner } from "@/lib/partners-data"

// Hero Component Logic
function HeroSection() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <Image
        src="https://az316141.cdn.laget.se/2317159/11348130.jpg"
        alt="Härnösands HF Team"
        fill
        quality={90}
        priority
        unoptimized
        className="object-cover z-0"
      />
      <div className="absolute inset-0 bg-black/60 z-10" /> {/* Darker, full overlay */}
      <div className="relative z-20 text-white text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-extrabold mb-4 leading-tight tracking-tight animate-fade-in-up">
          LAGET <span className="text-green-500">FÖRE ALLT</span>
        </h1>
        <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto animate-fade-in-up delay-200">
          Härnösands HF - En förening med stolthet, gemenskap och passion för sporten.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6 animate-fade-in-up delay-400">
          <Button
            asChild
            className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-md text-lg font-semibold shadow-lg transition-transform duration-300 hover:scale-105"
          >
            <Link href="/lag">
              Våra 23 Lag
              <ArrowRight className="ml-3 h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            className="bg-green-700 hover:bg-green-800 text-white px-10 py-4 rounded-md text-lg font-semibold shadow-lg transition-transform duration-300 hover:scale-105"
          >
            <Link href="/nyheter">Senaste Nytt</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

// Stats Component Logic
function StatsSection() {
  return (
    <section className="bg-green-600 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center">
            <Users className="w-12 h-12 mb-2" />
            <div className="text-4xl font-bold">23</div>
            <div className="text-sm">Totalt Lag</div>
          </div>

          <div className="flex flex-col items-center">
            <Trophy className="w-12 h-12 mb-2" />
            <div className="text-4xl font-bold">2</div>
            <div className="text-sm">A-lag</div>
          </div>

          <div className="flex flex-col items-center">
            <Award className="w-12 h-12 mb-2" />
            <div className="text-4xl font-bold">21</div>
            <div className="text-sm">Ungdomslag</div>
          </div>

          <div className="flex flex-col items-center">
            <TrendingUp className="w-12 h-12 mb-2" />
            <div className="text-4xl font-bold">50+</div>
            <div className="text-sm">År av Historia</div>
          </div>
        </div>
      </div>
    </section>
  )
}

// UpcomingEvents Component Logic
interface Match {
  date: string // YYYY-MM-DD
  time: string // HH:MM or "Heldag"
  title: string // Match title
}

function UpcomingEventsSection() {
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true)
        const now = new Date() // Use actual current date
        const fetchedMatches: Match[] = []

        // Loop over the current month and the next 5 months (total 6 months)
        for (let i = 0; i < 6; i++) {
          let currentYear = now.getFullYear()
          let currentMonth = now.getMonth() + i // 0-indexed month

          if (currentMonth > 11) {
            currentMonth -= 12
            currentYear++
          }

          const paddedMonth = (currentMonth + 1).toString().padStart(2, "0") // Convert to 1-indexed and pad
          const url = `https://www.laget.se/HarnosandsHF/Event/FilterEvents?Year=${currentYear}&Month=${paddedMonth}&PrintMode=False&SiteType=Club&Visibility=2&types=6`

          const response = await fetch(url)
          if (!response.ok) {
            console.warn(`Failed to fetch matches for ${currentYear}-${paddedMonth}: ${response.statusText}`)
            continue
          }

          const html = await response.text()
          const parser = new DOMParser()
          const doc = parser.parseFromString(html, "text/html")

          doc.querySelectorAll(".fullCalendar__day").forEach((dayElement) => {
            const dateAttribute = dayElement.getAttribute("data-day")
            if (!dateAttribute) return

            const fullDate = dateAttribute

            dayElement.querySelectorAll(".fullCalendar__list li").forEach((liElement) => {
              let time = "Okänd tid"
              let title = ""

              const timeElement = liElement.querySelector("time")
              if (timeElement) {
                time = timeElement.textContent?.trim() || "Okänd tid"
              }

              let rawTitle = liElement.textContent?.trim() || ""

              if (time !== "Okänd tid") {
                rawTitle = rawTitle.replace(time, "").trim()
              }

              if (rawTitle.includes("Heldag")) {
                time = "Heldag"
                rawTitle = rawTitle.replace(/Heldag/i, "").trim()
              }

              title = rawTitle
                .replace(/Läs mer/i, "")
                .replace(/v\.\d+/i, "")
                .replace(/\s+/g, " ")
                .trim()

              if (title) {
                fetchedMatches.push({ date: fullDate, time, title })
              }
            })
          })
        }

        // Filter out past matches and sort by date and time
        const nowDateTime = new Date()
        const filteredAndSortedMatches = fetchedMatches
          .filter((match) => {
            const matchDateTime = new Date(
              `${match.date}T${match.time.replace("Okänd tid", "00:00").replace("Heldag", "00:00")}`,
            )
            return matchDateTime >= nowDateTime
          })
          .sort((a, b) => {
            const dateTimeA = new Date(`${a.date}T${a.time.replace("Okänd tid", "00:00").replace("Heldag", "00:00")}`)
            const dateTimeB = new Date(`${b.date}T${b.time.replace("Okänd tid", "00:00").replace("Heldag", "00:00")}`)
            return dateTimeA.getTime() - dateTimeB.getTime()
          })

        setUpcomingMatches(filteredAndSortedMatches)
      } catch (e: any) {
        setError(e.message || "Failed to fetch matches.")
        console.error("Client-side fetch error:", e)
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [])

  const formatMatchDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("sv-SE", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <Card className="bg-white rounded-lg shadow-lg overflow-hidden max-w-2xl mx-auto">
          <CardHeader className="p-6 flex flex-col items-center text-center border-b border-gray-200">
            <Goal className="w-16 h-16 text-green-600 mb-4" />
            <CardTitle className="text-3xl font-bold text-green-600 mb-2">KOMMANDE MATCHER</CardTitle>
            <p className="text-gray-600 text-lg">Håll dig uppdaterad med våra nästa matcher!</p>
          </CardHeader>
          <CardContent className="p-6">
            {loading && <p className="text-center text-gray-600">Laddar matcher...</p>}
            {error && (
              <p className="text-center text-red-500">
                Fel: {error}. Detta kan bero på CORS-begränsningar från källwebbplatsen.
              </p>
            )}

            {!loading && !error && upcomingMatches.length === 0 && null}

            {!loading && !error && upcomingMatches.length > 0 && (
              <div className="space-y-4 mb-6">
                {upcomingMatches.slice(0, 5).map(
                  (
                    match,
                    index, // Display up to 5 matches
                  ) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 bg-gray-50 rounded-md border border-gray-200"
                    >
                      <div className="flex-shrink-0 text-center">
                        <CalendarDays className="w-6 h-6 text-orange-500" />
                        <span className="block text-xs text-gray-600">{formatMatchDate(match.date)}</span>
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-semibold text-gray-800">{match.title}</h4>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{match.time}</span>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}

            <div className="text-center">
              <Button
                asChild
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-md text-lg font-semibold transition-colors"
              >
                <Link href="/matcher">
                  Visa Alla Matcher
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

// AboutClub Component Logic
function AboutClubSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-green-600 mb-2">Härnösands HF</h2>

            <p className="text-gray-700 mb-6">
              Vi är en handbollsklubb som värnar om gemenskap, utveckling och sund konkurrens. Med våra 23 lag från
              ungdom till seniorer erbjuder vi handboll för alla åldrar och nivåer.
            </p>

            <p className="text-gray-700 mb-8">
              Vår vision är att vara den ledande handbollsklubben i regionen genom att skapa en miljö där varje spelare
              kan utvecklas och trivas.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="border border-gray-200 rounded-lg p-4 text-center">
                <Heart className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-medium mb-1">Passion</h4>
                <p className="text-xs text-gray-600">Vi brinner för handboll</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 text-center">
                <TrendingUp className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <h4 className="font-medium mb-1">Utveckling</h4>
                <p className="text-xs text-gray-600">Alla kan bli bättre</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 text-center">
                <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-medium mb-1">Gemenskap</h4>
                <p className="text-xs text-gray-600">Tillsammans är vi starka</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/lag"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md font-medium transition-colors"
              >
                Visa Lag
              </Link>
              <Link
                href="/kontakt"
                className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 px-6 py-2 rounded-md font-medium transition-colors"
              >
                Kontakta Oss
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="https://i.ibb.co/Zt8gppK/491897759-17872413642339702-3719173158843008539-n.jpg"
                alt="Härnösands HF Team"
                fill
                className="object-cover"
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              />
            </div>

            <div className="absolute -top-4 -right-4 bg-orange-500 text-white rounded-lg p-4 shadow-lg">
              <div className="text-3xl font-bold">23</div>
              <div className="text-sm">lag totalt</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// PartnersCarousel Component Logic
function PartnersCarouselSection() {
  const [openTier, setOpenTier] = useState<string | null>("Diamantpartner") // Default to Diamantpartner open
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null) // State to manage hovered card

  const handleToggle = (tierName: string) => {
    setOpenTier((prevOpenTier) => (prevOpenTier === tierName ? null : tierName))
  }

  const partnersForDisplay = allPartners.filter((p) => p.visibleInCarousel)

  const partnersByTier: Record<string, Partner[]> = partnersForDisplay.reduce(
    (acc, partner) => {
      if (!acc[partner.tier]) {
        acc[partner.tier] = []
      }
      acc[partner.tier].push(partner)
      return acc
    },
    {} as Record<string, Partner[]>,
  )

  const tierOrder = ["Diamantpartner", "Platinapartner", "Guldpartner", "Silverpartner", "Bronspartner"]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-2">
          Våra <span className="text-orange-500">Partners</span>
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Vi är stolta över att samarbeta med lokala företag och organisationer som stödjer vår verksamhet och hjälper
          oss att utveckla handbollen i Härnösand.
        </p>

        {tierOrder.map(
          (tierName) =>
            partnersByTier[tierName] && (
              <section key={tierName} className="mb-8 border-b border-gray-200 pb-4">
                <div
                  className="flex justify-between items-center mb-4 cursor-pointer"
                  onClick={() => handleToggle(tierName)}
                >
                  <h3 className="text-3xl font-bold text-green-600">{tierName}</h3>
                  <Button variant="ghost" size="icon" aria-expanded={openTier === tierName}>
                    {openTier === tierName ? (
                      <Minus className="w-6 h-6 text-green-700" />
                    ) : (
                      <Plus className="w-6 h-6 text-green-700" />
                    )}
                  </Button>
                </div>
                {openTier === tierName && (
                  <div className="flex justify-center animate-fade-in">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                      {partnersByTier[tierName].map((partner) => {
                        const isDiamant = partner.tier === "Diamantpartner"
                        const isHighcon = partner.id === "highcon"
                        return (
                          <div
                            key={partner.id}
                            className="relative group w-full h-36"
                            onMouseEnter={() => setHoveredCardId(partner.id)}
                            onMouseLeave={() => setHoveredCardId(null)}
                          >
                            <Card
                              className={`p-4 shadow-lg rounded-lg flex flex-col items-center justify-center h-full w-full text-center
                                ${isDiamant ? "border-2 border-yellow-500" : "bg-white/80"}
                              `}
                            >
                              {isDiamant && (
                                <Star className="absolute top-1 right-1 w-5 h-5 text-yellow-500 fill-yellow-500" />
                              )}
                              <div className={`relative w-full mb-2 ${isHighcon ? "h-24" : "h-20"}`}>
                                <Image
                                  src={partner.src || "/placeholder.svg"}
                                  alt={partner.alt}
                                  fill
                                  unoptimized
                                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                                />
                              </div>
                              <h4 className={`text-sm font-semibold ${isDiamant ? "text-gray-900" : "text-gray-800"}`}>
                                {partner.alt}
                              </h4>

                              {/* Hover Overlay */}
                              {hoveredCardId === partner.id && partner.linkUrl && (
                                <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-lg transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                                  <Button
                                    onClick={() => window.open(partner.linkUrl, "_blank")}
                                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
                                  >
                                    Gå till
                                  </Button>
                                </div>
                              )}
                            </Card>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </section>
            ),
        )}

        <section className="bg-green-700 text-white p-8 rounded-lg shadow-lg text-center mt-12">
          <h2 className="text-3xl font-bold mb-4">Vill du stödja Härnösands HF?</h2>
          <p className="text-lg mb-8">
            Vi välkomnar nya partners som vill stödja vår verksamhet och bidra till utvecklingen av handbollen i
            regionen.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/kontakt" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-md">
              Kontakta oss
            </Link>
          </div>
        </section>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <UpcomingEventsSection />
      <AboutClubSection />
      <PartnersCarouselSection />
    </>
  )
}
