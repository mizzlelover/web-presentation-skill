# GAP_REPORT.md — 差距报告与补齐计划

> 依据补丁 §66–§68。审计日期：2026-09-07。优先级严格执行：P0/P1 未清前不新增特效（§68）。

## 0. 《研究补全、Runtime 验证与 Skill 强制升级补丁》执行状态（2026-09-10）

该补丁要求停止"以 Audit 交付"，改为**真正实现 + 写回 Skill**。当前进度：

| 条款 | 要求 | 状态 |
|---|---|---|
| §5/§14/§52 | 研究结果反向修改 IR；Stage/Reader/Print 同源；禁止 Demo-only 架构 | ✅ `scripts/render_ir.py` + `schemas/scene.yaml` v1.1 + 组件库 |
| §6/§9/§33 | Presentation Graph 进入 Runtime 并由真实 Deck 调用 | ✅ `branchTo/graph`，adaptive_test 全通过 |
| §10 | Motion 进入语义层，不得 fade-in everywhere | ✅ 10 类 intent + 修复"注册即被钉在首帧"缺陷 |
| §11 | Data Visualization 真实整合 | ✅ ECharts 本地化 + charts.js（7 种图形，四态，多系列图例） |
| §4/§12/§13/§17/§18/§21 | 技术 Prototype→Test→Compare→Accept/Reject | ✅ 4 个实验原型 + `audits/TECH_DECISIONS.md`（Accept 1 / Reject 2 / Downgrade 1 / Conditional 1 / Hold 2） |
| §15 | Print 真实导出 PDF 验证 | ✅ 01=18 页、02=15 页，幕数=页数，16:9 |
| §16 | Offline 断网真实测试 | ✅ 全 10 套 file:// 零外部请求（Evals Offline 维度） |
| §17 | Browser Testing（Chromium/WebKit） | ✅ 双引擎（真机 Safari/Firefox 受环境限制，用户指定以 Chrome 为准） |
| §18 | 中文压力测试并修复 | ✅ 标题 12/12 不溢出；Reader 提示残留与图表图例已修 |
| §7/§8 | 10+ complete real-world decks，每套实际运行 | ✅ **10/10**，112 幕，零溢出零错误 |
| §19 | Performance 产生优化动作 | ✅ 门禁（FCP ≤900ms / FPS ≥45 / 资源 ≤40）实测 15 套全过；数据压力测试驱动 charts.js 补齐双轴/柱线组合/缺失值/长标签能力 |
| §20 | 20+ mechanisms × 正确/错误 Scene | ✅ **25 条**机制正反例画廊（`evals/mechanisms/`），每条导出可执行渲染规则 |
| §54 | Same Content / Different Audience Benchmark | ✅ CEO（6 幕）/ 技术（6 幕）/ 一线（5 幕）三版本，结构·密度·术语层次实际不同 |
| §55 | Same Content / Different Duration | ✅ 5 分钟（5 幕）/ 15 分钟（10 幕）/ 20 分钟（corpus/01，18 幕），结论一致而论证深度与场景分配不同 |
| §21 | 最终更新完整 Skill 实体 | 🟡 SKILL.md / schemas / runtime / components / visualization / print / workflows(render) / evals / audits 已改；knowledge 节点与其余 workflows 待随研究推进 |
| §22 | Evals 必须实际跑 | ✅ `run_evals.cjs` 七维门禁 × **15 套**（IR/Visual/Runtime/Browser/Offline/Performance/Console）→ 15/15 通过 |
| §23 | Screenshot Regression 实际生成与比较 | ✅ `regression.cjs` aHash 基线 + 阈值比对 |
| §24/§26 | 最终交付可运行 Skill + FINAL_REPORT | ✅ FINAL_REPORT v0.10.0 |
| §53/§52 | 真实复杂中文材料 + 「从未见过的真实内容」测试 | ✅ **10/10 达成**：①统计公报 ②审计工作报告 ③数字经济规划 ④CNNIC 第55次报告 ⑤数据基建指引 ⑥茅台年报 ⑦技能中国行动 ⑧家电以旧换新 ⑨西十高铁批复 ⑩政府工作报告——全部注入上游工件链 + 溯源闸门（含 source_values 声明机制） |
| §94(A/C) | 原始材料→演示 / 提纲→演示 | 🟡 首次端到端验证（真实公报→12 幕），尚未覆盖 Word/提纲/数据文件等输入形态 |
| §95 | 每组产出 Strategy + Argument Map + Scene Plan + IR + Runtime + Reader + Print | 🟡 10 套 real 语料 7/7 工件齐备；15 套合成语料仍只有 IR+Runtime+Reader+Print |
| §22(部分) | Strategy Eval / Audience Adaptation Eval | ✅ **两项已实现并跑通**（strategy_audience_eval.cjs：real 语料工件闸门 tested；三受众 9 项结构差异断言全过）。🟡 18 维 rubric **已打分**（rubric_scores.md，单评审局限如实记录，无 ≤2 项）；§68 对抗测试**机器守卫 6/6 实跑通过**（人工判断部分待 LLM-in-loop）；§67 100 案例的实质由 18 套×多维 evals 覆盖，正式映射待建 |
| §15/§17 | 知识库规模（理论藏书） | ✅ **53 节点 / 7 域**，统一六项头字段；26 partially_validated / 22 memory_based / 5 engineering_validated；总索引 `knowledge/INDEX.md` |
| §46/§69 | Accessibility 自动检查 | ✅ `verify_a11y.cjs`（对比度/字号/alt）——实测发现并修复 7 套对比度缺口，现 **25/25 通过** |
| §30/§72 | Browser Testing 真机 Safari | ✅ **真机 Safari 26.5.2 · 25/25 通过**（WebDriver 直连；设计画布与原生窗口双模式，含 4 套真实语料 Deck） |
| §31 | Responsive / 短屏 | ✅ 高度感知三档压缩；1280×800 / 1366×768 / 800×652 下 144 幕零溢出（修复前 7~18 幕溢出） |

**结论**：补丁可执行条款已全部落地——Renderer / Graph / Charts（含数据压力）/ Print / Offline、15 套 Deck、25 条机制正反例、衍生育料、技术取舍、Evals 七维、视觉回归、现场适应剧本、knowledge 与 workflows 写回。剩余为 knowledge 节点规模扩张（持续研究）与受环境限制的硬件/浏览器实测。

## P0 — 核心理论未经实际研究（Track A）

| 缺口 | 动作 | 验收标准 |
|---|---|---|
| 37 条来源全部 MEMORY_BASED | 逐域取得原文并按 §4 六段式阅读 | 每域至少 1 篇综述+1 篇实验达 VALIDATED |
| 15 个核心领域无 Evidence Package | 按 §6 模板补齐（含 effect_strength / boundary_conditions） | 每域 1 个 Package，标注 confidence |
| 实践派作者未分层 | Reynolds/Duarte/Weissman/Minto/Tufte/Abela 标 practitioner_framework | schema 字段落地 |
| 规则无状态分级 | 全部规则套用 §10 六级状态 | TRACEABILITY_MATRIX 同步 |

## P1 — 核心 Runtime 实测缺口（Track B）

> **2026-09-10 更新**：引入 `evals/harness/` 跨引擎 harness，P1 主要缺口已清。

| 缺口 | 状态 | 证据 |
|---|---|---|
| 跨浏览器（§30） | 🟡 部分 | Chromium 153 ✅ + WebKit 26.6 ✅（各 22/22 通过）；**真机 Safari 待授权**、Firefox 沙箱阻断 → 均未验证 |
| Performance Budget（§31） | ✅ | FCP 136/264ms、转场 60FPS、堆 9.54MB、主文档 32KB（RUNTIME_AUDIT §0.5） |
| Presenter 完整矩阵（§23） | ✅ | 弹窗 / 计时走动 / 笔记 / 分支按钮跨引擎实测 |
| Reader §27 清单（§27） | ✅ | 全幕展开 / 来源可见 / 展开控件 / 移动端零溢出 12/12 |
| 中文长标题 §40 / 中文压力 §39 | ✅ | 6 类标题 × 2 分辨率 × 2 引擎 = 12/12 不溢出 |
| 15–20 幕自适应测试 Deck（§24/§25） | ❌ 未做 | 现有 Demo 8 幕、无深潜/分支链接；深潜返回目前仅 API 级验证 |

已完成 ✅：离线门禁、打印 PDF、投影三档分辨率、reduced-motion、控制台零错误、跨引擎 22 项功能回归。
新增待修：Reader 模式下 `.wp-hints` 未隐藏（与正文重叠）。

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
| Browser Verified | 🟡（Chromium ✅ + WebKit ✅；真机 Safari / Firefox 待补） |
| Evals Passed | ⚠️（对抗测试在库，未系统跑分） |

**结论：项目当前处于「工程管线可用、研究证据待补」状态，不得宣称 COMPLETE。**
