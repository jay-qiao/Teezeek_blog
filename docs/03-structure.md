# 项目结构速览

```text
blog/
├── .github/workflows/       # GitHub Actions 部署
├── docs/                    # 项目文档
├── rules/                   # 项目规则
├── scripts/                 # 构建辅助脚本
├── site/                    # VitePress 站点源码
│   ├── .vitepress/
│   │   ├── config.mjs       # 站点配置
│   │   └── theme/
│   │       ├── index.js     # 主题入口
│   │       ├── Layout.vue   # 全局布局
│   │       ├── admin/       # GitHub API 客户端
│   │       ├── styles/      # 全局样式
│   │       └── components/  # 自定义组件
│   ├── data/                # 设置、外观、分类标签、屠龙榜 JSON
│   ├── public/              # 静态资源与生成文件
│   ├── index.md             # 烬土大厅
│   ├── leaderboard.md       # 屠龙勇士榜
│   ├── posts/               # 文章
│   ├── updates/             # 公告
│   ├── tools/               # 工具页
│   ├── about.md             # 关于
│   ├── admin/               # 管理员后台
│   └── 404.md               # 404 页面
├── package.json
├── package-lock.json
└── README.md
```

## 关键说明

- `site/.vitepress/config.mjs`：站点标题、导航、搜索、`base`、社交链接等配置。
- `site/.vitepress/theme/styles/index.css`：设计令牌与全站视觉规范所在地。
- `site/posts/`：每篇文章一个 Markdown 文件，文章列表与 RSS 自动读取该目录。
- `site/updates/`：公告列表数据源。
- `site/data/`：后台写入的站点设置、外观配置和分类标签数据源。
- `site/.vitepress/theme/admin/github.js`：GitHub API 客户端，负责 Token、读写文件、提交仓库。
- `site/admin/`：管理员后台模块，入口只放在首页地图底部。
- `scripts/gen-site-assets.mjs`：构建前生成 `feed.xml`、`sitemap.xml`、`robots.txt`。

## 如何新增一篇文章

1. 在 `site/posts/` 新建 `my-topic.md`。
2. 按 `docs/01-project-spec.md` 的 frontmatter 规范填写元信息。
3. 运行 `npm run docs:dev` 在本地确认渲染。
4. 提交并推送 `main`，GitHub Actions 会自动构建部署。
