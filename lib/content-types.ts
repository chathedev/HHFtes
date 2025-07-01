// lib/content-types.ts
export interface HeroContent {
  imageUrl: string
  title: string
  description: string
  button1Text: string
  button1Link: string
  button2Text: string
  button2Link: string
}

export interface StatsContent {
  totalTeams: number
  aTeams: number
  youthTeams: number
  yearsHistory: string
}

export interface AboutClubContent {
  title: string
  paragraph1: string
  paragraph2: string
  passionText: string
  developmentText: string
  communityText: string
  button1Text: string
  button1Link: string
  button2Text: string
  button2Link: string
  imageSrc: string
  imageAlt: string
  statNumber: number
  statLabel: string
}

export interface Partner {
  /** A unique, URL-safe id (used as React key, etc.) */
  id: string
  /** Sponsorship tier – e.g. “Diamantpartner”, “Guldpartner” … */
  tier: string
  /** Public URL (or pathname inside /public) of the partner logo */
  src: string
  /** Accessible alt text (also rendered as the partner name in UI) */
  alt: string
  /** Optional link to the partner’s website */
  linkUrl?: string
  /** Should this partner be visible in the carousel? */
  visibleInCarousel?: boolean
}

export interface FullContent {
  hero: HeroContent
  stats: StatsContent
  aboutClub: AboutClubContent
  partners: Partner[]
  sections: string[] // To store the order of sections
}
