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
  // Lägg till en sektion för att hantera ordningen av sektioner om du vill implementera drag & drop på frontend
  sections?: string[]
}

const LOCAL_STORAGE_KEY = "hhf_website_content"
const BACKEND_API_URL = "https://api.nuredo.se/api/content" // Din backend-URL
// VARNING: Att hårdkoda en token i klientkoden är INTE säkert för produktionsmiljöer.
// För en riktig applikation bör denna token hämtas säkert efter inloggning.
const AUTH_TOKEN = "NUR3doAuthT0ken2025xQ92vMBw7dLz8HyKcAFt3ZRnPeJ6uYo1gTDXrLmqEiVGbnCW09UsKaQ5"

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
  sections: [], // Lägg till denna för att matcha backend-strukturen
}

// Helper function for deep merging objects
function deepMerge<T extends object>(target: T, source: Partial<T>): T {
  const output = { ...target } as T

  if (target && typeof target === "object" && source && typeof source === "object") {
    Object.keys(source).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const targetValue = target[key as keyof T]
        const sourceValue = source[key as keyof T]

        if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
          // For arrays, replace or concatenate based on desired behavior.
          // Here, we replace the array.
          output[key as keyof T] = sourceValue as T[keyof T]
        } else if (
          typeof targetValue === "object" &&
          targetValue !== null &&
          typeof sourceValue === "object" &&
          sourceValue !== null &&
          !Array.isArray(targetValue) &&
          !Array.isArray(sourceValue)
        ) {
          // Deep merge objects
          output[key as keyof T] = deepMerge(targetValue as object, sourceValue as object) as T[keyof T]
        } else {
          // Replace primitive values or non-object types
          output[key as keyof T] = sourceValue as T[keyof T]
        }
      }
    })
  }
  return output
}

// Function to load content from backend or localStorage
export async function loadContent(): Promise<PageContent> {
  // Headers for GET request (no Authorization needed based on your server.cjs)
  const getHeaders = {
    "Content-Type": "application/json",
  }

  let fetchedContent: PageContent | null = null

  if (typeof window === "undefined") {
    // Server-side rendering: try to fetch from backend directly
    try {
      const response = await fetch(BACKEND_API_URL, { headers: getHeaders })
      if (response.ok) {
        fetchedContent = (await response.json()) as PageContent
      } else {
        console.warn(`Server-side fetch failed with status ${response.status}, falling back to default content.`)
      }
    } catch (error) {
      console.error("Server-side fetch failed, falling back to default content:", error)
    }
  } else {
    // Client-side: try localStorage first, then backend
    try {
      const storedContent = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (storedContent) {
        fetchedContent = JSON.parse(storedContent) as PageContent
      }
    } catch (error) {
      console.warn("Failed to parse content from localStorage, trying backend:", error)
    }

    if (!fetchedContent) {
      // Only fetch from backend if not found in localStorage
      try {
        const response = await fetch(BACKEND_API_URL, { headers: getHeaders }) // No auth token for GET
        if (response.ok) {
          fetchedContent = (await response.json()) as PageContent
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fetchedContent)) // Cache in localStorage
        } else {
          console.warn(`Client-side fetch failed with status ${response.status}, falling back to default content.`)
        }
      } catch (error) {
        console.error("Client-side fetch failed, falling back to default content:", error)
      }
    }
  }

  // Merge fetched content with default content to ensure full structure
  // This is crucial to prevent 'undefined' errors if backend returns partial data
  return deepMerge(defaultContent, fetchedContent || {})
}

// Function to save content to backend and localStorage
export async function saveContent(content: PageContent): Promise<boolean> {
  if (typeof window === "undefined") {
    console.warn("Attempted to save content on server-side. This function should be called client-side.")
    return false
  }
  try {
    const response = await fetch(BACKEND_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AUTH_TOKEN}`, // Authorization is required for POST
      },
      body: JSON.stringify(content),
    })

    if (response.ok) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(content))
      return true
    } else {
      const errorData = await response.json()
      console.error("Failed to save content to backend:", response.status, errorData)
      return false
    }
  } catch (error) {
    console.error("Network error during content save:", error)
    return false
  }
}

// Function to reset content to default (removes from localStorage, does not affect backend)
export function resetContent() {
  if (typeof window === "undefined") {
    return // Do nothing on server-side
  }
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY)
    // Om du vill återställa backend också, skulle du behöva en specifik backend-endpoint för det
  } catch (error) {
    console.error("Failed to reset content in localStorage:", error)
  }
}
