# GAP_REPORT.md — 差距报告与补齐计划

> 依据补丁 §66–§68。审计日期：2026-09-07。优先级严格执行：P0/P1 未清前不新增特效（§68）。

## P0 — 核心理论未经实际研究（Track A）

| 缺口 | 动作 | 验收标准 |
|---|---|---|
| 37 条来源全部 MEMORY_BASED | 逐域取得原文并按 §4 六段式阅读 | 每域至少 1 篇综述+1 篇实验达 VALIDATED |
| 15 个核心领域无 Evidence Package | 按 §6 模板补齐（含 effect_strength / boundary_conditions） | 每域 1 个 Package，标注 confidence |
| 实践派作者未分层 | Reynolds/Duarte/Weissman/Minto/Tufte/Abela 标 practitioner_framework | schema 字段落地 |
| 规则无状态分级 | 全部规则套用 §10 六级状态 | TRACEABILITY_MATRIX 同步 |

## P1 — 核心 Runtime 实测缺口（Track B）

| 缺口 | 动作 | 验收标准 |
|---|---|---|
| Safari / Firefox 未实测（§30） | 本机 Safari 实跑 + 截图 | 三浏览器截图基线入库 |
| Performance Budget 无数值（§31） | 采集 load/FPS/memory | 预算表 + 实测对照 |
| 15–20 幕自适应测试 Deck（§24/§25） | 含双深潜、双分支、返回主线 | 状态恢复全对（Scene/reveal/notes/动画） |
| Presenter 完整矩阵（§23） | 计时/下一幕/跳转/搜索实测 | 逐项 PASS 记录 |
| Reader §27 清单 / 中文长标题 §40 | 逐项过 | 测试记录 |

已完成 ✅：离线门禁、打印 PDF、投影三档分辨率、reduced-motion、控制台零错误、18 项功能回归。

## P2 — 真实中文基准语料

0/10 → 10/10，见 CORPUS_COVERAGE.md 整改计划。

## P3 — 工程化保障

| 缺口 | 动作 |
|---|---|
| 视觉回归基线（§58） | 保存 benchmark 截图，组件/主题改动自动对比 |
| Playwright 自动化（§59） | 现状用无头 Chromium 脚本，评估是否升级 |
| 真实硬件分级（§32） | 借用 MacBook Air 级设备实测 |
| 完整性审计脚本（§61/§62） | scripts/audit_*.py：来源阶梯一致性、能力状态一致性、CDN 依赖、离线引用 |

## P4 — 高级技术扩展（全部在 experimental/ 孵化）

GSAP / ECharts / D3 / Mermaid / Three.js / View Transition / Live Data：按补丁 §15–§20 各自的最小验证清单做 demo + benchmark，达到 `tested` 才允许进入 Renderer Planner。

## 完成度对照（§65）

| 条件 | 状态 |
|---|---|
| Research Validated | ❌（0 域 VALIDATED） |
| Knowledge Distilled | ⚠️（结构已建，证据未验） |
| IR Stable | ✅（校验器 0 error，round-trip 部分验证） |
| Runtime Tested | ✅ 核心 / ⚠️ 边缘 |
| Real Deck Generated | ✅（1 套，自我推介） |
| Browser Verified | ⚠️（Chromium ✅，Safari/Firefox 待补） |
| Evals Passed | ⚠️（对抗测试在库，未系统跑分） |

**结论：项目当前处于「工程管线可用、研究证据待补」状态，不得宣称 COMPLETE。**
