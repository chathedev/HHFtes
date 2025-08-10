export const dynamic = "force-dynamic" // Keep force-dynamic for editor updates

import type { FullContent } from "@/lib/content-types"
import { defaultContent } from "@/lib/default-content"
import Hero from "@/components/hero"
import Stats from "@/components/stats"
import UpcomingEvents from "@/components/upcoming-events"
import AboutClub from "@/components/about-club"
import PartnersCarouselClient from "@/app/partners-carousel-client"
import MatchCards from "@/components/match-cards" // Import MatchCards
import type { JSX } from "react" // Declare JSX variable

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "https://api.nuredo.se"

/* -------------------------------------------------------------------------- */
/*                           DATA-FETCHING FUNCTIONS                          */
/* -------------------------------------------------------------------------- */
async function getDynamicContent(): Promise<FullContent> {
  try {
    const res = await fetch(`${BACKEND_API_URL}/api/content`, { cache: "no-store" })
    if (!res.ok) {
      console.error(`Failed to fetch content from backend: ${res.statusText}`)
      return defaultContent
    }
    const data = (await res.json()) as Partial<FullContent>

    // Guarantee partners is an array
    const fetchedPartners = Array.isArray(data.partners) ? data.partners : defaultContent.partners

    // Merge with defaults to ensure all fields exist
    return { ...defaultContent, ...data, partners: fetchedPartners }
  } catch (err) {
    console.error("Error fetching dynamic content:", err)
    return defaultContent
  }
}

interface Match {
  // Define Match interface here for server-side use
  date: string
  time: string
  title: string
}

async function getUpcomingMatches(): Promise<Match[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000"}/api/matches`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: Match[] = await response.json()
    return data
  } catch (e: any) {
    console.error("Server-side fetch error for upcoming matches:", e)
    return []
  }
}

/* -------------------------------------------------------------------------- */
/*                                PAGE LAYOUT                                */
/* -------------------------------------------------------------------------- */
export default async function HomePage() {
  const content = await getDynamicContent()
  const upcomingMatches = await getUpcomingMatches() // Fetch matches server-side

  const sectionComponents: { [key: string]: JSX.Element } = {
    hero: <Hero content={content.hero} />,
    stats: <Stats content={content.stats} />,
    upcomingEvents: <UpcomingEvents upcomingMatches={upcomingMatches} />, // Pass matches as prop
    matchCards: <MatchCards upcomingMatches={upcomingMatches} />, // Pass matches to MatchCards
    aboutClub: <AboutClub content={content.aboutClub} />,
    partnersCarousel: <PartnersCarouselClient partners={content.partners} />,
  }

  return (
    <div>
      {content.sections.map((sectionKey) => {
        const component = sectionComponents[sectionKey]
        return component ? <div key={sectionKey}>{component}</div> : null
      })}
    </div>
  )
}
