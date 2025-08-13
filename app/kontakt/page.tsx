"use client"

import type React from "react"

import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { Mail, Facebook, Instagram, User, MessageSquare, Send } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"

export default function KontaktPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const emailBody = `Namn: ${formData.name}
E-post: ${formData.email}

Meddelande:
${formData.message}`

    const mailtoLink = `mailto:kontakt@harnosandshf.se?subject=${encodeURIComponent(formData.subject || "Kontakt från hemsidan")}&body=${encodeURIComponent(emailBody)}`

    window.location.href = mailtoLink
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <div className="h-24"></div> {/* Spacer for fixed header */}
        <div className="container px-4 md:px-6 py-8 md:py-12 lg:py-16 max-w-7xl mx-auto w-full">
          <h1 className="text-5xl font-bold text-green-700 mb-4 text-center">Kontakta Oss</h1>
          <p className="text-xl text-gray-700 mb-12 text-center max-w-3xl mx-auto">
            Har du frågor eller funderingar? Tveka inte att höra av dig till oss!
          </p>

          <div className="max-w-6xl mx-auto mb-12">
            {/* Department Email Contacts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/90 shadow-lg rounded-lg p-6 text-center">
                <Mail className="w-10 h-10 text-orange-500 mb-3 mx-auto" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Sponsring & Marknadsföring</h3>
                <p className="text-sm text-gray-600 mb-3">Vill du sponsra oss eller samarbeta?</p>
                <a href="mailto:marknad@harnosandshf.se" className="text-green-700 hover:underline font-medium">
                  marknad@harnosandshf.se
                </a>
              </div>

              <div className="bg-white/90 shadow-lg rounded-lg p-6 text-center">
                <Mail className="w-10 h-10 text-orange-500 mb-3 mx-auto" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Kommunikation</h3>
                <p className="text-sm text-gray-600 mb-3">Media, press och kommunikation</p>
                <a href="mailto:kommunikation@harnosandshf.se" className="text-green-700 hover:underline font-medium">
                  kommunikation@harnosandshf.se
                </a>
              </div>

              <div className="bg-white/90 shadow-lg rounded-lg p-6 text-center">
                <Mail className="w-10 h-10 text-orange-500 mb-3 mx-auto" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Föreningsinsats</h3>
                <p className="text-sm text-gray-600 mb-3">Förenings- och arbetsinsatser</p>
                <a href="mailto:foreningsinsats@harnosandshf.se" className="text-green-700 hover:underline font-medium">
                  foreningsinsats@harnosandshf.se
                </a>
              </div>

              <div className="bg-white/90 shadow-lg rounded-lg p-6 text-center">
                <Mail className="w-10 h-10 text-orange-500 mb-3 mx-auto" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Sport & Träning</h3>
                <p className="text-sm text-gray-600 mb-3">Frågor om träning och sportverksamhet</p>
                <a href="mailto:sport@harnosandshf.se" className="text-green-700 hover:underline font-medium">
                  sport@harnosandshf.se
                </a>
              </div>

              <div className="bg-white/90 shadow-lg rounded-lg p-6 text-center">
                <Mail className="w-10 h-10 text-orange-500 mb-3 mx-auto" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Ekonomi</h3>
                <p className="text-sm text-gray-600 mb-3">Ekonomiska frågor och fakturor</p>
                <a href="mailto:ekonomi@harnosandshf.se" className="text-green-700 hover:underline font-medium">
                  ekonomi@harnosandshf.se
                </a>
              </div>

              <div className="bg-white/90 shadow-lg rounded-lg p-6 text-center">
                <Mail className="w-10 h-10 text-orange-500 mb-3 mx-auto" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Styrelsen</h3>
                <p className="text-sm text-gray-600 mb-3">Kontakt med föreningens styrelse</p>
                <a href="mailto:styrelsen@harnosandshf.se" className="text-green-700 hover:underline font-medium">
                  styrelsen@harnosandshf.se
                </a>
              </div>
            </div>

            {/* General Email Contact Card */}
            <div className="bg-white/90 shadow-lg rounded-lg p-8 text-center mb-8">
              <Mail className="w-12 h-12 text-orange-500 mb-4 mx-auto" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Allmänna frågor</h2>
              <p className="text-lg text-gray-700 mb-4">För allmänna frågor och information</p>
              <a href="mailto:kontakt@harnosandshf.se" className="text-green-700 hover:underline text-lg font-medium">
                kontakt@harnosandshf.se
              </a>
            </div>

            {/* Contact Form */}
            <div className="bg-white/90 shadow-lg rounded-lg p-8">
              <div className="flex items-center justify-center mb-6">
                <MessageSquare className="w-8 h-8 text-orange-500 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-800">Skicka meddelande</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">
                      Namn *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Ditt namn"
                        className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                      E-post *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="din@email.se"
                        className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject" className="text-sm font-medium text-gray-700 mb-2 block">
                    Ämne
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="Vad gäller ditt meddelande?"
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    value={formData.subject}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-sm font-medium text-gray-700 mb-2 block">
                    Meddelande *
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Skriv ditt meddelande här..."
                    rows={5}
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500 resize-none"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="text-center">
                  <Button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-md text-lg font-semibold transition-colors inline-flex items-center"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Skicka meddelande
                  </Button>
                </div>
              </form>
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

          {/* FAQ Section */}
          <div className="mt-16">
            <div className="bg-white shadow-lg rounded-lg p-8 md:p-12 max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">Vanliga frågor om att börja träna</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-lg font-semibold text-gray-800 hover:no-underline">
                    Hur börjar jag spela handboll i Härnösands HF?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 text-base">
                    Det enklaste sättet att börja är att kontakta oss! Vi hjälper dig att hitta rätt lag baserat på din
                    ålder och erfarenhet. Du kan fylla i vårt kontaktformulär eller skicka ett mejl direkt till oss.
                    <Link href="/kontakt" className="text-orange-500 hover:underline ml-2">
                      Kontakta oss här.
                    </Link>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-lg font-semibold text-gray-800 hover:no-underline">
                    Vilken utrustning behöver jag?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 text-base">
                    Till en början behöver du bara bekväma träningskläder, inomhusskor och en vattenflaska. Handbollar
                    finns att låna under träningarna. När du väl bestämmer dig för att fortsätta kan du behöva
                    klubbkläder.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-lg font-semibold text-gray-800 hover:no-underline">
                    Finns det provträningar?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 text-base">
                    Absolut! Vi erbjuder alltid några kostnadsfria provträningar så att du kan känna efter om handboll
                    är något för dig. Detta ger dig en chans att träffa laget och tränarna innan du bestämmer dig.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-lg font-semibold text-gray-800 hover:no-underline">
                    Hur anmäler jag mig?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 text-base">
                    Efter dina provträningar får du information om hur du enkelt anmäler dig och blir en fullvärdig
                    medlem i Härnösands HF. Vi ser fram emot att välkomna dig till vår handbollsfamilj!
                    <Link href="/kontakt" className="text-orange-500 hover:underline ml-2">
                      Anmäl dig via kontaktformuläret.
                    </Link>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <div className="text-center mt-8">
                <Button
                  asChild
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-md text-lg font-semibold transition-colors"
                >
                  <Link href="/kontakt">Kontakta oss för mer information</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
