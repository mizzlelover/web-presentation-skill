---
name: wenzhi
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

- **禁止跳过前置访谈直接生成（Briefing Gate）**。用户请求未同时满足"五问答案齐备"或"明示跳过"时，第一动作必须是提问，禁止先产出任何 Strategy / IR / HTML。假设先行是返工项，不是默认路径（见第 0 步）。
- **禁止 Input → HTML 一步到位**。必须走 `Input → Presentation Strategy → Presentation IR → Renderer`（见 workflows/）。
- **禁止通用规则**："每页最多 6 行""标题必须是问句""字越少越好""动画越少越好"等只能是 Contextual Heuristics，必须带机制/语境/边界。
- **实践经验必须登记为 Practitioner Hypothesis**（knowledge/practitioner_hypotheses/），经证据检验后才可进入方法论，禁止直接进入 Scientific Core。
- **对抗性请求要识别**：用户要求"每页都加炫酷动画""所有数据做 3D""所有标题改问句"时，先判断是否损害传播，并向用户说明理由（见 evals/benchmark/adversarial.md）。
- **技术 ≠ 方法论**：Web 库只回答"怎么实现"，不回答"为什么应该这么设计"。知识层不得依赖任何框架 API。

## 真实证据双轨制（强制补丁，不可绕过）

- **Found ≠ Researched**：找到书名/论文标题不等于研究。来源必须走获取阶梯 `PLANNED → FOUND → ACQUIRED → READ → ANNOTATED → VALIDATED → DISTILLED`；只有 **VALIDATED** 以上可作 Knowledge Node 核心证据。只读到摘要时标 `access_level: abstract_only`，禁止推断实验条件、效应量、泛化性与边界条件。
- **Library Exists ≠ Capability Verified**：库文档说支持，不等于演示系统能稳定做。Web 能力必须走 `DISCOVERED → DOCUMENTED → PROTOTYPED → TESTED → BENCHMARKED → ACCEPTED`；只有 **TESTED** 以上可进入正式 Renderer Planner，未验证技术一律停留 `experimental/`。
- **两条证据链在 Presentation IR 汇合**：Track A（为什么这样设计）+ Track B（能否稳定实现）缺一不可。
- **禁止 Book-summary Research**：知识单位是 Mechanism Node（多书+多论文+实验+综述+实践汇聚），不是一本书的摘要。实践派方法（Reynolds/Duarte/Weissman/Minto/Tufte/Abela）标 `practitioner_framework`，不自动等于科学证据。
- **规则分级（§10）**：STRONG / SUPPORTED / CONTEXTUAL / PRACTITIONER / CONTESTED / INSUFFICIENT——禁止全写成确定性军规。
- **补齐顺序（§68）**：P0 核心理论实读 → P1 核心 Runtime 实跑 → P2 真实中文基准语料 → P3 跨浏览器/离线/打印 → P4 高级技术。P0/P1 未清前不新增特效。
- **审计基线**：`audits/`（RESEARCH_AUDIT / RUNTIME_AUDIT / CORPUS_COVERAGE / CAPABILITY_VERIFICATION / GAP_REPORT / MOTION_CAPABILITY_MATRIX / TRACEABILITY_MATRIX），每次声明能力或规则前先看当前状态，禁止虚标。

## 工作流程（按顺序执行）

### 第 0 步：前置访谈 + Situation First — 先问后判（Briefing Gate）

**先访谈，后判定。** 生成任何东西之前，向用户确认"五问"：

1. **给谁看**——观众角色、专业度、谁拍板（decision_power）；
2. **什么场合**——情境类型（20 类）、讲者在场还是自读；
3. **多长时间**——time_budget；
4. **要达成什么**——沟通目标与期望观众看完后的动作；
5. **材料与红线**——素材范围、必须涵盖/必须回避的内容、交付形态。

**跳过条件（仅两条，其余一律先问）**：
- 用户请求中已完整给出五问答案（可直接进入第 0 步的情境判定）；
- 用户明示"直接生成 / 按你的判断 / 别问了"（允许假设兜底，但 IR 的 `presentation.briefing.source` 必须写 `user_opt_out`，且所有假设字段显式标注）。

仅缺一两问时只追问缺项，不要重复问已有答案。**禁止**用"先合理假设、交付时用户再改"替代提问——受众错了，后面全部返工。

五问齐备后再回答："这到底是什么演示？"从 20 类情境中识别（Executive Briefing / Decision / Sales / Pitch / Training / Teaching / Technical / Scientific / Project Report / Government Report / Consulting / Data / Internal Communication / Public Speech / Conference Talk / Product Launch / Pre-read / Leave-behind / Self-reading / Hybrid）。**不同情境不得使用同一套规则。** 详见 `knowledge/presentation/situation-taxonomy.md`。访谈结论写入 IR 的 `presentation.briefing`（`schemas/presentation.yaml`）。

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

- **Renderer 是唯一 HTML 出口**：`scripts/render_ir.py` 消费 IR、按 `visual_semantics` / `blocks[].type` / `motion_intent` 装配组件并产出**自包含 HTML**。Stage / Reader / Print 由同一份 IR 同源产出（`content.reader`、`speaker_notes`、`source` 一并写入），禁止为某个 Demo 手写 HTML 绕开 IR（§52）。
- **语义组件库**：`runtime/components/components.css`（Renderer 输出的类名契约：`wpk-card / wpk-num / wpk-step / wpk-cmp / wpk-time / wpk-quote / wpk-risks / wpk-arch / wpk-actions / wpk-evidence / wpk-chart`）。新增视觉语义时应同时补组件与 Renderer 分支，而不是在 Deck 里写内联样式。
- **自适应演示图（Presentation Graph）**：`scene-engine.graph()` 从 DOM 推导有向图（core_path / branch / deep_dive / skip 四类边）。出口由 `nav_links{deep_dive,branch,skip}` 声明；`data-branch` 与 `data-deep-dive` 共用返回栈，Esc / `[data-branch-return]` 回主线并恢复揭示进度。分支 = 横向切换视角（技术/财务/异议），深潜 = 向下钻取证据。
- 渲染层级 L0–L6，逐 Scene 选择最低充分层级（见 `RUNTIME.md`）。
- 布局用 HTML + CSS Grid/Flexbox/Container Queries/CSS Variables；禁止 `left:428px` 式 PPT 模仿定位（特殊视觉场景除外）。
- 动效是 Semantic Motion（REVEAL/FOCUS/CONNECT/TRANSFORM/TRACE/ACCUMULATE/COMPARE/CAUSE/CONTINUITY/REMOVE），必须可被讲者 pause/resume/reverse/seek/skip/replay；技术优先级 CSS → Web Animations API → View Transition → Motion → GSAP（复杂 timeline 才用 GSAP）。`prefers-reduced-motion` 必须影响动效策略。**注册的动效必须在揭示步到达时播放**（否则 paused + `fill:both` 会把元素钉在首帧而不可见）；Reader/Print 全展开时须落到终态。
- 数据可视化先定 Cognitive Job（Comparison/Trend/Distribution/Relationship/Composition/Ranking/Flow/Network）再选图；**普通商务图用本地化的 ECharts**（`runtime/vendor/echarts.min.js`，离线，禁止 CDN），特殊场景才引入 D3/SVG。图表必须同时过 Stage / Reader / Print / reduced-motion 四态，并随幕宽重排（`runtime/visualization/charts.js`）。
- 3D（Three.js）仅用于空间关系/架构/产品/地理/科学结构，禁止"为了高级感用 3D"（当前未验证，见 `experimental/`）。
- 主题用 design_tokens（font/color/spacing/radius/shadow/motion/grid），禁止每个 Scene 随意写 CSS。见 `themes/` 与 `DESIGN_SYSTEM.md`。
- 必须支持：键盘导航、Presenter View（当前/下一幕/笔记/计时/跳转/搜索）、Reader Mode（可滚动/完整/可展开/可引用/hash 深链）、Print Mode（`@page` 按设计画布出页，冻结动画、展开关键内容、显示引用，**每幕恰好一页**）、离线运行（local assets，现场不依赖 CDN）、Performance Budget（Stable > Fancy）。
- **展示层必备（讲者与现场体验）**：
  - **Overview 总览模式**（O 键）：全部 Scene 以实时缩略图平铺，点击任意一幕直接跳转——服务"重新选页跳过去看"的自由导航，不属于内嵌演示逻辑但必须支持；
  - **页码锚点指示**：常驻低存在感的「当前页 / 总页数 · 主题」，让讲者与观众都能预期进度；
  - **隐晦按键提示**：常驻极简提示（如「→ 推进 · O 总览 · ? 快捷键」），无操作数秒后自动淡化，? 键呼出完整快捷键面板；
  - **静帧开关**（M 键）：一键关闭全部动效与逐步揭示，整幕直出——时间紧的现场不能被动效拖住；
  - **场景状态保持**：非线性切出再返回时，该幕保持切出前的揭示进度，不得重置回初始态；
  - **分支返回提示上下文化**：返回提示与返回锚点只在深潜（Deep Dive）进入时显示；线性浏览到达同一幕时不出现。
- 运行时实现见 `runtime/`（零依赖原生 JS，可直接使用或作为参考）。
- 交付时可用 `scripts/gen_keys_card.py` 为产物生成「键位速查」SVG 卡片（默认与运行时 `?` 帮助面板的键位一致；`--keys` 自定义键位、`--stops/--bg/--ink/--cap` 等参数适配产物主题，`--print-keys` 导出默认键位 JSON 供修改），嵌入 README 或交付说明，让第一次打开的人一眼上手。

### 第 6 步：QA 与评测

- 视觉 QA：overflow / contrast / font size / alignment / cropping / overlap / safe area / responsive。**溢出判定必须比较子元素包围盒与幕框**（`scrollHeight` 对非滚动容器不可靠），并覆盖 1920×1080 / 1366×768 / 1600×1000 三档。
- Runtime QA：broken links / missing assets / JS errors / animation failures / branch navigation / presenter mode / keyboard / offline load / print mode。
- 自动验证入口：`evals/harness/`（dev-only Playwright）。`runtime_verify.cjs` 功能与性能矩阵、`content_stress.cjs` 中文标题压力与 Reader 清单、`adaptive_test.cjs` 自适应导航端到端、`deck_shots.cjs` 逐幕截图与溢出。全部可一键复现。
- 评测 18 个维度（Audience Fit / Goal Clarity / Argument Quality / Cognitive Load / … / Aesthetic Quality），见 `evals/rubric.yaml` 与 `EVALS.md`。
- 浏览器以 **Chromium / Blink（Chrome）为主要验证环境**，WebKit 引擎补充回归；Firefox 与真机 Safari 受环境限制时须显式标注未验证，不得虚标 `browser_verified`。

## 交付能力自检（A–G）

A. 原始 Word/Markdown/长文 → HTML Presentation；B. 已有 HTML 演示 → 诊断优化；C. 提纲 → 完整演示；D. 数据 → 数据叙事演示；E. 同内容 → 不同受众不同演示；F. Stage → Reader/Print；G. 线性演示 → Adaptive Graph。

## 知识检索

- **53 个知识节点 / 7 域**，全量索引见 `knowledge/INDEX.md`（含验证状态与研究队列）；
  认知科学（工作记忆/认知负荷/双通道/分散注意/冗余/专长反转/诱惑性细节）：`knowledge/cognition/`
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
runtime/                — HTML Presentation Runtime
  ├─ core/              — Scene 引擎、bootstrap、基础样式
  ├─ navigation/        — 键盘/搜索/总览 + Presentation Graph（分支/深潜/跳过）
  ├─ motion/            — 语义动效控制器（WAAPI，可 pause/seek/skip）
  ├─ presenter/ reader/ print/  — 讲者台 / 阅读模式 / 打印（@page 设计画布）
  ├─ components/        — 语义组件样式（Renderer 的类名契约）
  ├─ visualization/     — 图表运行时（ECharts 包装，四态适配）
  └─ vendor/            — 本地化的第三方库（ECharts，离线，无 CDN）
components/             — 语义组件示例与说明
visualization/          — 可视化选型指南
themes/                 — design tokens 主题
evals/                  — 评测 rubric、100+ 测试案例登记、对抗测试
evals/harness/          — 跨引擎自动验证（dev-only Playwright；runtime_verify / content_stress / adaptive_test / deck_shots / verify_corpus / run_evals / regression / verify_experimental）
evals/mechanisms/       — 25 条机制正反例画廊（每条导出可执行渲染规则）
evals/baselines/        — 视觉回归基线（逐幕 aHash）
scripts/                — render_ir.py（IR→HTML 渲染器）、validate_ir.py（IR 校验）、build_corpus.py（批量构建）、render_mechanisms.py、gen_keys_card.py
benchmarks/corpus/      — 10 类真实中文基准语料 Deck（IR + 渲染产物 + 打印 PDF）
benchmarks/derived/     — 衍生育料：同内容多受众（CEO/技术/一线）、同内容多时长（5/15/20 分钟）
audits/                 — 双轨证据审计基线（研究/运行时/语料/能力/差距/动效矩阵/可追溯矩阵/技术取舍）
experimental/           — 未验证或已否决技术的孵化区与取舍证据（禁止进入 Production Runtime）
examples/demo/          — 可运行的完整示例（IR + 生成的 HTML）
```
