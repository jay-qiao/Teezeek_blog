import { createContentLoader } from 'vitepress'

export default createContentLoader('posts/*.md', {
  transform(raw) {
    return raw
      .filter((post) => post.url !== '/posts/')
      .filter((post) => !post.frontmatter.draft)
      .sort((a, b) => {
        const pinned = Number(Boolean(b.frontmatter.pinned)) - Number(Boolean(a.frontmatter.pinned))
        return pinned || String(b.frontmatter.date).localeCompare(String(a.frontmatter.date))
      })
  }
})
