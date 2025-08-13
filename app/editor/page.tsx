"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Monitor,
  Smartphone,
  Tablet,
  Save,
  RotateCcw,
  Eye,
  Edit3,
  ImageIcon,
  FileText,
  Home,
  Mail,
  Users,
  Calendar,
  Newspaper,
  Handshake,
  Loader2,
  Upload,
  X,
  RefreshCw,
  Zap,
  Globe,
  GitCommit,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Toaster } from "@/components/ui/toaster"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

type ContentFile = {
  name: string
  displayName: string
  icon: React.ReactNode
  path: string
  color: string
}

const CONTENT_FILES: ContentFile[] = [
  { name: "home", displayName: "Hem", icon: <Home className="w-4 h-4" />, path: "/", color: "bg-blue-500" },
  {
    name: "kontakt",
    displayName: "Kontakt",
    icon: <Mail className="w-4 h-4" />,
    path: "/kontakt",
    color: "bg-green-500",
  },
  { name: "lag", displayName: "Lag", icon: <Users className="w-4 h-4" />, path: "/lag", color: "bg-purple-500" },
  {
    name: "matcher",
    displayName: "Matcher",
    icon: <Calendar className="w-4 h-4" />,
    path: "/matcher",
    color: "bg-orange-500",
  },
  {
    name: "nyheter",
    displayName: "Nyheter",
    icon: <Newspaper className="w-4 h-4" />,
    path: "/nyheter",
    color: "bg-red-500",
  },
  {
    name: "partners",
    displayName: "Partners",
    icon: <Handshake className="w-4 h-4" />,
    path: "/partners",
    color: "bg-indigo-500",
  },
]

type ViewportSize = "desktop" | "tablet" | "mobile"

const VIEWPORT_SIZES = {
  desktop: { width: "100%", height: "100%", label: "Desktop", icon: Monitor },
  tablet: { width: "768px", height: "1024px", label: "Tablet", icon: Tablet },
  mobile: { width: "375px", height: "667px", label: "Mobile", icon: Smartphone },
}

export default function EditorPage() {
  const [currentFile, setCurrentFile] = useState<ContentFile>(CONTENT_FILES[0])
  const [content, setContent] = useState<any>({})
  const [originalContent, setOriginalContent] = useState<any>({})
  const [viewportSize, setViewportSize] = useState<ViewportSize>("desktop")
  const [isSaving, setIsSaving] = useState(false)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState("")
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [githubStatus, setGithubStatus] = useState<any>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Check GitHub configuration
  useEffect(() => {
    const checkGithubStatus = async () => {
      try {
        const response = await fetch("/api/github-status")
        const status = await response.json()
        setGithubStatus(status)
      } catch (error) {
        console.error("Error checking GitHub status:", error)
      }
    }
    checkGithubStatus()
  }, [])

  // Load content for current file
  const loadContent = useCallback(async () => {
    try {
      const response = await fetch(`/api/content/${currentFile.name}`)
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
  }, [currentFile.name])

  useEffect(() => {
    loadContent()
  }, [loadContent])

  // Save content with enhanced feedback
  const saveContent = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/content/${currentFile.name}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      })

      if (response.ok) {
        const result = await response.json()
        setOriginalContent(JSON.parse(JSON.stringify(content)))
        setLastSaved(new Date())

        toast({
          title: "✅ Committed to GitHub",
          description: `${currentFile.displayName} updated successfully`,
          className: "bg-green-500 text-white border-green-600",
        })

        // Fast refresh preview
        refreshPreview()
      } else {
        const error = await response.json()
        throw new Error(error.error || "Save failed")
      }
    } catch (error) {
      toast({
        title: "❌ Save Failed",
        description: error instanceof Error ? error.message : "Failed to save content",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Fast preview refresh
  const refreshPreview = () => {
    if (iframeRef.current) {
      setIsRefreshing(true)
      iframeRef.current.src = `${currentFile.path}?t=${Date.now()}`

      // Reset refresh state after animation
      setTimeout(() => setIsRefreshing(false), 1000)
    }
  }

  // Reset content
  const resetContent = () => {
    setContent(JSON.parse(JSON.stringify(originalContent)))
    setEditingField(null)
    toast({
      title: "🔄 Reset Complete",
      description: "Changes reverted to last saved version",
    })
  }

  // Handle field editing with enhanced UX
  const startEditing = (fieldPath: string, currentValue: string) => {
    setEditingField(fieldPath)
    setEditingValue(currentValue)
  }

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
      description: "Changes ready to save",
      className: "bg-blue-500 text-white",
    })
  }

  const cancelEditing = () => {
    setEditingField(null)
    setEditingValue("")
  }

  // Enhanced image upload
  const handleImageUpload = async (file: File, fieldPath: string) => {
    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const { url } = await response.json()

        const keys = fieldPath.split(".")
        let obj = content
        for (let i = 0; i < keys.length - 1; i++) {
          if (!obj[keys[i]]) obj[keys[i]] = {}
          obj = obj[keys[i]]
        }
        obj[keys[keys.length - 1]] = url

        setContent({ ...content })
        setShowImageUpload(false)

        toast({
          title: "🖼️ Image Uploaded",
          description: "Image ready to save",
          className: "bg-purple-500 text-white",
        })
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload image",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
    }
  }

  // Enhanced content editor with better UX
  const renderContentEditor = (obj: any, path = "") => {
    return Object.entries(obj).map(([key, value]) => {
      const fieldPath = path ? `${path}.${key}` : key

      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        return (
          <div key={fieldPath} className="space-y-3">
            <Label className="text-sm font-semibold text-gray-800 capitalize flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              {key.replace(/([A-Z])/g, " $1").trim()}
            </Label>
            <div className="pl-4 border-l-2 border-blue-200 space-y-3 ml-2">
              {renderContentEditor(value, fieldPath)}
            </div>
          </div>
        )
      }

      if (Array.isArray(value)) {
        return (
          <div key={fieldPath} className="space-y-3">
            <Label className="text-sm font-semibold text-gray-800 capitalize flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              {key.replace(/([A-Z])/g, " $1").trim()} ({value.length} items)
            </Label>
            <div className="space-y-2">
              {value.map((item, index) => (
                <div key={index} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                  {typeof item === "object" ? (
                    renderContentEditor(item, `${fieldPath}.${index}`)
                  ) : (
                    <Input
                      value={item}
                      onChange={(e) => {
                        const newArray = [...value]
                        newArray[index] = e.target.value
                        const keys = fieldPath.split(".")
                        let obj = content
                        for (let i = 0; i < keys.length - 1; i++) {
                          obj = obj[keys[i]]
                        }
                        obj[keys[keys.length - 1]] = newArray
                        setContent({ ...content })
                      }}
                      className="bg-white"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      }

      const isImage =
        key.toLowerCase().includes("image") || key.toLowerCase().includes("logo") || key.toLowerCase().includes("photo")
      const isLongText = typeof value === "string" && value.length > 100

      return (
        <div key={fieldPath} className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-700 capitalize flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${isImage ? "bg-purple-500" : isLongText ? "bg-orange-500" : "bg-gray-400"}`}
              ></div>
              {key.replace(/([A-Z])/g, " $1").trim()}
            </Label>
            {isImage && (
              <Button size="sm" variant="outline" onClick={() => setShowImageUpload(true)} className="h-7">
                <ImageIcon className="w-3 h-3 mr-1" />
                Change
              </Button>
            )}
          </div>

          {editingField === fieldPath ? (
            <div className="space-y-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              {isLongText ? (
                <Textarea
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  rows={4}
                  className="bg-white"
                />
              ) : (
                <Input value={editingValue} onChange={(e) => setEditingValue(e.target.value)} className="bg-white" />
              )}
              <div className="flex gap-2">
                <Button size="sm" onClick={saveField} className="bg-green-600 hover:bg-green-700">
                  <Save className="w-3 h-3 mr-1" />
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={cancelEditing}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div
              className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-blue-300 group transition-all duration-200"
              onClick={() => startEditing(fieldPath, String(value))}
            >
              {isImage && typeof value === "string" && value.startsWith("http") ? (
                <div className="space-y-2">
                  <img
                    src={value || "/placeholder.svg"}
                    alt={key}
                    className="w-24 h-24 object-cover rounded-lg shadow-sm"
                  />
                  <p className="text-xs text-gray-500 truncate font-mono">{value}</p>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className={`${isLongText ? "text-sm" : ""} ${isLongText ? "leading-relaxed" : ""}`}>
                    {isLongText ? `${String(value).substring(0, 150)}...` : String(value)}
                  </span>
                  <Edit3 className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
                </div>
              )}
            </div>
          )}
        </div>
      )
    })
  }

  const hasChanges = JSON.stringify(content) !== JSON.stringify(originalContent)

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {/* Enhanced Left Sidebar */}
        <aside className="w-96 bg-white shadow-xl flex flex-col border-r border-gray-200">
          {/* Enhanced Header */}
          <div className="p-6 border-b bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Zap className="w-6 h-6" />
                  Live Editor
                </h1>
                <p className="text-blue-100 text-sm">Real-time content management</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur">
                  <Globe className="w-3 h-3 mr-1" />
                  Live Preview
                </Badge>
                {githubStatus && (
                  <Badge
                    variant="secondary"
                    className={`text-xs backdrop-blur ${
                      githubStatus.configured ? "bg-green-500/20 text-green-100" : "bg-red-500/20 text-red-100"
                    }`}
                  >
                    <GitCommit className="w-3 h-3 mr-1" />
                    {githubStatus.configured ? "GitHub Connected" : "GitHub Not Configured"}
                  </Badge>
                )}
              </div>
            </div>

            {/* Enhanced Viewport Controls */}
            <div className="flex gap-2">
              {Object.entries(VIEWPORT_SIZES).map(([size, config]) => {
                const IconComponent = config.icon
                return (
                  <Tooltip key={size}>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant={viewportSize === size ? "secondary" : "ghost"}
                        onClick={() => setViewportSize(size as ViewportSize)}
                        className="text-white hover:bg-white/20 transition-all duration-200"
                      >
                        <IconComponent className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{config.label} View</TooltipContent>
                  </Tooltip>
                )
              })}
            </div>
          </div>

          {/* Enhanced Page Selection */}
          <div className="p-4 border-b bg-gray-50">
            <Label className="text-sm font-semibold text-gray-700 mb-3 block flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Current Page
            </Label>
            <Select
              value={currentFile.name}
              onValueChange={(value) => {
                const file = CONTENT_FILES.find((f) => f.name === value)
                if (file) setCurrentFile(file)
              }}
            >
              <SelectTrigger className="bg-white border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CONTENT_FILES.map((file) => (
                  <SelectItem key={file.name} value={file.name}>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${file.color}`}></div>
                      {file.icon}
                      <span className="font-medium">{file.displayName}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Enhanced Content Editor */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-blue-500" />
                  Content Fields
                </h3>
                <Button size="sm" variant="outline" onClick={refreshPreview} disabled={isRefreshing}>
                  <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`} />
                </Button>
              </div>

              {content && Object.keys(content).length > 0 ? (
                <div className="space-y-6">{renderContentEditor(content)}</div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">No content loaded</p>
                  <p className="text-sm">Select a page to start editing</p>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Enhanced Action Buttons */}
          <div className="p-4 border-t bg-gray-50 space-y-3">
            {lastSaved && (
              <div className="text-xs text-gray-600 bg-white p-2 rounded border flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Last saved: {lastSaved.toLocaleTimeString()}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={saveContent}
                disabled={isSaving || !hasChanges}
                className={`flex-1 transition-all duration-200 ${
                  hasChanges ? "bg-green-600 hover:bg-green-700 shadow-lg" : "bg-gray-400"
                }`}
              >
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <GitCommit className="w-4 h-4 mr-2" />}
                {isSaving ? "Committing..." : hasChanges ? "Save & Commit" : "No Changes"}
              </Button>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={resetContent}
                    disabled={!hasChanges}
                    className="hover:bg-red-50 hover:border-red-300 bg-transparent"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reset Changes</TooltipContent>
              </Tooltip>
            </div>

            {githubStatus?.repository && (
              <div className="text-xs text-gray-600 bg-white p-2 rounded border flex items-center gap-2">
                <GitCommit className="w-3 h-3" />
                {githubStatus.repository.fullName}
              </div>
            )}
          </div>
        </aside>

        {/* Enhanced Main Preview Area */}
        <main className="flex-1 flex flex-col bg-gradient-to-br from-gray-100 to-gray-200">
          {/* Enhanced Preview Header */}
          <div className="bg-white border-b p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-500" />
                Live Preview
              </h2>
              <Badge variant="outline" className={`${currentFile.color} text-white border-0`}>
                {currentFile.displayName}
              </Badge>
              {hasChanges && (
                <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
                  Unsaved Changes
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                {VIEWPORT_SIZES[viewportSize].label}
              </span>
              <span className="text-gray-400">•</span>
              <span className="font-mono">
                {VIEWPORT_SIZES[viewportSize].width} × {VIEWPORT_SIZES[viewportSize].height}
              </span>
            </div>
          </div>

          {/* Enhanced Preview Container */}
          <div className="flex-1 p-8 flex items-center justify-center">
            <div
              className={`bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-500 ${
                isRefreshing ? "scale-95 opacity-50" : "scale-100 opacity-100"
              }`}
              style={{
                width: VIEWPORT_SIZES[viewportSize].width,
                height: VIEWPORT_SIZES[viewportSize].height,
                maxWidth: "100%",
                maxHeight: "100%",
              }}
            >
              <iframe
                ref={iframeRef}
                src={currentFile.path}
                className="w-full h-full border-0"
                title="Live Preview"
                onLoad={() => setIsRefreshing(false)}
              />
            </div>
          </div>
        </main>

        {/* Enhanced Image Upload Modal */}
        {showImageUpload && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="w-full max-w-md shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Upload Image
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowImageUpload(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-2 font-medium">Drag and drop an image, or click to select</p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          handleImageUpload(file, editingField || "")
                        }
                      }}
                      disabled={uploadingImage}
                      className="cursor-pointer"
                    />
                  </div>

                  {uploadingImage && (
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                      Uploading image...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Toaster />
      </div>
    </TooltipProvider>
  )
}
