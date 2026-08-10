import { createContentLoader } from 'vitepress'

export default createContentLoader('updates/*.md', {
  transform(raw) {
    return raw
      .filter((post) => post.url !== '/updates/')
      .sort((a, b) => String(b.frontmatter.date).localeCompare(String(a.frontmatter.date)))
  }
})

