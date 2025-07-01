"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { SheetTrigger, SheetContent, Sheet } from "@/components/ui/sheet"
import { MenuIcon } from "lucide-react"
import { useAuth } from "@/components/auth-provider" // Import useAuth

export default function Header() {
  const { isAuthenticated } = useAuth() // Correctly destructure isAuthenticated

  return (
    <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6 border-b">
      <Link className="mr-6 flex items-center" href="/">
        <Image src="/logo.png" alt="Härnösands HF Logo" width={50} height={50} />
        <span className="sr-only">Härnösands HF</span>
      </Link>
      <nav className="ml-auto hidden gap-6 md:flex">
        <Link className="font-medium hover:underline underline-offset-4" href="/">
          Hem
        </Link>
        <Link className="font-medium hover:underline underline-offset-4" href="/nyheter">
          Nyheter
        </Link>
        <Link className="font-medium hover:underline underline-offset-4" href="/kalender">
          Kalender
        </Link>
        <Link className="font-medium hover:underline underline-offset-4" href="/lag">
          Lag
        </Link>
        <Link className="font-medium hover:underline underline-offset-4" href="/matcher">
          Matcher
        </Link>
        <Link className="font-medium hover:underline underline-offset-4" href="/partners">
          Partners
        </Link>
        <Link className="font-medium hover:underline underline-offset-4" href="/kontakt">
          Kontakt
        </Link>
        {isAuthenticated && ( // Conditionally render editor link
          <Link className="font-medium hover:underline underline-offset-4" href="/editor">
            Redigera
          </Link>
        )}
        {!isAuthenticated && ( // Conditionally render login link
          <Link className="font-medium hover:underline underline-offset-4" href="/login">
            Logga in
          </Link>
        )}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button className="md:hidden bg-transparent" size="icon" variant="outline">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <div className="grid gap-4 p-4">
            <Link className="font-medium hover:underline underline-offset-4" href="/">
              Hem
            </Link>
            <Link className="font-medium hover:underline underline-offset-4" href="/nyheter">
              Nyheter
            </Link>
            <Link className="font-medium hover:underline underline-offset-4" href="/kalender">
              Kalender
            </Link>
            <Link className="font-medium hover:underline underline-offset-4" href="/lag">
              Lag
            </Link>
            <Link className="font-medium hover:underline underline-offset-4" href="/matcher">
              Matcher
            </Link>
            <Link className="font-medium hover:underline underline-offset-4" href="/partners">
              Partners
            </Link>
            <Link className="font-medium hover:underline underline-offset-4" href="/kontakt">
              Kontakt
            </Link>
            {isAuthenticated && (
              <Link className="font-medium hover:underline underline-offset-4" href="/editor">
                Redigera
              </Link>
            )}
            {!isAuthenticated && (
              <Link className="font-medium hover:underline underline-offset-4" href="/login">
                Logga in
              </Link>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
