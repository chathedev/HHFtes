import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import HeroSection from "@/components/sections/hero-section"
import StatsSection from "@/components/sections/stats-section"
import AboutClubSection from "@/components/sections/about-club-section"
import PartnersCarouselSection from "@/components/sections/partners-carousel-section"
import UpcomingEventsSection from "@/components/upcoming-events-section"
import { loadContent } from "@/lib/content-store"

export default async function HomePage() {
  const content = await loadContent()

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <HeroSection content={content.hero} />
        <StatsSection content={content.stats} />
        <UpcomingEventsSection />
        <AboutClubSection content={content.aboutClub} />
        <PartnersCarouselSection content={content.partnersCarousel} />
      </main>
      <Footer />
    </div>
  )
}
