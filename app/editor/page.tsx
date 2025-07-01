"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { type PageContent, loadContent } from "@/lib/content-store"
import { saveEditorContentServer, resetEditorContentServer } from "@/app/actions/editor-content"
import { Badge } from "@/components/ui/badge" // Import Badge for editing mode indicator

// Import the section components
import HeroSection from "@/components/sections/hero-section"
import StatsSection from "@/components/sections/stats-section"
import AboutClubSection from "@/components/sections/about-club-section"
import PartnersCarouselSection from "@/components/sections/partners-carousel-section"
import UpcomingEventsSection from "@/components/upcoming-events-section"

export default function EditorPage() {
  const [content, setContent] = useState<PageContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true)
      try {
        const fetchedContent = await loadContent()

        // Explicitly ensure correct image URLs for the editor,
        // overriding any stale data from the backend if necessary.
        fetchedContent.hero.imageUrl = "https://az316141.cdn.laget.se/2317159/11348130.jpg"
        fetchedContent.aboutClub.imageSrc =
          "https://i.ibb.co/Zt8gppK/491897759-17872413642339702-3719173158843008539-n.jpg"

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
        // Ensure correct images after reset as well
        fetchedContent.hero.imageUrl = "https://az316141.cdn.laget.se/2317159/11348130.jpg"
        fetchedContent.aboutClub.imageSrc =
          "https://i.ibb.co/Zt8gppK/491897759-17872413642339702-3719173158843008539-n.jpg"
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
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-green-700 to-orange-500 shadow-lg z-50 p-4 flex flex-col sm:flex-row justify-center items-center gap-4 border-b border-gray-300">
        <Badge variant="secondary" className="bg-white text-green-800 px-3 py-1 text-sm font-semibold">
          Redigeringsläge Aktivt
        </Badge>
        <div className="flex gap-4">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-white hover:bg-gray-100 text-green-800 font-semibold"
          >
            {saving ? "Sparar..." : "Spara ändringar"}
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            disabled={saving}
            className="bg-white hover:bg-gray-100 text-orange-700 font-semibold border-orange-700"
          >
            Återställ till standard
          </Button>
        </div>
      </div>

      {/* Live Preview of the website sections */}
      <div className="pt-28">
        {" "}
        {/* Increased padding-top to account for enhanced fixed header */}
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
        <UpcomingEventsSection />
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
  )
}
