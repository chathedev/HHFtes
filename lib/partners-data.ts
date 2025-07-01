export interface Partner {
  id: string
  name: string
  logo: string // Path to the logo image
  tier: "Diamantpartner" | "Platinapartner" | "Guldpartner" | "Silverpartner" | "Bronspartner"
  linkUrl?: string // Optional URL for the partner
  visibleInCarousel?: boolean // Whether to show in the main carousel
}

export const partners: Partner[] = [
  {
    id: "highcon",
    name: "Highcon",
    logo: "/partners/highcon.png",
    tier: "Diamantpartner",
    linkUrl: "https://www.highcon.se",
    visibleInCarousel: true,
  },
  {
    id: "hsta",
    name: "HSTA",
    logo: "/partners/hsta.png",
    tier: "Diamantpartner",
    linkUrl: "https://www.hsta.se",
    visibleInCarousel: true,
  },
  {
    id: "harnosands-platslageri",
    name: "Härnösands Plåtslageri",
    logo: "/partners/harnosands-platslageri.png",
    tier: "Diamantpartner",
    linkUrl: "https://www.harnosandsplatslageri.se",
    visibleInCarousel: true,
  },
  {
    id: "jasab",
    name: "Jasab",
    logo: "/partners/jasab.png",
    tier: "Diamantpartner",
    linkUrl: "https://www.jasab.se",
    visibleInCarousel: true,
  },
  {
    id: "jj-bygg",
    name: "JJ Bygg",
    logo: "/partners/jj-bygg.png",
    tier: "Diamantpartner",
    linkUrl: "https://www.jjbygg.se",
    visibleInCarousel: true,
  },
  {
    id: "ohmy",
    name: "Ohmy",
    logo: "/partners/ohmy.png",
    tier: "Diamantpartner",
    linkUrl: "https://www.ohmy.se",
    visibleInCarousel: true,
  },
  {
    id: "westerlinds",
    name: "Westerlinds",
    logo: "/partners/westerlinds.png",
    tier: "Diamantpartner",
    linkUrl: "https://www.westerlinds.se",
    visibleInCarousel: true,
  },
  {
    id: "sundfrakt",
    name: "Sundfrakt",
    logo: "/partners/sundfrakt.png",
    tier: "Diamantpartner",
    linkUrl: "https://www.sundfrakt.se",
    visibleInCarousel: true,
  },
  {
    id: "mittmedia",
    name: "Mittmedia",
    logo: "/partners/mittmedia.png",
    tier: "Platinapartner",
    linkUrl: "https://www.mittmedia.se",
    visibleInCarousel: true,
  },
  {
    id: "banken",
    name: "Banken",
    logo: "/partners/banken.png",
    tier: "Platinapartner",
    linkUrl: "https://www.banken.se",
    visibleInCarousel: true,
  },
  {
    id: "ica-maxi",
    name: "ICA Maxi",
    logo: "/partners/ica-maxi.png",
    tier: "Guldpartner",
    linkUrl: "https://www.icamaxi.se",
    visibleInCarousel: true,
  },
  {
    id: "coop",
    name: "Coop",
    logo: "/partners/coop.png",
    tier: "Guldpartner",
    linkUrl: "https://www.coop.se",
    visibleInCarousel: true,
  },
  {
    id: "lokal-bygg",
    name: "Lokal Bygg",
    logo: "/partners/lokal-bygg.png",
    tier: "Silverpartner",
    linkUrl: "https://www.lokalbygg.se",
    visibleInCarousel: true,
  },
  {
    id: "sport-shop",
    name: "Sport Shop",
    logo: "/partners/sport-shop.png",
    tier: "Bronspartner",
    linkUrl: "https://www.sportshop.se",
    visibleInCarousel: true,
  },
]

// Export allPartners for compatibility with existing code
export const allPartners = partners
