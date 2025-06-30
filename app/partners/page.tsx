import { Button } from "@/components/ui/button"
import { loadContent } from "@/lib/content-store"
import Image from "next/image"
import { partners } from "@/lib/partners-data"
import Footer from "@/components/Footer" // Declare the Footer component

export default async function PartnersPage() {
  const content = await loadContent()

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">{content.partnersPage.title}</h1>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  {content.partnersPage.description}
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              {partners.map((partner, index) => (
                <div key={index} className="flex flex-col items-center space-y-4">
                  <Image
                    alt={partner.name}
                    className="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center"
                    height="100"
                    src={partner.logo || "/placeholder.svg"}
                    width="200"
                    unoptimized // Use unoptimized for external images if you don't want Next.js Image optimization
                  />
                  <h3 className="text-xl font-bold">{partner.name}</h3>
                  <p className="text-center text-gray-500 dark:text-gray-400">{partner.description}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
              <Button
                className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                href={content.partnersPage.callToActionLink}
              >
                {content.partnersPage.callToActionLinkText}
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
