/**
 * Central place for all editable-content typings
 * ───────────────────────────────────────────────
 * You can extend these interfaces later from the
 * editor if you need more fields.
 */

/* ----------  HERO  ---------- */
export interface HeroContent {
  headline: string
  subheadline: string
  ctaText: string
  ctaLink: string
  backgroundImage: string
}

/* ----------  STATS  ---------- */
export interface StatItem {
  label: string
  value: string
}

export interface StatsContent {
  stats: StatItem[]
}

/* ----------  ABOUT THE CLUB  ---------- */
export interface AboutClubContent {
  title: string
  body: string
  image: string
}

/* ----------  PARTNERS  ---------- */
export interface Partner {
  id: string
  /** Company name or short label shown under the logo */
  alt: string
  /** Public URL (or local path) to the logo */
  src: string
  /** “Diamantpartner”, “Platinapartner”, “Guldpartner”, “Silverpartner”, “Bronspartner” */
  tier: string
  /** Where to send visitors on click (optional) */
  linkUrl?: string
  /** Extra copy shown on partner cards (keep short) */
  benefits: string[]
  /** Should this partner be visible in the homepage carousel? */
  visibleInCarousel: boolean
}

/* ----------  COMPLETE SITE CONTENT  ---------- */
export interface SiteContent {
  hero: HeroContent
  stats: StatsContent
  aboutClub: AboutClubContent
  partners: Partner[]
  /**
   * Order of the home-page sections –
   * e.g. ["hero","stats","aboutClub","partnersCarousel"]
   */
  sections: string[]
}
