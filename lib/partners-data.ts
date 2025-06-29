export interface Partner {
  id: string
  src: string
  alt: string
  width: number // Standardized width
  height: number // Standardized height
  tier: "Diamantpartner" | "Platinapartner" | "Guldpartner" | "Silverpartner" | "Bronspartner"
  benefits: string[]
  visibleInCarousel: boolean
  linkUrl?: string
}

export const allPartners: Partner[] = [
  // Diamantpartners (Standardized size, premium decal)
  {
    id: "highcon",
    src: "https://az729104.cdn.laget.se/11314774.png",
    alt: "Highcon",
    width: 150,
    height: 75,
    tier: "Diamantpartner",
    benefits: ["Huvudsponsor", "Logotyp på matchställ", "Exklusiva event"],
    visibleInCarousel: true,
    linkUrl: "https://www.highcon.se", // Link: Yes
  },
  {
    id: "hsta",
    src: "https://az729104.cdn.laget.se/11313578.jpg",
    alt: "HSTA",
    width: 150,
    height: 75,
    tier: "Diamantpartner",
    benefits: ["Huvudsponsor", "Logotyp på matchställ", "Exklusiva event"],
    visibleInCarousel: true,
    linkUrl: "https://www.hsta.se", // Link: Yes
  },
  {
    id: "harnosands-platslageri",
    src: "https://az729104.cdn.laget.se/11311616.png",
    alt: "Härnösands Plåtslageri",
    width: 150,
    height: 75,
    tier: "Diamantpartner",
    benefits: ["Huvudsponsor", "Logotyp på matchställ", "Exklusiva event"],
    visibleInCarousel: true,
    linkUrl: "https://www.harnosandsplatslageri.se", // Link: Yes
  },
  {
    id: "jasab",
    src: "https://az729104.cdn.laget.se/11313577.jpg",
    alt: "Jasab",
    width: 150,
    height: 75,
    tier: "Diamantpartner",
    benefits: ["Huvudsponsor", "Logotyp på matchställ", "Exklusiva event"],
    visibleInCarousel: true,
    linkUrl: "https://www.jasab.se", // Link: Yes
  },
  {
    id: "jj-bygg",
    src: "https://az729104.cdn.laget.se/11314727.jpg",
    alt: "JJ Bygg",
    width: 150,
    height: 75,
    tier: "Diamantpartner",
    benefits: ["Huvudsponsor", "Logotyp på matchställ", "Exklusiva event"],
    visibleInCarousel: true,
    linkUrl: "https://jjbygg.se", // Link: Yes
  },
  {
    id: "ohmy",
    src: "https://az729104.cdn.laget.se/11313553.jpg",
    alt: "Ohmy",
    width: 150,
    height: 75,
    tier: "Diamantpartner",
    benefits: ["Huvudsponsor", "Logotyp på matchställ", "Exklusiva event"],
    visibleInCarousel: true,
    linkUrl: "https://ohmy.se", // Link: Yes
  },
  {
    id: "nsi-fastigheter",
    src: "https://az729104.cdn.laget.se/11314735.jpg",
    alt: "NSI Fastigheter",
    width: 150,
    height: 75,
    tier: "Diamantpartner",
    benefits: ["Huvudsponsor", "Logotyp på matchställ", "Exklusiva event"],
    visibleInCarousel: true,
    linkUrl: "https://nsifastigheter.se", // Link: Yes
  },
  {
    id: "westerlinds",
    src: "https://westerlinds.nu/wp-content/themes/westerlinds20/img/logo-new-full.svg",
    alt: "Westerlinds",
    width: 150,
    height: 75,
    tier: "Diamantpartner",
    benefits: ["Huvudsponsor", "Logotyp på matchställ", "Exklusiva event"],
    visibleInCarousel: true,
    linkUrl: "https://westerlinds.nu", // Link: Yes
  },

  // Platinapartners
  {
    id: "forsakringskonsult",
    src: "https://az729104.cdn.laget.se/11308402.jpg",
    alt: "Försäkringskonsult",
    width: 150,
    height: 75,
    tier: "Platinapartner",
    benefits: ["Logotyp på hemsida", "Synlighet vid hemmamatcher"],
    visibleInCarousel: true,
    linkUrl: "https://forsakringskonsult.se", // Link: Yes
  },
  {
    id: "sundfrakt",
    src: "https://az729104.cdn.laget.se/11313552.jpg",
    alt: "Sundfrakt",
    width: 150,
    height: 75,
    tier: "Platinapartner",
    benefits: ["Logotyp på hemsida", "Synlighet vid hemmamatcher"],
    visibleInCarousel: true,
    linkUrl: "https://www.sundfrakt.se", // Link: Yes
  },

  // Guldpartners
  {
    id: "bargab",
    src: "https://az729104.cdn.laget.se/11314769.png",
    alt: "Bärgab",
    width: 150,
    height: 75,
    tier: "Guldpartner",
    benefits: ["Logotyp på hemsida", "Synlighet vid hemmamatcher"],
    visibleInCarousel: true,
    linkUrl: "https://www.bargab.se", // Link: Yes
  },
  {
    id: "mekonomen",
    src: "https://d3sjey3kqst1or.cloudfront.net/static/version1750738442/frontend/Mekonomen/Mek/sv_SE/images/main-logo.svg",
    alt: "Mekonomen",
    width: 150,
    height: 75,
    tier: "Guldpartner",
    benefits: ["Logotyp på hemsida", "Synlighet vid hemmamatcher"],
    visibleInCarousel: true,
    linkUrl: "https://www.mekonomen.se", // Link: Yes
  },
  {
    id: "sca",
    src: "https://az729104.cdn.laget.se/11314773.png",
    alt: "SCA",
    width: 150,
    height: 75,
    tier: "Guldpartner",
    benefits: ["Logotyp på hemsida", "Synlighet vid hemmamatcher"],
    visibleInCarousel: true,
    linkUrl: "https://www.sca.com", // Link: Yes
  },

  // Silverpartners
  {
    id: "coop",
    src: "https://az729104.cdn.laget.se/11314752.jfif",
    alt: "Coop",
    width: 150,
    height: 75,
    tier: "Silverpartner",
    benefits: ["Logotyp på hemsida"],
    visibleInCarousel: true,
    linkUrl: undefined, // Link: No
  },
  {
    id: "ekebro-utveckling",
    src: "https://files.builder.misssite.com/f6/e9/f6e9e4a2-6fbb-4f4c-9fb6-04e1845c8b52.png",
    alt: "Ekebro Utveckling",
    width: 150,
    height: 75,
    tier: "Silverpartner",
    benefits: ["Logotyp på hemsida"],
    visibleInCarousel: true,
    linkUrl: undefined, // Link: No
  },
  {
    id: "harnosandshus",
    src: "https://az729104.cdn.laget.se/11314757.png",
    alt: "Härnösandshus",
    width: 150,
    height: 75,
    tier: "Silverpartner",
    benefits: ["Logotyp på hemsida"],
    visibleInCarousel: true,
    linkUrl: undefined, // Link: No
  },
  {
    id: "j-sjolunds-varme",
    src: "https://az729104.cdn.laget.se/11314761.png",
    alt: "J Sjölunds Värme",
    width: 150,
    height: 75,
    tier: "Silverpartner",
    benefits: ["Logotyp på hemsida"],
    visibleInCarousel: true,
    linkUrl: undefined, // Link: No
  },
  {
    id: "norrskydd",
    src: "https://az729104.cdn.laget.se/11314763.jfif",
    alt: "Norrskydd",
    width: 150,
    height: 75,
    tier: "Silverpartner",
    benefits: ["Logotyp på hemsida"],
    visibleInCarousel: true,
    linkUrl: undefined, // Link: No
  },
  {
    id: "lansforsakringar",
    src: "https://az729104.cdn.laget.se/11314767.png",
    alt: "Länsförsäkringar",
    width: 150,
    height: 75,
    tier: "Silverpartner",
    benefits: ["Logotyp på hemsida"],
    visibleInCarousel: true,
    linkUrl: undefined, // Link: No
  },
]
