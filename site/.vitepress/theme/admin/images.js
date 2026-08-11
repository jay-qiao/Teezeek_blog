import { getToken } from './github.js'

export const IMAGE_REPO = {
  owner: 'jay-qiao',
  repo: 'Teezeek_blog_images',
  branch: 'main'
}

export function imageUrls(path) {
  const encoded = path.split('/').map(encodeURIComponent).join('/')
  return {
    jsdelivr: `https://cdn.jsdelivr.net/gh/${IMAGE_REPO.owner}/${IMAGE_REPO.repo}@${IMAGE_REPO.branch}/${encoded}`,
    raw: `https://raw.githubusercontent.com/${IMAGE_REPO.owner}/${IMAGE_REPO.repo}/${IMAGE_REPO.branch}/${encoded}`
  }
}

export async function uploadImage(base64, path, message = 'chore: upload image') {
  const response = await fetch(
    `https://api.github.com/repos/${IMAGE_REPO.owner}/${IMAGE_REPO.repo}/contents/${path.split('/').map(encodeURIComponent).join('/')}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${getToken()}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      body: JSON.stringify({
        message,
        content: base64,
        branch: IMAGE_REPO.branch
      })
    }
  )
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`${response.status} ${text.slice(0, 240)}`)
  }
  return response.json()
}

export function makeSafeName(filename) {
  const ext = (filename.match(/\.(png|jpe?g|gif|webp|svg|bmp|ico)$/i) || ['', '.png'])[0].toLowerCase()
  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
  const base = filename
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\u4e00-\u9fa5_-]+/gu, '-')
    .replace(/^-+|-+$/g, '')
  return `${stamp}-${base || 'image'}${ext}`
}
