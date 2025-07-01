import { unstable_cache } from "next/cache"

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
  aboutClub: {
    title: string
    description: string
    imageSrc: string
    totalTeamsCallout: number
    totalMembersCallout: number
    totalYearsCallout: number
    linkText: string
    linkHref: string
  }
  partners: {
    title: string
    description: string
    partnerLogos: { src: string; alt: string; href: string }[]
  }
  upcomingEvents: {
    title: string
    description: string
  }
}

export const defaultContent: PageContent = {
  hero: {
    title: "Välkommen till Härnösands FF",
    description:
      "Din lokala fotbollsklubb med hjärta och passion för sporten. Upptäck våra lag, nyheter och evenemang.",
    imageUrl: "https://az316141.cdn.laget.se/2317159/11348130.jpg",
    button1Text: "Våra lag",
    button1Link: "/lag",
    button2Text: "Kalender",
    button2Link: "/kalender",
  },
  aboutClub: {
    title: "Om Härnösands HF",
    description:
      "Härnösands FF är mer än bara en fotbollsklubb – vi är en gemenskap. Sedan vår grundning har vi strävat efter att erbjuda en positiv och utvecklande miljö för fotbollsspelare i alla åldrar. Vi fokuserar på laganda, sportslighet och att ha roligt på planen.",
    imageSrc: "https://i.ibb.co/Zt8gppK/491897759-17872413642339702-3719173158843008539-n.jpg",
    totalTeamsCallout: 23,
    totalMembersCallout: 500,
    totalYearsCallout: 75,
    linkText: "Läs mer om oss",
    linkHref: "/om-oss",
  },
  partners: {
    title: "Våra Partners",
    description: "Tack till våra fantastiska partners som gör vår verksamhet möjlig.",
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
    description: "Håll dig uppdaterad med vad som händer i klubben.",
  },
}

export const loadContent = unstable_cache(
  async () => {
    try {
      const response = await fetch(`${process.env.BACKEND_API_URL}/content`, {
        next: {
          revalidate: 3600, // Revalidate every hour
        },
      })
      if (!response.ok) {
        console.error(`Failed to fetch content: ${response.statusText}`)
        return defaultContent
      }
      const customContent = await response.json()

      // Merge custom content with default, ensuring specific image URLs are prioritized
      const mergedContent = {
        ...defaultContent,
        ...customContent,
        hero: {
          ...defaultContent.hero,
          ...customContent.hero,
          imageUrl: customContent.hero?.imageUrl || defaultContent.hero.imageUrl,
        },
        aboutClub: {
          ...defaultContent.aboutClub,
          ...customContent.aboutClub,
          imageSrc: customContent.aboutClub?.imageSrc || defaultContent.aboutClub.imageSrc,
        },
      }
      return mergedContent
    } catch (error) {
      console.error("Error loading content:", error)
      return defaultContent
    }
  },
  ["page-content"],
  {
    tags: ["content"],
  },
)

export const saveContent = async (content: PageContent) => {
  "use server"
  try {
    const response = await fetch(`${process.env.BACKEND_API_URL}/content`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_SECRET}`,
      },
      body: JSON.stringify(content),
    })
    if (!response.ok) {
      const errorData = await response.json()
      console.error(`Failed to save content: ${response.statusText}`, errorData)
      return { success: false, message: errorData.message || "Failed to save content." }
    }
    return { success: true, message: "Content saved successfully!" }
  } catch (error) {
    console.error("Error saving content:", error)
    return { success: false, message: "An unexpected error occurred." }
  }
}
