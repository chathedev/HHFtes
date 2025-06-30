"use client"

import { useActionState } from "react"
import { submitContactForm } from "@/app/actions/contact"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { useEffect } from "react"

export default function KontaktPage() {
  const [state, formAction] = useActionState(submitContactForm, {
    success: false,
    message: "",
    errors: {},
  })
  const { toast } = useToast()

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Framgång!" : "Fel!",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      })
    }
  }, [state.message, state.success, toast])

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Kontakta Oss</h1>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Har du frågor, förslag eller vill du bara säga hej? Fyll i formuläret nedan så återkommer vi till dig
                  så snart som möjligt.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 flex justify-center">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Skicka ett meddelande</CardTitle>
                <CardDescription>Vi ser fram emot att höra från dig!</CardDescription>
              </CardHeader>
              <CardContent>
                <form action={formAction} className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Namn</Label>
                    <Input id="name" name="name" placeholder="Ditt namn" required />
                    {state.errors?.name && <p className="text-red-500 text-sm">{state.errors.name}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">E-post</Label>
                    <Input id="email" name="email" type="email" placeholder="din@epost.com" required />
                    {state.errors?.email && <p className="text-red-500 text-sm">{state.errors.email}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="subject">Ämne</Label>
                    <Input id="subject" name="subject" placeholder="Ämne för ditt meddelande" required />
                    {state.errors?.subject && <p className="text-red-500 text-sm">{state.errors.subject}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="message">Meddelande</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Ditt meddelande..."
                      required
                      className="min-h-[100px]"
                    />
                    {state.errors?.message && <p className="text-red-500 text-sm">{state.errors.message}</p>}
                  </div>
                  <Button type="submit">Skicka meddelande</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Toaster />
    </div>
  )
}
