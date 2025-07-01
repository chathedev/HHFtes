/**
 * Ultra-light auth helpers. In a real application you’d integrate Supabase
 * or NextAuth. Here we just stub the required exports so the build passes.
 */
"use server"

type Credentials = { email: string; password: string }

/* Simulated auth state held in memory (DO NOT USE IN PRODUCTION) */
let signedIn = false

export async function signIn(email: string, password: string): Promise<boolean> {
  // TODO: swap this mock for a real sign-in flow.
  console.log("🟢  signIn()", { email })
  return true
}

export async function signOut(): Promise<void> {
  // TODO: swap this mock for a real sign-out flow.
  console.log("🟡  signOut()")
  signedIn = false
}

export async function authenticate(formData: FormData): Promise<{ success: boolean }> {
  const email = formData.get("email") as string | null
  const password = formData.get("password") as string | null
  if (!email || !password) {
    return { success: false }
  }
  const ok = await signIn(email, password)
  return { success: ok }
}
