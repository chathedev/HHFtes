"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Save, Monitor, Tablet, Smartphone, Loader2, RefreshCw, ChevronDown, ChevronRight } from "lucide-react"

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
  const [isSaving, setIsSaving] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [content, setContent] = useState<any>({})
  const [originalContent, setOriginalContent] = useState<any>({})
  const [iframeSrc, setIframeSrc] = useState("")
  const [expandedSections, setExpandedSections] = useState<string[]>(["hero"])
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIframeSrc(`${window.location.origin}${currentPage.path}?editor=true&t=${Date.now()}`)
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
          filename: `public/content/${currentPage.name}.json`,
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

  const updateContentField = (fieldPath: string, value: string) => {
    const keys = fieldPath.split(".")
    const pageKey = keys[0]
    const fieldKeys = keys.slice(1)

    const obj = { ...content[pageKey] } || {}
    let current = obj

    for (let i = 0; i < fieldKeys.length - 1; i++) {
      if (!current[fieldKeys[i]]) current[fieldKeys[i]] = {}
      current = current[fieldKeys[i]]
    }

    current[fieldKeys[fieldKeys.length - 1]] = value
    setContent({ ...content, [pageKey]: obj })
  }

  const getFieldValue = (fieldPath: string): string => {
    const keys = fieldPath.split(".")
    const pageKey = keys[0]
    const fieldKeys = keys.slice(1)

    let current = content[pageKey]
    if (!current) return ""

    for (const key of fieldKeys) {
      current = current[key]
      if (current === undefined) return ""
    }

    return current || ""
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const renderEditingFields = () => {
    const pageContent = content[currentPage.name]
    if (!pageContent) return null

    const sections = [
      {
        key: "hero",
        title: "Hero Section",
        fields: [
          { key: "title", label: "Title", type: "input" },
          { key: "description", label: "Description", type: "textarea" },
          { key: "primaryButton", label: "Primary Button", type: "input" },
          { key: "secondaryButton", label: "Secondary Button", type: "input" },
        ],
      },
      {
        key: "stats",
        title: "Statistics",
        fields: [
          { key: "title", label: "Stats Title", type: "input" },
          { key: "members", label: "Members Count", type: "input" },
          { key: "membersLabel", label: "Members Label", type: "input" },
          { key: "years", label: "Years Count", type: "input" },
          { key: "yearsLabel", label: "Years Label", type: "input" },
          { key: "teams", label: "Teams Count", type: "input" },
          { key: "teamsLabel", label: "Teams Label", type: "input" },
        ],
      },
      {
        key: "about",
        title: "About Section",
        fields: [
          { key: "title", label: "About Title", type: "input" },
          { key: "description", label: "About Description", type: "textarea" },
          { key: "mission", label: "Mission", type: "textarea" },
          { key: "values", label: "Values", type: "textarea" },
        ],
      },
      {
        key: "faq",
        title: "FAQ Section",
        fields: [{ key: "title", label: "FAQ Title", type: "input" }],
      },
    ]

    return sections.map((section) => {
      const isExpanded = expandedSections.includes(section.key)
      const sectionData = pageContent[section.key]

      if (!sectionData) return null

      return (
        <div key={section.key} className="border border-gray-200 rounded-lg mb-4">
          <button
            onClick={() => toggleSection(section.key)}
            className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-t-lg"
          >
            <h3 className="font-semibold text-gray-800">{section.title}</h3>
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          {isExpanded && (
            <div className="p-4 space-y-4">
              {section.fields.map((field) => {
                const fieldPath = `${currentPage.name}.${section.key}.${field.key}`
                const value = getFieldValue(fieldPath)

                return (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                    {field.type === "textarea" ? (
                      <Textarea
                        value={value}
                        onChange={(e) => updateContentField(fieldPath, e.target.value)}
                        className="w-full text-black bg-white border border-gray-300"
                        rows={3}
                      />
                    ) : (
                      <Input
                        value={value}
                        onChange={(e) => updateContentField(fieldPath, e.target.value)}
                        className="w-full text-black bg-white border border-gray-300"
                      />
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )
    })
  }

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
      {/* Header */}
      <div className="bg-white border-b px-6 py-3 flex items-center justify-between shadow-sm">
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

          <Button onClick={refreshPreview} disabled={isRefreshing} size="sm" variant="outline">
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>

        <Button
          onClick={saveContent}
          disabled={isSaving || !hasChanges}
          className={hasChanges ? "bg-green-600 hover:bg-green-700 text-white" : ""}
        >
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {isSaving ? "Saving..." : hasChanges ? "Save Changes" : "No Changes"}
        </Button>
      </div>

      {/* Main Content - Two Columns */}
      <div className="flex-1 flex overflow-hidden">
        {/* Preview Column */}
        <div className="flex-1 p-4 flex items-center justify-center bg-gray-50">
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
              onLoad={() => setIsRefreshing(false)}
            />
          </div>
        </div>

        {/* Editing Panel */}
        <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Edit {currentPage.displayName}</h2>

            {content[currentPage.name] ? (
              <div className="space-y-4">{renderEditingFields()}</div>
            ) : (
              <div className="flex items-center justify-center py-8 text-gray-500">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Loading content...
              </div>
            )}
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  )
}
