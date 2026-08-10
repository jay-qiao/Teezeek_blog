---
title: 用 VitePress 与 GitHub Pages 部署魔法站台
description: 项目页部署的关键配置、Actions 工作流和构建命令速查。
date: 2026-08-10
category: 技术
tags:
  - VitePress
  - GitHub Pages
---

把 VitePress 站点部署到 GitHub Pages 项目页时，`base` 是第一个要确认的变量。

## 配置 base

仓库是 `jay-qiao/Teezeek_blog`，线上地址为 `https://jay-qiao.github.io/Teezeek_blog/`，因此 `base` 固定为：

```js
base: '/Teezeek_blog/'
```

## 构建命令

```bash
npm ci
npm run docs:build
```

构建产物输出到 `site/.vitepress/dist/`，由 GitHub Actions 上传为 Pages 工件。

## 部署流程

1. 在仓库 Settings -> Pages 中选择 "GitHub Actions" 作为部署来源。
2. 推送 `main` 分支。
3. 等待工作流完成，访问项目页地址。

## 小提醒

- `feed.xml`、`sitemap.xml`、`robots.txt` 由构建脚本自动生成，不要手工维护。
- 字体通过 `@fontsource` 自托管，不依赖外网字体服务。
