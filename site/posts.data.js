import { createContentLoader } from 'vitepress'

export default createContentLoader('posts/*.md', {
  transform(raw) {
    return raw
      .filter((post) => post.url !== '/posts/')
      .sort((a, b) => String(b.frontmatter.date).localeCompare(String(a.frontmatter.date)))
  }
})

