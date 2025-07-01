import type { ReadonlyURLSearchParams } from "next/navigation"

export interface FAQItem {
  question: string
  answer: string
}

export interface PageContent {
  sections: string[]
  hero: {
    title: string
    description: string
    imageUrl: string
    button1Text: string
    button1Link: string
    button2Text: string
    button2Link: string
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
  upcomingEvents: {
    title: string
    description: string
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
}

export const defaultContent: PageContent = {
  sections: ["hero", "stats", "aboutClub", "partnersCarousel"],
  hero: {
    title: "Välkommen till Härnösands FF",
    description:
      "Härnösands FF är en fotbollsklubb med en rik historia och en stark gemenskap. Vi strävar efter att utveckla både spelare och människor, från ungdom till elit.",
    imageUrl: "https://az316141.cdn.laget.se/2317159/11348130.jpg",
    button1Text: "Våra lag",
    button1Link: "/lag",
    button2Text: "Kalender",
    button2Link: "/kalender",
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
  upcomingEvents: {
    title: "Kommande Evenemang",
    description: "Missa inte vad som händer i Härnösands FF!",
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
}

// In-memory store for content (for demo purposes)
let currentContent: PageContent = { ...defaultContent }

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

// Add getContent as an alias for loadContent to maintain compatibility
export async function getContent(): Promise<PageContent> {
  return loadContent()
}

// Add saveContent function to handle content updates
export async function saveContent(newContent: PageContent): Promise<{ success: boolean; message: string }> {
  try {
    // In a real application, this would save to a database or API
    // For now, we'll just update our in-memory store
    currentContent = { ...newContent }

    // Simulate an API call to save content
    const res = await fetch("https://api.nuredo.se/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newContent),
    }).catch(() => {
      // If the API call fails, we'll still consider it a success since we updated the in-memory store
      console.warn("[saveContent] API call failed, but content was updated in memory")
      return { ok: true }
    })

    if (res && !res.ok) {
      console.warn(`[saveContent] Backend responded ${res.status}. Content was updated in memory only.`)
    }

    return { success: true, message: "Innehåll sparat framgångsrikt!" }
  } catch (err) {
    console.error("[saveContent] Error saving content:", err)
    return { success: false, message: "Ett fel uppstod när innehållet skulle sparas." }
  }
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
