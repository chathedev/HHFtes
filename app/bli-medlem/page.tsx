"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { Users, Trophy, Star, Heart } from "lucide-react"

export default function BliMedlemPage() {
  return (
    <div className="bg-white min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-400 to-orange-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Bli Supporter av Härnösands HF</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Stöd vår handbollsklubb som supporter! Kom till matcher, följ våra lag och var en del av vår fantastiska
              handbollsfamilj.
            </p>
            <Badge className="bg-green-500 text-white px-4 py-2 text-lg">Kommer Snart</Badge>
          </div>
        </section>

        {/* Membership Types */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Supportermedlemskap</h2>
            <div className="grid md:grid-cols-1 gap-8 max-w-2xl mx-auto">
              <Card className="p-6 text-center hover:shadow-lg transition-shadow border-2 border-orange-400 bg-orange-50">
                <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3 text-gray-800">Supportermedlemskap</h3>
                <p className="text-gray-700 mb-4">
                  Stöd Härnösands HF genom att bli supporter! Kom till matcher, följ våra lag och var en del av vår
                  handbollsfamilj. Perfekt för föräldrar, vänner och alla som vill stödja klubben.
                </p>
                <div className="text-2xl font-bold text-orange-600 mb-4">Kommer Snart</div>
                <Button disabled className="w-full bg-orange-400">
                  Kommer Snart
                </Button>
              </Card>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-green-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Vad ingår i supportermedlemskapet?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <Card className="p-4 text-center bg-orange-50 border-orange-200">
                <Trophy className="w-10 h-10 text-orange-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2 text-gray-800">Matcher</h3>
                <p className="text-sm text-gray-600">Kom och heja på våra lag under matcher</p>
              </Card>
              <Card className="p-4 text-center bg-green-50 border-green-200">
                <Users className="w-10 h-10 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2 text-gray-800">Gemenskap</h3>
                <p className="text-sm text-gray-600">Bli del av vår handbollsfamilj</p>
              </Card>
              <Card className="p-4 text-center bg-orange-50 border-orange-200">
                <Heart className="w-10 h-10 text-red-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2 text-gray-800">Stöd Klubben</h3>
                <p className="text-sm text-gray-600">Hjälp oss att utveckla handbollen i Härnösand</p>
              </Card>
              <Card className="p-4 text-center bg-green-50 border-green-200">
                <Star className="w-10 h-10 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2 text-gray-800">Uppdateringar</h3>
                <p className="text-sm text-gray-600">Få nyheter och information om klubben</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-green-500 text-white">
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
