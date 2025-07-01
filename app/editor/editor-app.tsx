"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { HeroSection } from "@/components/sections/hero-section"
import { AboutClubSection } from "@/components/sections/about-club-section"
import { StatsSection } from "@/components/sections/stats-section"
import { PartnersCarouselSection } from "@/components/sections/partners-carousel-section"
import { UpcomingEventsSection } from "@/components/upcoming-events-section"
import { defaultContent } from "@/lib/content-store"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider" // Import useAuth

// Define the structure for your content
interface Content {
  hero: {
    title: string
    description: string
    primaryButtonText: string
    primaryButtonLink: string
    secondaryButtonText: string
    secondaryButtonLink: string
    imageUrl: string
  }
  aboutClub: {
    title: string
    description: string
    linkText: string
    linkUrl: string
    totalTeamsCallout: number
    imageSrc: string
  }
  stats: {
    title: string
    description: string
    stats: { label: string; value: string }[]
  }
  partners: {
    title: string
    description: string
    partners: { name: string; logo: string; url: string }[]
  }
  upcomingEvents: {
    title: string
    description: string
  }
}

export default function EditorApp() {
  const { toast } = useToast()
  const { isAuthenticated, loading } = useAuth() // Correctly destructure isAuthenticated and loading
  const [content, setContent] = useState<Content>(defaultContent)
  const [isEditing, setIsEditing] = useState(true) // Editor is always in editing mode

  const fetchContent = useCallback(async () => {
    try {
      const response = await fetch("/api/content")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      // Explicitly set image URLs to ensure they are not placeholders
      const loadedContent = {
        ...data,
        hero: {
          ...data.hero,
          imageUrl: data.hero.imageUrl || defaultContent.hero.imageUrl,
        },
        aboutClub: {
          ...data.aboutClub,
          imageSrc: data.aboutClub.imageSrc || defaultContent.aboutClub.imageSrc,
        },
      }
      setContent(loadedContent)
      toast({
        title: "Innehåll laddat",
        description: "Webbplatsens innehåll har laddats.",
      })
    } catch (error) {
      console.error("Failed to fetch content:", error)
      toast({
        title: "Fel vid laddning",
        description: "Kunde inte ladda webbplatsens innehåll. Använder standardinnehåll.",
        variant: "destructive",
      })
      setContent(defaultContent) // Fallback to default content on error
    }
  }, [toast])

  useEffect(() => {
    if (!loading) {
      // Only fetch content once auth status is known
      fetchContent()
    }
  }, [fetchContent, loading])

  const handleSave = async () => {
    try {
      const response = await fetch("/api/editor-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(content),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      toast({
        title: "Ändringar sparade",
        description: result.message,
      })
    } catch (error) {
      console.error("Failed to save content:", error)
      toast({
        title: "Fel vid spara",
        description: "Kunde inte spara ändringarna.",
        variant: "destructive",
      })
    }
  }

  const handleReset = () => {
    setContent(defaultContent)
    toast({
      title: "Innehåll återställt",
      description: "Webbplatsens innehåll har återställts till standard.",
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        <p>Laddar autentisering...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        <p>Du måste vara inloggad för att redigera innehåll.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)]">
      <div className="bg-gray-100/50 py-4 px-6 flex items-center justify-between border-b">
        <h2 className="text-xl font-semibold">Redigeringsläge</h2>
        <Badge variant="secondary" className="bg-green-500 text-white">
          Redigeringsläge Aktivt
        </Badge>
        <div className="flex gap-2">
          <Button onClick={handleSave}>Spara ändringar</Button>
          <Button variant="outline" onClick={handleReset}>
            Återställ
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-6 space-y-12">
        <HeroSection content={content.hero} setContent={setContent} isEditing={isEditing} />
        <AboutClubSection content={content.aboutClub} setContent={setContent} isEditing={isEditing} />
        <StatsSection content={content.stats} setContent={setContent} isEditing={isEditing} />
        <PartnersCarouselSection content={content.partners} setContent={setContent} isEditing={isEditing} />
        <UpcomingEventsSection content={content.upcomingEvents} setContent={setContent} isEditing={isEditing} />
      </div>
    </div>
  )
}
