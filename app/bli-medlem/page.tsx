"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { Users, Trophy, Star, Heart } from "lucide-react"

export default function BliMedlemPage() {
  return (
    <div>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Bli Supporter av Härnösands HF</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Stöd vår handbollsklubb som supporter! Kom till matcher, följ våra lag och var en del av vår fantastiska
              handbollsfamilj. Detta medlemskap är för dig som vill stödja klubben utan att träna aktivt.
            </p>
            <Badge className="bg-orange-500 text-white px-4 py-2 text-lg">Kommer Snart</Badge>
          </div>
        </section>

        {/* Membership Types */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-green-700 mb-12">Supportermedlemskap</h2>
            <div className="grid md:grid-cols-1 gap-8 max-w-2xl mx-auto">
              <Card className="p-6 text-center hover:shadow-lg transition-shadow border-2 border-green-500">
                <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Supportermedlemskap</h3>
                <p className="text-gray-600 mb-4">
                  Stöd Härnösands HF genom att bli supporter! Kom till matcher, följ våra lag och var en del av vår
                  handbollsfamilj. Perfekt för föräldrar, vänner och alla som vill stödja klubben.
                </p>
                <div className="text-2xl font-bold text-green-600 mb-4">Kommer Snart</div>
                <Button disabled className="w-full">
                  Kommer Snart
                </Button>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Vill du träna handboll?</h3>
                <p className="text-blue-700">
                  Vi erbjuder för närvarande inte träningsmedlemskap för vuxna. Ungdomar som vill börja träna handboll
                  hänvisas till våra ungdomslag. Kontakta oss för mer information om träning för barn och ungdomar.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-green-700 mb-12">Vad ingår i supportermedlemskapet?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <div className="text-center">
                <Trophy className="w-10 h-10 text-orange-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Matcher</h3>
                <p className="text-sm text-gray-600">Kom och heja på våra lag under matcher</p>
              </div>
              <div className="text-center">
                <Users className="w-10 h-10 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Gemenskap</h3>
                <p className="text-sm text-gray-600">Bli del av vår handbollsfamilj</p>
              </div>
              <div className="text-center">
                <Heart className="w-10 h-10 text-red-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Stöd Klubben</h3>
                <p className="text-sm text-gray-600">Hjälp oss att utveckla handbollen i Härnösand</p>
              </div>
              <div className="text-center">
                <Star className="w-10 h-10 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Uppdateringar</h3>
                <p className="text-sm text-gray-600">Få nyheter och information om klubben</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-green-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Har du frågor om supportermedlemskap?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Kontakta oss så hjälper vi dig att bli en del av Härnösands HF:s supporterfamilj!
            </p>
            <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg">
              <a href="/kontakt">Kontakta Oss</a>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
