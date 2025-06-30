"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, TrendingUp, Users } from "lucide-react"

export default function AboutClub() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-green-600 mb-2">Härnösands HF</h2>

            <p className="text-gray-700 mb-6">
              Vi är en handbollsklubb som värnar om gemenskap, utveckling och sund konkurrens. Med våra 23 lag från
              ungdom till seniorer erbjuder vi handboll för alla åldrar och nivåer.
            </p>

            <p className="text-gray-700 mb-8">
              Vår vision är att vara den ledande handbollsklubben i regionen genom att skapa en miljö där varje spelare
              kan utvecklas och trivas.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="border border-gray-200 rounded-lg p-4 text-center">
                <Heart className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-medium mb-1">Passion</h4>
                <p className="text-xs text-gray-600">Vi brinner för handboll</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 text-center">
                <TrendingUp className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <h4 className="font-medium mb-1">Utveckling</h4>
                <p className="text-xs text-gray-600">Alla kan bli bättre</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 text-center">
                <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-medium mb-1">Gemenskap</h4>
                <p className="text-xs text-gray-600">Tillsammans är vi starka</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/lag"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md font-medium transition-colors"
              >
                Visa Lag
              </Link>
              <Link
                href="/kontakt"
                className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 px-6 py-2 rounded-md font-medium transition-colors"
              >
                Kontakta Oss
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="https://i.ibb.co/Zt8gppK/491897759-17872413642339702-3719173158843008539-n.jpg"
                alt="Härnösands HF Team"
                fill
                className="object-cover"
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              />
            </div>

            <div className="absolute -top-4 -right-4 bg-orange-500 text-white rounded-lg p-4 shadow-lg">
              <div className="text-3xl font-bold">23</div>
              <div className="text-sm">lag totalt</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
