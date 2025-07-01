"use server"

import { type PageContent, defaultContent } from "@/lib/content-store"

const BACKEND_API_URL = process.env.BACKEND_API_URL || "https://api.nuredo.se"
const API_SECRET = process.env.API_SECRET

if (!BACKEND_API_URL) {
  throw new Error("BACKEND_API_URL is not defined in environment variables.")
}
if (!API_SECRET) {
  throw new Error("API_SECRET is not defined in environment variables.")
}

export async function loadEditorContentServer(): Promise<PageContent> {
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/content`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Ensure no-cache to always get the latest content from the backend
      cache: "no-store",
    })

    if (!response.ok) {
      console.error(`Backend load error: ${response.status} ${response.statusText}`)
      // Fallback to default content if backend fetch fails
      return defaultContent
    }

    const data = await response.json()
    return data as PageContent
  } catch (error) {
    console.error("Error loading content from backend:", error)
    // Fallback to default content on network error
    return defaultContent
  }
}

export async function saveEditorContentServer(content: PageContent): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/content`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_SECRET}`,
      },
      body: JSON.stringify(content),
    })

    const result = await response.json()

    if (!response.ok) {
      console.error(`Backend save error: ${response.status} ${response.statusText}`, result)
      return { success: false, message: result.message || "Kunde inte spara innehåll på servern." }
    }

    return { success: true, message: result.message || "Innehåll sparat framgångsrikt!" }
  } catch (error) {
    console.error("Error saving content to backend:", error)
    return { success: false, message: "Nätverksfel vid sparning av innehåll." }
  }
}

export async function resetEditorContentServer(): Promise<PageContent> {
  // For reset, we send the default content to the backend
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/content`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_SECRET}`,
      },
      body: JSON.stringify(defaultContent),
    })

    const result = await response.json()

    if (!response.ok) {
      console.error(`Backend reset error: ${response.status} ${response.statusText}`, result)
      throw new Error(result.message || "Kunde inte återställa innehåll på servern.")
    }

    return result.content as PageContent // Backend should return the new content
  } catch (error) {
    console.error("Error resetting content on backend:", error)
    throw new Error("Nätverksfel vid återställning av innehåll.")
  }
}
