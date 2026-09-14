# TECH_DECISIONS.md — 高级技术取舍决议（补丁 §4 / §12 / §13 / §17 / §18 / §19 / §21）

> 依据补丁 §4：每项技术必须走 `Prototype → Test → Compare → Accept / Reject`，**不适合的删除或降级**，不得为显得技术丰富而全部保留。
> 实测日期：2026-09-10。原型目录：`experimental/`；报告：`evals/harness/_artifacts/experimental/experimental_report.json`。
> 验证环境：Chromium（Playwright，真实 Blink 内核）。

## 0. 决议速览

| 技术 | 原型 | 实测结果 | 决议 | 进入生产运行时？ |
|---|---|---|---|---|
| **ECharts** | `runtime/visualization/`（生产） | 图表 canvas 实际绘制；离线可跑；打印保留色彩 | **ACCEPT** | ✅ 是（`runtime/vendor/`，按需注入） |
| GSAP | `experimental/motion-compare/` | 三场景全通过；仅 S3 明显更自然；+71 KB；**非 OSI 许可** | **REJECT**（暂） | ❌ 否 |
| View Transition API | `experimental/motion-compare/` | S2 最贴近语义；仅同文档状态切换；不可 seek | **HOLD** | ❌ 否（待双引擎验证） |
| Mermaid | `experimental/mermaid-vs-svg/` | 32ms 可渲染；**库 3.26 MB**；默认主题与 Deck 主题不统一 | **DOWNGRADE** | ❌ 否，仅作草稿/中间表示 |
| Three.js | `experimental/threejs-cases/` | 正例可用；594 KB；headless 44 fps；无目标场景必需 3D | **REJECT**（暂） | ❌ 否 |
| D3 | `experimental/d3-narrative/` | 定制叙事确有优势（直接标注/注释带/分段着色）；273 KB | **CONDITIONAL** | ⚠️ 仅当 ECharts 无法表达时按需引入 |
| Live Data / WebSocket | 未构建 | 无受众场景要求实时数据；离线优先为硬约束 | **HOLD** | ❌ 否 |

## 1. GSAP — REJECT（保留在 experimental）

- **优势**：S3 复杂解释序列用 timeline + stagger 最自然；pause/seek/reverse 完整。
- **代价**：+71 KB；许可为 GreenSock 标准许可（**非 OSI 开源**），与「零依赖、可离线交付、MIT」的项目基线冲突。
- **比较**：本项目语义动效（REVEAL/FOCUS/CONNECT/TRANSFORM/TRACE/ACCUMULATE/COMPARE/CAUSE/CONTINUITY/REMOVE）均为单步或极短序列，WAAPI 已完整覆盖且原生支持全部控制。
- **结论**：不进入生产。若未来出现 L5 动态模拟等真正的长编排需求，再以「独立可选模块」形式评估，不污染核心运行时。

## 2. Mermaid — DOWNGRADE 为草稿工具（§12）

- **实测**：默认主题渲染可用（32ms），但 ①库体积 **3.26 MB**（为 ECharts 的 3 倍）；②默认视觉与 Deck 主题 token 不统一，需大量 `themeVariables` 二次调校；③输出为内联 SVG，字号/间距难以随幕宽等比缩放。
- **结论**：**不进入生产渲染路径**。Mermaid 仅用于「作者侧画草稿 / 中间结构表示」，成品由 `runtime/components/components.css` 的 `steps` / `arch` / `matrix` 等语义组件产出定制 SVG 或 HTML 结构（已在 10 套 Deck 中实际使用）。
- **不做**的事：不再讨论「Mermaid → 定制 SVG 自动转换器」——人工/组件化输出已满足需求，自动转换的复杂度与收益不成比例。

## 3. Three.js — REJECT（保留在 experimental，附正反例）

- **正向用例**（`threejs-cases/` 左）：场馆空间关系（体块位置与开口遮挡）——3D 有真实认知价值。
- **反向用例**（同页右侧）：**同一内容**用 2D SVG 表达——更快读、可标注、可打印、0 依赖。
- **实测**：脚本解析 25ms、首帧 23ms，但 headless（无 GPU）仅 **44 fps**；库 594 KB。
- **结论**：**本项目目标场景（汇报/评审/培训/路演/叙事）均不存在「必须 3D 才能表达」的信息结构**，投影现场稳定性优先。不进入生产；如未来出现建筑/数字孪生类需求，须完成 GPU 真机、内存、文字可读性与降级（静态图 fallback）四项验证后再议。

## 4. D3 — CONDITIONAL（按需引入，不作默认）

- **唯一正当理由**（§18）：产出「ECharts 难以实现、D3 有明显优势」的定制数据叙事。
- **已构建原型**：获客成本 × 复购率的联合轨迹——同一条轨迹、逐点年份直接标注、分段着色、注释带。ECharts 可做双轴折线，但这三件事在 ECharts 中需要大量 `graphic` / `markArea` 手工干预。
- **结论**：默认仍用 ECharts（体积 1.0 MB 但覆盖面广、生态成熟）；**仅在定制叙事确有必要时**按单 Deck 引入 D3，且必须同时提供静态 fallback（打印/离线）。

## 5. View Transition — HOLD

- S2（对象连续性）表现最好，是同文档状态切换的语义正解；但不可 seek、不可控，且需 Chromium + WebKit 双测与降级路径。
- **结论**：保持 `experimental/`；在补丁 §6「Runtime 不能停在 Demo」意义上，暂不纳入生产。

## 6. 依赖审计（补丁 §49）

| 依赖 | 体积 | 许可 | 位置 | 可替换性 |
|---|---|---|---|---|
| ECharts 5 | 1.01 MB | Apache-2.0 | `runtime/vendor/`（生产，按需） | 高（自研 SVG 图表可覆盖基础图形） |
| GSAP 3.15 | 71 KB | GreenSock 标准许可（非 OSI） | `experimental/vendor/` | — （不采用） |
| Three.js r149 | 594 KB | MIT | `experimental/vendor/` | — （不采用） |
| Mermaid 10 | 3.26 MB | MIT | `experimental/vendor/` | — （仅草稿） |
| D3 7 | 273 KB | ISC | `experimental/vendor/` | — （条件引入） |

**原则**：生产运行时（`runtime/core` + `runtime/components` + 各模式模块）**零依赖**；第三方仅在 `runtime/vendor/`（ECharts）与 `experimental/vendor/`（其余）出现，且均本地化、无 CDN。
