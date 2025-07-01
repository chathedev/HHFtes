"use server"

type Credentials = { email: string; password: string }

/* In-memory “auth” (for demo only!) */
let signedIn = false

export async function signIn(email: string, password: string): Promise<boolean> {
  signedIn = Boolean(email && password)
  return signedIn
}

export async function signOut(): Promise<void> {
  signedIn = false
}

export async function authenticate(_form: FormData | Credentials): Promise<{ success: boolean }> {
  return { success: signedIn }
}
