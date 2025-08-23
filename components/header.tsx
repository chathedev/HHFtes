"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Instagram, Facebook } from "lucide-react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Keep only the paths that will remain in the navigation
  const visiblePaths = ["/", "/nyheter", "/lag", "/kontakt", "/bli-medlem", "/kop-biljett"]

  if (!visiblePaths.includes(pathname)) {
    return null
  }

  const navLinks = [
    { name: "Hem", href: "/" },
    { name: "Nyheter", href: "/nyheter" },
    { name: "Lag", href: "/lag" },
    { name: "Köp biljett", href: "/kop-biljett" },
    { name: "Bli Medlem", href: "/bli-medlem" },
    { name: "Kontakt", href: "/kontakt" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 text-white shadow-lg transition-all duration-300
        ${
          pathname === "/"
            ? scrolled
              ? "bg-black/90 backdrop-blur-md"
              : "bg-transparent backdrop-blur-none"
            : "bg-black/90 backdrop-blur-md"
        }
      `}
    >
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-16 h-16">
            <Image
              src="/logo.png"
              alt="Härnösands HF Logo"
              fill
              className="object-contain"
              priority
              quality={100}
              sizes="56px"
            />
          </div>
          <div>
            <div className="font-bold text-lg">Härnösands HF</div>
          </div>
        </Link>

        {/* Mobile menu button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button className="md:hidden p-2" size="icon" variant="ghost" aria-label="Toggle navigation menu">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-black/90 text-white border-gray-800">
            <Link className="mr-6 flex items-center gap-3 py-4" href="/" onClick={() => setIsMenuOpen(false)}>
              <div className="relative w-14 h-14">
                <Image
                  src="/logo.png"
                  alt="Härnösands HF Logo"
                  fill
                  className="object-contain"
                  priority
                  quality={100}
                  sizes="48px"
                />
              </div>
              <span className="font-bold text-lg">Härnösands HF</span>
            </Link>
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-lg font-medium py-2
                    ${pathname === link.href ? "text-orange-500" : "text-white hover:text-gray-300"}
                  `}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6 ml-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative text-base font-medium py-2 group transition-colors duration-300
                ${pathname === link.href ? "text-orange-500" : "text-white hover:text-gray-300"}
              `}
            >
              {link.name}
              <span
                className={`absolute bottom-0 left-0 h-[3px] bg-orange-500 transition-all duration-300 ease-out
                  ${pathname === link.href ? "w-full" : "w-0 group-hover:w-full"}
                `}
              />
            </Link>
          ))}
          {/* Social links moved inside this flex container for right alignment */}
          <div className="flex items-center space-x-4">
            <Link href="https://www.instagram.com/harnosandshf/" target="_blank" rel="noopener noreferrer">
              <Instagram className="h-6 w-6 text-gray-400 hover:text-white" />
            </Link>
            <Link href="https://www.facebook.com/harnosandshf/" target="_blank" rel="noopener noreferrer">
              <Facebook className="h-6 w-6 text-gray-400 hover:text-white" />
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}

export { Header }
