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

## On-site editor (protected)

This project includes an optional, protected on-site editor that’s disabled by default. It keeps the site fully backward-compatible and does not change existing routes, except for the new `/editor` entry point and `/api/edit/*` endpoints.

### Prerequisites

1. Put Cloudflare Access in front of:
   - `/editor`
   - `/api/edit/*`
2. Add these environment variables in Vercel Project Settings:
   - `CF_TEAM_DOMAIN` (e.g. `myteam` for `https://myteam.cloudflareaccess.com`)
   - `CF_ACCESS_AUD` (the audience tag of your CF Access app)
   - `GITHUB_TOKEN` (repo scope)
   - `GITHUB_OWNER`
   - `GITHUB_REPO`
   - `GIT_AUTHOR_NAME`
   - `GIT_AUTHOR_EMAIL`

### How it works

- Visit `/editor` with a valid CF Access token → we verify the `CF-Access-Jwt-Assertion`, set an HttpOnly cookie `edit=1` for 1 hour, and enable Next.js `draftMode`. [^1][^5]
- Public pages remain unchanged. No editor UI appears unless the `edit=1` cookie exists.
- POST `/api/edit/commit` creates a branch and Pull Request with your changes under `/content` using the GitHub REST API.

### Add the floating Edit pill (optional)

Mount the pill only on pages/layouts where you want it:

\`\`\`tsx
// app/layout.tsx (example only — do not enable globally unless desired)
{/* <EditGate /> */}
\`\`\`

Import: `import { EditGate } from '@/components/edit-gate'`

### Make a field editable (opt-in)

Replace a static string with:

\`\`\`tsx
{/* <EditableField filePath="content/home.json" field="heroTitle" fallback="My Title" /> */}
\`\`\`

This shows static text for the public. With the `edit` cookie and the sidebar toggled, it turns into an inline input.

### Publish (open PR)

Send a POST to `/api/edit/commit`:

\`\`\`bash
curl -X POST /api/edit/commit \
  -H "CF-Access-Jwt-Assertion: <token>" \
  -H "Content-Type: application/json" \
  -d '{"changes":[{"filePath":"content/home.json","content":"{\"heroTitle\":\"Hej\"}"}]}'
\`\`\`

Response: `{ "ok": true, "url": "https://github.com/OWNER/REPO/pull/123" }`

### Disable edit mode

Delete the `edit` cookie (or wait for it to expire).

### Security

- `/editor` and `/api/edit/*` validate the Cloudflare Access token. If missing/invalid → 401. [^5]
- Commits require both a valid token and the `edit=1` cookie.
- Only paths under `/content` are allowed and directory traversal is blocked.
- Requests are size-limited and validated with zod.
- Draft mode is limited to `/editor`, so public traffic is unaffected. [^1]

[^1]: [Next.js Draft Mode](https://nextjs.org/docs/app/build-reference/functions/get-draft-mode)
[^5]: [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/identity/)
