"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Save, Monitor, Tablet, Smartphone, Loader2, X, Check, RefreshCw } from "lucide-react"

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
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [content, setContent] = useState<any>({})
  const [originalContent, setOriginalContent] = useState<any>({})
  const [iframeSrc, setIframeSrc] = useState("")
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIframeSrc(`${window.location.origin}${currentPage.path}?editor=true`)
    }
  }, [currentPage])

  useEffect(() => {
    loadContent()
  }, [currentPage])

  const loadContent = async () => {
    try {
      const response = await fetch(`/content/${currentPage.name}.json`)
      if (response.ok) {
        const data = await response.json()
        setContent({ ...content, [currentPage.name]: data })
        setOriginalContent({ ...originalContent, [currentPage.name]: data })
      }
    } catch (error) {
      console.error("Failed to load content:", error)
    }
  }

  const saveContent = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/github-commit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: `content/${currentPage.name}.json`,
          content: JSON.stringify(content[currentPage.name], null, 2),
          message: `Update ${currentPage.displayName} content via editor`,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to save ${currentPage.name}`)
      }

      setOriginalContent({ ...originalContent, [currentPage.name]: content[currentPage.name] })

      toast({
        title: "✅ Changes Committed to GitHub",
        description: `${currentPage.displayName} updated and pushed to repository`,
        className: "bg-green-500 text-white",
      })

      refreshPreview()
    } catch (error) {
      console.error("Save error:", error)
      toast({
        title: "❌ GitHub Commit Failed",
        description: "Failed to commit changes to repository",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const refreshPreview = () => {
    setIsRefreshing(true)
    if (iframeRef.current && typeof window !== "undefined") {
      const newSrc = `${window.location.origin}${currentPage.path}?editor=true&t=${Date.now()}`
      setIframeSrc(newSrc)
      setTimeout(() => setIsRefreshing(false), 1000)
    }
  }

  const handleEdit = (fieldPath: string, currentValue: string) => {
    setEditingField(fieldPath)
    setEditingValue(currentValue)
  }

  const handleImageEdit = (fieldPath: string) => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string
          updateContentField(fieldPath, imageUrl)

          toast({
            title: "Image Updated",
            description: "Click Save Changes to commit to GitHub",
            className: "bg-blue-500 text-white",
          })
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const updateContentField = (fieldPath: string, value: string) => {
    const keys = fieldPath.split(".")
    const pageKey = keys[0]
    const fieldKeys = keys.slice(1)

    const obj = content[pageKey] || {}
    let current = obj

    for (let i = 0; i < fieldKeys.length - 1; i++) {
      if (!current[fieldKeys[i]]) current[fieldKeys[i]] = {}
      current = current[fieldKeys[i]]
    }

    current[fieldKeys[fieldKeys.length - 1]] = value
    setContent({ ...content, [pageKey]: obj })
  }

  const saveField = () => {
    if (!editingField) return

    updateContentField(editingField, editingValue)
    setEditingField(null)
    setEditingValue("")

    toast({
      title: "Field Updated",
      description: "Click Save Changes to commit to GitHub",
      className: "bg-blue-500 text-white",
    })
  }

  const cancelEdit = () => {
    setEditingField(null)
    setEditingValue("")
  }

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "EDIT_REQUEST") {
        const { fieldPath, currentValue } = event.data
        handleEdit(fieldPath, currentValue)
      } else if (event.data.type === "IMAGE_EDIT_REQUEST") {
        const { fieldPath } = event.data
        handleImageEdit(fieldPath)
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("message", handleMessage)
      return () => window.removeEventListener("message", handleMessage)
    }
  }, [])

  const hasChanges = JSON.stringify(content[currentPage.name]) !== JSON.stringify(originalContent[currentPage.name])

  if (!iframeSrc) {
    return (
      <div className="h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading editor...</span>
        </div>
      </div>
    )
  }

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
            <SelectTrigger className="w-48 bg-white border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg z-50">
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

          <Button onClick={refreshPreview} disabled={isRefreshing} size="sm" variant="outline">
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
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

      <div className="flex-1 p-4 flex items-center justify-center overflow-hidden">
        <div
          className="bg-white rounded-lg shadow-xl overflow-hidden relative"
          style={{
            width: VIEWPORTS[viewport].width,
            height: VIEWPORTS[viewport].height,
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        >
          {isRefreshing && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
              <div className="flex items-center gap-2 text-gray-600">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Refreshing preview...</span>
              </div>
            </div>
          )}

          <iframe
            ref={iframeRef}
            src={iframeSrc}
            className="w-full h-full border-0"
            title={`Preview of ${currentPage.displayName}`}
            onLoad={() => {
              setIsRefreshing(false)
              if (iframeRef.current?.contentWindow) {
                const script = `
                  document.addEventListener('click', function(e) {
                    if (e.target.dataset.editable) {
                      e.preventDefault()
                      e.stopPropagation()
                      
                      const fieldPath = e.target.dataset.fieldPath
                      const currentValue = e.target.textContent || e.target.value || e.target.src || ''
                      
                      if (e.target.tagName === 'IMG') {
                        parent.postMessage({
                          type: 'IMAGE_EDIT_REQUEST',
                          fieldPath: fieldPath
                        }, '*')
                      } else {
                        parent.postMessage({
                          type: 'EDIT_REQUEST',
                          fieldPath: fieldPath,
                          currentValue: currentValue
                        }, '*')
                      }
                    }
                  })
                  
                  const style = document.createElement('style')
                  style.textContent = \`
                    [data-editable] {
                      cursor: pointer !important;
                      transition: all 0.2s ease !important;
                      position: relative !important;
                    }
                    [data-editable]:hover {
                      background-color: rgba(59, 130, 246, 0.1) !important;
                      outline: 2px dashed #3b82f6 !important;
                      outline-offset: 2px !important;
                    }
                    [data-editable]:hover::after {
                      content: "Click to edit" !important;
                      position: absolute !important;
                      top: -25px !important;
                      left: 0 !important;
                      background: #3b82f6 !important;
                      color: white !important;
                      padding: 2px 6px !important;
                      border-radius: 3px !important;
                      font-size: 11px !important;
                      white-space: nowrap !important;
                      z-index: 1000 !important;
                    }
                  \`
                  document.head.appendChild(style)
                `

                try {
                  iframeRef.current.contentWindow.eval(script)
                } catch (error) {
                  console.log("Could not inject editor script:", error)
                }
              }
            }}
          />
        </div>
      </div>

      {editingField && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="font-semibold mb-4 text-black">Edit: {editingField.split(".").pop()}</h3>

            {editingValue.length > 100 ? (
              <Textarea
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                rows={4}
                className="mb-4 text-black bg-white border border-gray-300"
                placeholder="Enter your text here..."
              />
            ) : (
              <Input
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                className="mb-4 text-black bg-white border border-gray-300"
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
