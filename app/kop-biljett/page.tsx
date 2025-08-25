"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { Ticket, Calendar, MapPin, Clock } from "lucide-react"

export default function KopBiljettPage() {
  return (
    <div className="bg-white min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-500 to-green-700 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <Ticket className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Köp Biljetter</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Kom och upplev spännande handbollsmatcher med Härnösands HF! Köp dina biljetter enkelt online.
            </p>
          </div>
        </section>

        {/* Coming Soon Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-green-700 mb-8">Biljettförsäljning Kommer Snart</h2>
              <p className="text-lg text-gray-700 mb-12 max-w-2xl mx-auto">
                Vi arbetar för att göra det så enkelt som möjligt för dig att köpa biljetter till våra matcher. Snart
                kommer du att kunna köpa biljetter direkt här på hemsidan.
              </p>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <Card className="p-6 text-center bg-green-50 border-green-200">
                  <Calendar className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">Alla Matcher</h3>
                  <p className="text-gray-600">Köp biljetter till alla våra hemmamatcher under säsongen</p>
                </Card>

                <Card className="p-6 text-center bg-orange-50 border-orange-200">
                  <MapPin className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">Enkelt & Smidigt</h3>
                  <p className="text-gray-600">Välj dina platser och betala säkert online</p>
                </Card>

                <Card className="p-6 text-center bg-green-50 border-green-200">
                  <Clock className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">24/7 Tillgängligt</h3>
                  <p className="text-gray-600">Köp dina biljetter när det passar dig bäst</p>
                </Card>
              </div>

              <Button
                disabled
                className="bg-green-500 text-white px-8 py-4 text-lg font-semibold rounded-md cursor-not-allowed opacity-60"
              >
                Kommer Snart
              </Button>
            </div>
          </div>
        </section>

        {/* Information Section */}
        <section className="py-16 bg-green-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-green-700 mb-8">Under tiden</h2>
              <p className="text-lg text-gray-700 mb-8">
                Medan vi förbereder vår nya biljettlösning kan du fortfarande köpa biljetter till våra matcher. Kontakta
                oss för mer information om kommande matcher och biljettpriser.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
                  <a href="/kontakt">Kontakta Oss</a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 text-lg bg-transparent"
                >
                  <a
                    href="https://www.profixio.com/app/tournaments?term=&filters[open_registration]=0&filters[kampoppsett]=0&filters[land_id]=se&filters[type]=seriespill&filters[idrett]=HB&filters[listingtype]=matches&filters[season]=765&dateTo=2026-04-30&klubbid=26031&dateFrom=2025-01-15"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Se Kommande Matcher
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
