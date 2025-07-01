"use server"

import { revalidatePath } from "next/cache"
import { defaultContent, deepMerge, type PageContent } from "@/lib/content-store"

const API_URL = process.env.BACKEND_API_URL || "https://api.nuredo.se/api/content"

/**
 * Load the current page content (or fallback to defaults inside content-store).
 */
export async function loadContent(resetToDefault = false): Promise<PageContent> {
  if (resetToDefault) {
    return defaultContent
  }

  try {
    const res = await fetch(API_URL, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store", // Always fetch latest content
    })

    if (res.ok) {
      const json = (await res.json()) as Partial<PageContent>
      return deepMerge(defaultContent, json)
    }

    console.warn(`[loadContent] Backend responded ${res.status}. Falling back to defaults.`)
  } catch (err) {
    console.error("[loadContent] Backend fetch failed:", err)
  }

  // Fallback to defaults if anything goes wrong
  return defaultContent
}

/**
 * Persist new content, then revalidate the public pages that rely on it.
 */
export async function saveContent(content: PageContent) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add any necessary authentication headers here, e.g., API_SECRET
        // "Authorization": `Bearer ${process.env.API_SECRET}`,
      },
      body: JSON.stringify(content),
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error(`Failed to save content: ${res.status} ${res.statusText} - ${errorText}`)
      throw new Error(`Failed to save content: ${res.statusText}`)
    }

    // Revalidate the home page to show updated content
    revalidatePath("/")
    revalidatePath("/editor") // Revalidate editor page itself if needed

    return { success: true, message: "Content saved successfully!" }
  } catch (error) {
    console.error("Error saving content:", error)
    return { success: false, message: `Error saving content: ${(error as Error).message}` }
  }
}

export { saveContent as default }
