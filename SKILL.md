---
name: web-presentation-skill
description: Web-native Presentation Intelligence（HTML 原生智能演示系统）。给定复杂内容、真实受众、沟通目标和演示场景，按"情境→受众→目标→论证→认知路径→视觉→动效→交互→Web 运行时"的完整链条，生成真正的 HTML Presentation Application（演示应用，而非 PPT 文件）。当用户需要：把 Word/Markdown/长文/提纲/数据转成 HTML 演示；诊断优化已有 HTML 演示；针对 CEO/技术团队/一线等不同受众生成不同版本；产出 Stage/Reader/Print 三模式；构建可分支、可深潜、可现场调整的自适应演示时使用。触发词：HTML 演示、网页版 PPT、HTML presentation、web slides、演示应用、发布会页面、汇报网页、presentation app。不适用：PowerPoint/WPS/Keynote/PPTX 文件制作（那是格式转换问题，不是本系统目标）。
---

# Web-native Presentation Intelligence · HTML 原生智能演示系统

## 核心哲学（不可协商）

1. **Communication before Decoration** — 先解决传播问题，再考虑形式；但形式必须服务于内容、认知与沟通目标。
2. **Audience before Author** — 演示必须回答"为什么这个人要听"，而不是"我有什么想讲"。
3. **Argument before Slides** — 先有论证架构，再拆 Scene。
4. **Cognitive Job before Visual** — 先明确这一幕让观众完成什么认知任务。
5. **Evidence before Rule** — 任何规则必须有机制、语境、证据、边界、例外。禁止把经验直接写成规则。
6. **Minimum Sufficient Rendering** — 用最低但充分的技术层级（L0 Reader → L6 Spatial/3D），不得默认高复杂度。
7. **Web-native, not Web-decorated** — 不用 HTML 模仿 PowerPoint，利用 Web 本身的能力。
8. **Presentation is a Runtime** — 演示是运行过程，不是页面集合。
9. **One Content Model, Multiple Modes** — Stage / Reader / Print 共享同一内容模型。
10. **Ethics** — 禁止假数据、误导性图表、欺骗性动画、伪造来源、扭曲坐标轴。

## 铁律（违反即返工）

- **禁止 Input → HTML 一步到位**。必须走 `Input → Presentation Strategy → Presentation IR → Renderer`（见 workflows/）。
- **禁止通用规则**："每页最多 6 行""标题必须是问句""字越少越好""动画越少越好"等只能是 Contextual Heuristics，必须带机制/语境/边界。
- **实践经验必须登记为 Practitioner Hypothesis**（knowledge/practitioner_hypotheses/），经证据检验后才可进入方法论，禁止直接进入 Scientific Core。
- **对抗性请求要识别**：用户要求"每页都加炫酷动画""所有数据做 3D""所有标题改问句"时，先判断是否损害传播，并向用户说明理由（见 evals/benchmark/adversarial.md）。
- **技术 ≠ 方法论**：Web 库只回答"怎么实现"，不回答"为什么应该这么设计"。知识层不得依赖任何框架 API。

## 工作流程（按顺序执行）

### 第 0 步：Situation First — 判定演示类型

先回答："这到底是什么演示？"从 20 类情境中识别（Executive Briefing / Decision / Sales / Pitch / Training / Teaching / Technical / Scientific / Project Report / Government Report / Consulting / Data / Internal Communication / Public Speech / Conference Talk / Product Launch / Pre-read / Leave-behind / Self-reading / Hybrid）。**不同情境不得使用同一套规则。** 详见 `knowledge/presentation/situation-taxonomy.md`。

### 第 1 步：受众与目标建模

填写受众模型（role / expertise / prior_knowledge / decision_power / attitude / motivation / concerns / objections / time_budget / cognitive_load_tolerance / expected_detail / likely_questions），并明确沟通目标（Inform / Explain / Teach / Persuade / Convince / Recommend / Request Decision / Build Trust / Align / Inspire / Sell / Demonstrate / Defend / Report / Facilitate Discussion）。禁止笼统的"做好 PPT"。详见 `workflows/build_presentation_strategy.md`。

### 第 2 步：论证架构

中长型演示优先建立 Central Thesis → Claim → Evidence/Example/Counterargument → Recommendation，并检查 Unsupported Claim / Logical Gap / Evidence Mismatch / Argument Jump / Duplicate Claim / Overclaim。Minto/SCQA 只是工具，先判断是否适合。详见 `workflows/build_argument_map.md`。

### 第 3 步：Scene 规划（Scene，不是 Slide）

- 每个 Scene 必须有 Cognitive Job：Ask / Answer / Explain / Compare / Demonstrate / Prove / Orient / Transition / Summarize / Challenge / Reveal / Visualize / Quantify / Simulate / Decide。
- 标题类型由 Cognitive Job 决定：Question / Assertion / Topic / Decision / Contrast / Narrative Headline。Skill 必须解释"为什么当前场景选择这一类标题"。
- 认知负荷曲线：禁止连续大量 HIGH 负荷 Scene，用 Concept→Example→Data→Story→Synthesis 形成节奏。
- 信息密度由 Mode × 受众专业度 × 讲者在场 × 时间共同决定，不是"字越少越好"。
- 同一 Scene 分离 `stage`（精简）与 `reader`（完整）内容；**Speaker Notes 必须是三层中最详细的——写成可照本宣科的完整脚本**（含上台/停顿/手势/转场/应急提示），让讲者脱稿也能读稿。
- 默认支持非线性 Presentation Graph：Core Path / Optional Path / Deep Dive / Evidence Appendix / Objection Handling / 分支。
- 详见 `workflows/build_scene_plan.md` 与 `knowledge/presentation/`。

### 第 4 步：生成 Presentation IR

所有演示先生成 IR（`schemas/presentation_ir.yaml`），字段含 scene.role / cognitive_job / assertion / evidence / visual_semantics / layout_intent / information_density / reveal_strategy / motion_intent / interaction / deep_dive / speaker_notes / reader_content / print_state。用 `scripts/validate_ir.py` 校验。详见 `workflows/build_presentation_ir.md`。

### 第 5 步：渲染与运行时

- 渲染层级 L0–L6，逐 Scene 选择最低充分层级（见 `RUNTIME.md`）。
- 布局用 HTML + CSS Grid/Flexbox/Container Queries/CSS Variables；禁止 `left:428px` 式 PPT 模仿定位（特殊视觉场景除外）。
- 动效是 Semantic Motion（REVEAL/FOCUS/CONNECT/TRANSFORM/TRACE/ACCUMULATE/COMPARE/CAUSE/CONTINUITY/REMOVE），必须可被讲者 pause/resume/reverse/seek/skip/replay；技术优先级 CSS → Web Animations API → View Transition → Motion → GSAP（复杂 timeline 才用 GSAP）。`prefers-reduced-motion` 必须影响动效策略。
- 数据可视化先定 Cognitive Job（Comparison/Trend/Distribution/Relationship/Composition/Ranking/Deviation/Flow/Network/Geography）再选图；商务图优先 ECharts，高度定制用 D3/SVG，流程草稿用 Mermaid（成品视觉需评估）。
- 3D（Three.js）仅用于空间关系/架构/产品/地理/科学结构，禁止"为了高级感用 3D"。
- 主题用 design_tokens（font/color/spacing/radius/shadow/motion/grid），禁止每个 Scene 随意写 CSS。见 `themes/` 与 `DESIGN_SYSTEM.md`。
- 必须支持：键盘导航、Presenter View（当前/下一幕/笔记/计时/跳转/搜索）、Reader Mode（可滚动/完整/可展开/可引用/hash 深链）、Print Mode（@media print，冻结动画、展开关键内容、显示引用）、离线运行（local assets，现场不依赖 CDN）、Performance Budget（Stable > Fancy）。
- **展示层必备（讲者与现场体验）**：
  - **Overview 总览模式**（O 键）：全部 Scene 以实时缩略图平铺，点击任意一幕直接跳转——服务"重新选页跳过去看"的自由导航，不属于内嵌演示逻辑但必须支持；
  - **页码锚点指示**：常驻低存在感的「当前页 / 总页数 · 主题」，让讲者与观众都能预期进度；
  - **隐晦按键提示**：常驻极简提示（如「→ 推进 · O 总览 · ? 快捷键」），无操作数秒后自动淡化，? 键呼出完整快捷键面板；
  - **静帧开关**（M 键）：一键关闭全部动效与逐步揭示，整幕直出——时间紧的现场不能被动效拖住；
  - **场景状态保持**：非线性切出再返回时，该幕保持切出前的揭示进度，不得重置回初始态；
  - **分支返回提示上下文化**：返回提示与返回锚点只在深潜（Deep Dive）进入时显示；线性浏览到达同一幕时不出现。
- 运行时实现见 `runtime/`（零依赖原生 JS，可直接使用或作为参考）。

### 第 6 步：QA 与评测

- 视觉 QA：overflow / contrast / font size / alignment / cropping / overlap / safe area / responsive。
- Runtime QA：broken links / missing assets / JS errors / animation failures / branch navigation / presenter mode / keyboard / offline load / print mode。
- 评测 18 个维度（Audience Fit / Goal Clarity / Argument Quality / Cognitive Load / … / Aesthetic Quality），见 `evals/rubric.yaml` 与 `EVALS.md`。
- 浏览器至少测 Chromium + Safari。

## 交付能力自检（A–G）

A. 原始 Word/Markdown/长文 → HTML Presentation；B. 已有 HTML 演示 → 诊断优化；C. 提纲 → 完整演示；D. 数据 → 数据叙事演示；E. 同内容 → 不同受众不同演示；F. Stage → Reader/Print；G. 线性演示 → Adaptive Graph。

## 知识检索

- 认知科学（工作记忆/认知负荷/多媒体学习/注意/流畅性）：`knowledge/cognition/`
- 传播与说服（叙事/论证/信任/提问框架）：`knowledge/communication/`
- 演示研究（Assertion-Evidence/标题系统/信息密度/情境分类/受众建模/Q&A）：`knowledge/presentation/`
- 可视化与感知：`knowledge/visualization/`；动效：`knowledge/motion/`；交互：`knowledge/interaction/`
- 经验假设层（未验证经验，禁止直接当规则）：`knowledge/practitioner_hypotheses/`
- 反模式：`knowledge/anti_patterns/`
- 来源登记与证据分级（A Strong / B Moderate / C Emerging / D Practitioner / E Contested）：`knowledge/sources/seed_corpus.yaml`、`EVIDENCE.md`
- Web 能力登记（浏览器支持/性能成本/降级方案）：`knowledge/web_capabilities.yaml`
- 研究日志：`knowledge/research_log.md`

## 多 Harness 使用

本 Skill 是标准 SKILL.md 包，可被任何支持 Agent Skills 的 harness 加载。Claude Code / Codex / OpenCode 的安装方式与适配文件见 `adapters/`（含 CLAUDE.md、AGENTS.md）。

## 目录导航

```
SKILL.md                — 本文件（路由器，progressive disclosure）
knowledge/              — 演示知识图谱（机制节点 + 证据分级 + 经验假设层）
schemas/                — IR / Scene / 知识节点 / 来源 等 YAML Schema
workflows/              — 9 个标准工作流（策略→论证→Scene→IR→渲染→优化→现场调整→评审）
runtime/                — 零依赖 HTML Presentation Runtime（Scene引擎/导航/演讲者/读者/打印/动效/交互）
components/             — 语义组件（HeroStatement/AssertionEvidence/BigNumber/Decision/…）
visualization/          — ECharts/D3/SVG/Mermaid 使用指南
themes/                 — design tokens 主题
evals/                  — 评测 rubric、100+ 测试案例登记、对抗测试
scripts/                — validate_ir.py 等工具
examples/demo/          — 可运行的完整示例（IR + 生成的 HTML）
```
