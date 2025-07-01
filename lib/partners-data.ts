import type { Partner } from "./content-types"

/**
 * Local fallback data.
 * Your production site should normally pull the real data from
 * https://api.nuredo.se, but several components (e.g. the
 * partners-carousel client) still import `allPartners` at build time.
 *
 * Keeping this array guarantees the build succeeds even if the remote
 * API is temporarily unavailable.
 */
export const allPartners: Partner[] = [
  {
    id: "highcon",
    tier: "Diamantpartner",
    src: "/placeholder-logo.png",
    alt: "HighCon AB",
    linkUrl: "https://example.com",
    visibleInCarousel: true,
  },
  {
    id: "demo-gold",
    tier: "Guldpartner",
    src: "/placeholder-logo.png",
    alt: "Guldföretaget",
    linkUrl: "https://example.com",
    visibleInCarousel: true,
  },
  /** add more seed partners here or load them dynamically */
]
