"use client"
import { loadContent } from "@/lib/content-store" // Import loadContent
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Hero } from "@/components/hero"
import { Stats } from "@/components/stats"
import { AboutClub } from "@/components/about-club"
import { PartnersCarousel } from "@/components/partners-carousel"
import { UpcomingEvents } from "@/components/upcoming-events"
import { MatchCards } from "@/components/match-cards"

// Hero Component Logic
// Hero component is now imported from "@/components/hero"

// Stats Component Logic
// Stats component is now imported from "@/components/stats"

// UpcomingEvents Component Logic
// UpcomingEvents component is now imported from "@/components/upcoming-events"

// AboutClub Component Logic
// AboutClub component is now imported from "@/components/about-club"

// PartnersCarousel Component Logic
// PartnersCarousel component is now imported from "@/components/partners-carousel"

// MatchCards Component Logic
// MatchCards component is now imported from "@/components/match-cards"

export default async function HomePage() {
  const content = await loadContent()

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Header />
      <main className="flex-1">
        <Hero
          title={content.hero.title}
          description={content.hero.description}
          imageUrl={content.hero.imageUrl}
          button1Text={content.hero.button1Text}
          button1Link={content.hero.button1Link}
          button2Text={content.hero.button2Text}
          button2Link={content.hero.button2Link}
        />
        <Stats
          totalTeams={content.stats.totalTeams}
          aTeams={content.stats.aTeams}
          youthTeams={content.stats.youthTeams}
          historyYears={content.stats.historyYears}
        />
        <AboutClub
          title={content.aboutClub.title}
          paragraph1={content.aboutClub.paragraph1}
          paragraph2={content.aboutClub.paragraph2}
          passionText={content.aboutClub.passionText}
          developmentText={content.aboutClub.developmentText}
          communityText={content.aboutClub.communityText}
          button1Text={content.aboutClub.button1Text}
          button1Link={content.aboutClub.button1Link}
          button2Text={content.aboutClub.button2Text}
          button2Link={content.aboutClub.button2Link}
          imageSrc={content.aboutClub.imageSrc}
          imageAlt={content.aboutClub.imageAlt}
          totalTeamsCallout={content.aboutClub.totalTeamsCallout}
          totalTeamsCalloutText={content.aboutClub.totalTeamsCalloutText}
        />
        <UpcomingEvents />
        <MatchCards />
        <PartnersCarousel
          title={content.partnersCarousel.title}
          description={content.partnersCarousel.description}
          callToActionTitle={content.partnersCarousel.callToActionTitle}
          callToActionDescription={content.partnersCarousel.callToActionDescription}
          callToActionLinkText={content.partnersCarousel.callToActionLinkText}
          callToActionLink={content.partnersCarousel.callToActionLink}
        />
      </main>
      <Footer />
    </div>
  )
}
