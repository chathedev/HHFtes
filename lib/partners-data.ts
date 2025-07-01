/**
 * Static fallback for build-time. During runtime we
 * replace this with live data from `https://api.nuredo.se`.
 * Make sure every partner has a `benefits` array so
 * `partner.benefits.length` is always defined.
 */

import type { Partner } from "@/lib/content-types"

export const allPartners: Partner[] = [
  {
    id: "highcon",
    alt: "HighCon AB",
    src: "/placeholder-logo.png",
    linkUrl: "https://highcon.se",
    tier: "Diamantpartner",
    benefits: ["Huvudsponsor 2024/25"],
    visibleInCarousel: true,
  },
  {
    id: "sundstrom",
    alt: "Sundström Bygg",
    src: "/placeholder-logo.png",
    linkUrl: "https://sundstrombygg.se",
    tier: "Platinapartner",
    benefits: ["Platina-sponsor"],
    visibleInCarousel: true,
  },
  {
    id: "handelsbanken",
    alt: "Handelsbanken",
    src: "/placeholder-logo.png",
    linkUrl: "https://handelsbanken.se",
    tier: "Guldpartner",
    benefits: ["Guldsponsor"],
    visibleInCarousel: true,
  },
  {
    id: "lokal-pizzeria",
    alt: "Lokal Pizzeria",
    src: "/placeholder-logo.png",
    tier: "Silverpartner",
    benefits: [],
    visibleInCarousel: false,
  },
  {
    id: "tryckeri-norr",
    alt: "Tryckeri Norr",
    src: "/placeholder-logo.png",
    tier: "Bronspartner",
    benefits: [],
    visibleInCarousel: false,
  },
]
