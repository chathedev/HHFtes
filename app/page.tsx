import { HeroSection } from "@/components/sections/hero-section"
import { AboutClubSection } from "@/components/sections/about-club-section"
import { StatsSection } from "@/components/sections/stats-section"
import { PartnersCarouselSection } from "@/components/sections/partners-carousel-section"
import { UpcomingEventsSection } from "@/components/upcoming-events-section"
import { getContent } from "@/lib/content-store"

// Force dynamic rendering for this page
export const dynamic = "force-dynamic"

export default async function Home() {
  const content = await getContent()

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)]">
      <HeroSection content={content.hero} />
      <AboutClubSection content={content.aboutClub} />
      <StatsSection content={content.stats} />
      <PartnersCarouselSection content={content.partnersCarousel} />
      <UpcomingEventsSection content={content.upcomingEvents} />
    </div>
  )
}
