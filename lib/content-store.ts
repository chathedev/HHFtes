import type { PageContent } from "./types" // assume you already have a shared type file

/* ---------- Default (fallback) data ---------- */
export const defaultContent: PageContent = {
  hero: {
    title: "Välkommen till Härnösands HF",
    description: "Fotboll med hjärta sedan 1990",
    imageUrl: "https://az316141.cdn.laget.se/2317159/11348130.jpg",
    button1Text: "Bli medlem",
    button1Link: "/kontakt",
    button2Text: "Våra lag",
    button2Link: "/lag",
  },
  aboutClub: {
    title: "Om Härnösands HF",
    description: "Härnösands HF är en ideell förening med fokus på glädje, gemenskap och utveckling.",
    imageSrc: "https://i.ibb.co/Zt8gppK/491897759-17872413642339702-3719173158843008539-n.jpg",
    linkText: "Läs mer",
    linkHref: "/kontakt",
    totalTeamsCallout: 23,
    totalMembersCallout: 450,
    totalYearsCallout: 35,
  },
  partners: [],
  upcomingEvents: [],
}

/* ---------- Lightweight client helpers ---------- */
const BACKEND_API_URL = "https://api.nuredo.se/api/content"

/**
 * Fetches the latest published content.  Falls back to defaultContent
 * on any error so the site never breaks.
 */
export async function loadContent(): Promise<PageContent> {
  try {
    const res = await fetch(BACKEND_API_URL, { cache: "no-store" })
    if (!res.ok) throw new Error(res.statusText)
    // merge to ensure we always have every field
    return { ...defaultContent, ...(await res.json()) }
  } catch {
    return defaultContent
  }
}
