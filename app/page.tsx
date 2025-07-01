"use client"

import { useState, useEffect } from "react"
import { type PageContent, loadContent, defaultContent } from "@/lib/content-store"

// Import the section components
import HeroSection from "@/components/sections/hero-section"
import StatsSection from "@/components/sections/stats-section"
import AboutClubSection from "@/components/sections/about-club-section"
import PartnersCarouselSection from "@/components/sections/partners-carousel-section"
import UpcomingEventsSection from "@/components/upcoming-events-section" // This one is not editable via content.json

export default function Home() {
  const [content, setContent] = useState<PageContent>(defaultContent) // Initialize with defaultContent

  useEffect(() => {
    const fetchContent = async () => {
      const fetchedContent = await loadContent()
      setContent(fetchedContent)
    }
    fetchContent()
  }, [])

  // No longer need a loading check here as content is initialized with defaultContent
  // The sections will render with default content first, then update when fetched content arrives.

  return (
    <>
      <HeroSection content={content.hero} />
      <StatsSection content={content.stats} />
      <UpcomingEventsSection content={content.upcomingEvents} /> {/* Pass content for upcoming events */}
      <AboutClubSection content={content.aboutClub} />
      <PartnersCarouselSection content={content.partnersCarousel} />
    </>
  )
}
