"use client"

import type { ReactElement } from "react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import ArrowRight from "lucide-react" // Import ArrowRight component
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
import { cn } from "@/lib/utils"

interface SelectedElementData {
  sectionKey: keyof PageContent
  elementId: string
  type: "text" | "number" | "link" | "image" | "button" | "color" | "font-size" | "select"
  label: string
  currentValue: string | number
  contentPath: string
  additionalFields?: {
    field: string
    label: string
    type: "text" | "select" | "color" | "font-size" | "number"
    currentValue: string | number
    options?: { name: string; value: string; bgClass?: string; textClass?: string }[]
  }[]
}

interface HeroSectionProps {
  content: PageContent["hero"]
  isEditing?: boolean
  onElementSelect: (data: SelectedElementData) => void
  handleInlineEdit: (path: string, newValue: string) => void
  availablePages: { name: string; path: string }[]
}

export default function HeroSection({
  content,
  isEditing = false,
  onElementSelect,
  handleInlineEdit,
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
      contentPath: "hero", // Dummy path
      additionalFields: Object.keys(tempContent).map((key) => ({
        field: key as keyof PageContent["hero"],
        label: key, // Simplified label
        type: typeof tempContent[key as keyof PageContent["hero"]] === "string" ? "text" : "number", // Simplified type
        currentValue: tempContent[key as keyof PageContent["hero"]],
        contentPath: `hero.${key}`, // Full path for updateContentProperty
      })),
    })
    setIsSettingsDialogOpen(false)
  }

  const overlayColorOptions = [
    { name: "Mörk (Svart)", value: "rgba(0, 0, 0, 0.6)" },
    { name: "Ljus (Vit)", value: "rgba(255, 255, 255, 0.6)" },
    { name: "Primär Grön", value: "rgba(22, 163, 74, 0.7)" }, // green-700
    { name: "Primär Blå", value: "rgba(37, 99, 235, 0.7)" }, // blue-600
  ]

  const textColorOptions = [
    { name: "Vit", value: "#FFFFFF" },
    { name: "Svart", value: "#1F2937" }, // gray-900
    { name: "Grå", value: "#6B7280" }, // gray-600
    { name: "Grön Primär", value: "#16A34A" }, // green-600
    { name: "Orange Primär", value: "#F97316" }, // orange-500
  ]

  const fontSizeOptions = [
    { name: "Liten (text-4xl)", value: "text-4xl" },
    { name: "Medium (text-5xl)", value: "text-5xl" },
    { name: "Stor (text-6xl)", value: "text-6xl" },
    { name: "Extra Stor (text-7xl)", value: "text-7xl" },
    { name: "Jätte Stor (text-8xl)", value: "text-8xl" },
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
        contentPath: "hero.imageUrl",
      })
    }
  }

  const handleButton1Click = () => {
    if (isEditing) {
      onElementSelect({
        sectionKey: "hero",
        elementId: "button1",
        type: "button",
        label: "Knapp 1",
        currentValue: content.button1Text,
        contentPath: "hero.button1Text",
        additionalFields: [
          {
            field: "button1Link",
            label: "Knapp 1 Länk",
            type: "select",
            currentValue: content.button1Link,
            options: availablePages,
            contentPath: "hero.button1Link",
          },
          {
            field: "button1BgColor",
            label: "Knapp 1 Bakgrund",
            type: "color",
            currentValue: content.button1BgColor,
            options: textColorOptions, // Reusing for color picker, but it's a direct color input
            contentPath: "hero.button1BgColor",
          },
          {
            field: "button1TextColor",
            label: "Knapp 1 Text Färg",
            type: "color",
            currentValue: content.button1TextColor,
            options: textColorOptions, // Reusing for color picker
            contentPath: "hero.button1TextColor",
          },
        ],
      })
    }
  }

  const handleButton2Click = () => {
    if (isEditing) {
      onElementSelect({
        sectionKey: "hero",
        elementId: "button2",
        type: "button",
        label: "Knapp 2",
        currentValue: content.button2Text,
        contentPath: "hero.button2Text",
        additionalFields: [
          {
            field: "button2Link",
            label: "Knapp 2 Länk",
            type: "select",
            currentValue: content.button2Link,
            options: availablePages,
            contentPath: "hero.button2Link",
          },
          {
            field: "button2BgColor",
            label: "Knapp 2 Bakgrund",
            type: "color",
            currentValue: content.button2BgColor,
            options: textColorOptions, // Reusing for color picker
            contentPath: "hero.button2BgColor",
          },
          {
            field: "button2TextColor",
            label: "Knapp 2 Text Färg",
            type: "color",
            currentValue: content.button2TextColor,
            options: textColorOptions, // Reusing for color picker
            contentPath: "hero.button2TextColor",
          },
        ],
      })
    }
  }

  const handleOverlayClick = () => {
    if (isEditing) {
      onElementSelect({
        sectionKey: "hero",
        elementId: "overlayColor",
        type: "color",
        label: "Överlagringsfärg",
        currentValue: content.overlayColor,
        contentPath: "hero.overlayColor",
        additionalFields: [
          {
            field: "overlayColor",
            label: "Överlagringsfärg",
            type: "color",
            currentValue: content.overlayColor,
            options: overlayColorOptions, // Reusing for color picker
            contentPath: "hero.overlayColor",
          },
        ],
      })
    }
  }

  return (
    <section className="relative h-[800px] w-full flex items-center justify-center overflow-hidden">
      <div className={cn("absolute inset-0", isEditing && "cursor-pointer group")} onClick={handleImageClick}>
        <Image
          src={content.imageUrl || "/placeholder.svg"}
          alt="Härnösands FF fotbollsplan"
          fill
          className="object-cover object-center"
          priority
          unoptimized
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
          `absolute inset-0 bg-gradient-to-t ${content.overlayColor.includes("rgba") ? "" : "from-black/60"} to-transparent`,
          isEditing && "cursor-pointer group",
        )}
        style={
          content.overlayColor.includes("rgba")
            ? { background: `linear-gradient(to top, ${content.overlayColor}, transparent)` }
            : {}
        }
        onClick={handleOverlayClick}
      >
        {isEditing && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white text-lg font-bold">Redigera överlagring</span>
          </div>
        )}
      </div>
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1
          className={cn(
            "font-extrabold mb-4 leading-tight tracking-tight animate-fade-in-up",
            content.titleFontSizeClass,
            isEditing && "cursor-text group hover:outline hover:outline-2 hover:outline-white rounded px-1",
          )}
          style={{ color: content.titleColor }}
          contentEditable={isEditing}
          suppressContentEditableWarning={true}
          onBlur={(e) => handleInlineEdit("hero.title", e.currentTarget.innerText)}
        >
          {content.title}
        </h1>
        <p
          className={cn(
            "mb-10 max-w-3xl mx-auto animate-fade-in-up delay-200",
            content.descriptionFontSizeClass,
            isEditing && "cursor-text group hover:outline hover:outline-2 hover:outline-white rounded px-1",
          )}
          style={{ color: content.descriptionColor }}
          contentEditable={isEditing}
          suppressContentEditableWarning={true}
          onBlur={(e) => handleInlineEdit("hero.description", e.currentTarget.innerText)}
        >
          {content.description}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6 animate-fade-in-up delay-400">
          <Button
            asChild
            className={cn(
              "px-10 py-4 rounded-md text-lg font-semibold shadow-lg transition-transform duration-300 hover:scale-105",
              isEditing && "cursor-pointer group hover:outline hover:outline-2 hover:outline-white rounded px-1",
            )}
            style={{ backgroundColor: content.button1BgColor, color: content.button1TextColor }}
            onClick={(e) => {
              if (isEditing) {
                e.preventDefault()
                handleButton1Click()
              }
            }}
          >
            <Link href={content.button1Link}>
              {content.button1Text}
              <ArrowRight className="ml-3 h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            className={cn(
              "px-10 py-4 rounded-md text-lg font-semibold shadow-lg transition-transform duration-300 hover:scale-105",
              isEditing && "cursor-pointer group hover:outline hover:outline-2 hover:outline-white rounded px-1",
            )}
            style={{ backgroundColor: content.button2BgColor, color: content.button2TextColor }}
            onClick={(e) => {
              if (isEditing) {
                e.preventDefault()
                handleButton2Click()
              }
            }}
          >
            <Link href={content.button2Link}>{content.button2Text}</Link>
          </Button>
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
                <Input
                  type="color"
                  value={tempContent.titleColor}
                  onChange={(e) => handleTempContentChange("titleColor", e.target.value)}
                  className="col-span-3 h-10 w-full"
                />
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
                <Input
                  type="color"
                  value={tempContent.descriptionColor}
                  onChange={(e) => handleTempContentChange("descriptionColor", e.target.value)}
                  className="col-span-3 h-10 w-full"
                />
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
                <Label htmlFor="button1BgColor-dialog" className="text-right">
                  Knapp 1 Bakgrund
                </Label>
                <Input
                  type="color"
                  id="button1BgColor-dialog"
                  value={tempContent.button1BgColor}
                  onChange={(e) => handleTempContentChange("button1BgColor", e.target.value)}
                  className="col-span-3 h-10 w-full"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="button1TextColor-dialog" className="text-right">
                  Knapp 1 Text Färg
                </Label>
                <Input
                  type="color"
                  id="button1TextColor-dialog"
                  value={tempContent.button1TextColor}
                  onChange={(e) => handleTempContentChange("button1TextColor", e.target.value)}
                  className="col-span-3 h-10 w-full"
                />
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
                <Label htmlFor="button2BgColor-dialog" className="text-right">
                  Knapp 2 Bakgrund
                </Label>
                <Input
                  type="color"
                  id="button2BgColor-dialog"
                  value={tempContent.button2BgColor}
                  onChange={(e) => handleTempContentChange("button2BgColor", e.target.value)}
                  className="col-span-3 h-10 w-full"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="button2TextColor-dialog" className="text-right">
                  Knapp 2 Text Färg
                </Label>
                <Input
                  type="color"
                  id="button2TextColor-dialog"
                  value={tempContent.button2TextColor}
                  onChange={(e) => handleTempContentChange("button2TextColor", e.target.value)}
                  className="col-span-3 h-10 w-full"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Överlagringsfärg</Label>
                <Input
                  type="color"
                  value={tempContent.overlayColor.startsWith("rgba") ? "#000000" : tempContent.overlayColor} // Default to black if rgba
                  onChange={(e) => handleTempContentChange("overlayColor", e.target.value)}
                  className="col-span-3 h-10 w-full"
                />
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
