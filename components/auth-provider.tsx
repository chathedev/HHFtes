"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  setIsAuthenticated: (value: boolean) => void
  loading: boolean // Indicates if the client-side auth check is still loading (e.g., from localStorage)
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({
  children,
  initialIsAuthenticated,
}: {
  children: React.ReactNode
  initialIsAuthenticated: boolean
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(initialIsAuthenticated)
  const [loading, setLoading] = useState(false) // No longer loading from localStorage initially

  // Use localStorage for client-side persistence after the initial server render
  useEffect(() => {
    // Only update localStorage if the state changes from the initial server-provided state
    // or subsequent client-side interactions.
    localStorage.setItem("hhf_is_authenticated", isAuthenticated.toString())
  }, [isAuthenticated])

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, loading }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
