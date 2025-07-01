import { NextResponse } from "next/server"

interface Event {
  date: string // YYYY-MM-DD
  time: string // HH:MM or "Heldag"
  title: string // Event description
}

async function fetchEventsForMonth(year: number, month: number): Promise<Event[]> {
  const paddedMonth = month.toString().padStart(2, "0")
  const url = `https://www.laget.se/HarnosandsHF/Event/FilterEvents?Year=${year}&Month=${paddedMonth}&PrintMode=False&SiteType=Club&Visibility=2&types=2&types=4&types=6&types=7`

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; HHF/1.0)" },
      next: { revalidate: 3600 }, // Revalidate every hour
    })
    if (!response.ok) {
      console.warn(`Failed to fetch events for ${year}-${month}: ${response.statusText}`)
      return []
    }

    const html = await response.text()
    const events: Event[] = []

    // Regex to find each day-group block and extract its date
    const dayGroupRegex =
      /<div[^>]+class="day-group"[^>]+data-day="(?<date>\d{4}-\d{2}-\d{2})"[^>]*>[\s\S]*?<\/div>\s*<\/div>/gi

    let dayGroupMatch
    while ((dayGroupMatch = dayGroupRegex.exec(html)) !== null) {
      const { date, content: dayContent } = dayGroupMatch.groups as { date: string; content: string }

      // Regex to find each event item within the day group
      const eventItemRegex = /<li[^>]+class="event-item"[^>]*>(?<eventContent>[\s\S]*?)<\/li>/gi
      let eventItemMatch

      while ((eventItemMatch = eventItemRegex.exec(dayContent)) !== null) {
        const eventHtml = eventItemMatch.groups!.eventContent

        let time = "Okänd tid"
        let title = ""

        // Check for "Heldag" (Full day) events first
        if (eventHtml.includes("Heldag")) {
          time = "Heldag"
          // Extract title by removing "Heldag" and any HTML tags
          title = eventHtml
            .replace(/<[^>]*>/g, " ")
            .replace(/Heldag/i, "")
            .replace(/\s+/g, " ")
            .trim()
        } else {
          // Extract time from <time> tag
          const timeMatch = eventHtml.match(/<time[^>]*>(\d{2}:\d{2})<\/time>/i)
          time = timeMatch ? timeMatch[1] : "Okänd tid"

          // Extract title: get all text, then remove time and other known unwanted strings
          title = eventHtml
            .replace(/<[^>]*>/g, " ") // Remove all HTML tags
            .replace(time, "") // Remove the time string
            .replace(/Läs mer/i, "") // Remove "Läs mer"
            .replace(/v\.\d+/i, "") // Remove week numbers like "v.14"
            .replace(/\s+/g, " ") // Replace multiple spaces with single space
            .trim()
        }

        if (title) {
          events.push({ date, time, title })
        }
      }
    }

    return events
  } catch (err) {
    console.error(`Error fetching ${url}:`, err)
    return []
  }
}

export async function GET(request: Request) {
  try {
    const now = new Date()
    const allEvents: Event[] = []

    // Loop over the current month and the next 5 months (total 6 months)
    for (let i = 0; i < 6; i++) {
      let currentYear = now.getFullYear()
      let currentMonth = now.getMonth() + 1 + i // 1-indexed month

      if (currentMonth > 12) {
        currentMonth -= 12
        currentYear++
      }

      const monthEvents = await fetchEventsForMonth(currentYear, currentMonth)
      allEvents.push(...monthEvents)
    }

    // Sort all events by date and time
    allEvents.sort((a, b) => {
      const dateTimeA = new Date(`${a.date}T${a.time.replace("Okänd tid", "00:00").replace("Heldag", "00:00")}`)
      const dateTimeB = new Date(`${b.date}T${b.time.replace("Okänd tid", "00:00").replace("Heldag", "00:00")}`)
      return dateTimeA.getTime() - dateTimeB.getTime()
    })

    return NextResponse.json(allEvents)
  } catch (error) {
    console.error("Error in GET /api/kalender-events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}
