import type { ReadonlyURLSearchParams } from "next/navigation"

export interface FAQItem {
  question: string
  answer: string
}

export interface EventItem {
  date: string
  time: string
  title: string
  location: string
}

export interface MatchItem {
  id: string
  date: string
  time: string
  homeTeam: string
  awayTeam: string
  homeLogo?: string
  awayLogo?: string
  location: string
  league: string
  result?: string
}

export interface PageContent {
  sections: string[]
  hero: {
    title: string
    titleColor: string // Changed to direct color string
    titleFontSizeClass: string
    description: string
    descriptionColor: string // Changed to direct color string
    descriptionFontSizeClass: string
    imageUrl: string
    button1Text: string
    button1Link: string
    button1BgColor: string // Changed to direct color string
    button1TextColor: string // Changed to direct color string
    button2Text: string
    button2Link: string
    button2BgColor: string // Changed to direct color string
    button2TextColor: string // Changed to direct color string
    overlayColor: string // Changed to direct color string (e.g., rgba or hex with alpha)
  }
  stats: {
    totalTeams: number
    aTeams: number
    youthTeams: number
    historyYears: string
  }
  aboutClub: {
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
    totalTeamsCallout: number
    totalTeamsCalloutText: string
  }
  partnersCarousel: {
    title: string
    description: string
    callToActionTitle: string
    callToActionDescription: string
    callToActionLinkText: string
    callToActionLink: string
  }
  kontaktPage: {
    emailTitle: string
    emailDescription: string
    emailAddress: string
    addressTitle: string
    addressDescription: string
    addressLocation: string
    boardTitle: string
    boardDescription: string
    boardContact: string
    faqItems: FAQItem[]
  }
  partnersPage: {
    title: string
    description: string
    callToActionTitle: string
    callToActionDescription: string
    callToActionLinkText: string
    callToActionLink: string
  }
  upcomingEvents: EventItem[]
  matches: MatchItem[] // Added matches to PageContent
}

export const defaultContent: PageContent = {
  sections: ["hero", "stats", "aboutClub", "partnersCarousel", "upcomingEvents", "matches"],
  hero: {
    title: "LAGET FÖRE ALLT",
    titleColor: "#FFFFFF", // White
    titleFontSizeClass: "text-6xl md:text-8xl",
    description: "Härnösands HF - En förening med stolthet, gemenskap och passion för sporten.",
    descriptionColor: "#FFFFFF", // White
    descriptionFontSizeClass: "text-xl md:text-2xl",
    imageUrl: "https://az316141.cdn.laget.se/2317159/11348130.jpg",
    button1Text: "Våra 23 Lag",
    button1Link: "/lag",
    button1BgColor: "#F97316", // Orange-500
    button1TextColor: "#FFFFFF", // White
    button2Text: "Senaste Nytt",
    button2Link: "/nyheter",
    button2BgColor: "#16A34A", // Green-700
    button2TextColor: "#FFFFFF", // White
    overlayColor: "rgba(0, 0, 0, 0.6)", // Black with 60% opacity
  },
  stats: {
    totalTeams: 23,
    aTeams: 2,
    youthTeams: 21,
    historyYears: "50+",
  },
  aboutClub: {
    title: "Härnösands HF",
    paragraph1:
      "Härnösands FF grundades med en vision om att skapa en inkluderande och framgångsrik fotbollsmiljö. Sedan dess har vi vuxit till en av regionens mest respekterade klubbar, känd för vår starka gemenskap och engagemang för ungdomsfotboll.",
    paragraph2:
      "Vi tror på att fotboll är mer än bara ett spel – det är en plattform för personlig utveckling, lagarbete och att bygga livslånga vänskaper. Våra tränare och ledare är dedikerade till att inspirera och vägleda varje spelare att nå sin fulla potential, både på och utanför planen.",
    passionText: "Vi brinner för handboll",
    developmentText: "Alla kan bli bättre",
    communityText: "Tillsammans är vi starka",
    button1Text: "Visa Lag",
    button1Link: "/lag",
    button2Text: "Kontakta Oss",
    button2Link: "/kontakt",
    imageSrc: "https://i.ibb.co/Zt8gppK/491897759-17872413642339702-3719173158843008539-n.jpg",
    imageAlt: "Härnösands FF lag i en ring",
    totalTeamsCallout: 23,
    totalTeamsCalloutText: "lag totalt",
  },
  partnersCarousel: {
    title: "Våra Partners",
    description:
      "Vi är stolta över våra samarbeten med lokala företag och organisationer som delar vår passion för fotboll och samhällsengagemang. Tillsammans bygger vi en starkare framtid för Härnösands FF.",
    callToActionTitle: "Vill du stödja Härnösands HF?",
    callToActionDescription:
      "Vi välkomnar nya partners som vill stödja vår verksamhet och bidra till utvecklingen av handbollen i regionen.",
    callToActionLinkText: "Kontakta Oss",
    callToActionLink: "/kontakt",
  },
  kontaktPage: {
    emailTitle: "E-post",
    emailDescription: "För allmänna frågor och information.",
    emailAddress: "info@harnosandsff.se",
    addressTitle: "Besöksadress",
    addressDescription: "Välkommen att besöka oss på vår anläggning.",
    addressLocation: "Härnösands Arena, Arenavägen 1, 871 40 Härnösand",
    boardTitle: "Styrelsen",
    boardDescription: "Kontakta styrelsen för ärenden som rör klubbens ledning och strategi.",
    boardContact: "styrelsen@harnosandsff.se",
    faqItems: [
      {
        question: "Hur blir jag medlem?",
        answer: "Du kan bli medlem genom att fylla i vårt online-formulär under sektionen 'Bli medlem'.",
      },
      {
        question: "Var hittar jag matchschemat?",
        answer: "Matchschemat för alla lag finns tillgängligt på 'Matcher'-sidan.",
      },
      {
        question: "Kan jag provträna med ett lag?",
        answer: "Ja, kontakta respektive lags tränare för att arrangera en provträning.",
      },
    ],
  },
  partnersPage: {
    title: "Våra Partners",
    description:
      "Härnösands FF är djupt tacksamma för det ovärderliga stöd vi får från våra partners. Deras engagemang är avgörande för vår förmåga att bedriva verksamheten, utveckla våra spelare och bidra positivt till lokalsamhället. Tillsammans skapar vi framgång på och utanför planen.",
    callToActionTitle: "Bli en del av vårt vinnande lag – Bli Partner!",
    callToActionDescription:
      "Är ditt företag intresserat av att synas tillsammans med Härnösands FF och stödja en levande idrottsförening? Vi erbjuder skräddarsydda partnerskap som ger exponering och möjlighet att associeras med positiva värden som gemenskap, hälsa och framgång. Kontakta oss för att utforska hur vi kan samarbeta.",
    callToActionLinkText: "Kontakta oss om partnerskap",
    callToActionLink: "/kontakt",
  },
  upcomingEvents: [
    {
      date: "2024-10-26",
      time: "14:00",
      title: "Herrar Div 1: Härnösands HF vs. IFK Skövde HK",
      location: "Härnösands Arena",
    },
    {
      date: "2024-11-02",
      time: "16:00",
      title: "Damer Div 2: Härnösands HF vs. Strands IF",
      location: "Härnösands Arena",
    },
    {
      date: "2024-11-09",
      time: "10:00",
      title: "Ungdomscup: Härnösand Cup",
      location: "Härnösands Arena",
    },
  ],
  matches: [
    {
      id: "match-1",
      date: "2024-07-15",
      time: "19:00",
      homeTeam: "Härnösands HF",
      awayTeam: "Sundsvall HK",
      homeLogo: "/placeholder-logo.png",
      awayLogo: "/placeholder-logo.png",
      location: "Härnösands Arena",
      league: "Herrar Div 1",
      result: "28 - 25",
    },
    {
      id: "match-2",
      date: "2024-07-20",
      time: "16:00",
      homeTeam: "Örnsköldsvik HK",
      awayTeam: "Härnösands HF",
      homeLogo: "/placeholder-logo.png",
      awayLogo: "/placeholder-logo.png",
      location: "Skyttis Arena",
      league: "Damer Div 2",
      result: "18 - 22",
    },
    {
      id: "match-3",
      date: "2024-07-25",
      time: "10:00",
      homeTeam: "Härnösands HF U16",
      awayTeam: "Timrå HK U16",
      homeLogo: "/placeholder-logo.png",
      awayLogo: "/placeholder-logo.png",
      location: "Härnösands Arena",
      league: "Pojkar U16",
      result: "15 - 15",
    },
  ],
}

/* ------------------------------------------------------------------
   Load content from backend and merge with defaults
-------------------------------------------------------------------*/
export async function loadContent(): Promise<PageContent> {
  try {
    const res = await fetch("https://api.nuredo.se/api/content", {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    })

    if (res.ok) {
      const json = (await res.json()) as Partial<PageContent>
      return deepMerge(defaultContent, json)
    }

    console.warn(`[loadContent] Backend responded ${res.status}. Falling back to defaults.`)
  } catch (err) {
    console.error("[loadContent] Backend fetch failed:", err)
  }

  // Fallback to defaults if anything goes wrong
  return defaultContent
}

// Helper function for deep merging objects (used internally by loadContentFromLocalStorage and server actions)
// This is kept here because it's used by the defaultContent logic and might be useful if content structure changes.
export function deepMerge<T extends object>(target: T, source: Partial<T>): T {
  const output = { ...target } as T

  if (target && typeof target === "object" && source && typeof source === "object") {
    Object.keys(source).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const targetValue = target[key as keyof T]
        const sourceValue = source[key as keyof T]

        if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
          // For arrays, replace completely rather than merging elements
          output[key as keyof T] = sourceValue as T[keyof T]
        } else if (
          typeof targetValue === "object" &&
          targetValue !== null &&
          typeof sourceValue === "object" &&
          sourceValue !== null &&
          !Array.isArray(targetValue) &&
          !Array.isArray(sourceValue) // Ensure it's not an array before deep merging
        ) {
          output[key as keyof T] = deepMerge(targetValue as object, sourceValue as object) as T[keyof T]
        } else {
          output[key as keyof T] = sourceValue as T[keyof T]
        }
      }
    })
  }
  return output
}

export function getBaseUrl(searchParams?: ReadonlyURLSearchParams) {
  const url = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3000"

  if (searchParams) {
    return `${url}?${searchParams.toString()}`
  }
  return url
}
