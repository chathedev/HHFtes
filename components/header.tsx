"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useSession, signOut } from "next-auth/react"

export default function Header() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const navItems = [
    { name: "Hem", href: "/" },
    { name: "Kalender", href: "/kalender" },
    { name: "Lag", href: "/lag" },
    { name: "Matcher", href: "/matcher" },
    { name: "Nyheter", href: "/nyheter" },
    { name: "Partners", href: "/partners" },
    { name: "Kontakt", href: "/kontakt" },
  ]

  return (
    <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between z-50 relative">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logo.png" alt="Härnösands FF Logo" width={50} height={50} />
        <span className="text-2xl font-bold text-green-700">Härnösands FF</span>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-gray-700 hover:text-green-600 transition-colors text-lg font-medium",
              pathname === item.href && "text-green-600 font-semibold",
            )}
          >
            {item.name}
          </Link>
        ))}
        {session?.user ? (
          <>
            <Link
              href="/editor"
              className={cn(
                "text-gray-700 hover:text-green-600 transition-colors text-lg font-medium",
                pathname === "/editor" && "text-green-600 font-semibold",
              )}
            >
              Editor
            </Link>
            <Button onClick={() => signOut()} variant="outline" className="ml-4">
              Logga ut
            </Button>
          </>
        ) : (
          <Link href="/login">
            <Button variant="outline" className="ml-4 bg-transparent">
              Logga in
            </Button>
          </Link>
        )}
      </nav>

      {/* Mobile Navigation */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[250px] sm:w-[300px] p-6">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-gray-800 hover:text-green-600 transition-colors text-xl font-medium",
                  pathname === item.href && "text-green-600 font-semibold",
                )}
              >
                {item.name}
              </Link>
            ))}
            {session?.user ? (
              <>
                <Link
                  href="/editor"
                  className={cn(
                    "text-gray-800 hover:text-green-600 transition-colors text-xl font-medium",
                    pathname === "/editor" && "text-green-600 font-semibold",
                  )}
                >
                  Editor
                </Link>
                <Button onClick={() => signOut()} variant="outline" className="mt-4">
                  Logga ut
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button variant="outline" className="mt-4 bg-transparent">
                  Logga in
                </Button>
              </Link>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
