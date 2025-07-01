"use server"

/**
 * Centralised authentication Server Actions.
 * We proxy through Next-Auth helpers so the rest of the app can
 * import everything from a single place.
 */

import { signIn, signOut } from "@/auth"

/**
 * authenticate – Server Action used by the login form (RSC `useFormState`).
 *
 * @param prevState  previous return value – not used here but required by the React API
 * @param formData   <form> payload containing `email` and `password`
 * @returns          undefined on success or a string error code on failure
 */
export async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    // Credentials provider will read `email` / `password` from the object
    await signIn("credentials", Object.fromEntries(formData))
    return undefined
  } catch (error) {
    // Bubble a short error code to the client component
    if ((error as Error).message?.includes("CredentialsSignin")) {
      return "CredentialsSignin"
    }
    throw error
  }
}

/**
 * Convenience wrapper for the sign-out flow so components can simply call
 * `logout()` instead of pulling in next-auth directly.
 */
export async function logout() {
  await signOut()
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Re-export helpers so other files can do                                 */
/*    import { signIn, signOut } from "app/actions/auth"                    */
/*  without reaching into "@/auth" directly.                                */
/* ────────────────────────────────────────────────────────────────────────── */
export { signIn, signOut }
