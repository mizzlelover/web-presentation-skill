# dist-r10 → dist-r11 发布记录（2026-09-14）

> 本文记录 dist-r10 到 dist-r11 的完整变更，供留档追溯。

---

## 一、发布概要

| 项 | dist-r10 | dist-r11 |
|---|---|---|
| 发布触发 | 实测验证回灌 | **Briefing Gate：前置访谈硬门槛** |
| 本地 main 基线 | `a16ff92` | 本次提交（见下） |
| 发布时间 | 2026-09-14 | 2026-09-14 |
| 变更性质 | runtime CSS / 渲染器 / 校验器 | **流程门禁（SKILL.md / 适配器 / workflow / 校验器 / schema）** |

---

## 二、事故与修复

**事故**：用户在 Codex 中请求「将我们这版改写稿生成演示页面」，skill 被直接执行到底——五问（给谁看 / 什么场合 / 多长时间 / 要达成什么 / 材料与红线）一个没问，全部假设兜底。

**根因链**：
1. 前置交互要求从未是硬门槛：SKILL.md 第 0/1 步只说"判定/填写"，未说"先问"；
2. `build_presentation_strategy.md` 措辞"缺信息时：先合理假设并显式标注，关键项向用户确认"——**假设是默认路径，确认可跳过**；
3. Codex 实际读的 `adapters/AGENTS.md` 只字未提访谈，"入口先读 SKILL.md"的软引用失效。

**修复（四层）**：

| 层 | 文件 | 变更 |
|---|---|---|
| 铁律 | `SKILL.md` | 铁律新增「禁止跳过前置访谈直接生成」；第 0 步改造为「前置访谈 + Situation First」，五问清单 + 仅两条跳过条件 + 禁止假设先行 |
| 入口适配器 | `adapters/AGENTS.md` / `adapters/CLAUDE.md` | 门禁直接内嵌入口行（不再依赖软引用），Codex/OpenCode/Claude Code 一进入即见 |
| workflow | `workflows/build_presentation_strategy.md` | 新增第 0 步 Briefing Gate；缺信息改"回到第 0 步追问"；假设兜底仅限 `user_opt_out`；输出增加 Briefing 记录 |
| 机器校验 | `scripts/validate_ir.py` | `presentation.briefing` 缺失 → warning（历史 IR 兼容）；`source` 非四值之一 → error；`user_opt_out` 无 notes 假设清单 → error |
| schema/IR | `schemas/presentation.yaml` / `workflows/build_presentation_ir.md` | briefing 字段（source/notes）入 schema，IR 组装必填 |

`briefing.source` 四值语义：`user_brief`（请求中直接给全）/ `interview`（访谈确认）/ `user_opt_out`（用户明示跳过，允许假设兜底，notes 必须逐条列假设）/ `corpus_spec`（基准语料规格给定，历史语料补录用）。

---

## 三、模拟验证（四场景）

| 场景 | 预期 | 实测 |
|---|---|---|
| ① 复现 Codex 请求（无五问、无跳过） | 门禁判定"必须先提问"；IR 缺 briefing → warning 触发 | ✓ |
| ② `briefing.source: "guessed"` | error：source 非法 | ✓ |
| ③ `source: user_opt_out` 无 notes | error：假设清单缺失 | ✓ |
| ④ `source: interview` + 五问 notes | 0 error 0 warning | ✓ |

typography-lint 回归：**28/28 套，266 幕，0 违规**（本变更不触渲染层）。

---

## 四、文件变更清单

| 文件 | 操作 |
|---|---|
| `SKILL.md` | 修改（铁律 + 第 0 步） |
| `adapters/AGENTS.md` / `adapters/CLAUDE.md` | 修改（入口门禁） |
| `workflows/build_presentation_strategy.md` | 修改（第 0 步 + 禁止清单） |
| `workflows/build_presentation_ir.md` | 修改（briefing 必填） |
| `scripts/validate_ir.py` | 修改（三闸门） |
| `schemas/presentation.yaml` | 修改（briefing 字段） |
| `CHANGELOG.md` / `DIST_R11.md` | 新增 [1.0.2] / 本记录 |

---

## 五、orphan 发布链（更新）

```
dist-r4 ─→ r5 ─→ r6 ─→ r7 ─→ r8 ─→ r9 ─→ r10 (34cc231) ─→ r11 (本次)
 中文排版   域名   留档   CI    CI修复  留档   实测验证回灌     Briefing Gate
```

---

*记录时间：2026-09-14*
