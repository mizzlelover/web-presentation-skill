# dist-r6 发布记录 — wenzhi 1.0.0-r6（2026-09-13）

> 本文记录 dist-r6 发布的完整上下文，供后续追溯。

---

## 一、发布概要

| 项 | 值 |
|---|---|
| 发布分支 | `dist-r6` |
| 发布 commit | `f12d31e2a8e46ae09b729a12d09b46826185400d` |
| 远程 main | `f12d31e` |
| 远程 tag | `v1.0.0 → f12d31e` |
| 本地 main 基线 | `f5a8c2e`（61 条提交） |
| 发布时间 | 2026-09-13 |
| 发布触发 | 补推 `RELEASE_NOTES.md` 到远程 |

---

## 二、dist-r6 相对 dist-r5 的变更

| 项 | 值 |
|---|---|
| 树差异 | `git diff c36a69f f12d31e --stat` |
| 变更文件 | **仅 1 个新增**：`RELEASE_NOTES.md`（79 行） |
| 变更类型 | 纯文档留档，无代码改动 |

**结论**：dist-r6 是 dist-r5 的文档补发版，代码内容完全一致。

---

## 三、本次发布涉及的全部文件（相对初始基线）

dist-r6 包含自 V1.0.0-r4 质量整改以来的全部 9 个文件：

| 文件 | 操作 | 说明 |
|---|---|---|
| `PROJECT_REVIEW.md` | 新增（r4 引入） | 项目复盘文档，含 r4 整改详情第八节 |
| `RELEASE_NOTES.md` | 新增（r6 引入） | 质量整改留档：文件清单/改动点/orphan 发布步骤/基线确认 |
| `runtime/core/presentation.css` | 修改（r4） | 5 级字重 token + 中文排版 6 规则 + 大标题/来源行居中 + tabular-nums 贯穿 |
| `runtime/components/components.css` | 修改（r4） | 9 处硬编码字重 → token；`.wpk-ev__s` 补 tabular-nums |
| `runtime/visualization/charts.js` | 修改（r4） | PALETTE 读 CSS 变量；标题用 fontDisplay |
| `evals/harness/typography_lint.cjs` | 新增（r4） | 7 项机器断言，可独立运行也可被复用 |
| `evals/harness/run_evals.cjs` | 修改（r4） | 接入第八维 typography |
| `evals/harness/package.json` | 修改（r4） | 新增 typography 脚本 |
| `evals/baselines/screens.json` | 修改（r4） | 266 幕视觉回归基线重建 |
| `assets/keys-card.svg` | 修改（r5） | 旧域名 → wenzhi.mizzlelover.xyz |

---

## 四、新增文档的提交历史

### PROJECT_REVIEW.md

| 提交 | 分支 | 说明 |
|---|---|---|
| `5363915` | 本地 main | V1.0.0-r4：中文排版质量整改（Kimi K3Max 接力轮） |
| `64554e7` | dist-r4 | 首次推远程 |
| `c36a69f` | dist-r5 | keys-card.svg 域名替换时保留 |
| `f12d31e` | dist-r6 | 当前远程 main |

### RELEASE_NOTES.md

| 提交 | 分支 | 说明 |
|---|---|---|
| `f5a8c2e` | 本地 main | docs: RELEASE_NOTES.md — 质量整改留档 |
| `f12d31e` | dist-r6 | 首次推远程（当前远程 main） |

---

## 五、orphan 发布链（完整）

```
dist-r4 (64554e7) ──→ dist-r5 (c36a69f) ──→ dist-r6 (f12d31e)
    │                      │                      │
    ▼                      ▼                      ▼
  V1.0.0-r4            V1.0.0-r5            V1.0.0-r6
  中文排版整改          keys-card.svg         RELEASE_NOTES.md
  + typography lint     域名替换              留档补发
```

本地 main 始终为完整历史（当前 `f5a8c2e`，61 条提交），远程 main 始终为 orphan 单提交。

---

## 六、验证状态

| 验证项 | 结果 |
|---|---|
| 本地 main 与远程 main 树差异 | 空（完全一致） |
| dist-r6 与 dist-r5 树差异 | 仅 `RELEASE_NOTES.md` |
| 工作区状态 | 干净（无未提交改动） |
| typography_lint 独立运行 | 28/28 套通过，266 幕 0 违例 |
| Pages 部署 | `built`（f12d31e） |

---

*记录时间：2026-09-13*
