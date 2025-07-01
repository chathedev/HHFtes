/**
 * Central content store used by the editor & runtime rendering.
 *
 * NOTE: In a real-world app you would back this with a database or KV.
 * Here we keep everything in-memory for simplicity.
 */

export type HeroContent = {
  title: string
  description: string
  titleTextColorClass: string
  titleFontSizeClass: string
  descriptionTextColorClass: string
  descriptionFontSizeClass: string
  backgroundImageUrl: string
  overlayColorClass: string
  ctaPrimary: { text: string; href: string; bgClass: string; textClass: string }
  ctaSecondary: { text: string; href: string; bgClass: string; textClass: string }
}

export type StatsContent = {
  heading: string
  items: { label: string; value: string }[]
}

export type AboutContent = {
  heading: string
  body: string
  imageUrl: string
}

export type PartnersContent = {
  heading: string
  logos: string[]
}

export type UpcomingEventsContent = {
  heading: string
  events: { title: string; date: string; url: string }[]
}

export type PageContent = {
  hero: HeroContent
  stats: StatsContent
  about: AboutContent
  partners: PartnersContent
  upcoming: UpcomingEventsContent
}

/* -------------------------------------------------------------------------- */
/*                                  DEFAULTS                                  */
/* -------------------------------------------------------------------------- */

export const defaultContent: PageContent = {
  hero: {
    title: "Välkommen till Härnösands HF",
    description: "Handbollsföreningen i hjärtat av Ångermanland.",
    titleTextColorClass: "text-white",
    titleFontSizeClass: "text-4xl md:text-6xl",
    descriptionTextColorClass: "text-white/90",
    descriptionFontSizeClass: "text-lg md:text-2xl",
    backgroundImageUrl: "/placeholder.svg?height=1080&width=1920",
    overlayColorClass: "bg-black/60",
    ctaPrimary: {
      text: "Bli medlem",
      href: "/bli-medlem",
      bgClass: "bg-red-600 hover:bg-red-700",
      textClass: "text-white",
    },
    ctaSecondary: {
      text: "Läs mer",
      href: "/om-oss",
      bgClass: "bg-white hover:bg-gray-200",
      textClass: "text-red-600",
    },
  },
  stats: {
    heading: "Klubbstatistik",
    items: [
      { label: "Grundad", value: "1975" },
      { label: "Medlemmar", value: "450+" },
      { label: "SM-guld", value: "3" },
    ],
  },
  about: {
    heading: "Om Härnösands HF",
    body:
      "Härnösands HF är en ideell handbollsförening som engagerar barn, ungdomar och vuxna " +
      "från hela regionen. Vi fokuserar på gemenskap, glädje och sportslig utveckling.",
    imageUrl: "/placeholder.svg?height=600&width=800",
  },
  partners: {
    heading: "Partners",
    logos: ["/placeholder.svg?height=120&width=240", "/placeholder.svg?height=120&width=240"],
  },
  upcoming: {
    heading: "Kommande matcher",
    events: [
      { title: "HHF vs. Örebro HK", date: "2025-09-14", url: "/matcher" },
      { title: "Sundsvalls IF vs. HHF", date: "2025-09-21", url: "/matcher" },
    ],
  },
}

/* -------------------------------------------------------------------------- */
/*                               HELPER UTILITIES                              */
/* -------------------------------------------------------------------------- */

/**
 * Deep-merge two objects (very small util; not production-ready for arrays etc.).
 */
export function deepMerge<T extends Record<string, any>>(base: T, patch: Partial<T>): T {
  const output = { ...base }
  for (const key of Object.keys(patch)) {
    // If both values are objects, recurse.
    if (typeof patch[key] === "object" && patch[key] !== null) {
      // @ts-expect-error – we know the index exists
      output[key] = deepMerge(output[key], patch[key])
    } else {
      // @ts-expect-error – we know the index exists
      output[key] = patch[key]
    }
  }
  return output
}

/**
 * Returns the Vercel URL on the server or window.location.origin on the client.
 */
export function getBaseUrl(): string {
  if (typeof window !== "undefined") return window.location.origin
  return process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : "http://localhost:3000"
}

/* -------------------------------------------------------------------------- */
/*                             IN-MEMORY CONTENT DB                            */
/* -------------------------------------------------------------------------- */

let currentContent: PageContent = structuredClone(defaultContent)

/**
 * Load the current content (fetch from API in real app, here just return memory).
 */
export async function loadContent(): Promise<PageContent> {
  // Simulate an async fetch for parity with real usage.
  return Promise.resolve(structuredClone(currentContent))
}

/**
 * Reset the content to its default values.
 */
export function resetContent(): PageContent {
  currentContent = structuredClone(defaultContent)
  return currentContent
}

/**
 * Update (patch) a fragment of the page content.
 */
export function patchContent(patch: Partial<PageContent>): PageContent {
  currentContent = deepMerge(currentContent, patch)
  return currentContent
}
