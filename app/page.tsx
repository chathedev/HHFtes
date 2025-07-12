export const dynamic = "force-dynamic"

import Hero from "@/components/hero"
import Stats from "@/components/stats"
import UpcomingEvents from "@/components/upcoming-events"
import AboutClub from "@/components/about-club"
import PartnersCarouselClient from "./partners-carousel-client"
import type { JSX } from "react"

import type { FullContent } from "@/lib/content-types"
import { defaultContent } from "@/lib/default-content"

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "https://api.nuredo.se"

/* -------------------------------------------------------------------------- */
/*                           DATA-FETCHING FUNCTION                           */
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

/* -------------------------------------------------------------------------- */
/*                                PAGE LAYOUT                                */
/* -------------------------------------------------------------------------- */
export default async function HomePage() {
  const content = await getDynamicContent()

  const sectionComponents: Record<string, JSX.Element> = {
    hero: <Hero content={content.hero} />,
    stats: <Stats content={content.stats} />,
    upcomingEvents: <UpcomingEvents />,
    aboutClub: <AboutClub content={content.aboutClub} />,
    partnersCarousel: <PartnersCarouselClient partners={content.partners} />,
  }

  return (
    <>
      {content.sections.map((key) => (
        <div key={key}>{sectionComponents[key]}</div>
      ))}
    </>
  )
}
