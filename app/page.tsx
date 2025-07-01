"use client"

import { useState, useEffect } from "react"
import { type PageContent, loadContent } from "@/lib/content-store"

// Import the section components
import HeroSection from "@/components/sections/hero-section"
import StatsSection from "@/components/sections/stats-section"
import AboutClubSection from "@/components/sections/about-club-section"
import PartnersCarouselSection from "@/components/sections/partners-carousel-section"
import UpcomingEventsSection from "@/components/upcoming-events-section"

export default function Home() {
  const [content, setContent] = useState<PageContent | null>(null)

  useEffect(() => {
    const fetchContent = async () => {
      const fetchedContent = await loadContent()
      setContent(fetchedContent)
    }
    fetchContent()
  }, [])

  if (!content) {
    return <div className="flex justify-center items-center min-h-screen">Laddar innehåll...</div>
  }

  return (
    <>
      <HeroSection content={content.hero} />
      <StatsSection content={content.stats} />
      <UpcomingEventsSection /> {/* This section remains dynamic */}
      <AboutClubSection content={content.aboutClub} />
      <PartnersCarouselSection content={content.partners} />
    </>
  )
}
