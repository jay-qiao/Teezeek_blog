import { createRequire } from 'node:module'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const require = createRequire(import.meta.url)
const { chromium } = require('C:/Users/john/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')

const base = process.env.PREVIEW_BASE || 'http://127.0.0.1:5173/Teezeek_blog'
const outDir = process.env.PREVIEW_OUT || 'preview'
mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--disable-gpu', '--no-sandbox']
})

const targets = [
  { name: 'home-letter', url: '/', width: 1440, height: 900, map: false, wait: 1200 },
  { name: 'home-loading', url: '/', width: 1440, height: 900, map: false, clickLetter: true, wait: 900 },
  { name: 'home-map', url: '/', width: 1440, height: 900, map: true, wait: 1200 },
  { name: 'posts', url: '/posts/', width: 1440, height: 900, map: false, wait: 1200 },
  { name: 'article', url: '/posts/vitepress-deploy', width: 1440, height: 900, map: false, wait: 1200 },
  { name: 'leaderboard', url: '/leaderboard', width: 1440, height: 900, map: false, wait: 1200 },
  { name: 'admin-dashboard', url: '/admin', width: 1440, height: 900, map: false, wait: 1200 },
  { name: 'admin-posts', url: '/admin/posts', width: 1440, height: 900, map: false, wait: 1200 },
  { name: 'home-mobile', url: '/', width: 390, height: 844, map: true, wait: 1200 },
  { name: 'posts-mobile', url: '/posts/', width: 390, height: 844, map: false, wait: 1200 },
  { name: 'admin-mobile', url: '/admin', width: 390, height: 844, map: false, wait: 1200 }
]

for (const target of targets) {
  const context = await browser.newContext({
    viewport: { width: target.width, height: target.height },
    locale: 'zh-CN'
  })
  if (target.map) {
    await context.addInitScript(() => {
      sessionStorage.setItem('teezeek-gate-seen', '1')
    })
  }
  const page = await context.newPage()
  await page.goto(`${base}${target.url}`, { waitUntil: 'networkidle' })
  if (target.clickLetter) {
    await page.click('.letter-actions .btn-gold')
  }
  await page.waitForTimeout(target.wait || 1200)
  await page.screenshot({ path: join(outDir, `${target.name}.png`) })
  await context.close()
}

await browser.close()
console.log(`Screenshots saved to ${outDir}`)
