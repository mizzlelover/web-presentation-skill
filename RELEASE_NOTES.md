# 质量整改留档 — V1.0.0-r4 / r5（2026-09-13 · Kimi K3Max 接力轮）

> 本文留档：整改涉及文件清单、改动点、orphan 发布标准操作步骤。

---

## 一、整改文件清单与改动点（8 个文件）

| 文件 | 操作 | 改动点 |
|---|---|---|
| `runtime/core/presentation.css` | 修改 | ①`:root` 新增 5 级字重 token（display/body/emphasis/number/label）；②`.wp-scene` 新增中文排版规则（line-break:strict / hanging-punctuation:first allow-end / text-spacing:ideograph-alpha ideograph-numeric / text-spacing-trim:space-start / text-justify:inter-ideograph）；③`.wp-scene > * { margin-inline: auto }`；④h1/h2 改 `width: fit-content; margin-inline: auto; margin-block: 0`；⑤p/li 改 `width: fit-content`；⑥标题/正文/表格/列表新增 `font-variant-numeric: tabular-nums`；⑦b/strong 新增 `font-synthesis: style small-caps` |
| `runtime/components/components.css` | 修改 | ①9 处硬编码字重替换为 token 引用（card__title/cmp__h/step__k/step__t/time__t/mx__h/layer__h/action__t/quote__text/num__v）；②`.wpk-ev__s` 新增 `font-variant-numeric: tabular-nums`（证据来源行年份对齐） |
| `runtime/visualization/charts.js` | 修改 | ①`PALETTE` 从硬编码色板改为读取 CSS 变量（`--wp-chart-c2…c6`，accent 为首色）；②`theme()` 新增 `fontDisplay` 读取 `--wp-font-display`；③图表标题 `textStyle.fontFamily` 改用 `fontDisplay` |
| `evals/harness/typography_lint.cjs` | **新增** | 中文排版自动化校验脚本：7 项机器断言（避头尾逐行检测/标点悬挂/行长溢出/数字字形/字重对比/孤词/中西文间距），逐幕覆盖 corpus+derived+real；可独立运行（`node typography_lint.cjs`）也可被 `run_evals.cjs` 复用（`checkPage(page)`） |
| `evals/harness/run_evals.cjs` | 修改 | ①`require("./typography_lint.cjs")` 引入 `checkPage`；②`browserPass` 返回新增 `typography` 字段；③`evals` 对象新增第八维 `typography: c.typography && c.typography.pass` |
| `evals/harness/package.json` | 修改 | `scripts` 新增 `"typography": "node typography_lint.cjs"`，`"all"` 链入 `typography_lint.cjs` |
| `evals/baselines/screens.json` | 修改 | 视觉回归基线更新（266 幕，CSS 变更后重建） |
| `assets/keys-card.svg` | 修改 | 旧域名 `present.mizzlelover.xyz` → `wenzhi.mizzlelover.xyz`（全仓唯一残留） |
| `PROJECT_REVIEW.md` | **新增** | 项目复盘文档（含 V1.0.0-r4 整改详情第八节） |

---

## 二、orphan 发布标准操作步骤

### 前提

- 本地 main 分支为开发主线，保留完整历史
- 远程 main 为 orphan 单提交（干净发布快照）
- **禁止** `git push origin main`（会 non-fast-forward 拒绝）

### 标准流程

```bash
# 1. 确保本地 main 为最新开发状态
git checkout main
git log --oneline -3   # 确认 HEAD 是预期发布点

# 2. 从 main 切出新的 orphan 发布分支（替换 X 为版本号，如 r6）
git checkout --orphan dist-rX

# 3. 全量添加并提交（orphan 无父提交，首次 add -A）
git add -A
git commit -m "wenzhi 1.0.0-rX — HTML 原生智能演示系统（文质）：<本次发布摘要>"

# 4. 强制更新 tag 指向新发布提交
git tag -f v1.0.0

# 5. 强制推送 orphan 分支覆盖远程 main
git push origin +dist-rX:main

# 6. 强制推送 tag
git push origin -f v1.0.0

# 7. 验证
git ls-remote origin main v1.0.0   # 两者 commit 应一致
gh api repos/mizzlelover/wenzhi/pages/builds/latest --jq '{commit,status}'
```

### 注意事项

1. **不要推本地 main 到远程**：远程 main 是 orphan，与本地 main 无共同祖先，直接推会被拒绝。
2. **orphan 分支命名**：按版本递增（dist-r4 → dist-r5 → dist-r6），避免复用旧名。
3. **tag 必须强刷**：`git tag -f v1.0.0` 指向新 orphan 提交，否则 tag 仍指旧发布。
4. **Pages 构建可能卡住**：若 `status` 长时间 `building` 且 `updated_at` 不动，用 `gh api repos/mizzlelover/wenzhi/pages/builds -X POST` 触发新构建。
5. **发布后验证**：`git ls-remote origin main v1.0.0` 确认 commit 一致；Pages `status=built` 后 curl 验证线上内容。
6. **本地切回 main**：发布完成后 `git checkout main` 继续开发，orphan 分支可保留也可删除（`git branch -D dist-rX`）。

---

## 三、当前基线确认

- **本地 main HEAD**：`dcdab97`（keys-card.svg 域名替换）
- **dist-r5**：`c36a69f`（orphan 发布快照）
- **树差异**：`git diff HEAD dist-r5 --stat` 为空 → **内容完全一致**
- **后续开发基线**：基于本地 main 继续推进，发布时切 `dist-r6`

---

*留档时间：2026-09-13*
