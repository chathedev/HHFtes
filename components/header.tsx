"use client"

import Image from "next/image"
import Link from "next/link"
import { MenuIcon } from "lucide-react"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation" // Import usePathname
import { cn } from "@/lib/utils" // Import cn utility

/**
 * Top navigation bar for the entire site.
 *
 * • Named export  : Header
 * • Default export: Header  (for legacy imports)
 */
export function Header() {
  const pathname = usePathname() // Get current pathname

  const navLinks = [
    { href: "/", label: "Hem" },
    { href: "/lag", label: "Lag" },
    { href: "/matcher", label: "Matcher" },
    { href: "/kalender", label: "Kalender" },
    { href: "/nyheter", label: "Nyheter" },
    { href: "/partners", label: "Partners" },
    { href: "/kontakt", label: "Kontakt" },
    { href: "/editor", label: "Redigerare" }, // Added editor link
  ]

  return (
    <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6 bg-white dark:bg-gray-950 shadow-sm">
      <Link href="/" className="mr-6 flex items-center" prefetch={false}>
        <Image src="/logo.png" alt="Härnösands HF Logo" width={50} height={50} className="h-12 w-12" />
        <span className="sr-only">Härnösands HF</span>
      </Link>
      <nav className="hidden md:flex gap-6 lg:gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "text-lg font-medium transition-colors hover:text-primary",
              pathname === link.href ? "text-primary" : "text-gray-600 dark:text-gray-400",
            )}
            prefetch={false}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="ml-auto md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col gap-6 pt-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-lg font-medium hover:text-primary",
                    pathname === link.href ? "text-primary" : "text-gray-800 dark:text-gray-200",
                  )}
                  prefetch={false}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

// Allow `import Header from "@/components/header"`
export default Header
