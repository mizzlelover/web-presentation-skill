# dist-r7 → dist-r8 发布记录（2026-09-13）

> 本文记录 dist-r7 到 dist-r8 的完整变更，供留档追溯。

---

## 一、发布概要

| 项 | dist-r7 | dist-r8 |
|---|---|---|
| 发布 commit | `83212d1` | `00e5833` |
| 远程 main | `83212d1` | `00e5833` |
| 远程 tag | `v1.0.0 → 83212d1` | `v1.0.0 → 00e5833` |
| 本地 main 基线 | `caa2c76` | `61780b4` |
| 发布时间 | 2026-09-13 | 2026-09-13 |
| 发布触发 | CI 工作流 + DIST_R6.md | CI 修复（Playwright 安装） |

---

## 二、dist-r8 相对 dist-r7 的变更

| 项 | 值 |
|---|---|
| 树差异 | `git diff 83212d1 00e5833 --stat` |
| 变更文件 | **仅 1 个修改**：`.github/workflows/typography-lint.yml` |
| 变更内容 | 新增 `Install Playwright browsers` 步骤（`npx playwright install chromium --with-deps`） |
| 变更类型 | CI 修复，无产品代码改动 |

**本地 main 提交**：`61780b4` — `ci: typography-lint 工作流补 Playwright chromium 安装（--with-deps）`

---

## 三、CI 运行验证

| 运行 | 结果 | 说明 |
|---|---|---|
| dist-r7 首次运行 | **failure**（17s） | Playwright 浏览器未安装（`chromium_headless_shell` 缺失） |
| dist-r8 修复后运行 | **success**（1m7s） | Playwright chromium 安装成功，28/28 套通过 |

**CI 日志关键确认**：
- `Install Playwright browsers` 步骤执行：`npx playwright install chromium --with-deps`
- 下载 `Chrome for Testing 153.0.8010.12` + `Chrome Headless Shell 153.0.8010.12`
- `Run typography lint`：28/28 套通过，无隐藏报错

---

## 四、文件变更清单

| 文件 | 操作 | 变更 |
|---|---|---|
| `.github/workflows/typography-lint.yml` | 修改 | 新增 `Install Playwright browsers` 步骤（5 行） |

---

## 五、orphan 发布链（更新）

```
dist-r4 (64554e7) ──→ dist-r5 (c36a69f) ──→ dist-r6 (f12d31e) ──→ dist-r7 (83212d1) ──→ dist-r8 (00e5833)
    │                      │                      │                      │                      │
    ▼                      ▼                      ▼                      ▼                      ▼
  V1.0.0-r4            V1.0.0-r5            V1.0.0-r6            V1.0.0-r7            V1.0.0-r8
  中文排版整改          keys-card.svg         RELEASE_NOTES.md     CI 工作流           CI 修复
  + typography lint     域名替换              留档补发             + DIST_R6.md        Playwright 安装
```

---

## 六、验证状态

| 验证项 | 结果 |
|---|---|
| 本地 main 与远程 main 树差异 | 空（完全一致） |
| dist-r8 与 dist-r7 树差异 | 仅 `.github/workflows/typography-lint.yml` |
| 工作区状态 | 干净（无未提交改动） |
| CI typography-lint | success（28/28 套通过） |

---

*记录时间：2026-09-13*
