"use client"

import Link from "next/link"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { MenuIcon } from "lucide-react"
import Image from "next/image"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm dark:bg-gray-950">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link className="flex items-center gap-2" href="/">
          <Image src="/logo.png" alt="Härnösands HF Logo" width={40} height={40} />
          <span className="text-lg font-semibold">Härnösands HF</span>
        </Link>
        <nav className="hidden space-x-4 md:flex">
          <Link className="font-medium hover:underline underline-offset-4" href="/">
            Hem
          </Link>
          <Link className="font-medium hover:underline underline-offset-4" href="/lag">
            Lag
          </Link>
          <Link className="font-medium hover:underline underline-offset-4" href="/matcher">
            Matcher
          </Link>
          <Link className="font-medium hover:underline underline-offset-4" href="/kalender">
            Kalender
          </Link>
          <Link className="font-medium hover:underline underline-offset-4" href="/nyheter">
            Nyheter
          </Link>
          <Link className="font-medium hover:underline underline-offset-4" href="/partners">
            Partners
          </Link>
          <Link className="font-medium hover:underline underline-offset-4" href="/kontakt">
            Kontakt
          </Link>
          <Link className="font-medium hover:underline underline-offset-4" href="/editor">
            Redigerare
          </Link>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button className="md:hidden bg-transparent" size="icon" variant="outline">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="flex flex-col gap-4 p-4">
              <Link className="font-medium hover:underline underline-offset-4" href="/">
                Hem
              </Link>
              <Link className="font-medium hover:underline underline-offset-4" href="/lag">
                Lag
              </Link>
              <Link className="font-medium hover:underline underline-offset-4" href="/matcher">
                Matcher
              </Link>
              <Link className="font-medium hover:underline underline-offset-4" href="/kalender">
                Kalender
              </Link>
              <Link className="font-medium hover:underline underline-offset-4" href="/nyheter">
                Nyheter
              </Link>
              <Link className="font-medium hover:underline underline-offset-4" href="/partners">
                Partners
              </Link>
              <Link className="font-medium hover:underline underline-offset-4" href="/kontakt">
                Kontakt
              </Link>
              <Link className="font-medium hover:underline underline-offset-4" href="/editor">
                Redigerare
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
