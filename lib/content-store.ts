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

export interface PageContent {
  sections: string[]
  hero: {
    title: string
    titleTextColorClass: string // New: Text color for title
    titleFontSizeClass: string // New: Font size for title
    description: string
    descriptionTextColorClass: string // New: Text color for description
    descriptionFontSizeClass: string // New: Font size for description
    imageUrl: string
    button1Text: string
    button1Link: string
    button1BgClass: string
    button1TextClass: string
    button2Text: string
    button2Link: string
    button2BgClass: string
    button2TextClass: string
    overlayColorClass: string
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
  upcomingEvents: EventItem[] // Added upcomingEvents to PageContent
}

export const defaultContent: PageContent = {
  sections: ["hero", "stats", "aboutClub", "partnersCarousel"],
  hero: {
    title: "Välkommen till Härnösands FF",
    titleTextColorClass: "text-white", // Default
    titleFontSizeClass: "text-6xl", // Default
    description:
      "Härnösands FF är en fotbollsklubb med en rik historia och en stark gemenskap. Vi strävar efter att utveckla både spelare och människor, från ungdom till elit.",
    descriptionTextColorClass: "text-white", // Default
    descriptionFontSizeClass: "text-xl", // Default
    imageUrl: "https://az316141.cdn.laget.se/2317159/11348130.jpg",
    button1Text: "Våra lag",
    button1Link: "/lag",
    button1BgClass: "bg-green-600",
    button1TextClass: "text-white",
    button2Text: "Kalender",
    button2Link: "/kalender",
    button2BgClass: "bg-white",
    button2TextClass: "text-gray-800",
    overlayColorClass: "from-black/70",
  },
  stats: {
    totalTeams: 15,
    aTeams: 2,
    youthTeams: 13,
    historyYears: "1900-tal",
  },
  aboutClub: {
    title: "Om Härnösands HF",
    paragraph1:
      "Härnösands FF grundades med en vision om att skapa en inkluderande och framgångsrik fotbollsmiljö. Sedan dess har vi vuxit till en av regionens mest respekterade klubbar, känd för vår starka gemenskap och engagemang för ungdomsfotboll.",
    paragraph2:
      "Vi tror på att fotboll är mer än bara ett spel – det är en plattform för personlig utveckling, lagarbete och att bygga livslånga vänskaper. Våra tränare och ledare är dedikerade till att inspirera och vägleda varje spelare att nå sin fulla potential, både på och utanför planen.",
    passionText: "Passion för fotboll",
    developmentText: "Utveckling för alla",
    communityText: "Stark gemenskap",
    button1Text: "Bli medlem",
    button1Link: "/bli-medlem",
    button2Text: "Kontakta oss",
    button2Link: "/kontakt",
    imageSrc: "https://i.ibb.co/Zt8gppK/491897759-17872413642339702-3719173158843008539-n.jpg",
    imageAlt: "Härnösands FF lag i en ring",
    totalTeamsCallout: 23,
    totalTeamsCalloutText: "Aktiva lag",
  },
  partnersCarousel: {
    title: "Våra Partners",
    description:
      "Vi är stolta över våra samarbeten med lokala företag och organisationer som delar vår passion för fotboll och samhällsengagemang. Tillsammans bygger vi en starkare framtid för Härnösands FF.",
    callToActionTitle: "Bli Partner",
    callToActionDescription:
      "Är ditt företag intresserat av att stödja Härnösands FF och bidra till vår fortsatta framgång? Kontakta oss för att diskutera olika partnerskapsmöjligheter.",
    callToActionLinkText: "Läs mer om partnerskap",
    callToActionLink: "/partners",
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
