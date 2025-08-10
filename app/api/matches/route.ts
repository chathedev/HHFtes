import { NextResponse } from "next/server"
import * as cheerio from "cheerio" // Import cheerio for server-side HTML parsing

interface Match {
  date: string // YYYY-MM-DD
  time: string // HH:MM or "Heldag" or "HH:MM - HH:MM"
  title: string // Match title
}

export async function GET() {
  try {
    const now = new Date()
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
      const $ = cheerio.load(html) // Load HTML with cheerio

      $(".fullCalendar__day").each((_idx, dayElement) => {
        const dateAttribute = $(dayElement).attr("data-day")
        if (!dateAttribute) return

        const fullDate = `${currentYear}-${paddedMonth}-${dateAttribute.padStart(2, "0")}`

        $(dayElement)
          .find(".fullCalendar__list li")
          .each((_idx, liElement) => {
            const textContent = $(liElement).text().toLowerCase() || ""
            if (textContent.includes("träning")) return // Skip trainings

            let time = "Okänd tid"
            let title = ""

            const timeElement = $(liElement).find("time")
            if (timeElement.length) {
              time = timeElement.text().trim() || "Okänd tid"
            }

            let rawTitle = $(liElement).text().trim() || ""

            if (rawTitle.includes("Heldag")) {
              time = "Heldag"
              rawTitle = rawTitle.replace(/Heldag/i, "").trim()
            }

            if (time === "Okänd tid") {
              const timeRegex = /\b(\d{2}:\d{2})\b/g
              const foundTimes: string[] = []
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
              fetchedMatches.push({ date: fullDate, time, title })
            }
          })
      })
    }

    // Filter out past matches and sort by date and time
    const nowDateTime = new Date()
    const filteredAndSortedMatches = fetchedMatches
      .filter((match) => {
        if (match.time === "Heldag") {
          const dateOnly = new Date(match.date)
          return dateOnly >= new Date(now.getFullYear(), now.getMonth(), now.getDate())
        }
        const dateTime = new Date(`${match.date}T${match.time.split(" ")[0].replace("Okänd tid", "00:00")}`)
        return dateTime >= nowDateTime
      })
      .sort((a, b) => {
        const dateA = new Date(
          `${a.date}T${a.time.split(" ")[0].replace("Okänd tid", "00:00").replace("Heldag", "00:00")}`,
        )
        const dateB = new Date(
          `${b.date}T${b.time.split(" ")[0].replace("Okänd tid", "00:00").replace("Heldag", "00:00")}`,
        )
        return dateA.getTime() - dateB.getTime()
      })

    return NextResponse.json(filteredAndSortedMatches)
  } catch (e: any) {
    console.error("Server-side error fetching matches:", e)
    return NextResponse.json({ error: "Failed to fetch matches." }, { status: 500 })
  }
}
