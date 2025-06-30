// lib/content-store.ts

export interface FAQItem {
  question: string
  answer: string
}

export interface PageContent {
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
    faqTitle: string
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
  sections?: string[]
}

const LOCAL_STORAGE_KEY = "hhf_website_content"

// Helper function for deep merging objects (kept here for client-side localStorage merging)
function deepMerge<T extends object>(target: T, source: Partial<T>): T {
  const output = { ...target } as T

  if (target && typeof target === "object" && source && typeof source === "object") {
    Object.keys(source).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const targetValue = target[key as keyof T]
        const sourceValue = source[key as keyof T]

        if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
          output[key as keyof T] = sourceValue as T[keyof T]
        } else if (
          typeof targetValue === "object" &&
          targetValue !== null &&
          typeof sourceValue === "object" &&
          sourceValue !== null &&
          !Array.isArray(targetValue) &&
          !Array.isArray(sourceValue)
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

// Default content for the website (should match public/default-content.json)
export const defaultContent: PageContent = {
  hero: {
    title: "LAGET FÖRE ALLT",
    description: "Härnösands HF - En förening med stolthet, gemenskap och passion för sporten.",
    imageUrl: "https://az316141.cdn.laget.se/2317159/11348130.jpg",
    button1Text: "Våra 23 Lag",
    button1Link: "/lag",
    button2Text: "Senaste Nytt",
    button2Link: "/nyheter",
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
      "Vi är en handbollsklubb som värnar om gemenskap, utveckling och sund konkurrens. Med våra 23 lag från ungdom till seniorer erbjuder vi handboll för alla åldrar och nivåer.",
    paragraph2:
      "Vår vision är att vara den ledande handbollsklubben i regionen genom att skapa en miljö där varje spelare kan utvecklas och trivas.",
    passionText: "Vi brinner för handboll",
    developmentText: "Alla kan bli bättre",
    communityText: "Tillsammans är vi starka",
    button1Text: "Visa Lag",
    button1Link: "/lag",
    button2Text: "Kontakta Oss",
    button2Link: "/kontakt",
    imageSrc: "https://i.ibb.co/Zt8gppK/491897759-17872413642339702-3719173158843008539-n.jpg",
    imageAlt: "Härnösands HF Team",
    totalTeamsCallout: 23,
    totalTeamsCalloutText: "lag totalt",
  },
  partnersCarousel: {
    title: "Våra Partners",
    description:
      "Vi är stolta över att samarbeta med lokala företag och organisationer som stödjer vår verksamhet och hjälper oss att utveckla handbollen i Härnösand.",
    callToActionTitle: "Vill du stödja Härnösands HF?",
    callToActionDescription:
      "Vi välkomnar nya partners som vill stödja vår verksamhet och bidra till utvecklingen av handbollen i regionen.",
    callToActionLinkText: "Kontakta oss",
    callToActionLink: "/kontakt",
  },
  kontaktPage: {
    emailTitle: "E-post",
    emailDescription: "Skicka dina frågor till oss via e-post",
    emailAddress: "info@harnosandshf.se",
    addressTitle: "Besöksadress",
    addressDescription: "Hitta oss på våra träningar",
    addressLocation: "Öbacka Sporthall, Härnösand",
    boardTitle: "Styrelse",
    boardDescription: "Kontakta vår styrelse för föreningsfrågor",
    boardContact: "Via e-post eller på träningarna",
    faqTitle: "Vanliga frågor",
    faqItems: [
      {
        question: "Hur blir jag en ny spelare?",
        answer:
          "Kontakta oss via e-post eller telefon för att få information om provträningar och hur du anmäler dig till ett av våra lag. Vi välkomnar spelare i alla åldrar och nivåer!",
      },
      {
        question: "Hur kan mitt företag sponsra Härnösands HF?",
        answer:
          "Vi är alltid öppna för nya partnerskap. Vänligen e-posta oss på info@harnosandshf.se för att diskutera sponsringsmöjligheter och hur vi kan samarbeta.",
      },
      {
        question: "Var finns era träningsanläggningar?",
        answer:
          "Våra huvudsakliga träningsanläggningar är Öbacka Sporthall och Landgrenshallen i Härnösand. Specifika tider och hallar för varje lag finns på respektive lagsida.",
      },
      {
        question: "Var hittar jag matchschemat?",
        answer:
          'Matchscheman för alla våra lag finns på de lagspecifika sidorna under "Lag" i menyn. Du kan också hitta en översikt över kommande matcher på vår "Matcher"-sida.',
      },
    ],
  },
  partnersPage: {
    title: "Våra Partners",
    description:
      "Vi är stolta över att samarbeta med lokala företag och organisationer som stödjer vår verksamhet och hjälper oss att utveckla handbollen och föreningen i Härnösand.",
    callToActionTitle: "Vill du stödja Härnösands HF?",
    callToActionDescription:
      "Vi välkomnar nya partners som vill stödja vår verksamhet och bidra till utvecklingen av handbollen i regionen.",
    callToActionLinkText: "Kontakta oss",
    callToActionLink: "/kontakt",
  },
  sections: [],
}

// Loads content either from the backend (server-side) or from
// localStorage (client-side) and always falls back to defaultContent.
export async function loadContent(): Promise<PageContent> {
  // Client side → reuse local-storage helper
  if (typeof window !== "undefined") {
    return loadContentFromLocalStorage()
  }

  // Server side → fetch from backend, merge with defaults
  try {
    const res = await fetch("https://api.nuredo.se/api/content", {
      // GET endpoint on your backend does NOT require auth
      headers: { "Content-Type": "application/json" },
      // 10 s timeout to avoid hanging builds
      cache: "no-store",
    })

    if (res.ok) {
      const json = (await res.json()) as Partial<PageContent>
      return deepMerge(defaultContent, json)
    }

    console.warn(`[loadContent] Backend responded ${res.status}. Falling back to defaultContent.`)
  } catch (err) {
    console.error("[loadContent] Backend fetch failed:", err)
  }

  // Fallback
  return defaultContent
}

// Client-side functions for localStorage
export async function loadContentFromLocalStorage(): Promise<PageContent> {
  if (typeof window === "undefined") {
    return defaultContent // Return default on server
  }
  try {
    const storedContent = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (storedContent) {
      // Use deepMerge to ensure all default fields are present even if stored content is partial
      return deepMerge(defaultContent, JSON.parse(storedContent) as Partial<PageContent>)
    }
  } catch (error) {
    console.warn("Failed to parse content from localStorage, returning default:", error)
  }
  return defaultContent
}

export function saveContentToLocalStorage(content: PageContent) {
  if (typeof window === "undefined") {
    return // Do nothing on server-side
  }
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(content))
  } catch (error) {
    console.error("Failed to save content to localStorage:", error)
  }
}

export function resetContent() {
  if (typeof window === "undefined") {
    return // Do nothing on server-side
  }
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY)
  } catch (error) {
    console.error("Failed to reset content in localStorage:", error)
  }
}
