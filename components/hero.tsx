"use client"

import type React from "react"

import type { ReactElement } from "react"
import Image from "next/image"
import Link from "next/link"
import type { PageContent } from "@/lib/content-store"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface HeroSectionProps {
  content: PageContent["hero"]
  isEditing?: boolean
  onContentChange?: (field: keyof PageContent["hero"], value: string | number) => void
  availablePages: { name: string; path: string }[]
  openEditorSidebar: (
    section: keyof PageContent,
    field: string,
    editType: "text" | "number" | "link" | "image" | "color" | "fontSize" | "textColor" | "overlayColor",
    currentValue?: string | number,
    currentLinkValue?: string,
    currentBgValue?: string,
    currentTxtValue?: string,
    options?: { name: string; value: string }[],
  ) => void
}

export default function HeroSection({
  content,
  isEditing = false,
  onContentChange,
  availablePages,
  openEditorSidebar,
}: HeroSectionProps): ReactElement {
  const handleTextChange = (field: keyof PageContent["hero"], e: React.ChangeEvent<HTMLDivElement>) => {
    if (onContentChange) {
      onContentChange(field, e.currentTarget.innerText)
    }
  }

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

  const overlayColorOptions = [
    { name: "Mörk (Svart)", value: "from-black/70" },
    { name: "Ljus (Vit)", value: "from-white/70" },
    { name: "Primär Grön", value: "from-green-700/70" },
    { name: "Primär Blå", value: "from-blue-700/70" },
  ]

  return (
    <section className="relative h-[800px] w-full overflow-hidden">
      <div
        className="absolute inset-0"
        onClick={() => isEditing && openEditorSidebar("hero", "imageUrl", "image", content.imageUrl)}
      >
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
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer">
            <span className="text-white text-lg font-bold">Redigera bild</span>
          </div>
        )}
      </div>
      <div
        className={`absolute inset-0 bg-gradient-to-t ${content.overlayColorClass} to-transparent`}
        onClick={() =>
          isEditing &&
          openEditorSidebar(
            "hero",
            "overlayColorClass",
            "overlayColor",
            content.overlayColorClass,
            undefined,
            undefined,
            undefined,
            overlayColorOptions,
          )
        }
      />
      <div className="relative z-10 flex h-full items-center justify-center p-8 md:p-12 text-center">
        <div className="max-w-3xl text-white">
          <h1
            className={cn(
              "font-bold leading-tight outline-none focus:ring-2 focus:ring-white rounded px-1",
              content.titleFontSizeClass,
              content.titleTextColorClass,
            )}
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={(e) => handleTextChange("title", e)}
            onClick={() =>
              isEditing &&
              openEditorSidebar("hero", "title", "text", content.title, undefined, undefined, undefined, undefined)
            }
          >
            {content.title}
          </h1>
          {isEditing && (
            <div className="flex justify-center gap-2 mt-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() =>
                  openEditorSidebar(
                    "hero",
                    "titleTextColorClass",
                    "textColor",
                    content.titleTextColorClass,
                    undefined,
                    undefined,
                    undefined,
                    textColorOptions,
                  )
                }
              >
                Färg
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() =>
                  openEditorSidebar(
                    "hero",
                    "titleFontSizeClass",
                    "fontSize",
                    content.titleFontSizeClass,
                    undefined,
                    undefined,
                    undefined,
                    fontSizeOptions,
                  )
                }
              >
                Storlek
              </Button>
            </div>
          )}
          <p
            className={cn(
              "mt-4 outline-none focus:ring-2 focus:ring-white rounded px-1",
              content.descriptionFontSizeClass,
              content.descriptionTextColorClass,
            )}
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={(e) => handleTextChange("description", e)}
            onClick={() =>
              isEditing &&
              openEditorSidebar(
                "hero",
                "description",
                "text",
                content.description,
                undefined,
                undefined,
                undefined,
                undefined,
              )
            }
          >
            {content.description}
          </p>
          {isEditing && (
            <div className="flex justify-center gap-2 mt-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() =>
                  openEditorSidebar(
                    "hero",
                    "descriptionTextColorClass",
                    "textColor",
                    content.descriptionTextColorClass,
                    undefined,
                    undefined,
                    undefined,
                    textColorOptions,
                  )
                }
              >
                Färg
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() =>
                  openEditorSidebar(
                    "hero",
                    "descriptionFontSizeClass",
                    "fontSize",
                    content.descriptionFontSizeClass,
                    undefined,
                    undefined,
                    undefined,
                    descriptionFontSizeOptions,
                  )
                }
              >
                Storlek
              </Button>
            </div>
          )}
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
              )}
              onClick={(e) => {
                if (isEditing) {
                  e.preventDefault()
                  openEditorSidebar(
                    "hero",
                    "button1Text",
                    "link",
                    content.button1Text,
                    content.button1Link,
                    content.button1BgClass,
                    content.button1TextClass,
                    availablePages,
                  )
                }
              }}
            >
              <span
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleTextChange("button1Text", e)}
                className="outline-none focus:ring-2 focus:ring-white rounded px-1"
              >
                {content.button1Text}
              </span>
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
              )}
              onClick={(e) => {
                if (isEditing) {
                  e.preventDefault()
                  openEditorSidebar(
                    "hero",
                    "button2Text",
                    "link",
                    content.button2Text,
                    content.button2Link,
                    content.button2BgClass,
                    content.button2TextClass,
                    availablePages,
                  )
                }
              }}
            >
              <span
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleTextChange("button2Text", e)}
                className="outline-none focus:ring-2 focus:ring-white rounded px-1"
              >
                {content.button2Text}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
