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
  hero: {
    title: "Härnösands Handbollsförening",
    description: "En handbollsklubb med stolthet, gemenskap och passion för sporten.",
    imageUrl: "/placeholder.svg?height=600&width=1200",
    button1Text: "Våra lag",
    button1Link: "/lag",
    button2Text: "Bli medlem",
    button2Link: "/kontakt",
  },
  stats: {
    totalTeams: 15,
    aTeams: 2,
    youthTeams: 13,
    historyYears: "50+",
  },
  aboutClub: {
    title: "Om Härnösands HF",
    paragraph1:
      "Härnösands Handbollsförening grundades 1972 och har sedan dess varit en central del av handbollslivet i Härnösand. Vi är stolta över vår historia och den gemenskap vi byggt upp genom åren.",
    paragraph2:
      "Vår vision är att erbjuda en meningsfull fritidsaktivitet för alla åldrar, från de yngsta knattarna till våra seniorlag. Vi fokuserar på att utveckla både individuella färdigheter och laganda.",
    passionText: "Passion för handboll",
    developmentText: "Utveckling för alla",
    communityText: "Stark gemenskap",
    button1Text: "Läs mer om oss",
    button1Link: "/om-oss",
    button2Text: "Kontakta oss",
    button2Link: "/kontakt",
    imageSrc: "/placeholder.svg?height=400&width=600",
    imageAlt: "Handbollsspelare i aktion",
    totalTeamsCallout: 15,
    totalTeamsCalloutText: "Aktiva lag",
  },
  partnersCarousel: {
    title: "Våra Partners",
    description: "Tack vare våra fantastiska partners kan vi fortsätta utveckla handbollen i Härnösand.",
    callToActionTitle: "Bli en del av vårt team!",
    callToActionDescription: "Är ditt företag intresserat av att stödja Härnösands HF och synas tillsammans med oss?",
    callToActionLinkText: "Läs mer om partnerskap",
    callToActionLink: "/partners",
  },
  kontaktPage: {
    emailTitle: "E-post",
    emailDescription: "Har du frågor eller funderingar? Skicka oss ett mejl så återkommer vi så snart vi kan.",
    emailAddress: "info@harnosandshf.se",
    addressTitle: "Besöksadress",
    addressDescription: "Vår hemmaarena och kansli finns på:",
    addressLocation: "Härnösand Arena, Arenavägen 1, 871 40 Härnösand",
    boardTitle: "Styrelsen",
    boardDescription: "Kontakta styrelsen för specifika ärenden rörande klubbens drift och strategi.",
    boardContact: "styrelsen@harnosandshf.se",
    faqItems: [
      {
        question: "Hur blir jag medlem?",
        answer: "Du kan bli medlem genom att fylla i vårt medlemsformulär på 'Bli medlem'-sidan.",
      },
      {
        question: "Vilka åldersgrupper har ni lag för?",
        answer:
          "Vi har lag för alla åldersgrupper, från handbollsskola för de yngsta till seniorlag för damer och herrar.",
      },
      {
        question: "Kan jag provträna?",
        answer:
          "Ja, du är välkommen att provträna med ett av våra lag. Kontakta respektive lags tränare för mer information.",
      },
    ],
  },
  partnersPage: {
    title: "Våra Stolta Partners",
    description:
      "Vi är oerhört tacksamma för det stöd vi får från våra partners. Deras bidrag är avgörande för vår verksamhet och hjälper oss att fortsätta utveckla handbollen i Härnösand.",
    callToActionTitle: "Vill du också bli Partner?",
    callToActionDescription:
      "Som partner till Härnösands HF får ditt företag möjlighet att synas i ett positivt sammanhang och bidra till ungdomsidrotten. Kontakta oss för att diskutera olika samarbetsmöjligheter.",
    callToActionLinkText: "Kontakta oss om partnerskap",
    callToActionLink: "/kontakt",
  },
}

// Client-side functions for localStorage (used by editor-client-page.tsx)
export function loadContent(): PageContent {
  if (typeof window !== "undefined") {
    const savedContent = localStorage.getItem("hhf_editor_content")
    if (savedContent) {
      try {
        return JSON.parse(savedContent)
      } catch (e) {
        console.error("Failed to parse saved content from localStorage", e)
      }
    }
  }
  return defaultContent
}

export function saveContentToLocalStorage(content: PageContent) {
  if (typeof window !== "undefined") {
    localStorage.setItem("hhf_editor_content", JSON.stringify(content))
  }
}

export function resetContent() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("hhf_editor_content")
  }
}
