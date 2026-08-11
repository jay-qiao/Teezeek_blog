# Git 工作流

## 分支与提交

- 主分支为 `main`，直接面向生产。
- 功能开发使用 `feat/主题` 或 `fix/主题` 分支，完成后合并回 `main`。
- 提交信息使用 Conventional Commits：`feat:`、`fix:`、`docs:`、`refactor:`、`chore:`。
- 提交前检查 diff，不提交 node_modules、构建产物、本地临时文件。
- 提交前检查 README 是否与本次网站改动同步，功能/页面/后台/部署有变化时必须一并更新。

## 合并

- 优先使用 PR 合并，不在 `main` 上直接提交破坏性改动。
- 合并前必须本地构建通过。

## 部署

- 推送 `main` 后由 GitHub Actions 自动部署。
- 不在仓库中提交 `site/.vitepress/dist/`。
