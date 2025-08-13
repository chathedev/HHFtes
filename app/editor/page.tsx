"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Save, Monitor, Tablet, Smartphone, Loader2, X, Check, Edit } from "lucide-react"

const PAGES = [
  { name: "home", displayName: "Hem", path: "/" },
  { name: "kontakt", displayName: "Kontakt", path: "/kontakt" },
  { name: "lag", displayName: "Lag", path: "/lag" },
  { name: "matcher", displayName: "Matcher", path: "/matcher" },
  { name: "nyheter", displayName: "Nyheter", path: "/nyheter" },
  { name: "partners", displayName: "Partners", path: "/partners" },
]

const VIEWPORTS = {
  desktop: { width: "100%", height: "100%", icon: Monitor },
  tablet: { width: "768px", height: "1024px", icon: Tablet },
  mobile: { width: "375px", height: "667px", icon: Smartphone },
}

const DEFAULT_CONTENT = {
  home: {
    hero: {
      title: "LAGET FÖRE ALLT",
      subtitle: "Härnösands Handbollsförening",
      description: "Välkommen till Härnösands HF - där passion möter prestation",
      primaryButton: "Bli Medlem",
      secondaryButton: "Se Matcher",
    },
    stats: {
      members: "200+",
      teams: "12",
      years: "25+",
      titles: "15",
    },
    about: {
      title: "Om Härnösands HF",
      description:
        "Vi är en handbollsförening som brinner för sporten och gemenskapen. Sedan 1999 har vi varit en del av Härnösands idrottsliv.",
      features: ["Professionell träning", "Stark gemenskap", "Alla åldrar välkomna", "Moderna faciliteter"],
    },
  },
  kontakt: {
    title: "Kontakta Oss",
    description: "Har du frågor eller vill veta mer om föreningen? Hör av dig till oss!",
    departments: [
      {
        name: "Allmän Information",
        email: "kontakt@harnosandshf.se",
        description: "För allmänna frågor om föreningen",
      },
      {
        name: "Marknadsföring",
        email: "marknad@harnosandshf.se",
        description: "Vill du sponsra oss eller samarbeta?",
      },
    ],
  },
  lag: {
    title: "Våra Lag",
    description: "Härnösands HF har lag för alla åldrar och nivåer",
    teams: [
      {
        name: "Herrar A-lag",
        description: "Vårt herrlag som spelar i division 2",
        ageGroup: "Senior",
      },
      {
        name: "Damer A-lag",
        description: "Vårt damlag som spelar i division 3",
        ageGroup: "Senior",
      },
    ],
  },
  matcher: {
    title: "Kommande Matcher",
    description: "Se våra kommande matcher och resultat",
    filters: ["Alla", "Hemma", "Borta"],
  },
  nyheter: {
    title: "Nyheter",
    description: "Håll dig uppdaterad med det senaste från föreningen",
  },
  partners: {
    title: "Våra Partners",
    description: "Tack till alla våra fantastiska partners som stödjer föreningen",
  },
}

export default function EditorPage() {
  const [currentPage, setCurrentPage] = useState(PAGES[0])
  const [viewport, setViewport] = useState<keyof typeof VIEWPORTS>("desktop")
  const [content, setContent] = useState<any>(DEFAULT_CONTENT)
  const [originalContent, setOriginalContent] = useState<any>(DEFAULT_CONTENT)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const savedContent = localStorage.getItem("editor-content")
    if (savedContent) {
      try {
        const parsed = JSON.parse(savedContent)
        setContent(parsed)
        setOriginalContent(parsed)
      } catch (error) {
        console.error("Error loading saved content:", error)
      }
    }
  }, [])

  const saveContent = async () => {
    setIsSaving(true)
    try {
      localStorage.setItem("editor-content", JSON.stringify(content))
      setOriginalContent(JSON.parse(JSON.stringify(content)))

      toast({
        title: "✅ Changes Saved",
        description: `${currentPage.displayName} updated successfully`,
        className: "bg-green-500 text-white",
      })

      // Refresh preview
      if (iframeRef.current) {
        iframeRef.current.src = `${currentPage.path}?t=${Date.now()}`
      }
    } catch (error) {
      toast({
        title: "❌ Save Failed",
        description: "Failed to save content",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleFieldEdit = (fieldPath: string, currentValue: string) => {
    setEditingField(fieldPath)
    setEditingValue(currentValue)
  }

  // Save field edit
  const saveField = () => {
    if (!editingField) return

    const keys = editingField.split(".")
    let obj = content

    for (let i = 0; i < keys.length - 1; i++) {
      if (!obj[keys[i]]) obj[keys[i]] = {}
      obj = obj[keys[i]]
    }

    obj[keys[keys.length - 1]] = editingValue
    setContent({ ...content })
    setEditingField(null)
    setEditingValue("")

    toast({
      title: "Field Updated",
      description: "Click Save Changes to persist all edits",
      className: "bg-blue-500 text-white",
    })
  }

  // Cancel editing
  const cancelEdit = () => {
    setEditingField(null)
    setEditingValue("")
  }

  const renderEditableFields = () => {
    const pageContent = content[currentPage.name] || {}

    const renderField = (obj: any, path = "", level = 0) => {
      return Object.entries(obj).map(([key, value]) => {
        const fieldPath = path ? `${path}.${key}` : key
        const fullPath = `${currentPage.name}.${fieldPath}`

        if (typeof value === "object" && value !== null && !Array.isArray(value)) {
          return (
            <div key={fieldPath} className={`ml-${level * 4} mb-2`}>
              <h4 className="font-medium text-gray-700 mb-1 capitalize">{key}</h4>
              {renderField(value, fieldPath, level + 1)}
            </div>
          )
        }

        if (Array.isArray(value)) {
          return (
            <div key={fieldPath} className={`ml-${level * 4} mb-2`}>
              <h4 className="font-medium text-gray-700 mb-1 capitalize">{key}</h4>
              {value.map((item, index) => {
                if (typeof item === "object") {
                  return (
                    <div key={index} className="ml-4 mb-2 p-2 border rounded">
                      <span className="text-sm text-gray-500">Item {index + 1}</span>
                      {renderField(item, `${fieldPath}.${index}`, level + 1)}
                    </div>
                  )
                }
                return (
                  <div key={index} className="ml-4 mb-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFieldEdit(`${fullPath}.${index}`, item)}
                      className="text-left justify-start w-full"
                    >
                      <Edit className="w-3 h-3 mr-2" />
                      {item.length > 50 ? `${item.substring(0, 50)}...` : item}
                    </Button>
                  </div>
                )
              })}
            </div>
          )
        }

        if (typeof value === "string") {
          return (
            <div key={fieldPath} className={`ml-${level * 4} mb-2`}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFieldEdit(fullPath, value)}
                className="text-left justify-start w-full"
              >
                <Edit className="w-3 h-3 mr-2" />
                <span className="font-medium mr-2 capitalize">{key}:</span>
                {value.length > 50 ? `${value.substring(0, 50)}...` : value}
              </Button>
            </div>
          )
        }

        return null
      })
    }

    return renderField(pageContent)
  }

  const hasChanges = JSON.stringify(content) !== JSON.stringify(originalContent)

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <div className="bg-white border-b px-6 py-3 flex items-center justify-between shadow-sm relative z-10">
        <div className="flex items-center gap-4">
          <Select
            value={currentPage.name}
            onValueChange={(value) => {
              const page = PAGES.find((p) => p.name === value)
              if (page) setCurrentPage(page)
            }}
          >
            <SelectTrigger className="w-48 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg">
              {PAGES.map((page) => (
                <SelectItem key={page.name} value={page.name} className="bg-white hover:bg-gray-100">
                  {page.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-1">
            {Object.entries(VIEWPORTS).map(([size, config]) => {
              const IconComponent = config.icon
              return (
                <Button
                  key={size}
                  size="sm"
                  variant={viewport === size ? "default" : "outline"}
                  onClick={() => setViewport(size as keyof typeof VIEWPORTS)}
                >
                  <IconComponent className="w-4 h-4" />
                </Button>
              )
            })}
          </div>

          <Button variant={isEditMode ? "default" : "outline"} size="sm" onClick={() => setIsEditMode(!isEditMode)}>
            <Edit className="w-4 h-4 mr-2" />
            {isEditMode ? "Hide Editor" : "Show Editor"}
          </Button>
        </div>

        <Button
          onClick={saveContent}
          disabled={isSaving || !hasChanges}
          className={hasChanges ? "bg-green-600 hover:bg-green-700" : ""}
        >
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {isSaving ? "Saving..." : hasChanges ? "Save Changes" : "No Changes"}
        </Button>
      </div>

      <div className="flex-1 flex">
        {isEditMode && (
          <div className="w-80 bg-white border-r p-4 overflow-y-auto">
            <h3 className="font-semibold mb-4">Edit {currentPage.displayName}</h3>
            <div className="space-y-2">{renderEditableFields()}</div>
          </div>
        )}

        <div className="flex-1 p-4 flex items-center justify-center">
          <div
            className="bg-white rounded-lg shadow-xl overflow-hidden"
            style={{
              width: VIEWPORTS[viewport].width,
              height: VIEWPORTS[viewport].height,
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          >
            <iframe
              ref={iframeRef}
              src={`${currentPage.path}?t=${Date.now()}`}
              className="w-full h-full border-0"
              title="Live Preview"
            />
          </div>
        </div>
      </div>

      {editingField && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="font-semibold mb-4">Edit: {editingField.split(".").pop()}</h3>

            {editingValue.length > 100 ? (
              <Textarea
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                rows={4}
                className="mb-4"
                placeholder="Enter your text here..."
              />
            ) : (
              <Input
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                className="mb-4"
                placeholder="Enter your text here..."
              />
            )}

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={cancelEdit}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={saveField} className="bg-green-600 hover:bg-green-700">
                <Check className="w-4 h-4 mr-2" />
                Update
              </Button>
            </div>
          </div>
        </div>
      )}

      <Toaster />
    </div>
  )
}
