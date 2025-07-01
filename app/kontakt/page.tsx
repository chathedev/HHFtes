"use client"

import { useFormState, useFormStatus } from "react-dom"
import { sendContactForm } from "@/app/actions/contact"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Mail, Phone, MapPin } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useEffect } from "react"

export default function KontaktPage() {
  const initialState = {
    success: false,
    message: "",
    errors: {},
  }
  const [state, formAction] = useFormState(sendContactForm, initialState)

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Meddelande skickat!" : "Fel vid skickande",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      })
    }
  }, [state])

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-4xl font-bold text-center text-green-700 mb-8">Kontakta Oss</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div className="space-y-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-green-600">Härnösands FF Kansli</CardTitle>
              <CardDescription>Vi svarar så snart vi kan!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-orange-500" />
                <div>
                  <p className="font-semibold">Besöksadress:</p>
                  <p>Härnösands Arena, Idrottsvägen 10, 871 50 Härnösand</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-6 h-6 text-orange-500" />
                <div>
                  <p className="font-semibold">Telefon:</p>
                  <p>+46 611-123 45</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-6 h-6 text-orange-500" />
                <div>
                  <p className="font-semibold">E-post:</p>
                  <p>
                    <a href="mailto:info@harnosandff.se" className="text-blue-600 hover:underline">
                      info@harnosandff.se
                    </a>
                  </p>
                </div>
              </div>
              <div>
                <p className="font-semibold">Öppettider:</p>
                <p>Måndag - Fredag: 09:00 - 16:00</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-green-600">Skicka ett meddelande</CardTitle>
            <CardDescription>Fyll i formuläret nedan så återkommer vi till dig.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-6">
              <div>
                <Label htmlFor="name">Namn</Label>
                <Input id="name" name="name" type="text" placeholder="Ditt namn" required />
                {state.errors?.name && <p className="text-red-500 text-sm mt-1">{state.errors.name}</p>}
              </div>
              <div>
                <Label htmlFor="email">E-post</Label>
                <Input id="email" name="email" type="email" placeholder="din.epost@example.com" required />
                {state.errors?.email && <p className="text-red-500 text-sm mt-1">{state.errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="subject">Ämne</Label>
                <Input id="subject" name="subject" type="text" placeholder="Ämne för ditt meddelande" required />
                {state.errors?.subject && <p className="text-red-500 text-sm mt-1">{state.errors.subject}</p>}
              </div>
              <div>
                <Label htmlFor="message">Meddelande</Label>
                <Textarea id="message" name="message" placeholder="Ditt meddelande här..." rows={5} required />
                {state.errors?.message && <p className="text-red-500 text-sm mt-1">{state.errors.message}</p>}
              </div>
              <SubmitButton />
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" aria-disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Skickar...
        </>
      ) : (
        "Skicka meddelande"
      )}
    </Button>
  )
}
