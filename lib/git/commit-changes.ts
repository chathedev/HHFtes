import { Octokit } from "octokit"

type Change = { filePath: string; content: string }

const OWNER = process.env.GITHUB_OWNER!
const REPO = process.env.GITHUB_REPO!
const TOKEN = process.env.GITHUB_TOKEN!
const AUTHOR_NAME = process.env.GIT_AUTHOR_NAME || "Site Editor Bot"
const AUTHOR_EMAIL = process.env.GIT_AUTHOR_EMAIL || "noreply@example.com"

/**
 * Creates a branch, commits file changes under /content, and opens a PR.
 * Returns the PR URL.
 */
export async function commitChanges(changes: Change[]): Promise<string> {
  if (!OWNER || !REPO || !TOKEN) {
    throw new Error("Missing GitHub configuration environment variables")
  }

  const octokit = new Octokit({ auth: TOKEN })

  // Get default branch
  const { data: repo } = await octokit.rest.repos.get({ owner: OWNER, repo: REPO })
  const baseBranch = repo.default_branch

  // Get base SHA
  const { data: ref } = await octokit.rest.git.getRef({
    owner: OWNER,
    repo: REPO,
    ref: `heads/${baseBranch}`,
  })
  const baseSha = ref.object.sha

  const branch = `edit-${Date.now()}`
  // Create new branch ref from base
  await octokit.rest.git.createRef({
    owner: OWNER,
    repo: REPO,
    ref: `refs/heads/${branch}`,
    sha: baseSha,
  })

  // Commit files one-by-one (simpler than building a tree); okay for small edits.
  for (const ch of changes) {
    const path = ch.filePath.replace(/^\/+/, "")
    const contentB64 = Buffer.from(ch.content, "utf8").toString("base64")

    // Use PUT /contents to create/update a file on the branch.
    await octokit.rest.repos.createOrUpdateFileContents({
      owner: OWNER,
      repo: REPO,
      path,
      message: `chore(editor): update ${path}`,
      content: contentB64,
      branch,
      committer: { name: AUTHOR_NAME, email: AUTHOR_EMAIL },
      author: { name: AUTHOR_NAME, email: AUTHOR_EMAIL },
    })
  }

  // Open PR
  const { data: pr } = await octokit.rest.pulls.create({
    owner: OWNER,
    repo: REPO,
    head: branch,
    base: baseBranch,
    title: "Site edits from /editor",
    body:
      "This PR was opened automatically from the on-site editor. Review the changes under /content and merge to publish.",
  })

  return pr.html_url
}
