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
import { Loader2, Save, XCircle } from "lucide-react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

export default function EditorPage() {
  const [content, setContent] = useState<PageContent | null>(null)
  const [isEditing, setIsEditing] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isColorSheetOpen, setIsColorSheetOpen] = useState(false)
  const [currentColorTarget, setCurrentColorTarget] = useState<{
    section: keyof PageContent
    fieldBg: string // Field for background class
    fieldTxt: string // Field for text class
    currentBgValue: string
    currentTxtValue: string
  } | null>(null)
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

  const openColorPicker = useCallback(
    (
      section: keyof PageContent,
      fieldBg: string,
      fieldTxt: string,
      currentBgValue: string,
      currentTxtValue: string,
    ) => {
      setCurrentColorTarget({ section, fieldBg, fieldTxt, currentBgValue, currentTxtValue })
      setIsColorSheetOpen(true)
    },
    [],
  )

  const handleColorChange = useCallback(
    (selectedBgClass: string) => {
      if (currentColorTarget) {
        const selectedOption = colorOptions.find((option) => option.bgClass === selectedBgClass)
        if (selectedOption) {
          handleContentChange(currentColorTarget.section, currentColorTarget.fieldBg, selectedOption.bgClass)
          handleContentChange(currentColorTarget.section, currentColorTarget.fieldTxt, selectedOption.textClass)
          setCurrentColorTarget((prev) =>
            prev
              ? {
                  ...prev,
                  currentBgValue: selectedOption.bgClass,
                  currentTxtValue: selectedOption.textClass,
                }
              : null,
          )
        }
      }
    },
    [currentColorTarget, handleContentChange],
  )

  const colorOptions = [
    { name: "Grön Primär", bgClass: "bg-green-600", textClass: "text-white" },
    { name: "Vit Bakgrund", bgClass: "bg-white", textClass: "text-gray-800" },
    { name: "Svart Bakgrund", bgClass: "bg-black", textClass: "text-white" },
    { name: "Grå Bakgrund", bgClass: "bg-gray-200", textClass: "text-gray-800" },
    { name: "Blå Primär", bgClass: "bg-blue-600", textClass: "text-white" },
    { name: "Röd Primär", bgClass: "bg-red-600", textClass: "text-white" },
  ]

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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Editor Control Bar (Left Sidebar) */}
      <div className="sticky top-0 z-50 bg-white shadow-md p-4 flex flex-col items-start justify-between border-r border-gray-200 w-64 shrink-0">
        <div className="flex flex-col gap-4 w-full">
          <h1 className="text-2xl font-bold text-gray-800">Redigeringsläge</h1>
          {isEditing && (
            <Badge variant="secondary" className="bg-green-100 text-green-700 px-3 py-1 text-sm">
              Redigeringsläge Aktivt
            </Badge>
          )}
          <div className="flex items-center space-x-2 mt-4">
            <Switch id="edit-mode" checked={isEditing} onCheckedChange={setIsEditing} />
            <Label htmlFor="edit-mode" className="text-gray-700">
              Aktivera redigering
            </Label>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full mt-auto">
          <Button onClick={handleReset} variant="outline" disabled={isSaving} className="w-full bg-transparent">
            <XCircle className="mr-2 h-4 w-4" />
            Återställ
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="w-full">
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {isSaving ? "Sparar..." : "Spara ändringar"}
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <main
        className={cn(
          "relative flex-1 transition-all duration-300",
          isColorSheetOpen ? "mr-[300px]" : "mr-0", // Adjust margin to "push" content
        )}
      >
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
                  openColorPicker={openColorPicker}
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

      {/* Right-Side Color Customization Sheet */}
      <Sheet open={isColorSheetOpen} onOpenChange={setIsColorSheetOpen}>
        <SheetContent
          side="right"
          className="w-[300px] sm:w-[300px] flex flex-col p-4 bg-white shadow-lg border-l border-gray-200"
        >
          <h2 className="text-xl font-bold mb-4">Välj Färg</h2>
          {currentColorTarget && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Redigerar: <span className="font-semibold">{currentColorTarget.fieldBg.replace("BgClass", "")}</span>{" "}
                (Bakgrund & Text)
              </p>
              <RadioGroup
                value={currentColorTarget.currentBgValue}
                onValueChange={handleColorChange}
                className="flex flex-col space-y-2"
              >
                {colorOptions.map((option) => (
                  <div key={option.bgClass} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.bgClass} id={option.bgClass} />
                    <Label htmlFor={option.bgClass} className="flex items-center gap-2 cursor-pointer">
                      <span
                        className={cn(
                          "w-6 h-6 rounded-full border",
                          option.bgClass,
                          option.textClass === "text-white" ? "border-gray-300" : "border-transparent",
                        )}
                      />
                      {option.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}
          <Button onClick={() => setIsColorSheetOpen(false)} className="mt-auto">
            Stäng
          </Button>
        </SheetContent>
      </Sheet>
    </div>
  )
}
