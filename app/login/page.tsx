"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { login } from "@/app/actions/auth"
import { useAuth } from "@/components/auth-provider"
import { useEffect } from "react"
import { toast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(login, null)
  const { isAuthenticated, setIsAuthenticated } = useAuth()

  // If already authenticated on the client, redirect to editor
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/editor")
    }
  }, [isAuthenticated, router])

  // Handle server action result
  useEffect(() => {
    if (state?.success) {
      setIsAuthenticated(true) // Update client-side auth state
      toast({
        title: "Inloggad!",
        description: "Du är nu inloggad till redigeraren.",
        variant: "default",
      })
      router.push("/editor")
    } else if (state?.message) {
      toast({
        title: "Inloggningsfel",
        description: state.message,
        variant: "destructive",
      })
    }
  }, [state, setIsAuthenticated, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Logga in till redigeraren</CardTitle>
          <CardDescription>Ange lösenordet för att komma åt webbplatsredigeraren.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Lösenord</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Loggar in..." : "Logga in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
