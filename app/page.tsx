export const dynamic = "force-dynamic"

import type { FullContent } from "@/lib/content-types"
import { defaultContent } from "@/lib/default-content"
import Hero from "@/components/hero"
import Stats from "@/components/stats"
import UpcomingEvents from "@/components/upcoming-events"
import AboutClub from "@/components/about-club"
import PartnersCarouselClient from "@/app/partners-carousel-client"
import LazySectionWrapper from "@/components/lazy-section-wrapper"
import { getUpcomingMatchesServer } from "@/lib/get-matches"
import { Suspense } from "react"

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

  // Fetch upcoming matches on the server for the homepage
  let upcomingMatches = []
  let matchesLoading = true
  let matchesError: string | null = null
  try {
    upcomingMatches = await getUpcomingMatchesServer()
    matchesLoading = false
  } catch (e: any) {
    matchesError = e.message || "Failed to fetch upcoming matches."
    matchesLoading = false
    console.error("Server-side fetch error for homepage upcoming matches:", e)
  }

  return (
    <div>
      {/* Hero loads immediately - no lazy wrapper */}
      <Hero content={content.hero} />

      {/* All other sections are lazy loaded */}
      <LazySectionWrapper delay={0}>
        <Stats content={content.stats} />
      </LazySectionWrapper>

      <LazySectionWrapper delay={100}>
        <Suspense
          fallback={
            <div className="py-16 bg-gray-50">
              <div className="container mx-auto px-4 text-center">
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
                  </div>
                </div>
              </div>
            </div>
          }
        >
          <UpcomingEvents upcomingMatches={upcomingMatches} loading={matchesLoading} error={matchesError} />
        </Suspense>
      </LazySectionWrapper>

      <LazySectionWrapper delay={200}>
        <AboutClub content={content.aboutClub} />
      </LazySectionWrapper>

      <LazySectionWrapper delay={300}>
        <Suspense
          fallback={
            <div className="py-16 bg-gray-50">
              <div className="container mx-auto px-4 text-center">
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-24 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        >
          <PartnersCarouselClient partners={content.partners} />
        </Suspense>
      </LazySectionWrapper>
    </div>
  )
}
