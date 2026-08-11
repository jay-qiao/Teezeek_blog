const OWNER = 'jay-qiao'
const REPO = 'Teezeek_blog'
const BRANCH = 'main'
const TOKEN_KEY = 'teezeek-admin-token'

export const REPO_INFO = {
  owner: OWNER,
  repo: REPO,
  branch: BRANCH,
  base: '/Teezeek_blog/'
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || ''
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, String(token || '').trim())
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function isConnected() {
  return Boolean(getToken())
}

export async function githubApi(path, options = {}) {
  const { method = 'GET', body, headers = {} } = options
  const response = await fetch(`https://api.github.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...headers
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  })
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`${response.status} ${text.slice(0, 240)}`)
  }
  if (response.status === 204) return null
  return response.json()
}

export function repoApi(path, options = {}) {
  return githubApi(`/repos/${OWNER}/${REPO}${path}`, options)
}

export async function connect(token) {
  const previous = getToken()
  setToken(token)
  try {
    return await githubApi('/user')
  } catch (error) {
    setToken(previous)
    throw error
  }
}

export function encodeBase64(text) {
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}

export function decodeBase64(encoded) {
  const binary = atob(encoded)
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export async function readTextFile(path) {
  const file = await repoApi(`/contents/${encodeURIComponent(path)}`)
  return { content: decodeBase64(file.content), sha: file.sha }
}

export async function writeTextFile(path, content, message = 'chore: update content') {
  let sha
  try {
    const existing = await repoApi(`/contents/${encodeURIComponent(path)}`)
    sha = existing.sha
  } catch {
    sha = undefined
  }
  return repoApi(`/contents/${encodeURIComponent(path)}`, {
    method: 'PUT',
    body: {
      message,
      content: encodeBase64(content),
      branch: BRANCH,
      ...(sha ? { sha } : {})
    }
  })
}

export async function deleteFile(path, message = 'chore: delete content') {
  const file = await repoApi(`/contents/${encodeURIComponent(path)}`)
  return repoApi(`/contents/${encodeURIComponent(path)}`, {
    method: 'DELETE',
    body: { message, sha: file.sha, branch: BRANCH }
  })
}

export async function listFiles(path) {
  const items = await repoApi(`/contents/${encodeURIComponent(path)}`)
  return items.filter((item) => item.type === 'file')
}

export function slugify(text) {
  const slug = String(text || '')
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\u4e00-\u9fa5]+/gu, '-')
    .replace(/^-+|-+$/g, '')
  return slug || `post-${Date.now()}`
}

export function splitFrontmatter(text) {
  const match = String(text).match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { frontmatter: '', body: String(text || '') }
  return { frontmatter: match[1], body: match[2] || '' }
}

export async function listPosts() {
  const files = await listFiles('site/posts')
  return files.filter((file) => file.name.endsWith('.md') && file.name !== 'index.md')
}

export async function listIssuesByLabel(label) {
  const items = await githubApi(
    `/repos/${OWNER}/${REPO}/issues?state=all&labels=${encodeURIComponent(label)}&per_page=100`
  )
  return items.filter((issue) => !issue.pull_request)
}

export async function listIssueComments(issueNumber) {
  return githubApi(`/repos/${OWNER}/${REPO}/issues/${issueNumber}/comments?per_page=100`)
}

export async function createIssueComment(issueNumber, body) {
  return githubApi(`/repos/${OWNER}/${REPO}/issues/${issueNumber}/comments`, {
    method: 'POST',
    body: { body }
  })
}

export async function updateIssue(issueNumber, body) {
  return githubApi(`/repos/${OWNER}/${REPO}/issues/${issueNumber}`, {
    method: 'PATCH',
    body
  })
}
