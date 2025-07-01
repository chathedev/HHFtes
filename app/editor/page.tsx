"use client"

import dynamic from "next/dynamic"

/* Dynamically import the client bundle only on the browser. */
const EditorApp = dynamic(() => import("./editor-app"), { ssr: false })

export default function EditorPage() {
  return <EditorApp />
}
