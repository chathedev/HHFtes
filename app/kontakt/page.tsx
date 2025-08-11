import Link from "next/link"
import { Instagram, Facebook } from "lucide-react" // Import Lucide icons
import { Header } from "@/components/header"
import Footer from "@/components/footer"

export default function KontaktPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="h-24"></div> {/* Spacer for fixed header */}
        <div className="container px-4 md:px-6 py-8 md:py-12 lg:py-16">
          <h1 className="text-5xl font-bold text-green-700 mb-4 text-center">KONTAKT</h1>
          <p className="text-lg text-gray-700 mb-12 text-center max-w-3xl mx-auto">
            Har du frågor eller funderingar? Tveka inte att kontakta oss!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 shadow-lg rounded-lg">
              <h2 className="text-2xl font-semibold text-orange-500 mb-4">Allmänna frågor</h2>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">E-post:</span> info@harnosandshf.se
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Telefon:</span> 070-123 45 67
              </p>
            </div>
            <div className="bg-white p-6 shadow-lg rounded-lg">
              <h2 className="text-2xl font-semibold text-orange-500 mb-4">Besöksadress</h2>
              <p className="text-gray-700 mb-2">Härnösands Handbollsförening</p>
              <p className="text-gray-700 mb-2">Idrottsvägen 10</p>
              <p className="text-gray-700">871 40 Härnösand</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <h2 className="text-3xl font-bold text-orange-500 mb-6">Följ oss på sociala medier</h2>
            <div className="flex justify-center space-x-6">
              <Link href="https://www.instagram.com/harnosandshf/" target="_blank" rel="noopener noreferrer">
                <Instagram className="w-12 h-12 text-pink-600 hover:text-pink-700 transition-colors" />
              </Link>
              <Link href="https://www.facebook.com/harnosandshf/" target="_blank" rel="noopener noreferrer">
                <Facebook className="w-12 h-12 text-blue-600 hover:text-blue-700 transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
