"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { saveContent, loadContent } from "@/app/actions/editor-content"
import { HeroSection } from "@/components/sections/hero-section"
import { StatsSection } from "@/components/sections/stats-section"
import { AboutClubSection } from "@/components/sections/about-club-section"
import { PartnersCarouselSection } from "@/components/sections/partners-carousel-section"
import { UpcomingEventsSection } from "@/components/upcoming-events-section"
import { useIsMobile } from "@/hooks/use-mobile" // Import the hook

type ElementType = "text" | "button" | "image" | "link" | "number"

interface SelectedElementData {
  id: string
  type: ElementType
  value: string | number
  section: string
  property: string
  link?: string
  alt?: string
  color?: string
  fontSize?: string
}

const FONT_SIZES = [
  "text-xs",
  "text-sm",
  "text-base",
  "text-lg",
  "text-xl",
  "text-2xl",
  "text-3xl",
  "text-4xl",
  "text-5xl",
  "text-6xl",
]
const COLORS = [
  { name: "Black", value: "text-black" },
  { name: "White", value: "text-white" },
  { name: "Gray 500", value: "text-gray-500" },
  { name: "Red 500", value: "text-red-500" },
  { name: "Orange 500", value: "text-orange-500" },
  { name: "Yellow 500", value: "text-yellow-500" },
  { name: "Green 500", value: "text-green-500" },
  { name: "Blue 500", value: "text-blue-500" },
  { name: "Indigo 500", value: "text-indigo-500" },
  { name: "Purple 500", value: "text-purple-500" },
  { name: "Pink 500", value: "text-pink-500" },
]

export default function EditorPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState<any>(null)
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false)
  const [selectedElementData, setSelectedElementData] = useState<SelectedElementData | null>(null)
  const { toast } = useToast()
  const isMobile = useIsMobile() // Use the hook

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const loadedContent = await loadContent()
        setContent(loadedContent)
      } catch (error) {
        console.error("Failed to load content:", error)
        toast({
          title: "Error",
          description: "Failed to load content. Please try again.",
          variant: "destructive",
        })
      }
    }
    fetchContent()
  }, [toast])

  const handleSave = useCallback(async () => {
    if (!content) return

    try {
      await saveContent(content)
      toast({
        title: "Success",
        description: "Content saved successfully!",
      })
    } catch (error) {
      console.error("Failed to save content:", error)
      toast({
        title: "Error",
        description: "Failed to save content. Please try again.",
        variant: "destructive",
      })
    }
  }, [content, toast])

  const handleReset = useCallback(async () => {
    try {
      const defaultContent = await loadContent(true) // Load default content
      setContent(defaultContent)
      toast({
        title: "Success",
        description: "Content reset to default.",
      })
    } catch (error) {
      console.error("Failed to reset content:", error)
      toast({
        title: "Error",
        description: "Failed to reset content. Please try again.",
        variant: "destructive",
      })
    }
  }, [toast])

  const onElementSelect = useCallback((data: SelectedElementData) => {
    setSelectedElementData(data)
    setIsRightSidebarOpen(true)
  }, [])

  const handlePropertyChange = useCallback(
    (newValue: string | number) => {
      if (!selectedElementData || !content) return

      const { section, property, type } = selectedElementData

      setContent((prevContent: any) => {
        const updatedContent = { ...prevContent }
        if (updatedContent[section]) {
          if (type === "number") {
            updatedContent[section][property] = Number(newValue)
          } else {
            updatedContent[section][property] = newValue
          }
        }
        return updatedContent
      })

      setSelectedElementData((prev) => (prev ? { ...prev, value: newValue } : null))
    },
    [selectedElementData, content],
  )

  const handleLinkChange = useCallback(
    (newLink: string) => {
      if (!selectedElementData || !content) return

      const { section, property } = selectedElementData
      setContent((prevContent: any) => {
        const updatedContent = { ...prevContent }
        if (updatedContent[section]) {
          // Assuming link is a property of the element itself, e.g., button.link or image.src
          updatedContent[section][property] = {
            ...updatedContent[section][property],
            link: newLink,
          }
        }
        return updatedContent
      })
      setSelectedElementData((prev) => (prev ? { ...prev, link: newLink } : null))
    },
    [selectedElementData, content],
  )

  const handleAltChange = useCallback(
    (newAlt: string) => {
      if (!selectedElementData || !content) return

      const { section, property } = selectedElementData
      setContent((prevContent: any) => {
        const updatedContent = { ...prevContent }
        if (updatedContent[section]) {
          updatedContent[section][property] = {
            ...updatedContent[section][property],
            alt: newAlt,
          }
        }
        return updatedContent
      })
      setSelectedElementData((prev) => (prev ? { ...prev, alt: newAlt } : null))
    },
    [selectedElementData, content],
  )

  const handleColorChange = useCallback(
    (newColor: string) => {
      if (!selectedElementData || !content) return

      const { section, property } = selectedElementData
      setContent((prevContent: any) => {
        const updatedContent = { ...prevContent }
        if (updatedContent[section]) {
          updatedContent[section][property] = {
            ...updatedContent[section][property],
            color: newColor,
          }
        }
        return updatedContent
      })
      setSelectedElementData((prev) => (prev ? { ...prev, color: newColor } : null))
    },
    [selectedElementData, content],
  )

  const handleFontSizeChange = useCallback(
    (newSize: string) => {
      if (!selectedElementData || !content) return

      const { section, property } = selectedElementData
      setContent((prevContent: any) => {
        const updatedContent = { ...prevContent }
        if (updatedContent[section]) {
          updatedContent[section][property] = {
            ...updatedContent[section][property],
            fontSize: newSize,
          }
        }
        return updatedContent
      })
      setSelectedElementData((prev) => (prev ? { ...prev, fontSize: newSize } : null))
    },
    [selectedElementData, content],
  )

  if (!content) {
    return <div className="flex items-center justify-center min-h-screen">Loading editor...</div>
  }

  return (
    <div className="flex flex-col min-h-screen">
      {isMobile ? (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 bg-gray-100 text-gray-800">
          <h1 className="text-2xl font-bold mb-4">Editor Not Available on Mobile</h1>
          <p className="text-lg">Please access the editor from a desktop computer for the best experience.</p>
        </div>
      ) : (
        <>
          {/* Top Bar for Editor Controls */}
          <div className="fixed top-0 left-0 w-full bg-gray-800 text-white p-4 z-50 flex justify-between items-center shadow-lg">
            <h1 className="text-xl font-bold">Website Editor</h1>
            <div className="flex gap-4">
              <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "destructive" : "default"}>
                {isEditing ? "Exit Editing" : "Enter Editing"}
              </Button>
              {isEditing && (
                <>
                  <Button onClick={handleSave} variant="secondary">
                    Save Changes
                  </Button>
                  <Button onClick={handleReset} variant="outline">
                    Reset to Default
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 pt-20">
            {" "}
            {/* Add padding-top to account for fixed header */}
            <HeroSection isEditing={isEditing} onElementSelect={onElementSelect} content={content.heroSection} />
            <StatsSection isEditing={isEditing} onElementSelect={onElementSelect} content={content.statsSection} />
            <AboutClubSection
              isEditing={isEditing}
              onElementSelect={onElementSelect}
              content={content.aboutClubSection}
            />
            <PartnersCarouselSection
              isEditing={isEditing}
              onElementSelect={onElementSelect}
              content={content.partnersCarouselSection}
            />
            <UpcomingEventsSection
              isEditing={isEditing}
              onElementSelect={onElementSelect}
              content={content.upcomingEventsSection}
            />
          </div>

          {/* Right Sidebar for Element Properties */}
          <Sheet open={isRightSidebarOpen} onOpenChange={setIsRightSidebarOpen}>
            <SheetContent className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Edit Element</SheetTitle>
                <SheetDescription>Adjust the properties of the selected {selectedElementData?.type}.</SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                {selectedElementData?.type === "text" && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="text-value" className="text-right">
                        Text
                      </Label>
                      <Input
                        id="text-value"
                        value={selectedElementData.value as string}
                        onChange={(e) => handlePropertyChange(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="font-size" className="text-right">
                        Font Size
                      </Label>
                      <RadioGroup
                        id="font-size"
                        value={selectedElementData.fontSize || "text-base"}
                        onValueChange={handleFontSizeChange}
                        className="col-span-3 flex flex-wrap gap-2"
                      >
                        {FONT_SIZES.map((size) => (
                          <div key={size} className="flex items-center space-x-2">
                            <RadioGroupItem value={size} id={size} />
                            <Label htmlFor={size}>{size.replace("text-", "")}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="color" className="text-right">
                        Color
                      </Label>
                      <RadioGroup
                        id="color"
                        value={selectedElementData.color || "text-black"}
                        onValueChange={handleColorChange}
                        className="col-span-3 flex flex-wrap gap-2"
                      >
                        {COLORS.map((color) => (
                          <div key={color.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={color.value} id={color.value} />
                            <Label htmlFor={color.value} className={`flex items-center gap-1 ${color.value}`}>
                              <span
                                className={`w-4 h-4 rounded-full border ${color.value.replace("text-", "bg-")}`}
                              ></span>
                              {color.name}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </>
                )}

                {selectedElementData?.type === "number" && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="number-value" className="text-right">
                      Number
                    </Label>
                    <Input
                      id="number-value"
                      type="number"
                      value={selectedElementData.value as number}
                      onChange={(e) => handlePropertyChange(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                )}

                {selectedElementData?.type === "button" && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="button-text" className="text-right">
                        Button Text
                      </Label>
                      <Input
                        id="button-text"
                        value={selectedElementData.value as string}
                        onChange={(e) => handlePropertyChange(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="button-link" className="text-right">
                        Link URL
                      </Label>
                      <Input
                        id="button-link"
                        value={selectedElementData.link || ""}
                        onChange={(e) => handleLinkChange(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="font-size" className="text-right">
                        Font Size
                      </Label>
                      <RadioGroup
                        id="font-size"
                        value={selectedElementData.fontSize || "text-base"}
                        onValueChange={handleFontSizeChange}
                        className="col-span-3 flex flex-wrap gap-2"
                      >
                        {FONT_SIZES.map((size) => (
                          <div key={size} className="flex items-center space-x-2">
                            <RadioGroupItem value={size} id={size} />
                            <Label htmlFor={size}>{size.replace("text-", "")}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="color" className="text-right">
                        Color
                      </Label>
                      <RadioGroup
                        id="color"
                        value={selectedElementData.color || "text-black"}
                        onValueChange={handleColorChange}
                        className="col-span-3 flex flex-wrap gap-2"
                      >
                        {COLORS.map((color) => (
                          <div key={color.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={color.value} id={color.value} />
                            <Label htmlFor={color.value} className={`flex items-center gap-1 ${color.value}`}>
                              <span
                                className={`w-4 h-4 rounded-full border ${color.value.replace("text-", "bg-")}`}
                              ></span>
                              {color.name}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </>
                )}

                {selectedElementData?.type === "image" && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="image-src" className="text-right">
                        Image URL
                      </Label>
                      <Input
                        id="image-src"
                        value={selectedElementData.value as string}
                        onChange={(e) => handlePropertyChange(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="image-alt" className="text-right">
                        Alt Text
                      </Label>
                      <Input
                        id="image-alt"
                        value={selectedElementData.alt || ""}
                        onChange={(e) => handleAltChange(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="image-link" className="text-right">
                        Link URL (Optional)
                      </Label>
                      <Input
                        id="image-link"
                        value={selectedElementData.link || ""}
                        onChange={(e) => handleLinkChange(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </>
      )}
    </div>
  )
}
