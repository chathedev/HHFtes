"use client"

import { useEffect, useState, useTransition } from "react"
import { Loader2, RefreshCcw, Save } from "lucide-react"

import { defaultContent, loadContent, type PageContent } from "@/lib/content-store"
import HeroSection from "@/components/sections/hero-section"
import AboutClubSection from "@/components/sections/about-club-section"
import PartnersCarouselSection from "@/components/sections/partners-carousel-section"
import UpcomingEventsSection from "@/components/upcoming-events-section"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

/** All site paths the dropdowns may link to (except /editor). */
const pages = [
  { name: "Hem", path: "/" },
  { name: "Kalender", path: "/kalender" },
  { name: "Lag", path: "/lag" },
  { name: "Matcher", path: "/matcher" },
  { name: "Nyheter", path: "/nyheter" },
  { name: "Partners", path: "/partners" },
  { name: "Kontakt", path: "/kontakt" },
]

export default function EditorApp() {
  const [content, setContent] = useState<PageContent>(defaultContent)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  /* ───────────────────────── load initial content ───────────────────────── */
  useEffect(() => {
    startTransition(async () => {
      const fetchedContent = await loadContent()
      // Explicitly set image URLs to ensure they are not placeholders in editor
      fetchedContent.hero.imageUrl = "https://az316141.cdn.laget.se/2317159/11348130.jpg"
      fetchedContent.aboutClub.imageSrc =
        "https://i.ibb.co/Zt8gppK/491897759-17872413642339702-3719173158843008539-n.jpg"
      setContent(fetchedContent)
    })
  }, [])

  /* ─────────────────────────── helpers ─────────────────────────── */
  const handleContentChange = (section: keyof PageContent, field: string, value: string | number) =>
    setContent((c) => ({
      ...c,
      [section]: { ...c[section], [field]: value } as PageContent[keyof PageContent],
    }))

  const saveToServer = async () => {
    startTransition(async () => {
      const res = await fetch("/api/editor-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      }).then((r) => r.json())

      toast({
        title: res.success ? "Innehåll sparat!" : "Fel vid sparning",
        description: res.message ?? "",
        variant: res.success ? "default" : "destructive",
      })
    })
  }

  const resetContent = () => {
    const resetData = { ...defaultContent }
    // Ensure reset also uses the correct images
    resetData.hero.imageUrl = "https://az316141.cdn.laget.se/2317159/11348130.jpg"
    resetData.aboutClub.imageSrc = "https://i.ibb.co/Zt8gppK/491897759-17872413642339702-3719173158843008539-n.jpg"
    setContent(resetData)
    toast({ title: "Återställt!", description: "Standardinnehållet har laddats." })
  }

  /* ─────────────────────────── UI ─────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* control bar */}
      <div className="sticky top-0 z-50 flex items-center justify-between gap-4 bg-white p-4 shadow-md">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">Redigeringsläge</h1>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            Aktivt
          </Badge>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={resetContent} disabled={isPending}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Återställ
          </Button>
          <Button onClick={saveToServer} disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {isPending ? "Spara..." : "Spara"}
          </Button>
        </div>
      </div>

      {/* live preview */}
      <main>
        <HeroSection
          content={content.hero}
          isEditing
          onContentChange={(f, v) => handleContentChange("hero", f, v)}
          availablePages={pages}
        />
        <AboutClubSection
          content={content.aboutClub}
          isEditing
          onContentChange={(f, v) => handleContentChange("aboutClub", f, v)}
          availablePages={pages}
        />
        <PartnersCarouselSection
          content={content.partners}
          isEditing
          onContentChange={(f, v) => handleContentChange("partners", f, v)}
        />
        <UpcomingEventsSection
          content={content.upcomingEvents}
          isEditing
          onContentChange={(f, v) => handleContentChange("upcomingEvents", f, v)}
        />
      </main>
    </div>
  )
}
