"use client"
import EditableKontaktPage from "./editable-page"
import { loadContent } from "@/lib/content-store"

export default async function KontaktPageWrapper() {
  const content = await loadContent()
  return <EditableKontaktPage content={content.kontaktPage} isEditing={false} />
}
