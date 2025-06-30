import { redirect } from "next/navigation"
import { isAuthenticatedServer } from "@/app/actions/auth"
import EditorClientPage from "./editor-client-page" // Import the new client component

export default async function EditorPageWrapper() {
  const isAuthenticated = await isAuthenticatedServer()

  if (!isAuthenticated) {
    redirect("/login")
  }

  // If authenticated, render the client-side editor component
  return <EditorClientPage />
}
