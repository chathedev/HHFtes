// GitHub PR helper using fetch (no Octokit dependency).
type Change = { filePath: string; content: string }

const GH = "https://api.github.com"

async function gh<T>(path: string, init: RequestInit = {}) {
  const token = process.env.GITHUB_TOKEN!
  const res = await fetch(`${GH}${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init.headers || {}),
    },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`GitHub ${res.status}: ${text}`)
  }
  return (await res.json()) as T
}

export async function openPullRequestWithChanges(changes: Change[]) {
  const owner = process.env.GITHUB_OWNER!
  const repo = process.env.GITHUB_REPO!
  const name = process.env.GIT_AUTHOR_NAME || "Site Editor"
  const email = process.env.GIT_AUTHOR_EMAIL || "site-editor@example.com"

  // default branch
  const repoInfo = await gh<{ default_branch: string }>(`/repos/${owner}/${repo}`)
  const base = repoInfo.default_branch

  // base SHA
  const ref = await gh<{ object: { sha: string } }>(`/repos/${owner}/${repo}/git/ref/heads/${base}`)
  const baseSha = ref.object.sha

  // new branch
  const branch = `edit-${Date.now()}`
  await gh(`/repos/${owner}/${repo}/git/refs`, {
    method: "POST",
    body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: baseSha }),
  })

  // commit each file via Contents API
  for (const ch of changes) {
    const contentB64 = Buffer.from(ch.content, "utf8").toString("base64")
    await gh(`/repos/${owner}/${repo}/contents/${encodeURIComponent(ch.filePath)}`, {
      method: "PUT",
      body: JSON.stringify({
        message: `chore(content): update ${ch.filePath}`,
        content: contentB64,
        branch,
        committer: { name, email },
        author: { name, email },
      }),
    })
  }

  // open PR
  const pr = await gh<{ html_url: string }>(`/repos/${owner}/${repo}/pulls`, {
    method: "POST",
    body: JSON.stringify({
      title: "Site edits from /editor",
      head: branch,
      base,
      body: "Edits submitted from the on-site editor. Merge to publish.",
    }),
  })
  return pr.html_url
}
