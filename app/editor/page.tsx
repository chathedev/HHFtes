"use client"

import { useEffect, useState, useTransition } from "react"
import { loadContent, saveContent, defaultContent, type PageContent } from "@/lib/content-store"
import HeroSection from "@/components/sections/hero-section"
import AboutClubSection from "@/components/sections/about-club-section"
import PartnersCarouselSection from "@/components/sections/partners-carousel-section"
import UpcomingEventsSection from "@/components/upcoming-events-section"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Save, RefreshCcw } from "lucide-react"

export default function EditorPage() {
  const [content, setContent] = useState<PageContent>(defaultContent)
  const [isEditing, setIsEditing] = useState(true)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const availablePages = [
    { name: "Hem", path: "/" },
    { name: "Kalender", path: "/kalender" },
    { name: "Lag", path: "/lag" },
    { name: "Matcher", path: "/matcher" },
    { name: "Nyheter", path: "/nyheter" },
    { name: "Partners", path: "/partners" },
    { name: "Kontakt", path: "/kontakt" },
    { name: "Logga in", path: "/login" },
  ]

  useEffect(() => {
    startTransition(async () => {
      const fetchedContent = await loadContent()
      // Explicitly set image URLs to ensure they are not placeholders in editor
      setContent({
        ...fetchedContent,
        hero: {
          ...fetchedContent.hero,
          imageUrl: "https://az316141.cdn.laget.se/2317159/11348130.jpg",
        },
        aboutClub: {
          ...fetchedContent.aboutClub,
          imageSrc: "https://i.ibb.co/Zt8gppK/491897759-17872413642339702-3719173158843008539-n.jpg",
        },
      })
    })
  }, [])

  const handleContentChange = (section: keyof PageContent, field: string, value: string | number) => {
    setContent((prevContent) => ({
      ...prevContent,
      [section]: {
        ...prevContent[section],
        [field]: value,
      },
    }))
  }

  const handleSave = async () => {
    startTransition(async () => {
      const result = await saveContent(content)
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
    })
  }

  const handleReset = () => {
    startTransition(async () => {
      // Reset to default content, ensuring correct images
      setContent({
        ...defaultContent,
        hero: {
          ...defaultContent.hero,
          imageUrl: "https://az316141.cdn.laget.se/2317159/11348130.jpg",
        },
        aboutClub: {
          ...defaultContent.aboutClub,
          imageSrc: "https://i.ibb.co/Zt8gppK/491897759-17872413642339702-3719173158843008539-n.jpg",
        },
      })
      toast({
        title: "Innehåll återställt!",
        description: "Sidan har återställts till standardinnehållet.",
        variant: "default",
      })
    })
  }

  return (
    <div className="relative min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50 w-full bg-white shadow-md p-4 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Redigeringsläge</h1>
          <Badge variant="secondary" className="bg-green-100 text-green-700 px-3 py-1 text-sm">
            Redigeringsläge Aktivt
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleReset} variant="outline" disabled={isPending}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            {isPending ? "Återställer..." : "Återställ"}
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            {isPending ? "Sparar..." : "Spara ändringar"}
          </Button>
        </div>
      </div>

      <main className="relative z-10">
        <HeroSection
          content={content.hero}
          isEditing={isEditing}
          onContentChange={(field, value) => handleContentChange("hero", field, value)}
          availablePages={availablePages}
        />
        <AboutClubSection
          content={content.aboutClub}
          isEditing={isEditing}
          onContentChange={(field, value) => handleContentChange("aboutClub", field, value)}
          availablePages={availablePages}
        />
        <PartnersCarouselSection
          content={content.partners}
          isEditing={isEditing}
          onContentChange={(field, value) => handleContentChange("partners", field, value)}
        />
        <UpcomingEventsSection
          content={content.upcomingEvents}
          isEditing={isEditing}
          onContentChange={(field, value) => handleContentChange("upcomingEvents", field, value)}
        />
      </main>
    </div>
  )
}
