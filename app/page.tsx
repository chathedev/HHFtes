export const dynamic = "force-dynamic"
import { redirect } from "next/navigation"

import type { FullContent } from "@/lib/content-types"
import { defaultContent } from "@/lib/default-content"

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "https://api.nuredo.se"

/* -------------------------------------------------------------------------- */
/*                           DATA-FETCHING FUNCTION                           */
/* -------------------------------------------------------------------------- */
async function getDynamicContent(): Promise<FullContent> {
  try {
    const res = await fetch(`${BACKEND_API_URL}/api/content`, { cache: "no-store" })
    if (!res.ok) {
      console.error(`Failed to fetch content from backend: ${res.statusText}`)
      return defaultContent
    }
    const data = (await res.json()) as Partial<FullContent>

    // Guarantee partners is an array
    const fetchedPartners = Array.isArray(data.partners) ? data.partners : defaultContent.partners

    // Merge with defaults to ensure all fields exist
    return { ...defaultContent, ...data, partners: fetchedPartners }
  } catch (err) {
    console.error("Error fetching dynamic content:", err)
    return defaultContent
  }
}

/* -------------------------------------------------------------------------- */
/*                                PAGE LAYOUT                                */
/* -------------------------------------------------------------------------- */
export default function HomePage() {
  // Temporary redirect to laget.se
  redirect("https://www.laget.se/HarnosandsHF")
}
