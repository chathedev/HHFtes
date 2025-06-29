import Hero from "@/components/hero"
import PartnersCarouselClient from "./partners-carousel-client"
import Stats from "@/components/stats"
import UpcomingEvents from "@/components/upcoming-events" // Updated import
import AboutClub from "@/components/about-club"

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <UpcomingEvents /> {/* Updated component usage */}
      <AboutClub />
      <PartnersCarouselClient />
    </>
  )
}
