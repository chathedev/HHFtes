"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { type PageContent, loadContent } from "@/lib/content-store"
import { saveEditorContentServer, resetEditorContentServer } from "@/app/actions/editor-content"

// Import the section components
import HeroSection from "@/components/sections/hero-section"
import StatsSection from "@/components/sections/stats-section"
import AboutClubSection from "@/components/sections/about-club-section"
import PartnersCarouselSection from "@/components/sections/partners-carousel-section"
import UpcomingEventsSection from "@/components/upcoming-events-section" // This one is not editable via content.json

export default function EditorPage() {
  const [content, setContent] = useState<PageContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true)
      try {
        const fetchedContent = await loadContent()
        setContent(fetchedContent)
      } catch (error) {
        console.error("Failed to load content for editor:", error)
        toast({
          title: "Fel vid laddning",
          description: "Kunde inte ladda innehåll från servern.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchContent()
  }, [])

  // Generic handler for content changes from child components
  const handleContentChange = useCallback(
    (sectionKey: keyof PageContent, field: keyof PageContent[keyof PageContent], value: string | number) => {
      if (!content) return

      setContent((prevContent) => {
        if (!prevContent) return null

        const updatedSection = {
          ...prevContent[sectionKey],
          [field]: value,
        }

        return {
          ...prevContent,
          [sectionKey]: updatedSection,
        }
      })
    },
    [content],
  )

  const handleSave = useCallback(async () => {
    if (!content) return
    setSaving(true)
    const result = await saveEditorContentServer(content)
    if (result.success) {
      toast({
        title: "Innehåll sparat!",
        description: result.message,
        variant: "default",
      })
    } else {
      toast({
        title: "Fel vid sparning",
        description: result.message,
        variant: "destructive",
      })
    }
    setSaving(false)
  }, [content])

  const handleReset = useCallback(async () => {
    if (window.confirm("Är du säker på att du vill återställa allt innehåll till standard? Detta kan inte ångras.")) {
      setLoading(true)
      try {
        const fetchedContent = await resetEditorContentServer()
        setContent(fetchedContent)
        toast({
          title: "Innehåll återställt!",
          description: "Allt innehåll har återställts till standardvärden.",
          variant: "default",
        })
      } catch (error) {
        console.error("Failed to reset content:", error)
        toast({
          title: "Fel vid återställning",
          description: "Kunde inte återställa innehåll från servern.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Laddar redigerare...</div>
  }

  if (!content) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Kunde inte ladda innehåll för redigering.
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Editor Controls */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 p-4 flex justify-center gap-4 border-b border-gray-200">
        <Button onClick={handleSave} disabled={saving} className="bg-orange-500 hover:bg-orange-600 text-white">
          {saving ? "Sparar..." : "Spara ändringar"}
        </Button>
        <Button onClick={handleReset} variant="outline" disabled={saving}>
          Återställ till standard
        </Button>
      </div>

      {/* Live Preview of the website sections */}
      <div className="pt-20 bg-gray-100 min-h-screen">
        <div className="max-w-screen-lg mx-auto bg-white shadow-lg border-x border-gray-200">
          <HeroSection
            content={content.hero}
            isEditing={true}
            onContentChange={(field, value) => handleContentChange("hero", field, value)}
          />
          <StatsSection
            content={content.stats}
            isEditing={true}
            onContentChange={(field, value) => handleContentChange("stats", field, value)}
          />
          <UpcomingEventsSection /> {/* This section is dynamic and not editable via content.json */}
          <AboutClubSection
            content={content.aboutClub}
            isEditing={true}
            onContentChange={(field, value) => handleContentChange("aboutClub", field, value)}
          />
          <PartnersCarouselSection
            content={content.partnersCarousel}
            isEditing={true}
            onContentChange={(field, value) => handleContentChange("partnersCarousel", field, value)}
          />
        </div>
      </div>
    </div>
  )
}
