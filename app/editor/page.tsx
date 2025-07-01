"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { type PageContent, loadContent, defaultContent } from "@/lib/content-store"
import HeroSection from "@/components/sections/hero-section"
import StatsSection from "@/components/sections/stats-section"
import AboutClubSection from "@/components/sections/about-club-section"
import PartnersCarouselSection from "@/components/sections/partners-carousel-section"
import UpcomingEventsSection from "@/components/upcoming-events-section"
import { saveEditorContentServer } from "@/app/actions/editor-content"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Save, XCircle } from "lucide-react" // Removed GripVertical

export default function EditorPage() {
  const [content, setContent] = useState<PageContent | null>(null)
  const [isEditing, setIsEditing] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const fetchContent = useCallback(async () => {
    setIsLoading(true)
    try {
      const loadedContent = await loadContent()
      // Explicitly set the image URLs to ensure they are not placeholders
      loadedContent.hero.imageUrl = "https://az316141.cdn.laget.se/2317159/11348130.jpg"
      loadedContent.aboutClub.imageSrc =
        "https://i.ibb.co/Zt8gppK/491897759-17872413642339702-3719173158843008539-n.jpg"
      setContent(loadedContent)
    } catch (error) {
      console.error("Failed to load content:", error)
      toast({
        title: "Fel vid laddning",
        description: "Kunde inte ladda innehåll. Laddar standardinnehåll.",
        variant: "destructive",
      })
      setContent(defaultContent) // Fallback to default if loading fails
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  const handleContentChange = useCallback(
    (section: keyof PageContent, field: string, value: string | number) => {
      if (!content) return
      setContent((prevContent) => {
        if (!prevContent) return null
        const updatedSection = {
          ...prevContent[section],
          [field]: value,
        } as PageContent[keyof PageContent]
        return {
          ...prevContent,
          [section]: updatedSection,
        }
      })
    },
    [content],
  )

  const handleSave = async () => {
    if (!content) return

    setIsSaving(true)
    try {
      const result = await saveEditorContentServer(content)
      if (result.success) {
        toast({
          title: "Innehåll sparat!",
          description: "Dina ändringar har sparats framgångsrikt.",
        })
      } else {
        toast({
          title: "Fel vid sparning",
          description: result.message || "Kunde inte spara ändringar.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to save content:", error)
      toast({
        title: "Fel vid sparning",
        description: "Ett oväntat fel uppstod vid sparning.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    setContent(defaultContent)
    toast({
      title: "Innehåll återställt",
      description: "Innehållet har återställts till standardvärden.",
    })
  }

  if (isLoading || !content) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-2 text-gray-700">Laddar redigerare...</span>
      </div>
    )
  }

  const availablePages = [
    { name: "Hem", path: "/" },
    { name: "Kalender", path: "/kalender" },
    { name: "Lag", path: "/lag" },
    { name: "Matcher", path: "/matcher" },
    { name: "Nyheter", path: "/nyheter" },
    { name: "Partners", path: "/partners" },
    { name: "Kontakt", path: "/kontakt" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Editor Control Bar */}
      <div className="sticky top-0 z-50 bg-white shadow-md p-4 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Redigeringsläge</h1>
          {isEditing && (
            <Badge variant="secondary" className="bg-green-100 text-green-700 px-3 py-1 text-sm">
              Redigeringsläge Aktivt
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch id="edit-mode" checked={isEditing} onCheckedChange={setIsEditing} />
            <Label htmlFor="edit-mode" className="text-gray-700">
              Aktivera redigering
            </Label>
          </div>
          <Button onClick={handleReset} variant="outline" disabled={isSaving}>
            <XCircle className="mr-2 h-4 w-4" />
            Återställ
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {isSaving ? "Sparar..." : "Spara ändringar"}
          </Button>
        </div>
      </div>

      {/* Render Sections based on content.sections order */}
      <main className="relative">
        {content.sections.map((sectionKey) => {
          switch (sectionKey) {
            case "hero":
              return (
                <HeroSection
                  key="hero"
                  content={content.hero}
                  isEditing={isEditing}
                  onContentChange={(field, value) => handleContentChange("hero", field, value)}
                  availablePages={availablePages}
                />
              )
            case "stats":
              return (
                <StatsSection
                  key="stats"
                  content={content.stats}
                  isEditing={isEditing}
                  onContentChange={(field, value) => handleContentChange("stats", field, value)}
                />
              )
            case "aboutClub":
              return (
                <AboutClubSection
                  key="aboutClub"
                  content={content.aboutClub}
                  isEditing={isEditing}
                  onContentChange={(field, value) => handleContentChange("aboutClub", field, value)}
                  availablePages={availablePages}
                />
              )
            case "partnersCarousel":
              return (
                <PartnersCarouselSection
                  key="partnersCarousel"
                  content={content.partnersCarousel}
                  isEditing={isEditing}
                  onContentChange={(field, value) => handleContentChange("partnersCarousel", field, value)}
                  availablePages={availablePages}
                />
              )
            case "upcomingEvents":
              return (
                <UpcomingEventsSection
                  key="upcomingEvents"
                  content={content.upcomingEvents}
                  isEditing={isEditing}
                  onContentChange={(field, value) => handleContentChange("upcomingEvents", field, value)}
                />
              )
            default:
              return null
          }
        })}
      </main>
    </div>
  )
}
