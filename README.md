# Teezeek Blog

一个以原创“烬土”世界观为背景的暗黑奇幻个人博客。入口是一封羊皮纸信卷，展开后是手绘风格的烬土大厅地图，把代码、文字和龙火一起装进这座图书馆。

## 在线地址

- 博客：<https://jay-qiao.github.io/Teezeek_blog/>
 

## 功能亮点

- 羊皮纸信卷入口：首次进入站点先展示入学信封，展开后进入烬土大厅地图
- 暗黑奇幻氛围：暗金雨丝、灰烬粒子、鼠标光晕、屠龙战场废墟背景
- 文章系统：文章列表、分类筛选、标签筛选、本地全文搜索、Markdown 渲染、代码高亮、悬浮目录
- 内容页面：文章站台、公告栏、工具资源页、屠龙勇士榜、关于页
- 访客投稿：访客通过 GitHub Issue 提交稿件，管理员审核通过后才发布
- 屠龙榜自动计分：按文章与评论自动统计贡献分，收录需管理员批准
- GitHub API 后台：仪表盘、文章管理、分类标签、投稿审核、Utterances 评论、屠龙榜管理、协作者管理、系统设置、外观设置、数据备份
- 响应式布局：桌面端和移动端都能正常浏览
- RSS / sitemap / robots.txt 自动生成

## 技术栈

| 项目 | 选择 |
| --- | --- |
| 静态站点 | VitePress 1.6.4 |
| 前端框架 | Vue 3 |
| 模块规范 | ES Module |
| 包管理器 | npm |
| 部署平台 | GitHub Pages |

## 本地运行

```bash
npm install
npm run docs:dev
```

打开 `http://127.0.0.1:5173/Teezeek_blog/` 即可预览。

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `npm run docs:dev` | 启动本地开发服务器 |
| `npm run docs:build` | 构建生产版本 |
| `npm run docs:preview` | 预览构建产物 |
| `npm run gen:assets` | 重新生成 RSS / sitemap / robots.txt |

## 项目结构

```text
site/                 VitePress 站点源码
site/posts/           文章 Markdown
site/updates/         公告
site/tools/           工具资源页
site/admin/           后台管理页面
site/data/            设置、外观、分类标签数据
docs/                 项目规范与设计文档
rules/                AI 协作规则
scripts/              构建与辅助脚本
```

## 文档入口

- [项目规范](docs/01-project-spec.md)
- [项目约束](docs/02-constraints.md)
- [项目结构速览](docs/03-structure.md)
- [网站风格规范](docs/04-style-guide.md)
- [规则文件索引](rules/00-index.md)

## 自动部署

仓库内置 GitHub Actions 工作流。推送 `main` 分支后会自动执行 `npm run docs:build`，并把构建产物发布到 GitHub Pages。

> 后台通过 GitHub API 直接管理仓库内容，保存后会自动触发部署；评论使用 Utterances，协作者使用 GitHub 权限体系。
