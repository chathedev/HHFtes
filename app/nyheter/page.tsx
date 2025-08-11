"use client" // This component needs to be a client component due to useState

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

function formatDate(dateStr?: string) {
  try {
    if (!dateStr) return ""
    const d = new Date(dateStr)
    if (Number.isNaN(d.getTime())) return dateStr
    return new Intl.DateTimeFormat("sv-SE", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d)
  } catch {
    return dateStr ?? ""
  }
}

const NEWS = [
  {
    guid: "99b802a3-5608-da7e-a12c-d5f4bb0360d6",
    title: "Handbollscamp 2025",
    link: "https://www.laget.se/HarnosandsHF/News/7904135/Handbollscamp-2025",
    description:
      "Spelare födda 2012 - 2015 se hit!<br>I år kör vi ett handbollscamp In och anmäl er på länken!<br> <a href='https://forms.office.com/Pages/ResponsePage.aspx?id=w-9zaNc360mUkFNgRBSBcAo4fkaTJfNPhDtAxiaNejZUOTNSTUZYUU9YMlUwMjBHUlRSUlhLTDlSQi4u' target='_blank' rel='noopener noreferrer'>Anmälan</a><br/><br/><i>Publicerad: 2025-07-03 19:13</i>",
    pubDate: "Thu, 03 Jul 2025 17:13:00 GMT",
    image: "https://laget001.blob.core.windows.net/11571904_medium.jpg",
  },
  {
    guid: "1d1a7224-4453-96b0-2e3e-eb3bdc68315e",
    title: "Årsmöte HHF",
    link: "https://www.laget.se/HarnosandsHF/News/7880108/Arsmote-HHF",
    description:
      "Hej Medlemmar,<br>Välkomna på årsmöte! Dags att summera säsongen 24/25.<br>Tid: 18:00 23 Juni.<br>Plats: House Be, Strengbergsgatan 2 (Företagshotellet)<br><br>Erforderliga handlingar kommer skickas ut i tid enligt stadgar.<br/><br/><i>Publicerad: 2025-05-23 19:51</i>",
    pubDate: "Fri, 23 May 2025 17:51:27 GMT",
  },
  {
    guid: "32611364-77df-9b2a-89c3-166316e6a3aa",
    title: "Ny Sportchef för Herrverksamheten",
    link: "https://www.laget.se/HarnosandsHF/News/7714033/Ny-Sportchef-for-Herrverksamheten",
    description:
      "Anette Norberg byter sport!<br><br>… (förkortad text – klipp från RSS) …<br/><br/><i>Publicerad: 2024-10-04 15:21</i>",
    pubDate: "Fri, 04 Oct 2024 13:21:41 GMT",
    image: "https://laget001.blob.core.windows.net/11238189_medium.png",
  },
  {
    guid: "b6fccd06-d4a7-712c-16d1-80b73c6e704d",
    title: "Handbollsfritids & Teknikskola startar 8/11",
    link: "https://www.laget.se/HarnosandsHF/News/7709515/Handbollsfritids---Teknikskola-startar-8-11",
    description: "Äntligen dags för Handbollsfritids & Teknikskola igen!<br/><br/><i>Publicerad: 2024-09-30 08:42</i>",
    pubDate: "Mon, 30 Sep 2024 06:42:54 GMT",
    image: "https://laget001.blob.core.windows.net/10923470_medium.jpg",
  },
]

export default function NyheterPage() {
  const [visible, setVisible] = useState(false)

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 py-8 md:py-12 lg:py-16">
        <div className="container px-4 md:px-6">
          <Link href="/" className="inline-flex items-center text-green-700 hover:underline mb-8">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Tillbaka till startsidan
          </Link>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">Senaste Nyheterna</h1>

          {!visible ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <button
                onClick={() => setVisible(true)}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border border-gray-300 hover:border-gray-400 text-gray-800 bg-gray-50 hover:bg-gray-100 transition"
                aria-label="Kolla nyheter"
              >
                <span>🔎 Kolla nyheter</span>
              </button>
            </div>
          ) : (
            <ul className="grid sm:grid-cols-2 gap-4">
              {NEWS.map((item) => (
                <li key={item.guid} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                  {item.image && (
                    <Link href={item.link} target="_blank" rel="noopener noreferrer">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        width={600} // Added width
                        height={400} // Added height
                        className="w-full h-40 object-cover"
                        priority // Use priority for images in the initial view
                      />
                    </Link>
                  )}
                  <div className="p-4">
                    <Link href={item.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      <h3 className="text-lg font-semibold leading-snug">{item.title}</h3>
                    </Link>
                    {item.pubDate && <p className="text-xs text-gray-500 mt-1">{formatDate(item.pubDate)}</p>}
                    <div
                      className="prose prose-sm max-w-none text-gray-700 mt-3"
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}
