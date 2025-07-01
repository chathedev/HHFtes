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

interface HeroSectionProps {
  content: PageContent["hero"]
  isEditing?: boolean
  onContentChange?: (field: keyof PageContent["hero"], value: string | number) => void
  availablePages: { name: string; path: string }[]
}

export default function HeroSection({
  content,
  isEditing = false,
  onContentChange,
  availablePages,
}: HeroSectionProps): ReactElement {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
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

  const handleSaveDialog = () => {
    if (onContentChange) {
      Object.keys(tempContent).forEach((key) => {
        onContentChange(key as keyof PageContent["hero"], tempContent[key as keyof PageContent["hero"]])
      })
    }
    setIsDialogOpen(false)
  }

  const overlayColorOptions = [
    { name: "Mörk (Svart)", value: "from-black/70" },
    { name: "Ljus (Vit)", value: "from-white/70" },
    { name: "Primär Grön", value: "from-green-700/70" },
    { name: "Primär Blå", value: "from-blue-700/70" },
  ]

  return (
    <section className="relative h-[800px] w-full overflow-hidden">
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
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <span className="text-white text-lg font-bold">Redigera bild</span>
        </div>
      )}
      <div className={`absolute inset-0 bg-gradient-to-t ${content.overlayColorClass} to-transparent`} />
      <div className="relative z-10 flex h-full items-center justify-center p-8 md:p-12 text-center">
        <div className="max-w-3xl text-white">
          <h1 className="text-4xl font-bold leading-tight md:text-6xl">{content.title}</h1>
          <p className="mt-4 text-lg md:text-xl">{content.description}</p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link
              href={content.button1Link}
              className="inline-flex items-center justify-center rounded-md bg-green-600 px-6 py-3 text-base font-medium text-white shadow transition-colors hover:bg-green-700"
            >
              {content.button1Text}
            </Link>
            <Link
              href={content.button2Link}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-800 shadow-sm transition-colors hover:bg-gray-100"
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
          onClick={() => setIsDialogOpen(true)}
        >
          <Settings className="h-5 w-5" />
          <span className="sr-only">Redigera Hero Sektion</span>
        </Button>
      )}

      {isEditing && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Redigera Hero Sektion</DialogTitle>
              <DialogDescription>
                Gör ändringar i rubrik, beskrivning, bilder, knappar och färger för hero-sektionen.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Rubrik
                </Label>
                <Input
                  id="title"
                  value={tempContent.title}
                  onChange={(e) => handleTempContentChange("title", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Beskrivning
                </Label>
                <Input
                  id="description"
                  value={tempContent.description}
                  onChange={(e) => handleTempContentChange("description", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="imageUrl" className="text-right">
                  Bild URL
                </Label>
                <Input
                  id="imageUrl"
                  value={tempContent.imageUrl}
                  onChange={(e) => handleTempContentChange("imageUrl", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="button1Text" className="text-right">
                  Knapp 1 Text
                </Label>
                <Input
                  id="button1Text"
                  value={tempContent.button1Text}
                  onChange={(e) => handleTempContentChange("button1Text", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="button1Link" className="text-right">
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
                <Label htmlFor="button2Text" className="text-right">
                  Knapp 2 Text
                </Label>
                <Input
                  id="button2Text"
                  value={tempContent.button2Text}
                  onChange={(e) => handleTempContentChange("button2Text", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="button2Link" className="text-right">
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
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Avbryt
              </Button>
              <Button onClick={handleSaveDialog}>Spara ändringar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </section>
  )
}
