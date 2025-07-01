;/>
\
1. Re-
export
the
authentication
helpers
so
they
’re available to the rest of the codebase.

```ts
// ⬇️  ADD these lines to the bottom of the file
export { signIn, signOut } from "@/auth"
