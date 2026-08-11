import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const ROOT = process.cwd()
const SITE = join(ROOT, 'site')
const PUBLIC_DIR = join(SITE, 'public')
const SITE_URL = (process.env.SITE_URL || 'https://jay-qiao.github.io/Teezeek_blog').replace(/\/+$/, '')
const SITE_NAME = 'Teezeek 的烬土图书馆'

mkdirSync(PUBLIC_DIR, { recursive: true })

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      walk(full, files)
    } else if (entry.endsWith('.md')) {
      files.push(full)
    }
  }
  return files
}

function readMeta(file) {
  const text = readFileSync(file, 'utf8')
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  const meta = {}
  if (match) {
    const lines = match[1].split('\n')
    const field = (name) => {
      const line = lines.find((item) => item.startsWith(`${name}:`))
      return line ? line.slice(name.length + 1).trim().replace(/^['"]|['"]$/g, '') : null
    }
    meta.title = field('title') || relative(SITE, file).replaceAll(sep, '/').replace(/\.md$/, '')
    meta.date = field('date') || '2026-08-10'
    meta.description = field('description') || ''
    meta.author = field('author') || 'Teezeek'
    meta.tags = lines
      .filter((line) => /^\s*-\s+/.test(line))
      .map((line) => line.replace(/^\s*-\s+/, '').trim())
  } else {
    meta.title = relative(SITE, file).replaceAll(sep, '/').replace(/\.md$/, '')
    meta.date = '2026-08-10'
    meta.description = ''
    meta.author = 'Teezeek'
    meta.tags = []
  }
  return meta
}

function toUrl(relPath) {
  const base = relPath.replace(/\.md$/, '')
  if (base.endsWith('/index')) {
    const parent = base.slice(0, -6)
    return parent === '' ? '/' : `/${parent}/`
  }
  return `/${base}/`
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

const mdFiles = walk(SITE).filter((file) => !file.endsWith('404.md'))
const entries = mdFiles
  .map((file) => {
    const rel = relative(SITE, file).replaceAll(sep, '/')
    const meta = readMeta(file)
    return {
      ...meta,
      url: toUrl(rel),
      file,
      rel,
      lastmod: new Date(statSync(file).mtime).toISOString().split('T')[0]
    }
  })
  .sort((a, b) => String(b.date).localeCompare(String(a.date)))

const now = new Date().toISOString()
const feedItems = entries
  .filter((entry) => entry.rel.startsWith('posts/') || entry.rel.startsWith('updates/'))
  .slice(0, 20)
  .map((entry) => {
    const link = `${SITE_URL}${entry.url}`
    return [
      '  <entry>',
      `    <title>${escapeXml(entry.title)}</title>`,
      `    <link href="${link}"/>`,
      `    <id>${link}</id>`,
      `    <updated>${entry.date}T00:00:00+08:00</updated>`,
      `    <published>${entry.date}T00:00:00+08:00</published>`,
      `    <author><name>${escapeXml(entry.author)}</name></author>`,
      entry.description ? `    <summary>${escapeXml(entry.description)}</summary>` : '',
      '  </entry>'
    ].filter(Boolean).join('\n')
  })

const feed = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<feed xmlns="http://www.w3.org/2005/Atom">',
  `  <title>${escapeXml(SITE_NAME)}</title>`,
  `  <link href="${SITE_URL}/"/>`,
  `  <updated>${now}</updated>`,
  `  <id>${SITE_URL}/</id>`,
  '  <author><name>Teezeek</name></author>',
  feedItems.join('\n'),
  '</feed>',
  ''
].join('\n')

const sitemapItems = entries
  .filter((entry) => !entry.rel.endsWith('/index.md'))
  .map((entry) => {
    const link = `${SITE_URL}${entry.url}`
    return [
      '  <url>',
      `    <loc>${escapeXml(link)}</loc>`,
      `    <lastmod>${entry.lastmod}</lastmod>`,
      '  </url>'
    ].join('\n')
  })
  .join('\n')

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  sitemapItems,
  '</urlset>',
  ''
].join('\n')

const robots = [
  'User-agent: *',
  'Allow: /',
  `Sitemap: ${SITE_URL}/sitemap.xml`,
  ''
].join('\n')

writeFileSync(join(PUBLIC_DIR, 'feed.xml'), feed, 'utf8')
writeFileSync(join(PUBLIC_DIR, 'sitemap.xml'), sitemap, 'utf8')
writeFileSync(join(PUBLIC_DIR, 'robots.txt'), robots, 'utf8')

console.log(`Generated feed.xml, sitemap.xml, robots.txt for ${entries.length} pages`)
