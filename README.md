# HHF

*Automatically synced with your [v0.dev](https://v0.dev) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/challe-ws-projects/v0-hhf)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/boGcJCfXMAI)

## Overview

This repository will stay in sync with your deployed chats on [v0.dev](https://v0.dev).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.dev](https://v0.dev).

## Deployment

Your project is live at:

**[https://vercel.com/challe-ws-projects/v0-hhf](https://vercel.com/challe-ws-projects/v0-hhf)**

## Build your app

Continue building your app on:

**[https://v0.dev/chat/projects/boGcJCfXMAI](https://v0.dev/chat/projects/boGcJCfXMAI)**

---

## On-site editor

This project includes an authenticated, on-site editor that’s disabled by default. It uses Cloudflare Access, an HttpOnly cookie, and a protected PR flow to GitHub. Public visitors never see edit UI.

### 1) Prerequisites

- Next.js App Router (already in this repo)
- Vercel deployment
- GitHub repo connected to Vercel

### 2) Environment variables (Vercel → Project Settings → Environment Variables)

- CF_ACCESS_AUD
- CF_TEAM_DOMAIN
- GITHUB_TOKEN (repo scope)
- GITHUB_OWNER
- GITHUB_REPO
- GIT_AUTHOR_NAME
- GIT_AUTHOR_EMAIL

### 3) Cloudflare Access

Protect these paths behind Cloudflare Access (SaaS app or self-hosted):
- `/editor`
- `/api/edit/*`

The middleware validates `CF-Access-Jwt-Assertion` for those paths only.

### 4) Enabling edit mode

Visit `/editor` with a valid Cloudflare Access session. The page:
- Verifies your token
- Sets `edit=1` cookie (`HttpOnly; Secure; SameSite=Strict; Max-Age=3600`)
- Enables Next.js `draftMode` for previewing changes
- Shows a confirmation message

Close the tab and browse the site.

### 5) Optional: show the Edit pill

To show the small “Edit” pill for editors, mount the gate and provider where you want (e.g. in `app/layout.tsx`). This is optional and off by default.

\`\`\`tsx
// app/layout.tsx (example snippet – do NOT copy blindly to production)
/*
import { TinaProvider, TinaSidebar } from "@/tina/config"
import { EditGate } from "@/components/edit-gate"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv">
      <body>
        <TinaProvider>
          <EditGate />
          <TinaSidebar />
          {children}
        </TinaProvider>
      </body>
    </html>
  )
}
*/
\`\`\`

### 6) Make a field editable

Use `EditableField` to bind UI to a file in `/content`.

\`\`\`tsx
// Example (do not ship this change directly – opt in where needed):
// <EditableField filePath="content/home.json" field="heroTitle" fallback="Hej Härnösand!" />
\`\`\`

When the `edit` cookie exists and the sidebar is open, the field becomes inline-editable.

### 7) Draft preview

- On `/editor`, `draftMode()` is enabled.
- Public pages remain unchanged for regular visitors.

### 8) Publish (open PR)

Send a POST request to `/api/edit/commit` with changed file contents to open a PR:

\`\`\`
POST /api/edit/commit
{
  "changes": [
    { "filePath": "content/home.json", "content": "{ \"heroTitle\": \"Hello\" }" }
  ]
}
\`\`\`

Requirements:
- Valid Cloudflare Access token
- `edit=1` cookie present
- Paths must be under `content/`

A PR titled “Site edits from /editor” is created against your default branch.

### 9) Disable edit mode

- Wait for cookie expiry (60 min), or
- Manually delete the `edit` cookie from the browser
