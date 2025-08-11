"use client"

import Link from "next/link"
import { ExternalLink, Instagram } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Header } from "@/components/header"
import Footer from "@/components/footer"

export default function LagPage() {
  const teamCategories = [
    {
      name: "A-lag",
      count: 2,
      teams: [
        {
          name: "Dam/utv",
          link: "https://www.laget.se/HHK-dam-utv",
          instagramLink: "https://www.instagram.com/harnosandshfdam/",
        },
        {
          name: "A-lag Herrar",
          link: "https://www.laget.se/HarnosandsHFHerr",
          instagramLink: "https://www.instagram.com/harnosandshfherr/",
        },
      ],
    },
    {
      name: "Ungdomslag",
      count: 21,
      teams: [
        {
          name: "Fritids-Teknikskola",
          link: "https://www.laget.se/HarnosandsHK-Fritids-Teknikskola",
        },
        {
          name: "Flickor 16 (F08/09)",
          link: "https://www.laget.se/HHK-Flickor16",
        },
        {
          name: "F-10",
          link: "https://www.laget.se/HHK-F10",
          instagramLink: "https://www.instagram.com/harnosandhff10/",
        },
        { name: "F-11", link: "https://www.laget.se/HHK-F11" },
        { name: "F-12", link: "https://www.laget.se/HHK-F12" },
        { name: "F-13", link: "https://www.laget.se/HHF-F13" },
        { name: "F-14", link: "https://www.laget.se/HarnosandsHK-F-14" },
        { name: "F-15", link: "https://www.laget.se/HarnosandsHK-F-15" },
        { name: "F-16", link: "https://www.laget.se/HarnosandsHK-F-16" },
        { name: "F-17", link: "https://www.laget.se/HarnosandsHK-F-17" },
        { name: "F-18", link: "https://www.laget.se/HarnosandsHF-F-18" },
        {
          name: "Pojkar 16 (P08/09)",
          link: "https://www.laget.se/HarnosandsHFP09",
        },
        {
          name: "P16 (09/10)",
          link: "https://www.laget.se/HarnosandsHFP16",
          instagramLink: "https://www.instagram.com/harnosandshf_p11/",
        },
        { name: "P-11", link: "https://www.laget.se/HHFP11" },
        { name: "P-12", link: "https://www.laget.se/HarnosandsHFP2012" },
        { name: "P-13", link: "https://www.laget.se/HHF2013" },
        {
          name: "P-14",
          link: "https://www.laget.se/HarnosandsHK-P-14",
          instagramLink: "https://www.instagram.com/harnosands_hf_p14",
        },
        { name: "P-15", link: "https://www.laget.se/HarnosandsHFP2015" },
        { name: "P-16", link: "https://www.laget.se/HarnosandsHFP2016" },
        { name: "P-17", link: "https://www.laget.se/HarnosandsHFP2017" },
        { name: "P-18", link: "https://www.laget.se/HarnosandsHF-P-18" },
      ],
    },
  ]

  const totalTeams = teamCategories.reduce((sum, cat) => sum + cat.count, 0)

  return (
    <>
      <Header />
      <main className="flex-1 py-8 md:py-12 lg:py-16 pt-32">
        {" "}
        {/* Increased pt to pt-32 */}
        <div className="container px-4 md:px-6">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">Våra Lag</h1>
          <p className="text-lg text-gray-700">
            Härnösands HF har {totalTeams} lag från ungdom till seniorer. Klicka på ett lag för att besöka deras
            officiella sida.
          </p>
          {/* Add more content related to teams here */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">Herrlaget</h2>
              <p className="text-gray-600">Följ vårt herrlag i deras matcher och träningar.</p>
              <Link href="#" className="text-orange-500 hover:underline mt-4 inline-block">
                Läs mer
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">Damlaget</h2>
              <p className="text-gray-600">Stöd vårt damlag på deras resa mot nya framgångar.</p>
              <Link href="#" className="text-orange-500 hover:underline mt-4 inline-block">
                Läs more
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">Ungdomslag</h2>
              <p className="text-gray-600">Våra framtida stjärnor i olika åldersgrupper.</p>
              <Link href="#" className="text-orange-500 hover:underline mt-4 inline-block">
                Läs mer
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-center">
            <Card className="p-6 bg-white/80 shadow-lg rounded-lg">
              <div className="text-5xl font-bold text-green-700">
                {teamCategories.find((c) => c.name === "A-lag")?.count || 0}
              </div>
              <div className="text-lg text-gray-600">A-lag</div>
            </Card>
            <Card className="p-6 bg-white/80 shadow-lg rounded-lg">
              <div className="text-5xl font-bold text-green-700">
                {teamCategories.find((c) => c.name === "Ungdomslag")?.count || 0}
              </div>
              <div className="text-lg text-gray-600">Ungdomslag</div>
            </Card>
            <Card className="p-6 bg-white/80 shadow-lg rounded-lg">
              <div className="text-5xl font-bold text-green-700">{totalTeams}</div>
              <div className="text-lg text-gray-600">Totalt</div>
            </Card>
          </div>

          {teamCategories.map((category) => (
            <section key={category.name} className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-orange-500">{category.name}</h2>
                <span className="text-xl font-bold text-orange-500">{category.count}</span>
              </div>
              <p className="text-lg text-gray-700 mb-8">{category.count} lag i kategorin</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.teams.map((team, index) => (
                  <Card key={index} className="p-6 bg-white/80 shadow-lg rounded-lg flex flex-col justify-between">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">{team.name}</h3>
                    <Link
                      href={team.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-green-700 hover:underline font-medium group"
                    >
                      Besök lagets sida
                      <ExternalLink className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                    {team.instagramLink && (
                      <Link
                        href={team.instagramLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-pink-600 hover:underline font-medium group mt-2"
                      >
                        Följ på Instagram
                        <Instagram className="w-4 h-4 ml-2 transition-transform group-hover:scale-110" />
                      </Link>
                    )}
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
