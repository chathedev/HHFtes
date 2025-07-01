import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

/**
 * A very small NextAuth configuration that authenticates via a single
 * password stored in the `API_SECRET` env-var.
 *
 * We expose `signIn` and `signOut` so the rest of the codebase can import
 * them directly from "@/auth".
 */
export const {
  auth, // Server-side helper (e.g. in route handlers)
  signIn, // ⬅️  required named export
  signOut, // ⬅️  required named export
  handlers: { GET, POST },
} = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials?.password === process.env.API_SECRET) {
          return { id: "admin" } // return a user object on success
        }
        return null
      },
    }),
  ],
  session: { strategy: "jwt" },
})
