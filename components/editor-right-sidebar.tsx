"use client"

import type * as React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import type { PageContent } from "@/lib/content-store"

interface EditorRightSidebarProps {
  content: PageContent["theme"]
  onContentChange: (field: keyof PageContent["theme"], value: string) => void
}

export default function EditorRightSidebar({ content, onContentChange }: EditorRightSidebarProps) {
  const handleColorChange = (field: keyof PageContent["theme"], e: React.ChangeEvent<HTMLInputElement>) => {
    // Convert hex to HSL for shadcn variables if needed, or just pass hex if Tailwind is configured for it.
    // For simplicity, assuming direct HSL input or a system that handles hex.
    // If using a color picker that outputs hex, you'd need a conversion function here.
    onContentChange(field, e.target.value)
  }

  const handleRadiusChange = (value: number[]) => {
    onContentChange("borderRadius", `${value[0]}rem`)
  }

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Stilredigerare</h2>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Färger</h3>
        {Object.entries(content).map(([key, value]) => {
          if (key === "borderRadius") return null // Skip borderRadius here

          // Simple heuristic to determine if it's a color field
          const isColorField =
            key.toLowerCase().includes("color") ||
            key.toLowerCase().includes("background") ||
            key.toLowerCase().includes("foreground") ||
            key.toLowerCase().includes("border") ||
            key.toLowerCase().includes("input") ||
            key.toLowerCase().includes("ring")

          if (!isColorField) return null

          return (
            <div key={key} className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor={key}>
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace("Color", "")
                  .trim()}
              </Label>
              <Input
                id={key}
                type="text" // Use text for HSL input, or "color" if you want a color picker and handle conversion
                value={value}
                onChange={(e) => handleColorChange(key as keyof PageContent["theme"], e)}
                className="h-8"
              />
            </div>
          )
        })}
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Gränser</h3>
        <div className="grid grid-cols-2 items-center gap-4">
          <Label htmlFor="borderRadius">Border Radius</Label>
          <Slider
            id="borderRadius"
            min={0}
            max={1}
            step={0.1}
            value={[Number.parseFloat(content.borderRadius.replace("rem", ""))] || [0.5]}
            onValueChange={handleRadiusChange}
            className="w-[60%]"
          />
          <span className="text-sm text-gray-500">{content.borderRadius}</span>
        </div>
      </div>
    </div>
  )
}
