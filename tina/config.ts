'use client'

import React, { createContext, useContext, useMemo, useState } from 'react'

type TinaContextType = {
  sidebarOpen: boolean
  toggle: () => void
}

const TinaContext = createContext<TinaContextType | null>(null)

/**
 * Minimal "Tina" provider to coordinate sidebar open state between EditGate
 * and inline EditableField controls. No external deps.
 */
export function TinaProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const value = useMemo(
    () => ({
      sidebarOpen: open,
      toggle: () => setOpen((v) => !v),
    }),
    [open]
  )
  return <TinaContext.Provider value={value}>{children}</TinaContext.Provider>
}

export function useTina() {
  const ctx = useContext(TinaContext)
  return ctx ?? { sidebarOpen: false, toggle: () => {} }
}

// Example content collections mapping (for reference)
export const collections = [
  {
    name: 'home',
    label: 'Home',
    path: 'content',
    files: [
      {
        name: 'home',
        label: 'Home Content',
        file: 'content/home.json',
        fields: [
          { name: 'heroTitle', label: 'Hero Title', type: 'string' },
          { name: 'heroSubtitle', label: 'Hero Subtitle', type: 'string' },
          { name: 'ctaText', label: 'CTA Text', type: 'string' },
        ],
      },
    ],
  },
]
