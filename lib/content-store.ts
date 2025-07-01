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
    imageSrc: string
    imageAlt: string
    totalTeamsCallout: number
    totalTeamsCalloutText: string
    button1Text: string
    button1Link: string
    button2Text: string
    button2Link: string
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
    title: string
    description: string
    address: string
    phone: string
    email: string
    mapEmbedUrl: string
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
  sections: ["hero", "stats", "upcomingEvents", "aboutClub", "partnersCarousel"],
  hero: {
    title: "Härnösands Handbollsförening",
    description: "Din lokala handbollsklubb i Härnösand. Gemenskap, glädje och utveckling för alla åldrar.",
    imageUrl: "/placeholder.svg?height=800&width=1200&text=Hero Image",
    button1Text: "Våra Lag",
    button1Link: "/lag",
    button2Text: "Bli Medlem",
    button2Link: "/kontakt",
  },
  stats: {
    totalTeams: 15,
    aTeams: 2,
    youthTeams: 13,
    historyYears: "40+",
  },
  aboutClub: {
    title: "Om Härnösands HF",
    paragraph1:
      "Härnösands Handbollsförening grundades med en vision om att skapa en levande och inkluderande handbollsmiljö i Härnösand. Vi strävar efter att erbjuda en plats där alla, oavsett ålder eller erfarenhet, kan utvecklas som handbollsspelare och som individer.",
    paragraph2:
      "Vår förening bygger på starka värderingar som gemenskap, respekt och idrottsglädje. Vi är stolta över vår historia och ser fram emot att fortsätta växa och bidra till handbollens framtid i regionen.",
    passionText: "Engagemang för sporten",
    developmentText: "Fokus på individuell tillväxt",
    communityText: "Stark laganda och vänskap",
    imageSrc: "/placeholder.svg?height=400&width=600&text=About Club Image",
    imageAlt: "Handbollsträning",
    totalTeamsCallout: 15,
    totalTeamsCalloutText: "Aktiva lag",
    button1Text: "Läs Mer",
    button1Link: "/om-oss",
    button2Text: "Kontakta Oss",
    button2Link: "/kontakt",
  },
  partnersCarousel: {
    title: "Våra Viktiga Partners",
    description:
      "Vi är oerhört tacksamma för det stöd vi får från våra partners. Deras bidrag är avgörande för vår verksamhet och hjälper oss att fortsätta utveckla handbollen i Härnösand.",
    callToActionTitle: "Bli en del av vårt team!",
    callToActionDescription: "Är ditt företag intresserat av att stödja Härnösands HF och synas tillsammans med oss?",
    callToActionLinkText: "Bli Partner",
    callToActionLink: "/kontakt",
  },
  kontaktPage: {
    title: "Kontakta Oss",
    description:
      "Har du frågor, funderingar eller vill du komma i kontakt med oss? Fyll i formuläret nedan eller använd våra kontaktuppgifter.",
    address: "Arenavägen 10, 871 40 Härnösand",
    phone: "070-123 45 67",
    email: "info@harnosandshf.se",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2000.0000000000002!2d17.9333333!3d62.6333333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNjLCjMzhJzAwLjAiTiAxN8KwNTYnNTkuOSJF!5e0!3m2!1sen!2sse!4v1678901234567!5m2!1sen!2sse",
  },
  partnersPage: {
    title: "Våra Partners",
    description:
      "Vi är stolta över att samarbeta med en rad fantastiska partners som delar vår passion för handboll och stöder vår förening. Deras engagemang är avgörande för vår framgång och utveckling.",
    callToActionTitle: "Vill du också bli partner?",
    callToActionDescription:
      "Vi söker ständigt nya samarbeten som kan bidra till vår förenings framtid. Kontakta oss för att diskutera hur ditt företag kan bli en del av Härnösands HF-familjen.",
    callToActionLinkText: "Kontakta oss om partnerskap",
    callToActionLink: "/kontakt",
  },
}

export async function loadContent(): Promise<PageContent> {
  // In a real application, this would fetch from a database or a CMS.
  // For this example, we'll use the default content.
  // If you have a backend, you would fetch from it here.
  try {
    const response = await fetch(`${process.env.BACKEND_API_URL}/api/content`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Use 'force-cache' for static pages, 'no-store' for dynamic content that needs to be fresh
      // For the public facing page, we want to cache it.
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!response.ok) {
      console.error(`Failed to fetch content from backend: ${response.status} ${response.statusText}`)
      return defaultContent // Fallback to default content on error
    }

    const data = await response.json()
    return data as PageContent
  } catch (error) {
    console.error("Network error fetching content:", error)
    return defaultContent // Fallback to default content on network error
  }
}
