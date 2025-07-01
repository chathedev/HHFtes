"use server"

import { revalidatePath } from "next/cache"
import { defaultContent, deepMerge } from "@/lib/content-store"
import type { PageContent } from "@/lib/content-store"

const API_URL = process.env.BACKEND_API_URL || "https://api.nuredo.se/api/content"

/* -------------------------------------------------------------------------- */
/*                               LOAD CONTENT                                 */
/* -------------------------------------------------------------------------- */
export async function loadContent(): Promise<PageContent> {
  try {
    const res = await fetch(API_URL, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    })

    if (res.ok) {
      const json = (await res.json()) as Partial<PageContent>
      return deepMerge(defaultContent, json)
    }

    console.warn(`[loadContent] Backend responded ${res.status}. Falling back to defaults.`)
  } catch (err) {
    console.error("[loadContent] Backend fetch failed:", err)
  }
  return defaultContent
}

/* -------------------------------------------------------------------------- */
/*                               SAVE CONTENT                                 */
/* -------------------------------------------------------------------------- */
export async function saveContent(content: PageContent): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    })

    if (!res.ok) {
      const errorData = await res.json()
      console.error("Failed to save content:", res.status, errorData)
      return { success: false, message: errorData.message || "Could not save content." }
    }

    // ✅  Revalidate the homepage without exposing any secrets
    revalidatePath("/") // refresh the root path

    return { success: true, message: "Content saved successfully!" }
  } catch (error) {
    console.error("Error in saveContent:", error)
    return { success: false, message: (error as Error).message }
  }
}
