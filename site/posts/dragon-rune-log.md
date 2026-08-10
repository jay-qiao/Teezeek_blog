---
title: 龙文与前端字体的炼金日志
description: 关于自托管字体、装饰性符文和性能取舍的记录。
date: 2026-08-10
category: 前端
tags:
  - 字体
  - 前端
---

这座图书馆的标题使用 Cormorant Garamond Italic，正文使用 Noto Serif SC，代码使用 JetBrains Mono。

## 为什么自托管

GitHub Pages 没有服务器端渲染字体代理，依赖 Google Fonts 会让首屏在网络不佳时等待外部请求。改用 `@fontsource` 后，字体文件随构建产物一起发布。

```js
import '@fontsource/cormorant-garamond/700-italic.css'
import '@fontsource/noto-serif-sc/400.css'
import '@fontsource/jetbrains-mono/400.css'
```

## 龙文只是装饰

页面里的符文只承担氛围，不承载语义。屏幕阅读器和搜索引擎看到的依然是正常的标题、段落与链接。

## 性能取舍

- 中文字体按字重拆分，避免一次加载整包。
- 灰烬粒子限制数量，并尊重 `prefers-reduced-motion`。
- 首屏不加载大图，装饰用 CSS 与轻量 SVG 完成。
