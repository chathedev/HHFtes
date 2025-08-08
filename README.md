# On-site editor (protected)

This project includes an authenticated, on-site editor that’s fully opt-in and keeps the existing site unchanged.

How it works:
- /editor: Requires Cloudflare Access (middleware validates the CF-Access-Jwt-Assertion). If valid, it sets an HttpOnly cookie `edit=1` and enables Next.js draftMode so editors can preview changes without affecting the public cache [^3].
- /api/edit/*: Protected by Cloudflare Access. Commit endpoint opens a PR with changes under /content via the GitHub REST API.

Environment variables on Vercel:
- CF_TEAM_DOMAIN
- CF_ACCESS_AUD
- GITHUB_TOKEN
- GITHUB_OWNER
- GITHUB_REPO
- GIT_AUTHOR_NAME
- GIT_AUTHOR_EMAIL

Optional floating “Edit” pill:
- Import and mount `<EditGate />` where you want it visible (e.g., in app/layout.tsx). It only renders when the `edit=1` cookie exists.
- Use `<EditableField filePath="content/home.json" field="heroTitle" />` to make fields inline-editable when edit mode is on.

Security:
- Middleware validates CF Access only for /editor and /api/edit/*; no changes to the rest of the app [^5].
- Only allows writes under /content and validates inputs.
- Draft Mode is limited to /editor, keeping public pages static [^1][^3].

[^1]: https://nextjs.org/docs/app/guides/data-security  
[^3]: https://nextjs.org/docs/app/api-reference/functions/draft-mode  
[^5]: https://nextjs.org/docs/app/api-reference/file-conventions/middleware
