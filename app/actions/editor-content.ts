"use server"

import { type PageContent, defaultContent } from "@/lib/content-store"

const BACKEND_API_URL = "https://api.nuredo.se/api/content"

// Helper function for deep merging objects (copied from lib/content-store.ts for server-side use)
function deepMerge<T extends object>(target: T, source: Partial<T>): T {
  const output = { ...target } as T

  if (target && typeof target === "object" && source && typeof source === "object") {
    Object.keys(source).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const targetValue = target[key as keyof T]
        const sourceValue = source[key as keyof T]

        if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
          output[key as keyof T] = sourceValue as T[keyof T]
        } else if (
          typeof targetValue === "object" &&
          targetValue !== null &&
          typeof sourceValue === "object" &&
          sourceValue !== null &&
          !Array.isArray(targetValue) &&
          !Array.isArray(sourceValue)
        ) {
          output[key as keyof T] = deepMerge(targetValue as object, sourceValue as object) as T[keyof T]
        } else {
          output[key as keyof T] = sourceValue as T[keyof T]
        }
      }
    })
  }
  return output
}

export async function loadEditorContentServer(): Promise<PageContent> {
  try {
    // GET /api/content does NOT require authentication based on your backend snippet
    const response = await fetch(BACKEND_API_URL, {
      headers: {
        "Content-Type": "application/json",
      },
      // Disable caching for editor content to always get the latest
      cache: "no-store",
    })

    if (response.ok) {
      const fetchedContent = (await response.json()) as PageContent
      // Merge fetched content with default to ensure all fields exist
      return deepMerge(defaultContent, fetchedContent)
    } else {
      console.warn(
        `Failed to fetch content from backend (status: ${response.status}), falling back to default content.`,
      )
      return defaultContent
    }
  } catch (error) {
    console.error("Network error during server-side content fetch, falling back to default content:", error)
    return defaultContent
  }
}

export async function saveEditorContentServer(content: PageContent): Promise<{ success: boolean; message: string }> {
  try {
    // POST /api/content REQUIRES authentication based on your backend snippet
    const response = await fetch(BACKEND_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Ensure API_SECRET is available as an environment variable on the server
        Authorization: `Bearer ${process.env.API_SECRET}`, // Use Bearer token as per your backend
      },
      body: JSON.stringify(content),
    })

    if (response.ok) {
      return { success: true, message: "Innehåll sparat framgångsrikt!" }
    } else {
      const errorData = await response.json()
      console.error("Failed to save content to backend:", response.status, errorData)
      return { success: false, message: `Kunde inte spara innehållet: ${errorData.message || response.statusText}` }
    }
  } catch (error) {
    console.error("Network error during server-side content save:", error)
    return { success: false, message: "Nätverksfel vid sparande av innehåll." }
  }
}

// This function will simply return default content, as there's no specific backend endpoint for "resetting" all content
export async function resetEditorContentServer(): Promise<PageContent> {
  // In a real scenario, if you had a backend endpoint to reset content, you'd call it here.
  // For now, it just returns the default content.
  console.log("Resetting editor content to default values (server-side).")
  await new Promise((resolve) => setTimeout(resolve, 200)) // Simulate delay
  return defaultContent
}
