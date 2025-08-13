"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Save, Monitor, Tablet, Smartphone, Loader2, X, Check } from "lucide-react"

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

export default function EditorPage() {
  const [currentPage, setCurrentPage] = useState(PAGES[0])
  const [viewport, setViewport] = useState<keyof typeof VIEWPORTS>("desktop")
  const [content, setContent] = useState<any>({})
  const [originalContent, setOriginalContent] = useState<any>({})
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Load content for current page
  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch(`/api/content/${currentPage.name}`)
        if (response.ok) {
          const data = await response.json()
          setContent(data)
          setOriginalContent(JSON.parse(JSON.stringify(data)))
        }
      } catch (error) {
        console.error("Error loading content:", error)
        toast({
          title: "Error",
          description: "Failed to load content",
          variant: "destructive",
        })
      }
    }
    loadContent()
  }, [currentPage.name])

  // Save content to GitHub
  const saveContent = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/content/${currentPage.name}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      })

      if (response.ok) {
        setOriginalContent(JSON.parse(JSON.stringify(content)))
        toast({
          title: "✅ Saved to GitHub",
          description: `${currentPage.displayName} updated successfully`,
          className: "bg-green-500 text-white",
        })

        // Refresh preview
        if (iframeRef.current) {
          iframeRef.current.src = `${currentPage.path}?t=${Date.now()}`
        }
      } else {
        throw new Error("Save failed")
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

  // Handle double-click editing
  const handleDoubleClick = (fieldPath: string, currentValue: string) => {
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
      description: "Double-click other fields to edit, then save all changes",
      className: "bg-blue-500 text-white",
    })
  }

  // Cancel editing
  const cancelEdit = () => {
    setEditingField(null)
    setEditingValue("")
  }

  // Render editable content overlay
  const renderEditableOverlay = (obj: any, path = "") => {
    return Object.entries(obj).map(([key, value]) => {
      const fieldPath = path ? `${path}.${key}` : key

      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        return renderEditableOverlay(value, fieldPath)
      }

      if (Array.isArray(value)) {
        return value.map((item, index) => {
          if (typeof item === "object") {
            return renderEditableOverlay(item, `${fieldPath}.${index}`)
          }
          return null
        })
      }

      if (typeof value === "string") {
        return (
          <div
            key={fieldPath}
            className="absolute bg-blue-500/10 border-2 border-blue-500/30 hover:border-blue-500 cursor-pointer rounded transition-all"
            onDoubleClick={() => handleDoubleClick(fieldPath, value)}
            title={`Double-click to edit: ${key}`}
          />
        )
      }

      return null
    })
  }

  const hasChanges = JSON.stringify(content) !== JSON.stringify(originalContent)

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <div className="bg-white border-b px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Select
            value={currentPage.name}
            onValueChange={(value) => {
              const page = PAGES.find((p) => p.name === value)
              if (page) setCurrentPage(page)
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGES.map((page) => (
                <SelectItem key={page.name} value={page.name}>
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

      <div className="flex-1 p-4 flex items-center justify-center">
        <div
          className="bg-white rounded-lg shadow-xl overflow-hidden relative"
          style={{
            width: VIEWPORTS[viewport].width,
            height: VIEWPORTS[viewport].height,
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        >
          <iframe ref={iframeRef} src={currentPage.path} className="w-full h-full border-0" title="Live Preview" />

          {renderEditableOverlay(content)}
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
              />
            ) : (
              <Input value={editingValue} onChange={(e) => setEditingValue(e.target.value)} className="mb-4" />
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
