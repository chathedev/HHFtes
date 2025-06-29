"use client"

import Link from "next/link"
import { ChevronLeft, CalendarDays, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState, useMemo } from "react"

interface Training {
  date: string
  time: string
  title: string
}

interface GroupedTrainings {
  [monthYear: string]: Training[]
}

export default function TrainingsPage() {
  const [allTrainings, setAllTrainings] = useState<Training[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        setLoading(true)
        const startDate = new Date()
        const fetchedTrainings: Training[] = []

        for (let i = 0; i < 4; i++) {
          let currentYear = startDate.getFullYear()
          let currentMonth = startDate.getMonth() + i
          if (currentMonth > 11) {
            currentMonth -= 12
            currentYear++
          }

          const paddedMonth = (currentMonth + 1).toString().padStart(2, "0")
          const url = `https://www.laget.se/HarnosandsHF/Event/FilterEvents?Year=${currentYear}&Month=${paddedMonth}&PrintMode=False&SiteType=Club&Visibility=2&types=2`

          const response = await fetch(url)
          if (!response.ok) {
            console.warn(`Failed to fetch trainings for ${currentYear}-${paddedMonth}: ${response.statusText}`)
            continue
          }

          const html = await response.text()
          const parser = new DOMParser()
          const doc = parser.parseFromString(html, "text/html")

          doc.querySelectorAll(".fullCalendar__day").forEach((dayElement) => {
            const dateAttribute = dayElement.getAttribute("data-day")
            if (!dateAttribute) return

            const fullDate = `${currentYear}-${paddedMonth}-${dateAttribute.padStart(2, "0")}`

            dayElement.querySelectorAll(".fullCalendar__list li").forEach((liElement) => {
              let time = "Okänd tid"
              let title = ""

              const timeElement = liElement.querySelector("time")
              if (timeElement) {
                time = timeElement.textContent?.trim() || "Okänd tid"
              }

              let rawTitle = liElement.textContent?.trim() || ""

              if (rawTitle.includes("Heldag")) {
                time = "Heldag"
                rawTitle = rawTitle.replace(/Heldag/i, "").trim()
              }

              if (time === "Okänd tid") {
                const timeRegex = /\b(\d{2}:\d{2})\b/g
                const foundTimes = []
                let match
                while ((match = timeRegex.exec(rawTitle)) !== null) {
                  foundTimes.push(match[1])
                }

                if (foundTimes.length >= 2) {
                  time = `${foundTimes[0]} - ${foundTimes[foundTimes.length - 1]}`
                  rawTitle = rawTitle
                    .replace(foundTimes[0], "")
                    .replace(foundTimes[foundTimes.length - 1], "")
                    .trim()
                } else if (foundTimes.length === 1) {
                  time = foundTimes[0]
                  rawTitle = rawTitle.replace(foundTimes[0], "").trim()
                }
              }

              title = rawTitle
                .replace(/Läs mer/i, "")
                .replace(/v\.\d+/i, "")
                .replace(/\s+/g, " ")
                .trim()

              if (title) {
                fetchedTrainings.push({ date: fullDate, time, title })
              }
            })
          })
        }

        const nowDateTime = new Date()
        const filteredAndSortedTrainings = fetchedTrainings
          .filter((training) => {
            if (training.time === "Heldag") {
              const trainingDateOnly = new Date(training.date)
              const nowOnly = new Date(nowDateTime.getFullYear(), nowDateTime.getMonth(), nowDateTime.getDate())
              return trainingDateOnly >= nowOnly
            }

            const trainingDateTime = new Date(
              `${training.date}T${training.time.split(" ")[0].replace("Okänd tid", "00:00")}`
            )
            return trainingDateTime >= nowDateTime
          })
          .sort((a, b) => {
            const dateTimeA = new Date(
              `${a.date}T${a.time.split(" ")[0].replace("Okänd tid", "00:00").replace("Heldag", "00:00")}`
            )
            const dateTimeB = new Date(
              `${b.date}T${b.time.split(" ")[0].replace("Okänd tid", "00:00").replace("Heldag", "00:00")}`
            )
            return dateTimeA.getTime() - dateTimeB.getTime()
          })

        setAllTrainings(filteredAndSortedTrainings)
      } catch (e: any) {
        setError(e.message || "Failed to fetch trainings.")
        console.error("Client-side fetch error:", e)
      } finally {
        setLoading(false)
      }
    }

    fetchTrainings()
  }, [])

  const groupedTrainings = useMemo(() => {
    const grouped: GroupedTrainings = allTrainings.reduce((acc, training) => {
      const trainingDate = new Date(training.date)
      const monthYearKey = trainingDate.toLocaleDateString("sv-SE", { year: "numeric", month: "long" })
      if (!acc[monthYearKey]) {
        acc[monthYearKey] = []
      }
      acc[monthYearKey].push(training)
      return acc
    }, {} as GroupedTrainings)

    const sortedGrouped: GroupedTrainings = Object.keys(grouped)
      .sort((a, b) => {
        const parse = (s: string) => {
          const [month, year] = s.split(" ")
          const monthIndex = new Date(Date.parse(month + " 1, 2000")).getMonth()
          return new Date(Number(year), monthIndex, 1)
        }
        return parse(a).getTime() - parse(b).getTime()
      })
      .reduce((obj, key) => {
        obj[key] = grouped[key]
        return obj
      }, {} as GroupedTrainings)

    return sortedGrouped
  }, [allTrainings])

  const formatTrainingDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("sv-SE", { day: "numeric", month: "short" })
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 py-8 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <Link href="/" className="inline-flex items-center text-green-700 hover:underline mb-8">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Tillbaka till startsidan
        </Link>

        <h1 className="text-5xl font-bold text-green-700 mb-4 text-center">Kommande Träningar</h1>
        <p className="text-xl text-gray-700 mb-12 text-center max-w-3xl mx-auto">
          Här hittar du alla kommande träningar för Härnösands HF.
        </p>

        {loading && <p className="text-center text-gray-600">Laddar träningar...</p>}
        {error && (
          <p className="text-center text-red-500">
            Fel: {error}. Detta kan bero på CORS-begränsningar från källwebbplatsen när du försöker hämta data direkt från webbläsaren.
          </p>
        )}

        {!loading && !error && Object.keys(groupedTrainings).length === 0 && (
          <p className="text-center text-gray-600">Inga träningar planerade.</p>
        )}

        {!loading && !error && (
          <div className="space-y-12">
            {Object.entries(groupedTrainings).map(([monthYear, trainings]) => (
              <section key={monthYear}>
                <h2 className="text-4xl font-bold text-orange-500 mb-8 text-center md:text-left">{monthYear}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trainings.map((training) => (
                    <Card
                      key={training.date + training.time + training.title}
                      className="bg-white border border-gray-200 hover:shadow-lg transition rounded-lg flex flex-col"
                    >
                      <CardHeader>
                        <CardTitle className="text-xl font-semibold text-gray-800 mb-2">{training.title}</CardTitle>
                        <div className="flex items-center text-sm text-gray-500">
                          <CalendarDays className="w-4 h-4 mr-1" />
                          <span>{formatTrainingDate(training.date)}</span>
                          <Clock className="w-4 h-4 ml-4 mr-1" />
                          <span>{training.time}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow flex flex-col justify-between" />
                    </Card>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
