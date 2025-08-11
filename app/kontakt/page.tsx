import Link from "next/link"
import { Card } from "@/components/ui/card"

export default function KontaktPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 py-8 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <Link href="/" className="inline-flex items-center text-green-700 hover:underline mb-8">← Tillbaka till startsidan</Link>

        <h1 className="text-5xl font-bold text-green-700 mb-12 text-center">Kontakt</h1>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="p-6 bg-white/80 shadow-lg rounded-lg flex items-start gap-4">
            <div className="w-6 h-6 bg-green-700 rounded flex-shrink-0"></div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">E-post</h2>
              <p className="text-lg text-gray-700 mb-2">Skicka dina frågor till oss via e-post</p>
              <a href="mailto:info@harnosandshf.se" className="text-orange-500 hover:underline text-lg font-medium">
                info@harnosandshf.se
              </a>
            </div>
          </Card>
          <Card className="p-6 bg-white/80 shadow-lg rounded-lg flex items-start gap-4">
            <div className="w-6 h-6 bg-green-700 rounded flex-shrink-0"></div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Besöksadress</h2>
              <p className="text-lg text-gray-700 mb-2">Hitta oss på våra träningar</p>
              <p className="text-lg text-gray-700">Öbacka Sporthall, Härnösand</p>
            </div>
          </Card>
          <Card className="p-6 bg-white/80 shadow-lg rounded-lg flex items-start gap-4 md:col-span-2">
            <div className="w-6 h-6 bg-green-700 rounded flex-shrink-0"></div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Styrelse</h2>
              <p className="text-lg text-gray-700 mb-2">Kontakta vår styrelse för föreningsfrågor</p>
              <p className="text-lg text-gray-700">Via e-post eller på träningarna</p>
            </div>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-orange-500 mb-6">Vanliga frågor</h2>
          <ul className="space-y-4 text-lg text-gray-700">
            <li>
              <span className="font-semibold text-gray-800">• Nya spelare:</span> Kontakta oss för provträningar
            </li>
            <li>
              <span className="font-semibold text-gray-800">• Sponsring:</span> E-posta för partnerskapsmöjligheter
            </li>
            <li>
              <span className="font-semibold text-gray-800">• Hallar:</span> Information om våra träningsanläggningar
            </li>
            <li>
              <span className="font-semibold text-gray-800">• Matcher:</span> Schema finns på lagspecifika sidor
            </li>
          </ul>
        </section>
      </main>
    </div>
  )
}
