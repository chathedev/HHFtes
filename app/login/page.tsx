"use client"

import { useFormState, useFormStatus } from "react-dom"
import { authenticate } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined)

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-green-700">Logga in</CardTitle>
          <CardDescription className="text-gray-600">
            Använd ditt användarnamn och lösenord för att logga in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={dispatch} className="space-y-6">
            <div>
              <Label htmlFor="username">Användarnamn</Label>
              <Input id="username" name="username" type="text" placeholder="ditt.användarnamn" required />
            </div>
            <div>
              <Label htmlFor="password">Lösenord</Label>
              <Input id="password" name="password" type="password" placeholder="********" required />
            </div>
            {errorMessage && <div className="text-red-500 text-sm text-center">{errorMessage}</div>}
            <LoginButton />
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function LoginButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full" aria-disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loggar in...
        </>
      ) : (
        "Logga in"
      )}
    </Button>
  )
}
