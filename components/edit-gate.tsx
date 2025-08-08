'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

export function EditGate() {
  const [hasEdit, setHasEdit] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const present = document.cookie.split('; ').some((c) => c.startsWith('edit=1'))
    setHasEdit(present)
  }, [])

  if (!hasEdit) return null

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          'fixed bottom-4 right-4 z-50 rounded-full bg-black text-white',
          'px-4 py-2 text-sm shadow-lg transition hover:scale-[1.02]'
        )}
        aria-label="Open editor"
      >
        Edit
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-[360px] p-0">
          <div className="p-4 border-b">
            <SheetHeader>
              <SheetTitle>Redigeringsläge</SheetTitle>
            </SheetHeader>
          </div>
          <div className="p-4 space-y-3 text-sm">
            <p className="text-muted-foreground">
              Med redigeringsläget aktiverat kan du klicka på fält som är
              markerade som redigerbara och spara dina ändringar lokalt.
            </p>
            <p className="text-muted-foreground">
              Publicering görs via ett Pull Request till GitHub.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('tina:toggle'))
              }}
            >
              Visa/Dölj redigerbara fält
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
