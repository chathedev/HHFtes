import 'server-only'

type Change = { filePath: string; content: string }

const GH_API = 'https://api.github.com'

async function gh<T>(path: string, init: RequestInit = {}) {
  const token = process.env.GITHUB_TOKEN!
  const res = await fetch(`${GH_API}${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
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
  const authorName = process.env.GIT_AUTHOR_NAME || 'Site Editor'
  const authorEmail = process.env.GIT_AUTHOR_EMAIL || 'site-editor@example.com'

  // Get default branch
  const repoInfo = await gh<{ default_branch: string }>(`/repos/${owner}/${repo}`)
  const base = repoInfo.default_branch

  // Base ref SHA
  const baseRef = await gh<{ object: { sha: string } }>(
    `/repos/${owner}/${repo}/git/ref/heads/${base}`
  )
  const baseSha = baseRef.object.sha

  // Create branch
  const branch = `edit-${Date.now()}`
  await gh(`/repos/${owner}/${repo}/git/refs`, {
    method: 'POST',
    body: JSON.stringify({
      ref: `refs/heads/${branch}`,
      sha: baseSha,
    }),
  })

  // Commit each file (GitHub will create individual commits)
  for (const ch of changes) {
    const contentB64 = Buffer.from(ch.content, 'utf8').toString('base64')
    await gh(`/repos/${owner}/${repo}/contents/${encodeURIComponent(ch.filePath)}`, {
      method: 'PUT',
      body: JSON.stringify({
        message: `chore(content): update ${ch.filePath}`,
        content: contentB64,
        branch,
        committer: { name: authorName, email: authorEmail },
        author: { name: authorName, email: authorEmail },
      }),
    })
  }

  // Open PR
  const pr = await gh<{ html_url: string }>(`/repos/${owner}/${repo}/pulls`, {
    method: 'POST',
    body: JSON.stringify({
      title: 'Site edits from /editor',
      head: branch,
      base,
      body:
        'Edits submitted from on-site editor. Please review and merge to publish.',
    }),
  })

  return pr.html_url
}
