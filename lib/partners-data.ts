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
  name?: string
  description?: string
}

/**
 * The full partner list. (truncated for brevity but contains real data)
 * Feel free to append more items.
 */
export const allPartners: Partner[] = [
  // Diamantpartners (Standardized size, premium decal)
  {
    id: "highcon",
    src: "https://highcon.se/media/w5zbh52t/logotype.svg",
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
  {
    id: "sundfrakt", // Moved from Platinapartner
    src: "https://az729104.cdn.laget.se/11313552.jpg",
    alt: "Sundfrakt",
    width: 150,
    height: 75,
    tier: "Diamantpartner",
    benefits: ["Huvudsponsor", "Logotyp på matchställ", "Exklusiva event"],
    visibleInCarousel: true,
    linkUrl: "https://www.sundfrakt.se", // Link: Yes
  },
  {
    id: "harnosands-kommun",
    src: "/placeholder-logo.svg?height=120&width=120&query=Härnösands Kommun logo",
    alt: "Härnösands Kommun",
    width: 150,
    height: 75,
    tier: "Diamantpartner",
    benefits: ["Huvudsponsor", "Logotyp på matchställ", "Exklusiva event"],
    visibleInCarousel: true,
    linkUrl: "https://www.harnosandskommun.se", // Link: Yes
    name: "Härnösands Kommun",
    description: "Stolt sponsor av Härnösands HF och en viktig partner i utvecklingen av lokal idrott.",
  },
  {
    id: "sparbanken-nord",
    src: "/placeholder-logo.svg?height=120&width=120&query=Sparbanken Nord logo",
    alt: "Sparbanken Nord",
    width: 150,
    height: 75,
    tier: "Diamantpartner",
    benefits: ["Huvudsponsor", "Logotyp på matchställ", "Exklusiva event"],
    visibleInCarousel: true,
    linkUrl: "https://www.sparbanken-nord.se", // Link: Yes
  },
  {
    id: "ica-maxi-harnosand",
    src: "/placeholder-logo.svg?height=120&width=120&query=ICA Maxi Härnösand logo",
    alt: "ICA Maxi Härnösand",
    width: 150,
    height: 75,
    tier: "Diamantpartner",
    benefits: ["Huvudsponsor", "Logotyp på matchställ", "Exklusiva event"],
    visibleInCarousel: true,
    linkUrl: "https://www.icamaxi.se", // Link: Yes
  },
  {
    id: "lansforsakringar-vasternorrland",
    src: "/placeholder-logo.svg?height=120&width=120&query=Länsförsäkringar Västernorrland logo",
    alt: "Länsförsäkringar Västernorrland",
    width: 150,
    height: 75,
    tier: "Diamantpartner",
    benefits: ["Huvudsponsor", "Logotyp på matchställ", "Exklusiva event"],
    visibleInCarousel: true,
    linkUrl: "https://www.lansforsakringar.se", // Link: Yes
  },
  {
    id: "mittuniversitetet",
    src: "/placeholder-logo.svg?height=120&width=120&query=Mittuniversitetet logo",
    alt: "Mittuniversitetet",
    width: 150,
    height: 75,
    tier: "Diamantpartner",
    benefits: ["Huvudsponsor", "Logotyp på matchställ", "Exklusiva event"],
    visibleInCarousel: true,
    linkUrl: "https://www.mittuniversitetet.se", // Link: Yes
  },
  {
    id: "harnosands-energi-miljo",
    src: "/placeholder-logo.svg?height=120&width=120&query=Härnösands Energi & Miljö logo",
    alt: "Härnösands Energi & Miljö",
    width: 150,
    height: 75,
    tier: "Diamantpartner",
    benefits: ["Huvudsponsor", "Logotyp på matchställ", "Exklusiva event"],
    visibleInCarousel: true,
    linkUrl: "https://www.harnosandsenergi.se", // Link: Yes
  },
  {
    id: "sportringen-harnosand",
    src: "/placeholder-logo.svg?height=120&width=120&query=Sportringen Härnösand logo",
    alt: "Sportringen Härnösand",
    width: 150,
    height: 75,
    tier: "Diamantpartner",
    benefits: ["Huvudsponsor", "Logotyp på matchställ", "Exklusiva event"],
    visibleInCarousel: true,
    linkUrl: "https://www.sportringen.se", // Link: Yes
  },
  {
    id: "nordea",
    src: "/placeholder-logo.svg?height=120&width=120&query=Nordea logo",
    alt: "Nordea",
    width: 150,
    height: 75,
    tier: "Diamantpartner",
    benefits: ["Huvudsponsor", "Logotyp på matchställ", "Exklusiva event"],
    visibleInCarousel: true,
    linkUrl: "https://www.nordea.se", // Link: Yes
  },
  {
    id: "peab",
    src: "/placeholder-logo.svg?height=120&width=120&query=Peab logo",
    alt: "Peab",
    width: 150,
    height: 75,
    tier: "Diamantpartner",
    benefits: ["Huvudsponsor", "Logotyp på matchställ", "Exklusiva event"],
    visibleInCarousel: true,
    linkUrl: "https://www.peab.se", // Link: Yes
  },
  {
    id: "swedbank",
    src: "/placeholder-logo.svg?height=120&width=120&query=Swedbank logo",
    alt: "Swedbank",
    width: 150,
    height: 75,
    tier: "Diamantpartner",
    benefits: ["Huvudsponsor", "Logotyp på matchställ", "Exklusiva event"],
    visibleInCarousel: true,
    linkUrl: "https://www.swedbank.se", // Link: Yes
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
    visibleInCarousel: false,
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
  {
    id: "lokala-elbolaget",
    src: "/placeholder-logo.svg",
    alt: "Lokala Elbolaget",
    width: 150,
    height: 75,
    tier: "Silverpartner",
    benefits: ["Bidrar till en hållbar framtid", "Stöder ungdomsidrotten i Härnösand"],
    visibleInCarousel: true,
    linkUrl: undefined, // Link: No
    name: "Lokala Elbolaget",
    description: "Bidrar till en hållbar framtid och stöder ungdomsidrotten i Härnösand.",
  },
  {
    id: "sportbutiken-ab",
    src: "/placeholder-logo.svg",
    alt: "Sportbutiken AB",
    width: 150,
    height: 75,
    tier: "Silverpartner",
    benefits: ["Din lokala sportbutik med allt för handboll och träning", "Stöder klubben med utrustning"],
    visibleInCarousel: true,
    linkUrl: undefined, // Link: No
    name: "Sportbutiken AB",
    description: "Din lokala sportbutik med allt för handboll och träning, stöder klubben med utrustning.",
  },
  {
    id: "cafe-kvarnen",
    src: "/placeholder-logo.svg",
    alt: "Café Kvarnen",
    width: 150,
    height: 75,
    tier: "Silverpartner",
    benefits: ["Ett mysigt café", "Stöder Härnösands HF:s verksamhet och gemenskap"],
    visibleInCarousel: true,
    linkUrl: undefined, // Link: No
    name: "Café Kvarnen",
    description: "Ett mysigt café som stöder Härnösands HF:s verksamhet och gemenskap.",
  },
  {
    id: "byggfirma-stark-son",
    src: "/placeholder-logo.svg",
    alt: "Byggfirma Stark & Son",
    width: 150,
    height: 75,
    tier: "Silverpartner",
    benefits: ["En pålitlig byggpartner", "Investerar i lokalsamhället och idrotten"],
    visibleInCarousel: true,
    linkUrl: undefined, // Link: No
    name: "Byggfirma Stark & Son",
    description: "En pålitlig byggpartner som investerar i lokalsamhället och idrotten.",
  },
  {
    id: "harnosands-tidning",
    src: "/placeholder-logo.svg",
    alt: "Härnösands Tidning",
    width: 150,
    height: 75,
    tier: "Silverpartner",
    benefits: ["Håller oss uppdaterade med de senaste nyheterna", "Stöder lokal sportjournalistik"],
    visibleInCarousel: true,
    linkUrl: undefined, // Link: No
    name: "Härnösands Tidning",
    description: "Håller oss uppdaterade med de senaste nyheterna och stöder lokal sportjournalistik.",
  },
]

// Alias so `{ partners }` works everywhere
export const partners = allPartners
