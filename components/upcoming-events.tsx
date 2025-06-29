"use client"

import { Calendar, Zap, ArrowRight, Goal } from "lucide-react" // Added Goal icon
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function UpcomingEvents() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Kommande Träningar / Evenemang - Now a button to Kalender */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 flex flex-col items-center text-center">
              <Calendar className="w-12 h-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-bold text-orange-500 mb-4">KALENDER</h3>
              <p className="text-gray-600 text-sm mb-4">Se alla kommande träningar och evenemang</p>
              <Button
                asChild
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md font-medium transition-colors"
              >
                <Link href="/kalender">
                  Visa Kalender
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Kommande Matcher - New button */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 flex flex-col items-center text-center">
              <Goal className="w-12 h-12 text-green-600 mb-4" /> {/* Using Goal icon for matches */}
              <h3 className="text-xl font-bold text-green-600 mb-4">KOMMANDE MATCHER</h3>
              <p className="text-gray-600 text-sm mb-4">Se alla kommande matcher</p>
              <Button
                asChild
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
              >
                <Link href="/matcher">
                  Visa Matcher
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Svenska Cupen (remains the same) */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 flex flex-col items-center text-center">
              <Zap className="w-12 h-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-bold text-orange-500 mb-2">SVENSKA CUPEN 25/26</h3>
              <p className="text-gray-600 text-sm">Följ vårt A-lag herr i Svenska Cupen</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
