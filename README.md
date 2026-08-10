# Teezeek Blog

一个以"龙族 / 卡塞尔学院"为世界观的暗黑奇幻个人博客，基于 VitePress 1.6.4 + Vue 3 + ES Module 构建，使用 npm 管理依赖，部署到 GitHub Pages。

## 快速开始

```bash
npm install
npm run docs:dev
```

本地预览地址默认为 `http://127.0.0.1:5173/`。

站点包含卡塞尔大厅（信卷入口 + 地图）、文章站台、公告栏、工具店、屠龙勇士榜、关于页，以及完整的静态管理员后台演示（仪表盘、文章管理、分类标签、评论审核、用户管理、系统设置、外观设置、数据备份）。

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `npm run docs:dev` | 启动本地开发服务器 |
| `npm run docs:build` | 生成站点资源并构建生产版本 |
| `npm run docs:preview` | 预览构建产物 |
| `npm run gen:assets` | 仅重新生成 RSS / sitemap / robots.txt |

## 文档入口

- [项目规范](docs/01-project-spec.md)
- [项目约束](docs/02-constraints.md)
- [项目结构速览](docs/03-structure.md)
- [网站风格规范](docs/04-style-guide.md)
- [规则文件索引](rules/00-index.md)

## 部署

仓库已内置 GitHub Actions 工作流 `.github/workflows/deploy.yml`。将仓库推送到 GitHub 后，在仓库 Settings -> Pages 中选择 "GitHub Actions" 作为部署来源，推送 `main` 分支即可自动部署到 `https://jay-qiao.github.io/Teezeek_blog/`。
