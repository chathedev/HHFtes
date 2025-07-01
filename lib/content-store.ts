/**
 * Central content store used by the editor & runtime rendering.
 *
 * NOTE: In a real-world app you would back this with a database or KV.
 * Here we keep everything in-memory for simplicity.
 */

export interface PageContent {
  hero: {
    title: string
    description: string
    titleTextColorClass: string
    descriptionTextColorClass: string
    titleFontSizeClass: string
    descriptionFontSizeClass: string
    backgroundImageUrl: string
    overlayColorClass: string
    buttons: Array<{
      text: string
      href: string
      bgColorClass: string
      textColorClass: string
    }>
  }
  // Add other sections as needed…
}

/* -------------------------------------------------------------------------- */
/*                                  DEFAULTS                                  */
/* -------------------------------------------------------------------------- */

export const defaultContent: PageContent = {
  hero: {
    title: "Välkommen till Härnösands HF",
    description: "Officiell hemsida för handbollsföreningen från Härnösand.",
    titleTextColorClass: "text-white",
    descriptionTextColorClass: "text-white/90",
    titleFontSizeClass: "text-4xl md:text-6xl",
    descriptionFontSizeClass: "text-lg md:text-xl",
    backgroundImageUrl: "/placeholder.svg?height=900&width=1600",
    overlayColorClass: "bg-black/40",
    buttons: [
      {
        text: "Bli medlem",
        href: "/bli-medlem",
        bgColorClass: "bg-red-600",
        textColorClass: "text-white",
      },
      {
        text: "Matcher",
        href: "/matcher",
        bgColorClass: "bg-transparent border border-white",
        textColorClass: "text-white",
      },
    ],
  },
}

/* -------------------------------------------------------------------------- */
/*                               HELPER UTILITIES                              */
/* -------------------------------------------------------------------------- */

/**
 * Deep-merge two objects (very small util; not production-ready for arrays etc.).
 */
export function deepMerge<T extends object>(base: T, patch: Partial<T>): T {
  const output = { ...base } as T
  for (const key of Object.keys(patch) as Array<keyof T>) {
    const value = patch[key]
    if (value && typeof value === "object" && !Array.isArray(value) && key in base) {
      // @ts-ignore – safe recursive merge
      output[key] = deepMerge(base[key] as any, value as any)
    } else if (value !== undefined) {
      output[key] = value as T[typeof key]
    }
  }
  return output
}

/**
 * Load content from an API or localStorage.
 * Falls back to `defaultContent` on any error.
 */
export async function loadContent(): Promise<PageContent> {
  try {
    // Example fetch – replace with real endpoint if you have one.
    const res = await fetch("/api/editor-content")
    if (res.ok) {
      const json = (await res.json()) as Partial<PageContent>
      return deepMerge(defaultContent, json)
    }
    // eslint-disable-next-line no-empty
  } catch {}
  return structuredClone(defaultContent)
}

/** Reset to factory defaults (use in the editor’s “Återställ” button). */
export function resetContent(): PageContent {
  return structuredClone(defaultContent)
}

/** Resolve absolute base-URL both locally and on Vercel. */
export function getBaseUrl(): string {
  if (typeof window !== "undefined") return ""
  return process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : "http://localhost:3000"
}
