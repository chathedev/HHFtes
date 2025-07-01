"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  setIsAuthenticated: (value: boolean) => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, you'd fetch a session from an API or check a secure cookie.
        // For this demo, we'll use a simple localStorage flag.
        // NOTE: This is NOT secure for production. For production, use NextAuth.js or similar.
        if (typeof window !== "undefined") {
          const storedAuth = localStorage.getItem("hhf_is_authenticated")
          if (storedAuth === "true") {
            setIsAuthenticated(true)
          }
        }
      } catch (error) {
        console.error("Auth check error:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Function to update localStorage when isAuthenticated changes
  useEffect(() => {
    if (typeof window !== "undefined" && !loading) {
      localStorage.setItem("hhf_is_authenticated", isAuthenticated.toString())
    }
  }, [isAuthenticated, loading])

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
