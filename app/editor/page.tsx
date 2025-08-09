"use client"

import type React from "react"

import { useEffect, useMemo, useRef, useState } from "react"

// Hardcoded editor login (per request)
const ALLOWED_EMAIL = "harnosandshf@wby.se"
const ALLOWED_PASSWORD = "harnosandshf10!"
const AUTH_KEY = "editor-auth"

// Public GitHub repo metadata (safe for client)
// Also used to build the RAW URL to avoid 404 from a wrong repo/branch.
const OWNER = (typeof process !== "undefined" && (process as any).env?.NEXT_PUBLIC_GITHUB_OWNER) || "chathedev"
const REPO = (typeof process !== "undefined" && (process as any).env?.NEXT_PUBLIC_GITHUB_REPO) || "HHFNAFN"
const BRANCH = (typeof process !== "undefined" && (process as any).env?.NEXT_PUBLIC_GITHUB_BRANCH) || "main"

// Load source JSON (fixed: build from OWNER/REPO/BRANCH to avoid 404)
const RAW_URL = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/content/home.json`

// Token is NOT read from env to avoid exposing secrets. User pastes a fine-grained PAT at runtime.
const TOKEN_STORAGE_KEY = "editor.github.token"

type HomeData = {
  heroTitle: string
  heroSubtitle: string
  ctaText: string
  heroImage: string // URL
  partners: { name: string; logoUrl: string }[]
}

type ValidationErrors = Record<string, string>

function isHttpsUrl(url: string) {
  return /^https:\/\/.+/i.test(url.trim())
}

function encodeToBase64Utf8(str: string) {
  // Safe base64 for UTF-8 strings in browsers
  return btoa(unescape(encodeURIComponent(str)))
}

export default function EditorPage() {
  // Auth
  const [authed, setAuthed] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState<string | null>(null)
  useEffect(() => {
    const stored = sessionStorage.getItem(AUTH_KEY)
    setAuthed(stored === "1")
  }, [])
  const onLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim().toLowerCase() === ALLOWED_EMAIL && password === ALLOWED_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, "1")
      setAuthed(true)
      setLoginError(null)
    } else {
      setLoginError("Invalid credentials. Please try again.")
    }
  }
  const onLogout = () => {
    sessionStorage.removeItem(AUTH_KEY)
    setAuthed(false)
  }

  // Data + UI state
  const [data, setData] = useState<HomeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [publishing, setPublishing] = useState(false)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const hasErrors = useMemo(() => Object.keys(validationErrors).length > 0, [validationErrors])

  // Simple toast
  const [toast, setToast] = useState<{ message: string; href?: string } | null>(null)
  const showToast = (t: { message: string; href?: string }) => {
    setToast(t)
    setTimeout(() => setToast(null), 6000)
  }

  // Runtime GitHub token (user-supplied)
  const [gitHubToken, setGitHubToken] = useState<string>("")
  useEffect(() => {
    const saved = sessionStorage.getItem(TOKEN_STORAGE_KEY)
    if (saved) setGitHubToken(saved)
  }, [])
  const saveToken = (t: string) => {
    setGitHubToken(t)
    sessionStorage.setItem(TOKEN_STORAGE_KEY, t)
  }
  const clearToken = () => {
    setGitHubToken("")
    sessionStorage.removeItem(TOKEN_STORAGE_KEY)
  }

  // Inline edit states for hero text
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingSubtitle, setIsEditingSubtitle] = useState(false)
  const [isEditingCTA, setIsEditingCTA] = useState(false)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLButtonElement>(null)
  const titleDraft = useRef<string>("")
  const subtitleDraft = useRef<string>("")
  const ctaDraft = useRef<string>("")

  // Hero image popover
  const [imagePopoverOpen, setImagePopoverOpen] = useState(false)
  const [imagePopoverPos, setImagePopoverPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const imageInputRef = useRef<HTMLInputElement>(null)

  // Partner logo popover
  const [partnerLogoEdit, setPartnerLogoEdit] = useState<{ index: number; x: number; y: number } | null>(null)
  const partnerLogoInputRef = useRef<HTMLInputElement>(null)

  // Load data on mount (fixed RAW_URL)
  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(RAW_URL, { cache: "no-store" })
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
      const json: HomeData = await res.json()
      setData(json)
    } catch (e: any) {
      setError(`Failed to load data: ${e?.message || "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => void fetchData(), [])

  // Validation
  const validate = () => {
    const errs: ValidationErrors = {}
    if (!data) {
      setValidationErrors(errs)
      return errs
    }
    if (!data.heroTitle.trim()) errs.heroTitle = "Hero title cannot be empty."
    if (!data.ctaText.trim()) errs.ctaText = "CTA text cannot be empty."
    if (!data.heroImage.trim()) errs.heroImage = "Hero image URL cannot be empty."
    else if (!isHttpsUrl(data.heroImage)) errs.heroImage = "Hero image URL must start with https://"

    data.partners.forEach((p, i) => {
      if (!p.name.trim()) errs[`partners.${i}.name`] = "Partner name cannot be empty."
      if (!p.logoUrl.trim()) errs[`partners.${i}.logoUrl`] = "Logo URL cannot be empty."
      else if (!isHttpsUrl(p.logoUrl)) errs[`partners.${i}.logoUrl`] = "Logo URL must start with https://"
    })

    setValidationErrors(errs)
    return errs
  }

  // Publish via GitHub Contents API using user-supplied token
  const handlePublish = async () => {
    if (!data) return
    const errs = validate()
    if (Object.keys(errs).length > 0) return

    if (!gitHubToken) {
      showToast({ message: "Please set a GitHub token in the left panel before publishing." })
      return
    }

    setPublishing(true)
    try {
      // Get SHA
      const getRes = await fetch(
        `https://api.github.com/repos/${OWNER}/${REPO}/contents/content/home.json?ref=${BRANCH}`,
        {
          headers: {
            Authorization: `Bearer ${gitHubToken}`,
            Accept: "application/vnd.github+json",
          },
        },
      )
      if (!getRes.ok) throw new Error(`GET file failed: ${getRes.status} ${getRes.statusText}`)
      const fileInfo = await getRes.json()
      const sha = fileInfo?.sha
      if (!sha) throw new Error("Could not read file sha from GitHub response.")

      // Update
      const pretty = JSON.stringify(data, null, 2)
      const content = encodeToBase64Utf8(pretty)

      const putRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/content/home.json`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${gitHubToken}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Editor changes from /editor",
          content,
          sha,
          branch: BRANCH,
        }),
      })

      if (!putRes.ok) throw new Error(`PUT update failed: ${putRes.status} ${putRes.statusText}`)
      const result = await putRes.json()
      const commitUrl: string | undefined = result?.commit?.html_url

      showToast({ message: "Changes published successfully.", href: commitUrl })
    } catch (e: any) {
      setError(e?.message || "Failed to publish changes.")
    } finally {
      setPublishing(false)
    }
  }

  // Reset: re-fetch from source
  const handleReset = () => {
    fetchData()
    setValidationErrors({})
  }

  // Editing helpers for hero text
  const startEdit = (type: "title" | "subtitle" | "cta") => {
    if (!data) return
    if (type === "title") {
      titleDraft.current = data.heroTitle
      setIsEditingTitle(true)
      setTimeout(() => titleRef.current?.focus(), 0)
    } else if (type === "subtitle") {
      subtitleDraft.current = data.heroSubtitle
      setIsEditingSubtitle(true)
      setTimeout(() => subtitleRef.current?.focus(), 0)
    } else {
      ctaDraft.current = data.ctaText
      setIsEditingCTA(true)
      setTimeout(() => ctaRef.current?.focus(), 0)
    }
  }
  const onKeyDownEditable = (e: React.KeyboardEvent<HTMLElement>, type: "title" | "subtitle" | "cta") => {
    if (e.key === "Enter") {
      e.preventDefault()
      ;(e.target as HTMLElement).blur()
    } else if (e.key === "Escape") {
      if (type === "title") {
        if (titleRef.current) titleRef.current.textContent = titleDraft.current
        setIsEditingTitle(false)
      } else if (type === "subtitle") {
        if (subtitleRef.current) subtitleRef.current.textContent = subtitleDraft.current
        setIsEditingSubtitle(false)
      } else {
        if (ctaRef.current) ctaRef.current.textContent = ctaDraft.current
        setIsEditingCTA(false)
      }
    }
  }
  const onBlurEditable = (e: React.FocusEvent<HTMLElement>, type: "title" | "subtitle" | "cta") => {
    if (!data) return
    const text = e.currentTarget.textContent ?? ""
    if (type === "title") {
      setData({ ...data, heroTitle: text })
      setIsEditingTitle(false)
    } else if (type === "subtitle") {
      setData({ ...data, heroSubtitle: text })
      setIsEditingSubtitle(false)
    } else {
      setData({ ...data, ctaText: text })
      setIsEditingCTA(false)
    }
  }

  // Hero image popover
  const openImagePopover = (e: React.MouseEvent) => {
    setImagePopoverPos({ x: e.clientX, y: e.clientY })
    setImagePopoverOpen(true)
    setTimeout(() => imageInputRef.current?.focus(), 0)
  }
  const updateHeroImage = (url: string) => {
    if (!data) return
    setData({ ...data, heroImage: url })
  }

  // Partners
  const addPartner = () => {
    if (!data) return
    setData({
      ...data,
      partners: [...data.partners, { name: "New Partner", logoUrl: "https://via.placeholder.com/200x80?text=Logo" }],
    })
  }
  const removePartner = (index: number) => {
    if (!data) return
    const next = [...data.partners]
    next.splice(index, 1)
    setData({ ...data, partners: next })
  }

  const startEditPartnerName = (index: number) => {
    const el = document.getElementById(`partner-name-${index}`) as HTMLParagraphElement | null
    if (el) {
      ;(el as any).__draft = el.textContent || ""
      el.contentEditable = "true"
      el.focus()
    }
  }
  const onKeyDownPartnerName = (e: React.KeyboardEvent<HTMLParagraphElement>, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault()
      e.currentTarget.blur()
    } else if (e.key === "Escape") {
      const draft = (e.currentTarget as any).__draft as string
      e.currentTarget.textContent = draft
      e.currentTarget.blur()
    }
  }
  const onBlurPartnerName = (e: React.FocusEvent<HTMLParagraphElement>, index: number) => {
    const name = e.currentTarget.textContent || ""
    e.currentTarget.contentEditable = "false"
    if (!data) return
    const next = [...data.partners]
    next[index] = { ...next[index], name }
    setData({ ...data, partners: next })
  }

  const openPartnerLogoPopover = (index: number, e: React.MouseEvent) => {
    setPartnerLogoEdit({ index, x: e.clientX, y: e.clientY })
    setTimeout(() => partnerLogoInputRef.current?.focus(), 0)
  }
  const updatePartnerLogo = (index: number, logoUrl: string) => {
    if (!data) return
    const next = [...data.partners]
    next[index] = { ...next[index], logoUrl }
    setData({ ...data, partners: next })
  }

  // If not authenticated, show inline login (only at /editor)
  if (!authed) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-semibold text-center">Editor Login</h1>
          <p className="mt-1 text-sm text-gray-600 text-center">Enter your email and password to continue.</p>
          <form className="mt-6 space-y-4" onSubmit={onLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            {loginError && <p className="text-sm text-red-600">{loginError}</p>}
            <button
              type="submit"
              className="w-full rounded bg-blue-600 hover:bg-blue-700 text-white py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-xs text-gray-500 text-center">
            This login is only used to access the editor. No external services required.
          </p>
        </div>
      </main>
    )
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="h-28 bg-white rounded shadow animate-pulse" />
            <div className="h-56 bg-white rounded shadow animate-pulse" />
          </div>
          <div className="md:col-span-2 h-[28rem] bg-white rounded shadow animate-pulse" />
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto p-4">
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
            <p className="font-medium">Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
          <button
            onClick={() => {
              setError(null)
              fetchData()
            }}
            className="mt-4 inline-flex items-center rounded bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER REMOVED AS REQUESTED */}

      {/* Split layout */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left tools */}
        <aside className="space-y-6">
          <section className="bg-white rounded shadow p-4">
            <h2 className="font-medium mb-3">Actions</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={validate}
                className="inline-flex items-center rounded bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
              >
                Validate
              </button>
              <button
                onClick={handleReset}
                className="inline-flex items-center rounded bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600"
              >
                Reset
              </button>
              <button
                onClick={handlePublish}
                disabled={publishing}
                className={`inline-flex items-center rounded ${
                  publishing ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
                } text-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 disabled:cursor-not-allowed`}
              >
                {publishing ? "Publishing..." : "Publish"}
              </button>
              <button
                onClick={onLogout}
                className="inline-flex items-center rounded bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
              >
                Logout
              </button>
            </div>
          </section>

          <section className="bg-white rounded shadow p-4">
            <h2 className="font-medium mb-3">GitHub token</h2>
            <p className="text-xs text-gray-600 mb-2">
              Paste a fine‑grained PAT with contents read/write for {OWNER}/{REPO}. Stored only in your browser session.
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                value={gitHubToken}
                onChange={(e) => saveToken(e.target.value)}
                placeholder="ghp_..."
                className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                aria-label="GitHub token"
              />
              <button
                onClick={clearToken}
                className="rounded bg-gray-200 hover:bg-gray-300 px-3 py-2 text-sm"
                type="button"
              >
                Clear
              </button>
            </div>
          </section>

          <section className="bg-white rounded shadow p-4">
            <h2 className="font-medium mb-3">Hero image</h2>
            <label htmlFor="heroImageInput" className="block text-sm text-gray-700">
              Image URL
            </label>
            <input
              id="heroImageInput"
              type="text"
              value={data.heroImage}
              onChange={(e) => updateHeroImage(e.target.value)}
              className={`mt-1 w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                validationErrors.heroImage ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="https://example.com/image.jpg"
            />
            {validationErrors.heroImage && <p className="mt-2 text-xs text-red-600">{validationErrors.heroImage}</p>}
            <p className="mt-2 text-xs text-gray-500">Tip: Click the hero image in the preview to edit inline.</p>
          </section>

          <section className="bg-white rounded shadow p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">Partners</h2>
              <button
                onClick={addPartner}
                className="text-xs inline-flex items-center rounded bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
              >
                + Add partner
              </button>
            </div>
            <div className="mt-3 space-y-2">
              <button
                onClick={() => {
                  if (data.partners.length > 0) removePartner(data.partners.length - 1)
                }}
                className="w-full text-xs inline-flex items-center justify-center rounded bg-red-600 hover:bg-red-700 text-white px-2 py-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
              >
                Remove last partner
              </button>
            </div>
          </section>

          {hasErrors && (
            <section className="bg-red-50 border border-red-200 rounded p-4">
              <h3 className="font-medium text-red-800">Validation</h3>
              <ul className="mt-2 list-disc list-inside text-sm text-red-700 space-y-1">
                {Object.entries(validationErrors).map(([k, v]) => (
                  <li key={k}>
                    <span className="font-mono">{k}</span>: {v}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>

        {/* Right live preview (primary) */}
        <main className="md:col-span-2">
          <div className="bg-white rounded shadow overflow-hidden">
            {/* Hero */}
            <div
              className="relative h-80 sm:h-96 bg-gray-200 bg-center bg-cover cursor-pointer"
              style={{ backgroundImage: `url('${data.heroImage}')` }}
              onClick={(e) => openImagePopover(e)}
              role="button"
              aria-label="Edit hero image URL"
            >
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white px-4">
                <h2
                  ref={titleRef}
                  className={`text-3xl sm:text-4xl font-bold text-center outline-none rounded ${
                    validationErrors.heroTitle ? "ring-2 ring-red-500" : ""
                  }`}
                  contentEditable={isEditingTitle}
                  suppressContentEditableWarning
                  onDoubleClick={() => startEdit("title")}
                  onKeyDown={(e) => onKeyDownEditable(e, "title")}
                  onBlur={(e) => onBlurEditable(e, "title")}
                  tabIndex={0}
                >
                  {data.heroTitle}
                </h2>

                <p
                  ref={subtitleRef}
                  className="mt-3 text-lg sm:text-xl text-center max-w-3xl outline-none rounded"
                  contentEditable={isEditingSubtitle}
                  suppressContentEditableWarning
                  onDoubleClick={() => startEdit("subtitle")}
                  onKeyDown={(e) => onKeyDownEditable(e, "subtitle")}
                  onBlur={(e) => onBlurEditable(e, "subtitle")}
                  tabIndex={0}
                >
                  {data.heroSubtitle}
                </p>

                <button
                  ref={ctaRef}
                  className={`mt-6 inline-flex items-center rounded bg-blue-600 hover:bg-blue-700 px-5 py-3 text-white font-medium outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 ${
                    validationErrors.ctaText ? "ring-2 ring-red-500 focus:ring-red-500" : ""
                  }`}
                  contentEditable={isEditingCTA}
                  suppressContentEditableWarning
                  onDoubleClick={() => startEdit("cta")}
                  onKeyDown={(e) => onKeyDownEditable(e as any, "cta")}
                  onBlur={(e) => onBlurEditable(e as any, "cta")}
                >
                  {data.ctaText}
                </button>
              </div>
            </div>

            {/* Partners */}
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Our Partners</h3>
                <button
                  onClick={addPartner}
                  className="text-xs inline-flex items-center rounded bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
                >
                  + Add partner
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {data.partners.map((p, i) => (
                  <div key={`${p.name}-${i}`} className="relative border rounded p-3 flex flex-col items-center">
                    <img
                      src={p.logoUrl || "/placeholder.svg"}
                      alt={p.name}
                      className={`h-16 object-contain cursor-pointer ${
                        validationErrors[`partners.${i}.logoUrl`] ? "outline outline-2 outline-red-500" : ""
                      }`}
                      onClick={(e) => openPartnerLogoPopover(i, e)}
                    />
                    <p
                      id={`partner-name-${i}`}
                      className={`mt-2 text-sm text-center outline-none rounded ${
                        validationErrors[`partners.${i}.name`] ? "ring-2 ring-red-500" : ""
                      }`}
                      onDoubleClick={() => startEditPartnerName(i)}
                      onKeyDown={(e) => onKeyDownPartnerName(e, i)}
                      onBlur={(e) => onBlurPartnerName(e, i)}
                      tabIndex={0}
                    >
                      {p.name}
                    </p>
                    <button
                      onClick={() => removePartner(i)}
                      className="absolute top-2 right-2 text-xs rounded bg-red-600 hover:bg-red-700 text-white px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
                      aria-label={`Remove partner ${p.name}`}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Hero image popover */}
      {imagePopoverOpen && (
        <>
          <div
            className="fixed z-30 bg-white shadow-lg border rounded p-3 w-72"
            style={{
              top: imagePopoverPos.y,
              left: imagePopoverPos.x,
              transform: "translate(-50%, -110%)",
            }}
          >
            <label htmlFor="heroImagePopover" className="block text-sm text-gray-700 mb-1">
              Hero Image URL
            </label>
            <input
              id="heroImagePopover"
              ref={imageInputRef}
              type="text"
              value={data.heroImage}
              onChange={(e) => updateHeroImage(e.target.value)}
              className={`w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                validationErrors.heroImage ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="https://..."
            />
            <div className="mt-2 flex justify-end gap-2">
              <button
                onClick={() => setImagePopoverOpen(false)}
                className="text-sm rounded bg-gray-200 hover:bg-gray-300 px-3 py-1"
              >
                Close
              </button>
            </div>
          </div>
          <div className="fixed inset-0 z-20" onClick={() => setImagePopoverOpen(false)} aria-hidden="true" />
        </>
      )}

      {/* Partner logo popover */}
      {partnerLogoEdit && (
        <>
          <div
            className="fixed z-30 bg-white shadow-lg border rounded p-3 w-80"
            style={{
              top: partnerLogoEdit.y,
              left: partnerLogoEdit.x,
              transform: "translate(-50%, -110%)",
            }}
          >
            <label htmlFor="partnerLogoUrl" className="block text-sm text-gray-700 mb-1">
              Partner Logo URL
            </label>
            <input
              id="partnerLogoUrl"
              ref={partnerLogoInputRef}
              type="text"
              value={data.partners[partnerLogoEdit.index]?.logoUrl || ""}
              onChange={(e) => updatePartnerLogo(partnerLogoEdit.index, e.target.value)}
              className={`w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                validationErrors[`partners.${partnerLogoEdit.index}.logoUrl`] ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="https://..."
            />
            <div className="mt-2 flex justify-end gap-2">
              <button
                onClick={() => setPartnerLogoEdit(null)}
                className="text-sm rounded bg-gray-200 hover:bg-gray-300 px-3 py-1"
              >
                Close
              </button>
            </div>
          </div>
          <div className="fixed inset-0 z-20" onClick={() => setPartnerLogoEdit(null)} aria-hidden="true" />
        </>
      )}

      {/* Simple toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-gray-900 text-white rounded shadow-lg px-4 py-3 max-w-sm">
          <p className="text-sm">{toast.message}</p>
          {toast.href && (
            <a
              href={toast.href}
              target="_blank"
              rel="noreferrer"
              className="text-xs underline text-blue-300 mt-1 inline-block"
            >
              View commit
            </a>
          )}
          <button
            onClick={() => setToast(null)}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white text-gray-900 text-xs"
            aria-label="Close toast"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}
