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
          // For arrays, replace completely rather than merging elements
          output[key as keyof T] = sourceValue as T[keyof T]
        } else if (
          typeof targetValue === "object" &&
          targetValue !== null &&
          typeof sourceValue === "object" &&
          sourceValue !== null &&
          !Array.isArray(targetValue) &&
          !Array.isArray(sourceValue) // Ensure it's not an array before deep merging
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
    const response = await fetch(BACKEND_API_URL, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Always get the latest content
    })

    if (response.ok) {
      const fetchedContent = (await response.json()) as PageContent
      // Merge fetched content with default to ensure all fields exist,
      // especially if the fetched content is incomplete.
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
    const response = await fetch(BACKEND_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_SECRET}`, // Use Bearer token for authentication
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

export async function resetEditorContentServer(): Promise<PageContent> {
  // This function will simulate fetching the default content from the backend.
  // In a real scenario, if your backend had a specific endpoint to "reset" content
  // (e.g., by deleting the content.json or reverting it), you would call it here.
  // For this implementation, we'll just return the defaultContent.
  console.log("Simulating reset of editor content to default values (server-side).")
  // You might want to add a call to your backend's POST /api/content with defaultContent
  // if you want the reset to persist on GitHub.
  // Example:
  // await saveEditorContentServer(defaultContent);
  await new Promise((resolve) => setTimeout(resolve, 200)) // Simulate network delay
  return defaultContent
}
