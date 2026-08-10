import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'Teezeek 的卡塞尔图书馆',
  description: '记录代码与生活的暗黑奇幻个人博客。',
  base: '/Teezeek_blog/',
  cleanUrls: true,
  appearance: 'force-dark',
  lastUpdated: true,
  head: [
    ['meta', { name: 'theme-color', content: '#0A0A0A' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/Teezeek_blog/favicon.svg' }],
    ['meta', { property: 'og:title', content: 'Teezeek 的卡塞尔图书馆' }],
    ['meta', { property: 'og:description', content: '记录代码与生活的暗黑奇幻个人博客。' }],
    ['meta', { property: 'og:type', content: 'website' }]
  ],
  themeConfig: {
    logo: '/Teezeek_blog/logo.svg',
    siteTitle: 'Teezeek',
    nav: [
      { text: '大厅', link: '/' },
      { text: '文章', link: '/posts/' },
      { text: '公告', link: '/updates/' },
      { text: '工具', link: '/tools/' },
      { text: '勇士榜', link: '/leaderboard' },
      { text: '关于', link: '/about' },
    ],
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
          modal: {
            noResultsText: '未找到相关内容',
            resetButtonTitle: '清除',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    },
    outline: { label: '本页目录', level: [2, 3] },
    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdated: {
      text: '最后更新于',
      formatOptions: { dateStyle: 'full', timeStyle: 'short' }
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/jay-qiao' }],
    footer: {
      message: '以龙之名，记录代码与生活。',
      copyright: 'Copyright © 2026 Teezeek'
    }
  }
})
