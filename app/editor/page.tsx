"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Monitor,
  Smartphone,
  Tablet,
  Save,
  RotateCcw,
  LogOut,
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
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Toaster } from "@/components/ui/toaster"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

// Editor configuration
const DEFAULT_LOGIN_PASSWORD = "harnosandshf10!"

type ContentFile = {
  name: string
  displayName: string
  icon: React.ReactNode
  path: string
}

const CONTENT_FILES: ContentFile[] = [
  { name: "home", displayName: "Hem", icon: <Home className="w-4 h-4" />, path: "/" },
  { name: "kontakt", displayName: "Kontakt", icon: <Mail className="w-4 h-4" />, path: "/kontakt" },
  { name: "lag", displayName: "Lag", icon: <Users className="w-4 h-4" />, path: "/lag" },
  { name: "matcher", displayName: "Matcher", icon: <Calendar className="w-4 h-4" />, path: "/matcher" },
  { name: "nyheter", displayName: "Nyheter", icon: <Newspaper className="w-4 h-4" />, path: "/nyheter" },
  { name: "partners", displayName: "Partners", icon: <Handshake className="w-4 h-4" />, path: "/partners" },
]

type ViewportSize = "desktop" | "tablet" | "mobile"

const VIEWPORT_SIZES = {
  desktop: { width: "100%", height: "100%" },
  tablet: { width: "768px", height: "1024px" },
  mobile: { width: "375px", height: "667px" },
}

export default function EditorPage() {
  const [authed, setAuthed] = useState(false)
  const [currentFile, setCurrentFile] = useState<ContentFile>(CONTENT_FILES[0])
  const [content, setContent] = useState<any>({})
  const [originalContent, setOriginalContent] = useState<any>({})
  const [viewportSize, setViewportSize] = useState<ViewportSize>("desktop")
  const [isPreviewMode, setIsPreviewMode] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState("")
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [githubStatus, setGithubStatus] = useState<any>(null)

  const iframeRef = useRef<HTMLIFrameElement>(null)
  const router = useRouter()

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check-auth", { method: "GET" })
        setAuthed(res.ok)
      } catch (error) {
        setAuthed(false)
      }
    }
    checkAuth()
  }, [])

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
    if (!authed) return

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
  }, [authed, currentFile.name])

  useEffect(() => {
    loadContent()
  }, [loadContent])

  // Save content
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
        toast({
          title: "Saved & Committed",
          description: "Changes saved to GitHub repository",
          className: "bg-green-500 text-white",
        })

        // Refresh preview
        if (iframeRef.current) {
          iframeRef.current.src = iframeRef.current.src
        }
      } else {
        const error = await response.json()
        throw new Error(error.error || "Save failed")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save content",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Reset content
  const resetContent = () => {
    setContent(JSON.parse(JSON.stringify(originalContent)))
    setEditingField(null)
    toast({
      title: "Reset",
      description: "Changes reverted to last saved version",
    })
  }

  // Handle login
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const password = formData.get("password") as string

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      if (response.ok) {
        setAuthed(true)
        toast({
          title: "Success",
          description: "Logged in successfully",
        })
      } else {
        throw new Error("Invalid password")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Login failed",
        variant: "destructive",
      })
    }
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setAuthed(false)
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  // Handle field editing
  const startEditing = (fieldPath: string, currentValue: string) => {
    setEditingField(fieldPath)
    setEditingValue(currentValue)
  }

  const saveField = () => {
    if (!editingField) return

    const keys = editingField.split(".")
    let obj = content

    // Navigate to the parent object
    for (let i = 0; i < keys.length - 1; i++) {
      if (!obj[keys[i]]) obj[keys[i]] = {}
      obj = obj[keys[i]]
    }

    // Set the value
    obj[keys[keys.length - 1]] = editingValue

    setContent({ ...content })
    setEditingField(null)
    setEditingValue("")
  }

  const cancelEditing = () => {
    setEditingField(null)
    setEditingValue("")
  }

  // Handle image upload
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

        // Update content with new image URL
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
          title: "Success",
          description: "Image uploaded successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
    }
  }

  // Render content editor
  const renderContentEditor = (obj: any, path = "") => {
    return Object.entries(obj).map(([key, value]) => {
      const fieldPath = path ? `${path}.${key}` : key

      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        return (
          <div key={fieldPath} className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 capitalize">
              {key.replace(/([A-Z])/g, " $1").trim()}
            </Label>
            <div className="pl-4 border-l-2 border-gray-200 space-y-2">{renderContentEditor(value, fieldPath)}</div>
          </div>
        )
      }

      if (Array.isArray(value)) {
        return (
          <div key={fieldPath} className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 capitalize">
              {key.replace(/([A-Z])/g, " $1").trim()}
            </Label>
            <div className="space-y-2">
              {value.map((item, index) => (
                <div key={index} className="p-2 border rounded">
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
            <Label className="text-sm font-medium text-gray-700 capitalize">
              {key.replace(/([A-Z])/g, " $1").trim()}
            </Label>
            {isImage && (
              <Button size="sm" variant="outline" onClick={() => setShowImageUpload(true)}>
                <ImageIcon className="w-3 h-3 mr-1" />
                Change
              </Button>
            )}
          </div>

          {editingField === fieldPath ? (
            <div className="space-y-2">
              {isLongText ? (
                <Textarea value={editingValue} onChange={(e) => setEditingValue(e.target.value)} rows={4} />
              ) : (
                <Input value={editingValue} onChange={(e) => setEditingValue(e.target.value)} />
              )}
              <div className="flex gap-2">
                <Button size="sm" onClick={saveField}>
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={cancelEditing}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div
              className="p-2 border rounded cursor-pointer hover:bg-gray-50 group"
              onClick={() => startEditing(fieldPath, String(value))}
            >
              {isImage && typeof value === "string" && value.startsWith("http") ? (
                <div className="space-y-2">
                  <img src={value || "/placeholder.svg"} alt={key} className="w-20 h-20 object-cover rounded" />
                  <p className="text-xs text-gray-500 truncate">{value}</p>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className={isLongText ? "text-sm" : ""}>
                    {isLongText ? `${String(value).substring(0, 100)}...` : String(value)}
                  </span>
                  <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
            </div>
          )}
        </div>
      )
    })
  }

  // Login form
  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-800">Editor Login</CardTitle>
            <p className="text-gray-600">Access the content management system</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  defaultValue={DEFAULT_LOGIN_PASSWORD}
                  className="mt-1"
                />
              </div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                Login to Editor
              </Button>
            </form>
          </CardContent>
        </Card>
        <Toaster />
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-80 bg-white shadow-lg flex flex-col">
          {/* Header */}
          <div className="p-6 border-b bg-gradient-to-r from-green-600 to-blue-600 text-white">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Content Editor</h1>
              <div className="flex flex-col items-end gap-1">
                <Badge variant="secondary" className="bg-white/20 text-white">
                  Live Preview
                </Badge>
                {/* GitHub status indicator */}
                {githubStatus && (
                  <Badge
                    variant="secondary"
                    className={`text-xs ${
                      githubStatus.configured ? "bg-green-500/20 text-green-100" : "bg-red-500/20 text-red-100"
                    }`}
                  >
                    {githubStatus.configured ? "GitHub Connected" : "GitHub Not Configured"}
                  </Badge>
                )}
              </div>
            </div>

            {/* Viewport Controls */}
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant={viewportSize === "desktop" ? "secondary" : "ghost"}
                    onClick={() => setViewportSize("desktop")}
                    className="text-white hover:bg-white/20"
                  >
                    <Monitor className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Desktop View</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant={viewportSize === "tablet" ? "secondary" : "ghost"}
                    onClick={() => setViewportSize("tablet")}
                    className="text-white hover:bg-white/20"
                  >
                    <Tablet className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Tablet View</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant={viewportSize === "mobile" ? "secondary" : "ghost"}
                    onClick={() => setViewportSize("mobile")}
                    className="text-white hover:bg-white/20"
                  >
                    <Smartphone className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Mobile View</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Page Selection */}
          <div className="p-4 border-b">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Current Page</Label>
            <Select
              value={currentFile.name}
              onValueChange={(value) => {
                const file = CONTENT_FILES.find((f) => f.name === value)
                if (file) setCurrentFile(file)
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CONTENT_FILES.map((file) => (
                  <SelectItem key={file.name} value={file.name}>
                    <div className="flex items-center gap-2">
                      {file.icon}
                      {file.displayName}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content Editor */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">Content Fields</h3>
                <div className="flex gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" variant="outline" onClick={() => setIsPreviewMode(!isPreviewMode)}>
                        {isPreviewMode ? <Edit3 className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{isPreviewMode ? "Switch to Edit Mode" : "Switch to Preview Mode"}</TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {content && Object.keys(content).length > 0 ? (
                <div className="space-y-4">{renderContentEditor(content)}</div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No content loaded</p>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Action Buttons */}
          <div className="p-4 border-t bg-gray-50 space-y-2">
            <div className="flex gap-2">
              <Button
                onClick={saveContent}
                disabled={isSaving || JSON.stringify(content) === JSON.stringify(originalContent)}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                {isSaving ? "Committing..." : "Save & Commit"}
              </Button>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={resetContent}
                    disabled={JSON.stringify(content) === JSON.stringify(originalContent)}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reset Changes</TooltipContent>
              </Tooltip>
            </div>

            {/* GitHub status info */}
            {githubStatus && !githubStatus.configured && (
              <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                ⚠️ GitHub not configured. Changes will only be saved locally.
              </div>
            )}

            {githubStatus?.repository && (
              <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">📁 {githubStatus.repository.fullName}</div>
            )}

            <Button variant="ghost" onClick={handleLogout} className="w-full text-gray-600 hover:text-gray-800">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Main Preview Area */}
        <main className="flex-1 flex flex-col bg-gray-200">
          {/* Preview Header */}
          <div className="bg-white border-b p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="font-semibold text-gray-800">Live Preview</h2>
              <Badge variant="outline">{currentFile.displayName}</Badge>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Viewport: {viewportSize}</span>
              <span className="text-gray-400">•</span>
              <span>
                {VIEWPORT_SIZES[viewportSize].width} × {VIEWPORT_SIZES[viewportSize].height}
              </span>
            </div>
          </div>

          {/* Preview Container */}
          <div className="flex-1 p-8 flex items-center justify-center">
            <div
              className="bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300"
              style={{
                width: VIEWPORT_SIZES[viewportSize].width,
                height: VIEWPORT_SIZES[viewportSize].height,
                maxWidth: "100%",
                maxHeight: "100%",
              }}
            >
              <iframe ref={iframeRef} src={currentFile.path} className="w-full h-full border-0" title="Live Preview" />
            </div>
          </div>
        </main>

        {/* Image Upload Modal */}
        {showImageUpload && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Upload Image</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowImageUpload(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-2">Drag and drop an image, or click to select</p>
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
                    />
                  </div>

                  {uploadingImage && (
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <Loader2 className="w-4 h-4 animate-spin" />
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
