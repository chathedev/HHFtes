"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { Users, Trophy, Calendar, Star, Heart, Award, Target } from "lucide-react"

export default function BliMedlemPage() {
  return (
    <div>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Bli Medlem i Härnösands HF</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Gå med i vår handbollsfamilj som vuxen och upplev glädjen med att träna handboll tillsammans med andra!
              Detta medlemskap är för vuxna som vill träna och spela handboll.
            </p>
            <Badge className="bg-orange-500 text-white px-4 py-2 text-lg">Kommer Snart</Badge>
          </div>
        </section>

        {/* Membership Types */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-green-700 mb-12">Medlemskapsalternativ för Vuxna</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Adult Training Membership */}
              <Card className="p-6 text-center hover:shadow-lg transition-shadow border-2 border-green-500">
                <Star className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Träningsmedlemskap</h3>
                <p className="text-gray-600 mb-4">
                  För vuxna som vill träna handboll regelbundet. Inkluderar träningar och utvecklingsprogram.
                </p>
                <div className="text-2xl font-bold text-green-600 mb-4">Kommer Snart</div>
                <Button disabled className="w-full">
                  Kommer Snart
                </Button>
              </Card>

              {/* Supporter Membership */}
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Supportermedlemskap</h3>
                <p className="text-gray-600 mb-4">
                  Stöd klubben utan att träna aktivt. Perfekt för föräldrar och fans som vill stödja verksamheten.
                </p>
                <div className="text-2xl font-bold text-green-600 mb-4">Kommer Snart</div>
                <Button disabled className="w-full">
                  Kommer Snart
                </Button>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Ungdomsträning</h3>
                <p className="text-blue-700">
                  Ungdomar som vill börja träna handboll hänvisas till våra ungdomslag. Kontakta oss för mer information
                  om träning för barn och ungdomar.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-green-700 mb-12">Vad ingår i medlemskapet?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <div className="text-center">
                <Users className="w-10 h-10 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Träningar</h3>
                <p className="text-sm text-gray-600">Regelbundna träningar med kvalificerade tränare</p>
              </div>
              <div className="text-center">
                <Trophy className="w-10 h-10 text-orange-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Matcher</h3>
                <p className="text-sm text-gray-600">Delta i seriespel och turneringar</p>
              </div>
              <div className="text-center">
                <Award className="w-10 h-10 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Utveckling</h3>
                <p className="text-sm text-gray-600">Personlig utveckling och färdighetsträning</p>
              </div>
              <div className="text-center">
                <Target className="w-10 h-10 text-orange-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Gemenskap</h3>
                <p className="text-sm text-gray-600">Bli del av vår handbollsfamilj</p>
              </div>
            </div>
          </div>
        </section>

        {/* Training Schedule Placeholder */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-green-700 mb-12">Träningsschema</h2>
            <div className="max-w-4xl mx-auto">
              <Card className="p-8 text-center">
                <Calendar className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-4">Träningsschema Kommer Snart</h3>
                <p className="text-gray-600 mb-6">
                  Vi arbetar på att färdigställa vårt träningsschema för alla åldersgrupper. Håll utkik för
                  uppdateringar!
                </p>
                <Button disabled>Kommer Snart</Button>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-green-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Har du frågor om vuxenmedlemskap?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Kontakta oss så hjälper vi dig att komma igång med handbollsträning som vuxen i Härnösands HF!
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
