/**
 * Ultra-light auth helpers. In a real application you’d integrate Supabase
 * or NextAuth. Here we just stub the required exports so the build passes.
 */
"use server"

type Credentials = { email: string; password: string }

/* Simulated auth state held in memory (DO NOT USE IN PRODUCTION) */
let signedIn = false

export async function signIn({ email, password }: Credentials): Promise<boolean> {
  // Very naive check – any non-empty credentials are accepted
  if (email && password) {
    signedIn = true
    return true
  }
  return false
}

export async function signOut(): Promise<void> {
  signedIn = false
}

export async function authenticate(): Promise<boolean> {
  return signedIn
}
