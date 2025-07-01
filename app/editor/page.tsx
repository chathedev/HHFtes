"use client"

import { cn } from "@/lib/utils"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Save, RotateCcw, X } from "lucide-react"
import { loadContent, defaultContent, type PageContent } from "@/lib/content-store"
import { saveContent } from "@/app/actions/editor-content"
import HeroSection from "@/components/sections/hero-section"
import StatsSection from "@/components/sections/stats-section"
import AboutClubSection from "@/components/sections/about-club-section"
import PartnersCarouselSection from "@/components/sections/partners-carousel-section"
import UpcomingEventsSection from "@/components/upcoming-events-section"
import { useMobile } from "@/hooks/use-mobile"
import { useToast } from "@/hooks/use-toast"

// Define SelectedElementData interface here or in a shared types file
interface SelectedElementData {
  sectionKey: keyof PageContent
  elementId: string // Unique ID for the element within the section (e.g., "heroTitle", "aboutClubImage")
  type: "text" | "number" | "link" | "image" | "button" | "color" | "font-size" | "select" // Type of element being edited
  label: string // Label for the input field in the sidebar
  currentValue: string | number // The current value of the primary field (e.g., text content, URL)
  contentPath?: string // e.g., "hero.title", "aboutClub.imageSrc"
  additionalFields?: {
    field: string
    label: string
    type: "text" | "select" | "color" | "font-size" | "number"
    currentValue: string | number
    options?: { name: string; value: string; bgClass?: string; textClass?: string }[]
  }[]
}

export default function EditorPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [pageContent, setPageContent] = useState<PageContent>(defaultContent) // Initialize with defaultContent
  const [originalContent, setOriginalContent] = useState<PageContent>(defaultContent) // Initialize with defaultContent
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false)
  const [selectedElementData, setSelectedElementData] = useState<SelectedElementData | null>(null)
  const { toast } = useToast()
  const isMobile = useMobile()

  const availablePages = [
    { name: "Hem", path: "/" },
    { name: "Kontakt", path: "/kontakt" },
    { name: "Partners", path: "/partners" },
    { name: "Lag", path: "/lag" },
    { name: "Matcher", path: "/matcher" },
    { name: "Kalender", path: "/kalender" },
    { name: "Nyheter", path: "/nyheter" },
  ]

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const fetchedContent = await loadContent()
        setPageContent(fetchedContent)
        setOriginalContent(fetchedContent)
      } catch (error) {
        console.error("Failed to load content:", error)
        toast({
          title: "Fel vid laddning",
          description: "Kunde inte ladda innehåll från servern. Visar standardinnehåll.",
          variant: "destructive",
        })
        setPageContent(defaultContent)
        setOriginalContent(defaultContent)
      }
    }
    fetchContent()
  }, [toast])

  const handleElementSelect = useCallback((data: SelectedElementData) => {
    setSelectedElementData(data)
    setIsRightSidebarOpen(true)
  }, [])

  const handleElementUpdate = useCallback(
    (field: string, value: string | number) => {
      if (!selectedElementData) return

      setPageContent((prevContent) => {
        const newContent = { ...prevContent }
        const section = newContent[selectedElementData.sectionKey] as any

        if (section) {
          // Update the primary field
          if (selectedElementData.elementId === field) {
            section[field] = value
          } else {
            // Update additional fields
            section[field] = value
          }
        }
        return newContent
      })
    },
    [selectedElementData],
  )

  const handleSave = async () => {
    try {
      await saveContent(pageContent)
      setOriginalContent(pageContent) // Update original content after successful save
      toast({
        title: "Innehåll sparat!",
        description: "Dina ändringar har sparats framgångsrikt.",
      })
    } catch (error) {
      console.error("Failed to save content:", error)
      toast({
        title: "Fel vid sparning",
        description: "Kunde inte spara innehållet. Försök igen.",
        variant: "destructive",
      })
    }
  }

  const handleReset = () => {
    setPageContent(originalContent)
    toast({
      title: "Ändringar återställda",
      description: "Innehållet har återställts till den senast sparade versionen.",
    })
  }

  if (isMobile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Redigeringsläge</h1>
        <p className="text-gray-700">För att redigera webbplatsen, vänligen använd en dator eller en större skärm.</p>
        <p className="text-gray-500 mt-2">Mobilredigering stöds inte för närvarande.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Bar for Editor Controls */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-green-700">Härnösands FF Editor</h1>
          <div className="flex items-center gap-2">
            <Label htmlFor="editing-mode">Redigeringsläge</Label>
            <Switch id="editing-mode" checked={isEditing} onCheckedChange={setIsEditing} />
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={!isEditing}>
            <Save className="mr-2 h-4 w-4" /> Spara
          </Button>
          <Button variant="outline" onClick={handleReset} disabled={!isEditing}>
            <RotateCcw className="mr-2 h-4 w-4" /> Återställ
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 relative">
        <HeroSection
          content={pageContent.hero}
          isEditing={isEditing}
          onElementSelect={handleElementSelect}
          availablePages={availablePages}
        />
        <StatsSection content={pageContent.stats} isEditing={isEditing} onElementSelect={handleElementSelect} />
        <UpcomingEventsSection
          content={pageContent.upcomingEvents} // Assuming upcomingEvents is part of PageContent now
          isEditing={isEditing}
          onElementSelect={handleElementSelect}
        />
        <AboutClubSection content={pageContent.aboutClub} isEditing={isEditing} onElementSelect={handleElementSelect} />
        <PartnersCarouselSection
          content={pageContent.partnersCarousel}
          isEditing={isEditing}
          onElementSelect={handleElementSelect}
        />
      </main>

      {/* Right Sidebar for Element Editing */}
      <Sheet open={isRightSidebarOpen && isEditing} onOpenChange={setIsRightSidebarOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Redigera {selectedElementData?.label}</SheetTitle>
            <SheetDescription>Justera innehållet och stilen för det valda elementet.</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            {selectedElementData && (
              <>
                {/* Primary field input */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="main-input" className="text-right">
                    {selectedElementData.label}
                  </Label>
                  {selectedElementData.type === "text" ||
                  selectedElementData.type === "image" ||
                  selectedElementData.type === "link" ||
                  selectedElementData.type === "button" ? (
                    <Input
                      id="main-input"
                      value={selectedElementData.currentValue as string}
                      onChange={(e) => handleElementUpdate(selectedElementData.elementId, e.target.value)}
                      className="col-span-3"
                    />
                  ) : selectedElementData.type === "number" ? (
                    <Input
                      id="main-input"
                      type="number"
                      value={selectedElementData.currentValue as number}
                      onChange={(e) => handleElementUpdate(selectedElementData.elementId, Number(e.target.value))}
                      className="col-span-3"
                    />
                  ) : selectedElementData.type === "select" && selectedElementData.additionalFields?.[0]?.options ? (
                    <Select
                      value={selectedElementData.currentValue as string}
                      onValueChange={(value) => handleElementUpdate(selectedElementData.elementId, value)}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder={`Välj ${selectedElementData.label.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedElementData.additionalFields[0].options.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : null}
                </div>

                {/* Additional fields */}
                {selectedElementData.additionalFields?.map((fieldData) => (
                  <div key={fieldData.field} className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor={fieldData.field} className="text-right">
                      {fieldData.label}
                    </Label>
                    {fieldData.type === "text" ? (
                      <Input
                        id={fieldData.field}
                        value={fieldData.currentValue as string}
                        onChange={(e) => handleElementUpdate(fieldData.field, e.target.value)}
                        className="col-span-3"
                      />
                    ) : fieldData.type === "number" ? (
                      <Input
                        id={fieldData.field}
                        type="number"
                        value={fieldData.currentValue as number}
                        onChange={(e) => handleElementUpdate(fieldData.field, Number(e.target.value))}
                        className="col-span-3"
                      />
                    ) : fieldData.type === "color" && fieldData.options ? (
                      <RadioGroup
                        value={fieldData.currentValue as string}
                        onValueChange={(value) => handleElementUpdate(fieldData.field, value)}
                        className="flex flex-col space-y-1 col-span-3"
                      >
                        {fieldData.options.map((option) => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.value} id={`${fieldData.field}-${option.value}`} />
                            <Label htmlFor={`${fieldData.field}-${option.value}`} className={option.textClass}>
                              {option.name}
                              {option.bgClass && (
                                <span className={cn("ml-2 w-4 h-4 inline-block rounded-full", option.bgClass)} />
                              )}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    ) : fieldData.type === "font-size" && fieldData.options ? (
                      <Select
                        value={fieldData.currentValue as string}
                        onValueChange={(value) => handleElementUpdate(fieldData.field, value)}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder={`Välj ${fieldData.label.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {fieldData.options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : fieldData.type === "select" && fieldData.options ? (
                      <Select
                        value={fieldData.currentValue as string}
                        onValueChange={(value) => handleElementUpdate(fieldData.field, value)}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder={`Välj ${fieldData.label.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {fieldData.options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : null}
                  </div>
                ))}
              </>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsRightSidebarOpen(false)}>
              <X className="mr-2 h-4 w-4" /> Stäng
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
