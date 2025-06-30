"use server"

import { defaultContent, type PageContent } from "@/lib/content-store"

const API_BASE_URL = "https://api.nuredo.se/api"

interface ApiResponse {
  message: string
  content?: PageContent
  sections?: string[]
}

async function fetchWithAuth(url: string, options?: RequestInit): Promise<Response> {
  const headers = new Headers(options?.headers)
  // Only add Authorization header for POST/PATCH requests
  if (options?.method === "POST" || options?.method === "PATCH") {
    headers.set("Authorization", `Bearer ${process.env.API_SECRET}`)
  }
  return fetch(url, { ...options, headers })
}

export async function loadEditorContentServer(): Promise<PageContent> {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/content`, {
      method: "GET",
      next: { revalidate: 0 }, // Ensure fresh data on every request
    })

    if (!response.ok) {
      console.error(`Failed to fetch content: ${response.status} ${response.statusText}`)
      // Fallback to default content if backend fetch fails
      return defaultContent
    }

    const data = await response.json()
    return data as PageContent
  } catch (error) {
    console.error("Error loading editor content from backend:", error)
    // Fallback to default content if there's a network error
    return defaultContent
  }
}

export async function saveEditorContentServer(content: PageContent): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/content`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(content),
    })

    const result: ApiResponse = await response.json()

    if (!response.ok) {
      console.error("Failed to save content:", result.message || response.statusText)
      return { success: false, message: result.message || "Kunde inte spara innehåll." }
    }

    return { success: true, message: result.message || "Innehåll sparat framgångsrikt!" }
  } catch (error) {
    console.error("Error saving editor content to backend:", error)
    return { success: false, message: "Nätverksfel vid sparning av innehåll." }
  }
}

export async function resetEditorContentServer(): Promise<PageContent> {
  // In a real scenario, this might trigger a backend reset or simply return default.
  // For this demo, we'll just return the default content.
  // If your backend has a specific reset endpoint, you'd call it here.
  console.log("Resetting content to default values (server-side simulation).")
  return defaultContent
}
