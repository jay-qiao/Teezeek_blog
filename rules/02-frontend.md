# 前端开发规范

## 技术边界

- 只使用 Vue 3 Composition API 与 ES Module。
- 不新增构建工具，不引入 React 或 Tailwind。
- 依赖必须写入 `package.json`，禁止隐式依赖传递包。

## 组件规范

- 自定义组件放在 `site/.vitepress/theme/components/`。
- 组件命名使用 PascalCase，注册为全局组件。
- 组件只做展示与交互，不写后端请求。
- 所有颜色、间距、圆角优先引用 `styles/index.css` 中的设计令牌。

## 可访问性与性能

- 图标按钮必须有 aria-label。
- 动画必须尊重 `prefers-reduced-motion`。
- 灰烬粒子、矩阵雨、鼠标光晕在组件卸载时清理定时器与监听器。
- 页面过渡使用轻量 DOM/CSS 动画，不阻塞路由切换。
- 页面首屏不加载大图；字体按需引入字重。

## 构建

- 修改配置后必须执行 `npm run docs:build` 验证。
- 构建前由 `scripts/gen-site-assets.mjs` 重新生成 RSS / sitemap。
