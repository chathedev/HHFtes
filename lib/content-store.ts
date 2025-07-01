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
    buttons: {
      text: string
      href: string
      bgColorClass: string
      textColorClass: string
    }[]
  }
}

/* ---------------------------- DEFAULT CONTENT --------------------------- */
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

/* ----------------------------- UTILITIES -------------------------------- */
export function deepMerge<T extends object>(base: T, patch: Partial<T>): T {
  const out = { ...base } as T
  for (const k in patch) {
    // @ts-expect-error generic merge
    out[k] =
      typeof patch[k] === "object" && !Array.isArray(patch[k])
        ? deepMerge(base[k], patch[k] as any)
        : (patch[k] ?? base[k])
  }
  return out
}

let currentContent: PageContent = structuredClone(defaultContent)

export async function loadContent(): Promise<PageContent> {
  // In a real app fetch from DB / API.
  return structuredClone(currentContent)
}

export function resetContent(): PageContent {
  currentContent = structuredClone(defaultContent)
  return currentContent
}

export function getBaseUrl(): string {
  if (typeof window !== "undefined") return ""
  return process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : "http://localhost:3000"
}
