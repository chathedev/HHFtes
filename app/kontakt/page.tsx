import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { Mail, MapPin, Facebook, Instagram } from "lucide-react"

export default function KontaktPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="h-24"></div> {/* Spacer for fixed header */}
        <div className="container px-4 md:px-6 py-8 md:py-12 lg:py-16 max-w-7xl mx-auto w-full">
          <h1 className="text-5xl font-bold text-green-700 mb-4 text-center">Kontakta Oss</h1>
          <p className="text-xl text-gray-700 mb-12 text-center max-w-3xl mx-auto">
            Har du frågor eller funderingar? Tveka inte att höra av dig till uss!
          </p>

          {/* Contact Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            <div className="bg-white/90 shadow-lg rounded-lg p-8 flex flex-col items-center text-center">
              <Mail className="w-12 h-12 text-orange-500 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">E-post</h2>
              <p className="text-lg text-gray-700 mb-4">Skicka oss ett meddelande när som helst.</p>
              <a href="mailto:info@harnosandshf.se" className="text-green-700 hover:underline text-lg font-medium">
                info@harnosandshf.se
              </a>
            </div>

            <div className="bg-white/90 shadow-lg rounded-lg p-8 flex flex-col items-center text-center">
              <MapPin className="w-12 h-12 text-orange-500 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Besöksadress</h2>
              <p className="text-lg text-gray-700 mb-4">Härnösands Handbollsförening</p>
              <p className="text-lg text-gray-700">Idrottsgatan 10</p>
              <p className="text-lg text-gray-700">871 40 Härnösand</p>
            </div>
          </div>

          {/* Social Media Section - Moved outside the grid for full-width centering */}
          <div className="mt-12 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Följ oss på sociala medier</h2>
            <div className="flex justify-center space-x-6">
              <a
                href="https://www.facebook.com/harnosandshf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Facebook className="w-10 h-10" />
              </a>
              <a
                href="https://www.instagram.com/harnosandshf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-pink-600 transition-colors"
              >
                <Instagram className="w-10 h-10" />
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
