// Define the structure for different content sections
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
    title: string
    description: string
    statsItems: {
      icon: string // This will be a string name of the icon, e.g., "Users"
      value: number
      label: string
    }[]
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
    totalMembersCallout: number
    totalYearsCallout: number
    linkText: string
    linkHref: string
  }
  partners: {
    title: string
    description: string
    partnerLogos: {
      src: string
      alt: string
      href: string
    }[]
  }
  upcomingEvents: {
    title: string
    description: string
  }
}

// Default content for the website
export const defaultContent: PageContent = {
  hero: {
    title: "Härnösands HF",
    description: "En handbollsklubb med stolthet, gemenskap och passion för sporten",
    imageUrl: "https://az316141.cdn.laget.se/2317159/11348130.jpg",
    button1Text: "Bli Medlem",
    button1Link: "/kontakt",
    button2Text: "Våra Lag",
    button2Link: "/lag",
  },
  stats: {
    title: "Vår Framgång i Siffror",
    description: "Vi är stolta över vår utveckling och de milstolpar vi har uppnått tillsammans.",
    statsItems: [
      { icon: "Users", value: 23, label: "Aktiva Lag" },
      { icon: "Trophy", value: 120, label: "Vunna Titlar" },
      { icon: "CalendarDays", value: 40, label: "År i Drift" },
    ],
  },
  aboutClub: {
    title: "Om Härnösands HF",
    paragraph1:
      "Härnösands Handbollsförening (HHF) grundades 1983 med en vision om att skapa en levande och inkluderande handbollskultur i Härnösand. Sedan dess har vi vuxit till att bli en av regionens mest respekterade idrottsföreningar, känd för vår starka gemenskap och framgångar på planen.",
    paragraph2:
      "Vi erbjuder handboll för alla åldrar och nivåer, från de yngsta knattarna till våra seniorlag. Vårt fokus ligger inte bara på sportslig utveckling, utan också på att fostra goda medmänniskor och bidra positivt till samhället. Vi tror på glädjen i att röra på sig, vikten av lagarbete och kraften i att uppnå mål tillsammans.",
    passionText: "Engagemang för sporten och våra medlemmar.",
    developmentText: "Ständig förbättring och framåtblickande.",
    communityText: "En stark känsla av tillhörighet och stöd.",
    button1Text: "Läs Mer",
    button1Link: "/om-oss",
    button2Text: "Kontakta Oss",
    button2Link: "/kontakt",
    imageSrc: "https://i.ibb.co/Zt8gppK/491897759-17872413642339702-3719173158843008539-n.jpg",
    imageAlt: "Härnösands HF lagbild",
    totalTeamsCallout: 23,
    totalTeamsCalloutText: "Aktiva Lag",
    totalMembersCallout: 350,
    totalYearsCallout: 40,
    linkText: "Läs mer om oss",
    linkHref: "/om-oss",
  },
  partners: {
    title: "Våra Stolta Partners",
    description: "Vi är tacksamma för det ovärderliga stöd vi får från våra partners, som gör vår verksamhet möjlig.",
    partnerLogos: [
      { src: "/placeholder-logo.png", alt: "Partner 1", href: "#" },
      { src: "/placeholder-logo.png", alt: "Partner 2", href: "#" },
      { src: "/placeholder-logo.png", alt: "Partner 3", href: "#" },
      { src: "/placeholder-logo.png", alt: "Partner 4", href: "#" },
      { src: "/placeholder-logo.png", alt: "Partner 5", href: "#" },
    ],
  },
  upcomingEvents: {
    title: "Kommande Evenemang",
    description: "Håll dig uppdaterad med våra senaste matcher och aktiviteter.",
  },
}

// In-memory store for content (for demo purposes)
let currentContent: PageContent = defaultContent

export async function loadContent(): Promise<PageContent> {
  // In a real app, this would fetch from a database or API
  // For this demo, we'll try to fetch from our local API route
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000"}/api/content`, {
      cache: "no-store", // Ensure we always get fresh content
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const fetchedContent: PageContent = await response.json()
    currentContent = fetchedContent // Update in-memory content
    return fetchedContent
  } catch (error) {
    console.error("Failed to load content from API, using default:", error)
    return defaultContent // Fallback to default content on error
  }
}

export function saveContent(newContent: PageContent) {
  // In a real app, this would save to a database or CMS
  currentContent = newContent
  console.log("Content saved (in-memory):", currentContent)
}

// Function to get the current content (used by editor-app.tsx)
export function getCurrentContent(): PageContent {
  return currentContent
}
