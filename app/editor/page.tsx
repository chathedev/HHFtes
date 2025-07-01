"use client"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
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

// Define SelectedElementData interface for sidebar-editable elements
interface SelectedElementData {
  sectionKey: keyof PageContent
  elementId: string // Unique ID for the element within the section (e.g., "heroImage", "button1Link")
  type: "link" | "image" | "button" | "color" | "font-size" | "select" | "text" | "number" // Type of element being edited
  label: string // Label for the input field in the sidebar
  currentValue: string | number // The current value of the primary field (e.g., text content, URL)
  contentPath: string // Dot-separated path to the property in PageContent (e.g., "hero.imageUrl")
  additionalFields?: {
    field: string // The actual field name in the content object (e.g., "imageAlt", "button1Link")
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

  // Function to update nested properties in pageContent state
  const updateContentProperty = useCallback((path: string, value: string | number) => {
    setPageContent((prevContent) => {
      const newContent = { ...prevContent }
      const pathParts = path.split(".")
      let current: any = newContent

      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i]
        if (!current[part]) {
          current[part] = {} // Create nested object if it doesn't exist
        }
        current = current[part]
      }
      current[pathParts[pathParts.length - 1]] = value
      return newContent
    })
  }, [])

  // Handle inline text/number editing (onBlur)
  const handleInlineEdit = useCallback(
    (path: string, newValue: string) => {
      if (!isEditing) return
      updateContentProperty(path, newValue)
    },
    [isEditing, updateContentProperty],
  )

  // Handle sidebar element selection
  const handleElementSelect = useCallback((data: SelectedElementData) => {
    setSelectedElementData(data)
    setIsRightSidebarOpen(true)
  }, [])

  // Handle updates from sidebar inputs
  const handleSidebarUpdate = useCallback(
    (fieldPath: string, newValue: string | number) => {
      updateContentProperty(fieldPath, newValue)
      // Also update the selectedElementData's currentValue if it's the primary field
      if (selectedElementData && selectedElementData.contentPath === fieldPath) {
        setSelectedElementData((prev) => (prev ? { ...prev, currentValue: newValue } : null))
      } else if (selectedElementData && selectedElementData.additionalFields) {
        // Update additional fields in selectedElementData
        setSelectedElementData((prev) => {
          if (!prev) return null
          const updatedAdditionalFields = prev.additionalFields?.map((field) =>
            field.contentPath === fieldPath ? { ...field, currentValue: newValue } : field,
          )
          return { ...prev, additionalFields: updatedAdditionalFields }
        })
      }
    },
    [selectedElementData, updateContentProperty],
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
          handleInlineEdit={handleInlineEdit}
          availablePages={availablePages}
        />
        <StatsSection
          content={pageContent.stats}
          isEditing={isEditing}
          onElementSelect={handleElementSelect}
          handleInlineEdit={handleInlineEdit}
        />
        <UpcomingEventsSection
          content={pageContent.upcomingEvents}
          isEditing={isEditing}
          onElementSelect={handleElementSelect}
          handleInlineEdit={handleInlineEdit}
        />
        <AboutClubSection
          content={pageContent.aboutClub}
          isEditing={isEditing}
          onElementSelect={handleElementSelect}
          handleInlineEdit={handleInlineEdit}
          availablePages={availablePages}
        />
        <PartnersCarouselSection
          content={pageContent.partnersCarousel}
          isEditing={isEditing}
          onElementSelect={handleElementSelect}
          handleInlineEdit={handleInlineEdit}
          availablePages={availablePages}
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
                {/* Primary field input (for image URL, button link, etc.) */}
                {(selectedElementData.type === "image" || selectedElementData.type === "link") && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="main-input" className="text-right">
                      {selectedElementData.label}
                    </Label>
                    <Input
                      id="main-input"
                      value={selectedElementData.currentValue as string}
                      onChange={(e) => handleSidebarUpdate(selectedElementData.contentPath, e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                )}

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
                        onChange={(e) => handleSidebarUpdate(fieldData.contentPath, e.target.value)}
                        className="col-span-3"
                      />
                    ) : fieldData.type === "number" ? (
                      <Input
                        id={fieldData.field}
                        type="number"
                        value={fieldData.currentValue as number}
                        onChange={(e) => handleSidebarUpdate(fieldData.contentPath, Number(e.target.value))}
                        className="col-span-3"
                      />
                    ) : fieldData.type === "color" ? (
                      <Input
                        id={fieldData.field}
                        type="color"
                        value={fieldData.currentValue as string}
                        onChange={(e) => handleSidebarUpdate(fieldData.contentPath, e.target.value)}
                        className="col-span-3 h-10 w-full"
                      />
                    ) : fieldData.type === "font-size" && fieldData.options ? (
                      <Select
                        value={fieldData.currentValue as string}
                        onValueChange={(value) => handleSidebarUpdate(fieldData.contentPath, value)}
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
                        onValueChange={(value) => handleSidebarUpdate(fieldData.contentPath, value)}
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
