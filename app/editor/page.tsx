"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { type PageContent, loadContent } from "@/lib/content-store"
import { saveEditorContentServer, resetEditorContentServer } from "@/app/actions/editor-content"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Settings } from "lucide-react"

// Import editable versions of pages/sections
import HeroSection from "@/components/sections/hero-section"
import StatsSection from "@/components/sections/stats-section"
import AboutClubSection from "@/components/sections/about-club-section"
import PartnersCarouselSection from "@/components/sections/partners-carousel-section"
import UpcomingEventsSection from "@/components/upcoming-events-section" // Not editable via content.json

// New: Editable versions of full pages
import EditablePartnersPage from "@/app/partners/editable-page"
import EditableKontaktPage from "@/app/kontakt/editable-page"

// New: Component for the right-side editor sidebar
import EditorRightSidebar from "@/components/editor-right-sidebar"

// New: Dropdown for page selection
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function EditorPage() {
  const [content, setContent] = useState<PageContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [currentPage, setCurrentPage] = useState<string>("/") // State for selected page to edit

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

  const handleThemeChange = useCallback(
    (field: keyof PageContent["theme"], value: string) => {
      if (!content) return

      setContent((prevContent) => {
        if (!prevContent) return null
        return {
          ...prevContent,
          theme: {
            ...prevContent.theme,
            [field]: value,
          },
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

  // Dynamically render the selected page for editing
  const renderEditablePage = () => {
    switch (currentPage) {
      case "/":
        return (
          <>
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
            <UpcomingEventsSection /> {/* Not editable via content.json */}
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
          </>
        )
      case "/partners":
        return (
          <EditablePartnersPage
            content={content.partnersPage}
            isEditing={true}
            onContentChange={(field, value) => handleContentChange("partnersPage", field, value)}
          />
        )
      case "/kontakt":
        return (
          <EditableKontaktPage
            content={content.kontaktPage}
            isEditing={true}
            onContentChange={(field, value) => handleContentChange("kontaktPage", field, value)}
          />
        )
      default:
        return <div className="text-center text-gray-500 py-10">Välj en sida att redigera.</div>
    }
  }

  return (
    <div className="relative">
      {/* Editor Controls */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 p-4 flex justify-center items-center gap-4 border-b border-gray-200">
        <Select onValueChange={setCurrentPage} value={currentPage}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Välj sida" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="/">Hem</SelectItem>
            <SelectItem value="/partners">Partners</SelectItem>
            <SelectItem value="/kontakt">Kontakt</SelectItem>
            {/* Add other pages here if they become editable */}
          </SelectContent>
        </Select>
        <Button onClick={handleSave} disabled={saving} className="bg-orange-500 hover:bg-orange-600 text-white">
          {saving ? "Sparar..." : "Spara ändringar"}
        </Button>
        <Button onClick={handleReset} variant="outline" disabled={saving}>
          Återställ till standard
        </Button>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="ml-auto bg-transparent">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Öppna stilredigerare</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 sm:w-96">
            <EditorRightSidebar content={content.theme} onContentChange={handleThemeChange} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Live Preview of the website sections */}
      <div className="pt-20">{renderEditablePage()}</div>

      {/* Apply dynamic theme styles */}
      <style jsx global>{`
        :root {
          --primary: ${content.theme.primaryColor};
          --secondary: ${content.theme.secondaryColor};
          --background: ${content.theme.backgroundColor};
          --foreground: ${content.theme.foregroundColor};
          --card: ${content.theme.cardColor};
          --card-foreground: ${content.theme.cardForegroundColor};
          --popover: ${content.theme.popoverColor};
          --popover-foreground: ${content.theme.popoverForegroundColor};
          --primary-foreground: ${content.theme.primaryForegroundColor};
          --secondary-foreground: ${content.theme.secondaryForegroundColor};
          --muted: ${content.theme.mutedColor};
          --muted-foreground: ${content.theme.mutedForegroundColor};
          --accent: ${content.theme.accentColor};
          --accent-foreground: ${content.theme.accentForegroundColor};
          --destructive: ${content.theme.destructiveColor};
          --destructive-foreground: ${content.theme.destructiveForegroundColor};
          --border: ${content.theme.borderColor};
          --input: ${content.theme.inputColor};
          --ring: ${content.theme.ringColor};
          --radius: ${content.theme.borderRadius};
        }
      `}</style>
    </div>
  )
}
