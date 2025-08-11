"use client"

import { Header } from "@/components/header"
import Footer from "@/components/footer"

export default function MatcherPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-8 md:py-12 lg:py-16 pt-32">
        {" "}
        {/* Increased pt to pt-32 */}
        <div className="container px-4 md:px-6">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">Kommande Matcher</h1>
          <p className="text-lg text-gray-700">
            Håll koll på våra kommande matcher och evenemang. Kom och heja fram Härnösands HF!
          </p>
          {/* Placeholder for match schedule */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Matchschema</h2>
            <ul className="space-y-4">
              <li className="border-b pb-2">
                <p className="font-medium">Härnösands HF vs. Gästriklands HK</p>
                <p className="text-sm text-gray-600">Datum: 2025-08-20, Tid: 19:00</p>
                <p className="text-sm text-gray-600">Plats: Öbackahallen</p>
              </li>
              <li className="border-b pb-2">
                <p className="font-medium">Sundsvalls HK vs. Härnösands HF</p>
                <p className="text-sm text-gray-600">Datum: 2025-08-27, Tid: 18:30</p>
                <p className="text-sm text-gray-600">Plats: Sundsvalls Sporthall</p>
              </li>
              <li className="border-b pb-2">
                <p className="font-medium">Härnösands HF vs. Umeå IK</p>
                <p className="text-sm text-gray-600">Datum: 2025-09-03, Tid: 20:00</p>
                <p className="text-sm text-gray-600">Plats: Öbackahallen</p>
              </li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
