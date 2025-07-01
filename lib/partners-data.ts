/**
 * Local fallback dataset used at build-time.
 * In production, the live content coming from
 *  https://api.nuredo.se/api/content  will overwrite this.
 */

import type { Partner } from "@/lib/content-types"

export const allPartners: Partner[] = [
  {
    id: "highcon",
    tier: "Diamantpartner",
    src: "/placeholder-logo.png",
    alt: "Highcon AB",
    linkUrl: "https://highcon.example",
    visibleInCarousel: true,
  },
  {
    id: "acme",
    tier: "Guldpartner",
    src: "/placeholder-logo.png",
    alt: "ACME Industries",
    linkUrl: "https://acme.example",
    visibleInCarousel: true,
  },
  {
    id: "beta",
    tier: "Silverpartner",
    src: "/placeholder-logo.png",
    alt: "Beta Bygg",
    visibleInCarousel: true,
  },
]
