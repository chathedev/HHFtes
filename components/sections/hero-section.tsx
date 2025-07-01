"use client"

import type { ReactElement } from "react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import type { PageContent } from "@/lib/content-store"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

interface SelectedElementData {
  sectionKey: keyof PageContent
  elementId: string // Unique ID for the element within the section (e.g., "heroTitle", "aboutClubImage")
  type: "text" | "number" | "link" | "image" | "button" | "color" | "font-size" // Type of element being edited
  label: string // Label for the input field in the sidebar
  currentValue: string | number // The current value of the primary field (e.g., text content, URL)
  contentPath?: string // e.g., "hero.title", "aboutClub.imageSrc"
  additionalFields?: {
    field: string
    label: string
    type: "text" | "select" | "color" | "font-size"
    currentValue: string | number
    options?: { name: string; value: string; bgClass?: string; textClass?: string }[]
  }[]
}

interface HeroSectionProps {
  content: PageContent["hero"]
  isEditing?: boolean
  onElementSelect: (data: SelectedElementData) => void
  availablePages: { name: string; path: string }[]
}

export default function HeroSection({
  content,
  isEditing = false,
  onElementSelect,
  availablePages,
}: HeroSectionProps): ReactElement {
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false)
  const [tempContent, setTempContent] = useState(content)

  // Update tempContent when content prop changes (e.g., after save or reset)
  useState(() => {
    setTempContent(content)
  }, [content])

  const handleTempContentChange = (field: keyof PageContent["hero"], value: string | number) => {
    setTempContent((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveSettingsDialog = () => {
    // This dialog is for bulk editing, so we'll directly call onElementSelect for each field
    // This is a simplified approach for the dialog, assuming it's for direct content updates
    // For more granular control, each field in the dialog would trigger onElementSelect
    // For now, we'll just update the main content object via a dummy call to trigger the save
    onElementSelect({
      sectionKey: "hero",
      elementId: "heroSectionSettings",
      type: "text", // Dummy type
      label: "Hero Sektion Inställningar",
      currentValue: "",
      additionalFields: Object.keys(tempContent).map((key) => ({
        field: key as keyof PageContent["hero"],
        label: key, // Simplified label
        type: typeof tempContent[key as keyof PageContent["hero"]] === "string" ? "text" : "number", // Simplified type
        currentValue: tempContent[key as keyof PageContent["hero"]],
      })),
    })
    setIsSettingsDialogOpen(false)
  }

  const overlayColorOptions = [
    { name: "Mörk (Svart)", value: "from-black/70" },
    { name: "Ljus (Vit)", value: "from-white/70" },
    { name: "Primär Grön", value: "from-green-700/70" },
    { name: "Primär Blå", value: "from-blue-700/70" },
  ]

  const textColorOptions = [
    { name: "Vit", value: "text-white" },
    { name: "Svart", value: "text-gray-900" },
    { name: "Grå", value: "text-gray-600" },
    { name: "Grön Primär", value: "text-green-600" },
    { name: "Orange Primär", value: "text-orange-500" },
  ]

  const fontSizeOptions = [
    { name: "Liten (text-4xl)", value: "text-4xl" },
    { name: "Medium (text-5xl)", value: "text-5xl" },
    { name: "Stor (text-6xl)", value: "text-6xl" },
    { name: "Extra Stor (text-7xl)", value: "text-7xl" },
  ]

  const descriptionFontSizeOptions = [
    { name: "Liten (text-lg)", value: "text-lg" },
    { name: "Medium (text-xl)", value: "text-xl" },
    { name: "Stor (text-2xl)", value: "text-2xl" },
  ]

  const handleImageClick = () => {
    if (isEditing) {
      onElementSelect({
        sectionKey: "hero",
        elementId: "imageUrl",
        type: "image",
        label: "Hero Bild URL",
        currentValue: content.imageUrl,
      })
    }
  }

  const handleTitleClick = () => {
    if (isEditing) {
      onElementSelect({
        sectionKey: "hero",
        elementId: "title",
        type: "text",
        label: "Rubrik",
        currentValue: content.title,
        additionalFields: [
          {
            field: "titleTextColorClass",
            label: "Rubrik Färg",
            type: "color",
            currentValue: content.titleTextColorClass,
            options: textColorOptions,
          },
          {
            field: "titleFontSizeClass",
            label: "Rubrik Storlek",
            type: "font-size",
            currentValue: content.titleFontSizeClass,
            options: fontSizeOptions,
          },
        ],
      })
    }
  }

  const handleDescriptionClick = () => {
    if (isEditing) {
      onElementSelect({
        sectionKey: "hero",
        elementId: "description",
        type: "text",
        label: "Beskrivning",
        currentValue: content.description,
        additionalFields: [
          {
            field: "descriptionTextColorClass",
            label: "Beskrivning Färg",
            type: "color",
            currentValue: content.descriptionTextColorClass,
            options: textColorOptions,
          },
          {
            field: "descriptionFontSizeClass",
            label: "Beskrivning Storlek",
            type: "font-size",
            currentValue: content.descriptionFontSizeClass,
            options: descriptionFontSizeOptions,
          },
        ],
      })
    }
  }

  const handleButton1Click = () => {
    if (isEditing) {
      onElementSelect({
        sectionKey: "hero",
        elementId: "button1Text",
        type: "button",
        label: "Knapp 1 Text",
        currentValue: content.button1Text,
        additionalFields: [
          {
            field: "button1Link",
            label: "Knapp 1 Länk",
            type: "select",
            currentValue: content.button1Link,
            options: availablePages,
          },
          {
            field: "button1BgClass",
            label: "Knapp 1 Bakgrund",
            type: "color",
            currentValue: content.button1BgClass,
            options: [
              { name: "Grön Primär", value: "bg-green-600", bgClass: "bg-green-600", textClass: "text-white" },
              { name: "Vit Bakgrund", value: "bg-white", bgClass: "bg-white", textClass: "text-gray-800" },
              { name: "Svart Bakgrund", value: "bg-black", bgClass: "bg-black", textClass: "text-white" },
              { name: "Grå Bakgrund", value: "bg-gray-200", bgClass: "bg-gray-200", textClass: "text-gray-800" },
              { name: "Blå Primär", value: "bg-blue-600", bgClass: "bg-blue-600", textClass: "text-white" },
              { name: "Röd Primär", value: "bg-red-600", bgClass: "bg-red-600", textClass: "text-white" },
              { name: "Orange Primär", value: "bg-orange-500", bgClass: "bg-orange-500", textClass: "text-white" },
            ],
          },
          {
            field: "button1TextClass",
            label: "Knapp 1 Text Färg",
            type: "color",
            currentValue: content.button1TextClass,
            options: textColorOptions,
          },
        ],
      })
    }
  }

  const handleButton2Click = () => {
    if (isEditing) {
      onElementSelect({
        sectionKey: "hero",
        elementId: "button2Text",
        type: "button",
        label: "Knapp 2 Text",
        currentValue: content.button2Text,
        additionalFields: [
          {
            field: "button2Link",
            label: "Knapp 2 Länk",
            type: "select",
            currentValue: content.button2Link,
            options: availablePages,
          },
          {
            field: "button2BgClass",
            label: "Knapp 2 Bakgrund",
            type: "color",
            currentValue: content.button2BgClass,
            options: [
              { name: "Grön Primär", value: "bg-green-600", bgClass: "bg-green-600", textClass: "text-white" },
              { name: "Vit Bakgrund", value: "bg-white", bgClass: "bg-white", textClass: "text-gray-800" },
              { name: "Svart Bakgrund", value: "bg-black", bgClass: "bg-black", textClass: "text-white" },
              { name: "Grå Bakgrund", value: "bg-gray-200", bgClass: "bg-gray-200", textClass: "text-gray-800" },
              { name: "Blå Primär", value: "bg-blue-600", bgClass: "bg-blue-600", textClass: "text-white" },
              { name: "Röd Primär", value: "bg-red-600", bgClass: "bg-red-600", textClass: "text-white" },
              { name: "Orange Primär", value: "bg-orange-500", bgClass: "bg-orange-500", textClass: "text-white" },
            ],
          },
          {
            field: "button2TextClass",
            label: "Knapp 2 Text Färg",
            type: "color",
            currentValue: content.button2TextClass,
            options: textColorOptions,
          },
        ],
      })
    }
  }

  const handleOverlayClick = () => {
    if (isEditing) {
      onElementSelect({
        sectionKey: "hero",
        elementId: "overlayColorClass",
        type: "color",
        label: "Överlagringsfärg",
        currentValue: content.overlayColorClass,
        additionalFields: [
          {
            field: "overlayColorClass",
            label: "Överlagringsfärg",
            type: "color",
            currentValue: content.overlayColorClass,
            options: overlayColorOptions,
          },
        ],
      })
    }
  }

  return (
    <section className="relative h-[800px] w-full overflow-hidden">
      <div className={cn("relative h-full w-full", isEditing && "cursor-pointer group")} onClick={handleImageClick}>
        <Image
          src={content.imageUrl || "/placeholder.svg"}
          alt="Härnösands FF fotbollsplan"
          fill
          className="object-cover object-center"
          priority
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
        />
        {isEditing && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white text-lg font-bold">Redigera bild</span>
          </div>
        )}
      </div>
      <div
        className={cn(
          `absolute inset-0 bg-gradient-to-t ${content.overlayColorClass} to-transparent`,
          isEditing && "cursor-pointer group",
        )}
        onClick={handleOverlayClick}
      >
        {isEditing && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white text-lg font-bold">Redigera överlagring</span>
          </div>
        )}
      </div>
      <div className="relative z-10 flex h-full items-center justify-center p-8 md:p-12 text-center">
        <div className="max-w-3xl text-white">
          <h1
            className={cn(
              "font-bold leading-tight",
              content.titleFontSizeClass,
              content.titleTextColorClass,
              isEditing && "cursor-pointer group hover:outline hover:outline-2 hover:outline-white rounded px-1",
            )}
            onClick={handleTitleClick}
          >
            {content.title}
          </h1>
          <p
            className={cn(
              "mt-4",
              content.descriptionFontSizeClass,
              content.descriptionTextColorClass,
              isEditing && "cursor-pointer group hover:outline hover:outline-2 hover:outline-white rounded px-1",
            )}
            onClick={handleDescriptionClick}
          >
            {content.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link
              href={content.button1Link}
              className={cn(
                "inline-flex items-center justify-center rounded-md px-6 py-3 text-base font-medium shadow transition-colors",
                content.button1BgClass,
                content.button1TextClass,
                content.button1BgClass.includes("bg-white")
                  ? "border border-gray-300 hover:bg-gray-100"
                  : "hover:opacity-90",
                isEditing && "cursor-pointer group hover:outline hover:outline-2 hover:outline-white rounded px-1",
              )}
              onClick={(e) => {
                if (isEditing) {
                  e.preventDefault() // Prevent navigation in editing mode
                  handleButton1Click()
                }
              }}
            >
              {content.button1Text}
            </Link>
            <Link
              href={content.button2Link}
              className={cn(
                "inline-flex items-center justify-center rounded-md px-6 py-3 text-base font-medium shadow-sm transition-colors",
                content.button2BgClass,
                content.button2TextClass,
                content.button2BgClass.includes("bg-white")
                  ? "border border-gray-300 hover:bg-gray-100"
                  : "hover:opacity-90",
                isEditing && "cursor-pointer group hover:outline hover:outline-2 hover:outline-white rounded px-1",
              )}
              onClick={(e) => {
                if (isEditing) {
                  e.preventDefault() // Prevent navigation in editing mode
                  handleButton2Click()
                }
              }}
            >
              {content.button2Text}
            </Link>
          </div>
        </div>
      </div>

      {isEditing && (
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 right-4 z-30"
          onClick={() => setIsSettingsDialogOpen(true)}
        >
          <Settings className="h-5 w-5" />
          <span className="sr-only">Redigera Hero Sektion</span>
        </Button>
      )}

      {isEditing && (
        <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Redigera Hero Sektion</DialogTitle>
              <DialogDescription>
                Gör ändringar i rubrik, beskrivning, bilder, knappar och färger för hero-sektionen.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title-dialog" className="text-right">
                  Rubrik
                </Label>
                <Input
                  id="title-dialog"
                  value={tempContent.title}
                  onChange={(e) => handleTempContentChange("title", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Rubrik Färg</Label>
                <RadioGroup
                  value={tempContent.titleTextColorClass}
                  onValueChange={(value) => handleTempContentChange("titleTextColorClass", value)}
                  className="flex flex-col space-y-1 col-span-3"
                >
                  {textColorOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`title-text-${option.value}`} />
                      <Label htmlFor={`title-text-${option.value}`} className={option.value}>
                        {option.name}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Rubrik Storlek</Label>
                <Select
                  value={tempContent.titleFontSizeClass}
                  onValueChange={(value) => handleTempContentChange("titleFontSizeClass", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Välj storlek" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontSizeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description-dialog" className="text-right">
                  Beskrivning
                </Label>
                <Input
                  id="description-dialog"
                  value={tempContent.description}
                  onChange={(e) => handleTempContentChange("description", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Beskrivning Färg</Label>
                <RadioGroup
                  value={tempContent.descriptionTextColorClass}
                  onValueChange={(value) => handleTempContentChange("descriptionTextColorClass", value)}
                  className="flex flex-col space-y-1 col-span-3"
                >
                  {textColorOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`desc-text-${option.value}`} />
                      <Label htmlFor={`desc-text-${option.value}`} className={option.value}>
                        {option.name}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Beskrivning Storlek</Label>
                <Select
                  value={tempContent.descriptionFontSizeClass}
                  onValueChange={(value) => handleTempContentChange("descriptionFontSizeClass", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Välj storlek" />
                  </SelectTrigger>
                  <SelectContent>
                    {descriptionFontSizeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="imageUrl-dialog" className="text-right">
                  Bild URL
                </Label>
                <Input
                  id="imageUrl-dialog"
                  value={tempContent.imageUrl}
                  onChange={(e) => handleTempContentChange("imageUrl", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="button1Text-dialog" className="text-right">
                  Knapp 1 Text
                </Label>
                <Input
                  id="button1Text-dialog"
                  value={tempContent.button1Text}
                  onChange={(e) => handleTempContentChange("button1Text", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="button1Link-dialog" className="text-right">
                  Knapp 1 Länk
                </Label>
                <Select
                  value={tempContent.button1Link}
                  onValueChange={(value) => handleTempContentChange("button1Link", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Välj sida" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePages.map((page) => (
                      <SelectItem key={page.path} value={page.path}>
                        {page.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="button2Text-dialog" className="text-right">
                  Knapp 2 Text
                </Label>
                <Input
                  id="button2Text-dialog"
                  value={tempContent.button2Text}
                  onChange={(e) => handleTempContentChange("button2Text", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="button2Link-dialog" className="text-right">
                  Knapp 2 Länk
                </Label>
                <Select
                  value={tempContent.button2Link}
                  onValueChange={(value) => handleTempContentChange("button2Link", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Välj sida" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePages.map((page) => (
                      <SelectItem key={page.path} value={page.path}>
                        {page.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Överlagringsfärg</Label>
                <RadioGroup
                  value={tempContent.overlayColorClass}
                  onValueChange={(value) => handleTempContentChange("overlayColorClass", value)}
                  className="flex flex-col space-y-1 col-span-3"
                >
                  {overlayColorOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`overlay-${option.value}`} />
                      <Label htmlFor={`overlay-${option.value}`}>{option.name}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSettingsDialogOpen(false)}>
                Avbryt
              </Button>
              <Button onClick={handleSaveSettingsDialog}>Spara ändringar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </section>
  )
}

// Provide the required named export while preserving default export
export { default as HeroSection } from "./hero-section" /* path resolves to this same file */
