export const dynamic = "force-dynamic"

import Hero from "@/components/hero"
import PartnersCarouselClient from "./partners-carousel-client"
import Stats from "@/components/stats"
import UpcomingEvents from "@/components/upcoming-events"
import type { FullContent } from "@/lib/content-types"
import { defaultContent } from "@/lib/default-content"
import A from "@/components/about-club"

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "https://api.nuredo.se"

async function getDynamicContent(): Promise<FullContent> {
  try {
    const res = await fetch(`${BACKEND_API_URL}/api/content`, { cache: "no-store" })
    if (!res.ok) {
      console.error(`Failed to fetch content from backend: ${res.statusText}`)
      return defaultContent // Fallback to default content
    }
    const data = await res.json()

    // Ensure partners is always an array. If data.partners is not an array,
    // fall back to defaultContent.partners.
    const fetchedPartners = Array.isArray(data.partners) ? data.partners : defaultContent.partners

    // Merge fetched content with default to ensure all fields exist
    return { ...defaultContent, ...data, partners: fetchedPartners }
  } catch (error) {
    console.error("Error fetching dynamic content:", error)
    return defaultContent // Fallback to default content on error
  }
}

interface DynamicHomeContentProps {
  content: FullContent
}

function DynamicHomeContent({ content }: DynamicHomeContentProps) {
  const sectionComponents: { [key: string]: JSX.Element } = {
    hero: <Hero content={content.hero} />,
    stats: <Stats content={content.stats} />,
    upcomingEvents: <UpcomingEvents />,
    aboutClub: <A content={content.aboutClub} />,
    partnersCarousel: <PartnersCarouselClient partners={content.partners} />,
  }

  return (
    <>
      {content.sections.map((sectionKey) => {
        const component = sectionComponents[sectionKey]
        if (component) {
          return <div key={sectionKey}>{component}</div>
        }
        return null
      })}
    </>
  )
}

export default async function Home() {
  const content = await getDynamicContent()

  return <DynamicHomeContent content={content} />
}

export { DynamicHomeContent }
