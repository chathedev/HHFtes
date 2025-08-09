"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { PanelLeft, Save, RotateCcw, LogOut, CheckCircle, XCircle, Github, Loader2, Info } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Toaster } from "@/components/ui/toaster"

// Hardcoded editor login (per request) - this is now the only credential needed
const DEFAULT_LOGIN_PASSWORD = "harnosandshf10!"

// Environment variables for GitHub API
const GITHUB_OWNER = "chathedev"
const GITHUB_REPO = "HHFNAF"
const BRANCH = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF || "main" // Use Vercel branch or default to main

// Path to the content file within the repository
const FILE_PATH_IN_REPO = "content/home.json"

// GitHub API URL for contents (for SHA and PUT operations)
const GITHUB_API_CONTENTS_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH_IN_REPO}`

// Raw content URL for fetching the file directly
const RAW_CONTENT_FETCH_URL = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${BRANCH}/${FILE_PATH_IN_REPO}`

type HomeData = {
  heroTitle: string
  heroSubtitle: string
  ctaText: string
  heroImage: string // URL
  partners: { name: string; logoUrl: string }[]
}

type ValidationErrors = Record<string, string>

function isHttpsUrl(url: string) {
  return /^https:\/\/.+/i.test(url.trim())
}

function encodeToBase64Utf8(str: string) {
  // Safe base64 for UTF-8 strings in browsers
  return btoa(unescape(encodeURIComponent(str)))
}

export default function EditorPage() {
  const [content, setContent] = useState("")
  const [originalContent, setOriginalContent] = useState("")
  const [gitHubToken, setGitHubToken] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [authed, setAuthed] = useState(false) // This state will be managed by successful API login
  const router = useRouter()

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Attempt to fetch a protected resource or check a cookie directly
        // For simplicity, we'll assume if the user is on this page, they are authenticated
        // or will attempt to authenticate via the form.
        // A more robust solution would involve checking the 'editor-auth' cookie here.
        const res = await fetch("/api/auth/check-auth", { method: "GET" }) // You might need to create this endpoint
        if (res.ok) {
          setAuthed(true)
        } else {
          setAuthed(false)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        setAuthed(false)
      }
    }
    checkAuth()
  }, [])

  const fetchData = useCallback(async () => {
    if (!authed || !gitHubToken) return

    try {
      // Fetch raw content directly from the raw.githubusercontent.com URL
      const response = await fetch(RAW_CONTENT_FETCH_URL, {
        cache: "no-store", // Ensure fresh data
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch content from ${RAW_CONTENT_FETCH_URL}: ${response.statusText}`)
      } else {
        const text = await response.text()
        setContent(text)
        setOriginalContent(text)
        toast({
          title: "Content Loaded",
          description: "Successfully loaded content from GitHub.",
        })
      }
    } catch (error: any) {
      console.error("Error fetching content:", error)
      toast({
        title: "Error Loading Content",
        description: error.message || "Could not load content from GitHub.",
        variant: "destructive",
      })
    }
  }, [authed, gitHubToken]) // gitHubToken is still a dependency for `authed` state, even if not used in fetch headers

  useEffect(() => {
    if (authed && gitHubToken) {
      // Only fetch data if authenticated and PAT is set
      fetchData()
    }
  }, [fetchData, authed, gitHubToken])

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" })
      if (response.ok) {
        setAuthed(false)
        setGitHubToken("")
        setContent("")
        setOriginalContent("")
        router.push("/login") // Redirect to login page after logout
        toast({
          title: "Logged Out",
          description: "You have been successfully logged out.",
        })
      } else {
        throw new Error("Logout failed.")
      }
    } catch (error: any) {
      console.error("Logout error:", error)
      toast({
        title: "Logout Failed",
        description: error.message || "An error occurred during logout.",
        variant: "destructive",
      })
    }
  }

  const validateContent = useCallback(() => {
    try {
      JSON.parse(content)
      setValidationError(null)
      toast({
        title: "Validation Successful",
        description: "Content is valid JSON.",
        className: "bg-green-500 text-white",
      })
      return true
    } catch (e: any) {
      setValidationError(e.message)
      toast({
        title: "Validation Failed",
        description: `Invalid JSON: ${e.message}`,
        variant: "destructive",
      })
      return false
    }
  }, [content])

  const handlePublish = async () => {
    if (!validateContent()) {
      return
    }

    setIsSaving(true)
    try {
      // First, get the SHA of the current file using the GitHub API
      const shaResponse = await fetch(GITHUB_API_CONTENTS_URL + `?ref=${BRANCH}`, {
        headers: {
          Authorization: `token ${gitHubToken}`,
          Accept: "application/vnd.github.v3+json", // Request JSON for SHA
        },
      })

      if (!shaResponse.ok) {
        throw new Error(`Failed to get file SHA from ${GITHUB_API_CONTENTS_URL}: ${shaResponse.statusText}`)
      }

      const shaData = await shaResponse.json()
      const currentSha = shaData.sha

      // Prepare content for GitHub API (base64 encoded)
      const encodedContent = btoa(content)

      const commitMessage = `Update ${FILE_PATH_IN_REPO} via editor on branch ${BRANCH}`

      const response = await fetch(GITHUB_API_CONTENTS_URL, {
        method: "PUT",
        headers: {
          Authorization: `token ${gitHubToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: commitMessage,
          content: encodedContent,
          sha: currentSha, // Required for updating existing files
          branch: BRANCH,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`GitHub API error: ${response.status} - ${errorData.message || response.statusText}`)
      }

      setOriginalContent(content) // Update original content after successful publish
      toast({
        title: "Published Successfully",
        description: "Content updated on GitHub and deployment triggered.",
        className: "bg-green-500 text-white",
      })
    } catch (error: any) {
      console.error("Publish error:", error)
      toast({
        title: "Publish Failed",
        description: error.message || "An error occurred during publishing.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    setContent(originalContent)
    setValidationError(null)
    toast({
      title: "Content Reset",
      description: "Changes have been reverted to the last saved version.",
    })
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const password = formData.get("password") as string

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: password }), // Only send password
      })

      if (response.ok) {
        setAuthed(true)
        toast({
          title: "Login Successful",
          description: "You are now logged in.",
        })
        router.push("/editor") // Redirect to editor page on successful login
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Login failed.") // Use error from server response
      }
    } catch (error: any) {
      console.error("Login error:", error)
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials.",
        variant: "destructive",
      })
    }
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Editor Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Removed email input */}
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required defaultValue={DEFAULT_LOGIN_PASSWORD} />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold">GitHub Personal Access Token (PAT)</h3>
              <p className="text-sm text-gray-600">
                Enter a GitHub PAT with `repo` scope to enable content fetching and publishing.
              </p>
              <Input
                type="password"
                placeholder="Enter GitHub PAT"
                value={gitHubToken}
                onChange={(e) => setGitHubToken(e.target.value)}
              />
              <Button
                onClick={() => {
                  if (gitHubToken) {
                    setAuthed(true) // Set authed to true to allow fetching data with PAT
                    toast({
                      title: "PAT Applied",
                      description: "GitHub token has been set. Attempting to fetch content.",
                    })
                    // No router.push here, as setting authed will trigger useEffect to fetch data
                  } else {
                    toast({
                      title: "PAT Missing",
                      description: "Please enter a GitHub Personal Access Token.",
                      variant: "destructive",
                    })
                  }
                }}
                className="w-full"
                disabled={!gitHubToken}
              >
                Use PAT
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                <a
                  href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  How to create a PAT
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
        <Toaster />
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="flex min-h-screen bg-gray-50">
        {/* Left Sidebar */}
        <aside className="w-64 bg-gray-800 text-white flex flex-col p-4 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Editor</h2>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <PanelLeft className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Toggle Sidebar</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <ScrollArea className="flex-grow pr-2">
            <nav className="space-y-2">
              <h3 className="text-lg font-semibold mb-2">Content Sections</h3>
              {/* Example: Dynamically list sections from home.json if needed */}
              <Button variant="ghost" className="w-full justify-start text-left text-white hover:bg-gray-700">
                Home Page Content
              </Button>
              {/* Add more content sections here */}
            </nav>
            <Separator className="my-6 bg-gray-700" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold mb-2">Editor Actions</h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={validateContent}
                    variant="ghost"
                    className="w-full justify-start text-left text-white hover:bg-gray-700"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" /> Validate JSON
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Check if the content is valid JSON</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleReset}
                    variant="ghost"
                    className="w-full justify-start text-left text-white hover:bg-gray-700"
                    disabled={content === originalContent}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" /> Reset Changes
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Revert to the last published version</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handlePublish}
                    disabled={isSaving || content === originalContent}
                    className="w-full justify-start text-left bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}{" "}
                    Publish to GitHub
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Save changes to GitHub and trigger a new deployment</p>
                </TooltipContent>
              </Tooltip>
              {validationError && (
                <div className="flex items-center text-red-400 text-sm mt-2">
                  <XCircle className="mr-2 h-4 w-4" />
                  <span>{validationError}</span>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="mt-auto pt-4 border-t border-gray-700">
            {/* Removed Tooltip from Logout Button as requested */}
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start text-left text-white hover:bg-gray-700"
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
            <div className="mt-4 text-xs text-gray-400 flex items-center">
              <Github className="mr-2 h-4 w-4" />
              <span>
                Repo: {GITHUB_OWNER}/{GITHUB_REPO}
              </span>
            </div>
            <div className="text-xs text-gray-400 flex items-center mt-1">
              <Info className="mr-2 h-4 w-4" />
              <span>Branch: {BRANCH}</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Site Editor</h1>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Edit `{FILE_PATH_IN_REPO}` Content</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                className="min-h-[600px] font-mono text-sm"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Loading content..."
              />
            </CardContent>
          </Card>
        </main>
        <Toaster />
      </div>
    </TooltipProvider>
  )
}
