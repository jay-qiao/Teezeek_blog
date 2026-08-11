# 项目约束

## 技术约束

- VitePress 固定为 `1.6.4`，不随意升级大版本。
- 使用 Vue 3 Composition API 编写自定义组件。
- 全项目使用 ES Module，不使用 CommonJS 书写源码。
- 包管理器固定为 npm，锁文件 `package-lock.json` 必须提交。
- 不引入 React、Tailwind CSS、Framer Motion；视觉统一用自研设计令牌与 Vue 组件实现。
- 字体通过 `@fontsource` 自托管，不依赖 Google Fonts 等外网资源。

## 部署约束

- 部署平台为 GitHub Pages 项目页，VitePress `base` 固定为 `/Teezeek_blog/`。
- GitHub Pages 仅托管静态文件，禁止依赖 Node 服务、数据库或真实登录系统。
- 部署由 `.github/workflows/deploy.yml` 自动完成，禁止手动把构建产物提交进仓库。

## 视觉约束

- 首版为暗黑单主题，不做亮色模式切换。
- 主色：极黑 `#0A0A0A`、深空紫 `#1A0A2E`。
- 强调色：暗金 `#C9A84C`、龙血红 `#8B0000`。
- 文字色：羊皮纸白 `#F5E6C8`、银灰 `#B8B8B8`。
- 雨滴以倾斜暗金雨丝为主、墨绿 `#5CA87A` 少量点缀，不使用字符矩阵。
- 标题字体：Cormorant Garamond Italic + Noto Serif SC；正文字体：Noto Serif SC；代码字体：JetBrains Mono。
- 动画尊重 `prefers-reduced-motion`，灰烬粒子和雨滴数量有上限且不影响阅读。
- 鼠标光晕、页面过渡均为轻量实现，不允许阻塞主内容渲染。

## 内容约束

- 写作语言默认中文，代码与专有名词保留原文。
- 每篇文章必须包含 title、description、date、tags。
- 文章建议补充 category 分类字段。
- 文件名使用短横线小写命名，例如 `hello-ashlands.md`。
- 图片优先存放于 `site/public/images/`，引用时使用绝对站点路径。

## README 同步要求

- 每次修改网站功能、页面、后台模块或部署方案后，必须同步更新 `README.md`。
- README 中的功能亮点、项目结构、文档入口、自动部署说明必须与线上站点保持一致。
- 提交前将 README 纳入改动清单检查，遗漏视为未完成任务。

## 非目标

- 后台通过 GitHub API 管理仓库文件，不使用独立服务器、数据库或登录系统。
- 评论使用 Utterances（GitHub Issues 驱动），不接入需要独立后端的评论服务。
- 访客投稿通过 GitHub Issue 提交并由管理员审核，不引入第三方表单服务。
- 不做亮色模式、多语言、支付、会员体系。
