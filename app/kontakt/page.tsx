"use client"

import Link from "next/link"

import { Header } from "@/components/header"
import Footer from "@/components/footer"

export default function KontaktPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-8 md:py-12 lg:py-16 pt-32">
        {" "}
        {/* Increased pt to pt-32 */}
        <div className="container px-4 md:px-6">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">Kontakta Oss</h1>
          <p className="text-lg text-gray-700 mb-8">Har du frågor eller funderingar? Tveka inte att kontakta oss!</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Allmänna frågor</h2>
              <p className="text-gray-600">
                E-post:{" "}
                <a href="mailto:info@harnosandshf.se" className="text-orange-500 hover:underline">
                  info@harnosandshf.se
                </a>
              </p>
              <p className="text-gray-600">
                Telefon:{" "}
                <a href="tel:+46701234567" className="text-orange-500 hover:underline">
                  070-123 45 67
                </a>
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Besöksadress</h2>
              <p className="text-gray-600">Öbackahallen</p>
              <p className="text-gray-600">Idrottsvägen 1</p>
              <p className="text-gray-600">871 40 Härnösand</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Följ oss på sociala medier</h2>
              <div className="flex space-x-4">
                <Link
                  href="https://www.instagram.com/harnosandshf/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 hover:underline"
                >
                  Instagram
                </Link>
                <Link
                  href="https://www.facebook.com/harnosandshf/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 hover:underline"
                >
                  Facebook
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
