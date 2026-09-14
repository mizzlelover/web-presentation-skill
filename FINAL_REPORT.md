# FINAL REPORT — HTML 原生智能演示系统（文质 Wenzhi）

版本：**v1.0.0** · 更新日期：2026-09-13 · 作者：谁是专家
（1.0.0 为重新发布：以端到端行为测试与知识节点升级后的状态为准，替代同日的初版发布）

> 本报告依据三份任务书撰写：《全生命周期项目需求提示词》（§70 十五问验收）、《真实研究与技术验证强制补丁》（双轨证据制）、《研究补全、Runtime 验证与 Skill 强制升级补丁》（真正实现并写回 Skill）。
> 原则：**A citation is not research. A library feature is not a verified capability. A prototype is not production. 状态表只用于内部跟踪，不能以 Audit 代替实现。**

---

## 1. 交付概览

| 维度 | 交付 |
|---|---|
| 架构 | 四层隔离：SKILL.md 路由 → Knowledge Layer（框架无关）→ **Presentation IR**（唯一耦合点）→ Runtime → Evals |
| 研究证据（Track A） | 58 条来源登记（**18 条全文精读、18/18 完成独立复核**）、13 个 Evidence Package（13/13 抽查复核，拦截 5 处问题）、**53 个知识节点（30 partially_validated / 18 memory_based / 5 engineering_validated）**+ 3 个反模式 |
| 运行时证据（Track B） | 零依赖运行时；Chromium + WebKit 双引擎实测；离线零外部请求 |
| 渲染管线 | **`scripts/render_ir.py`**：IR → 自包含 HTML（唯一出口，禁止手写绕开） |
| 可视化 | ECharts 本地化 + `runtime/visualization/charts.js`（7 种图形，Stage/Reader/Print/reduced-motion 四态） |
| 自适应演示 | **Presentation Graph** 落地：分支 / 深潜 / 跳过 / 返回主线并恢复揭示进度 |
| 基准语料 | 15 套合成 Deck（144 幕）+ **13 套真实世界语料全链路 Deck**（98 幕：10 套中国政务/企业材料 + 3 套国际组织全新形态材料——WHO 统计新闻稿 / UN 第 80/117 号决议 / UN-IPCC 关键结论；**其中后 3 套为端到端行为测试：系统从未见过的材料走 spec→五工件→闸门→渲染全管线，闸门实战拦截 3 处**） |
| 机制正反例 | **25 条**（`evals/mechanisms/`），每条导出可执行渲染规则 |
| 自动验证 | `evals/harness/`：runtime_verify、content_stress、adaptive_test、deck_shots、verify_corpus、**run_evals（七维门禁 ×28）**、regression（aHash 基线 266 幕）、verify_a11y、adversarial_eval、strategy_audience_eval、live_scenarios、**case_exec（案例级执行 100/100）**、verify_experimental |
| 技术取舍 | `audits/TECH_DECISIONS.md`：Accept 1 / Reject 2 / Downgrade 1 / Conditional 1 / Hold 2 |

---

## 2. 架构

```
SKILL.md（路由器 / progressive disclosure）
   ↓
Knowledge Layer（方法论：机制节点 + 证据分级；不依赖任何框架 API）
   ↓
Presentation IR（schemas/；validate_ir.py 强制校验）
   ↓
Renderer（scripts/render_ir.py）→ 自包含 HTML
   ↓
Runtime（零依赖：Scene Engine / Graph / Motion / Presenter / Reader / Print / Charts）
   ↓
Evals（evals/harness/；七维门禁 + 视觉回归）
```

**上游知识层**：`knowledge/`（认知 / 传播 / 演示 / 可视化 / 动效 / 交互）+ `knowledge/evidence_packages/`（13 个机制证据包）。
**下游运行时**：`runtime/`（生产，零依赖）+ `runtime/vendor/echarts.min.js`（唯一第三方）。

---

## 3. 研究证据链（Track A）

- **来源**：58 条登记，走获取阶梯 `PLANNED → FOUND → ACQUIRED → READ → ANNOTATED → VALIDATED → DISTILLED`；**18 条达 VALIDATED**（全文精读），3 条诚实标 `abstract_only`（禁止推断效应量）。
- **证据包（§6）**：13 个，含 mechanism / primary_sources / supporting / conflicting / experimental_context / boundary_conditions / effect_strength / common_misinterpretation / presentation_application / confidence。
- **节点状态**：`cognitive-load`、`working-memory`、`multimedia-learning`、`attention-fluency`、`assertion-evidence`、`headline-system`、`persuasion-elm`、`narrative`、`chart-selection`、`visual-perception`、`audience-modeling` 等已升 `partially_validated`；其余仍为 `memory_based`，**未虚标**。
- **实践派分层**：Reynolds / Duarte / Weissman / Minto / Tufte / Abela 标 `practitioner_framework`，不自动等于科学证据。
- **规则分级（§10）**：STRONG / SUPPORTED / CONTEXTUAL / PRACTITIONER / CONTESTED / INSUFFICIENT 六级已落地。

---

## 4. 运行时证据链（Track B）

| 能力 | 状态 | 证据 |
|---|---|---|
| Scene 引擎 / 线性导航 / 揭示步进 | tested | 跨引擎 22 项功能断言 |
| **Presentation Graph（分支/深潜/跳过/返回）** | tested | `adaptive_test.cjs`：进入、返回、揭示恢复全通过 |
| 语义动效（10 类 intent，可 pause/seek/skip） | tested | 修复「注册即被钉在首帧」缺陷后跨引擎复测 |
| 讲者台 / 搜索 / 总览 / 静帧 / 帮助 | tested | 弹窗·计时·笔记·命中跳转实测 |
| Reader（锚点/引用/展开/移动端） | tested | §27 清单逐项 |
| Print（@page = 设计画布） | tested | 幕数 = 页数，16:9，图表保留色彩 |
| Offline | tested | file:// 零外部请求（10/10 套） |
| ECharts 可视化 | accepted | 13 张图表 canvas 实际绘制 |
| GSAP / Three.js / Mermaid / D3 / View Transition / Live Data | rejected·downgraded·conditional·hold | 见 `audits/TECH_DECISIONS.md` |

**双轨汇合点**：Presentation IR —— 研究决定「表达什么、为何这样表达」，运行时决定「如何稳定实现」，两者在 IR 处对齐后才渲染。

---

## 5. 基准语料：类型 10/10；真实世界材料 10/10（§53 十类全覆盖达成）

### 5.0 真实世界语料（2026-09-11，10 例）

- ①国家统计局《2024年国民经济和社会发展统计公报》（54,459 字）→ 12 幕
- ②审计署《2024年度审计工作报告》（官方 PDF 27 页，16,963 字）→ 13 幕
- ③国务院《“十四五”数字经济发展规划》（gov.cn，14,206 字）→ 10 幕
- ④CNNIC《第55次中国互联网络发展状况统计报告》（官方 PDF 75 页，60,705 字）→ 9 幕
- ⑤国家发展改革委等《国家数据基础设施建设指引》（全文 10,211 字）→ 10 幕（技术架构类，含三阶段时间表/八大能力/三大统一/六类设施）
- ⑥贵州茅台《2024 年年度报告》（巨潮官方 PDF 143 页，前 45 页 53,097 字，附表未入语料）→ 9 幕（经营分析类）
- ⑦人社部《“技能中国行动”实施方案》（12,746 字）→ 8 幕（教育培训类）；⑧商务部等4部门《家电以旧换新通知》（2,390 字）→ 8 幕（销售类，薄材料不注水）；⑨国家发改委《西十高铁可研批复》（1,693 字）→ 8 幕（项目方案类，薄材料）；⑩《政府工作报告》2025（20,666 字）→ 8 幕（高管汇报类，形态解构）
- 十套共 71 幕；§53 十类全覆盖。上游工具化：`scripts/build_real_deck.py`（spec→五工件→闸门→渲染一键完成）+ 引文收割器（解决搜索快照措辞≠原文的系统性失配）。闸门多轮实测累计拦截：deck04 14 处通稿式引文（含分母错误）、deck05 1 处通稿引文 + 2 处 L3 缺 rationale、deck01 表格转换缺陷、deck02 3 处转写错误（漏字/引号形态）、deck06 4 处全角标点失配——全部按原文修正
- 工件链（每套齐全）：content-understanding → strategy → argument-map → scene-plan → IR → Deck
- 闸门：`scripts/validate_strategy.py`（引文逐字命中源材料 + 图表数值溯源 + source_values 声明 + overclaim 登记）全部 0 error
- 诚实声明：薄材料（西十高铁批复 1,693 字 / 家电以旧换新 2,390 字）不注水，按材料本身信息量成幕；茅台年报附表未入语料；deck03 反例（水泥/粗钢/煤炭占比）主动登记于 balance 幕

| 类型 | Deck | 幕数 | 图表 |
|---|---|---:|---:|
| 高管汇报 | 01-executive-portal-decision | 18 | 2 |
| 政府/国企项目 | 02-government-waterfront | 15 | 1 |
| 技术架构 | 03-tech-data-platform | 12 | 0 |
| 数据分析 | 04-data-quarterly-review | 10 | 3 |
| 教育培训 | 05-training-safety-induction | 9 | 0 |
| 销售/路演 | 06-sales-content-service | 10 | 1 |
| 研究报告 | 07-research-industry-briefing | 9 | 3 |
| 项目汇报 | 08-project-progress-review | 9 | 1 |
| 战略规划 | 09-strategy-three-year-plan | 10 | 0 |
| 复杂叙事 | 10-narrative-bookstore | 10 | 2 |

**合计 112 幕；幕内溢出 0；控制台错误 0。**

### 5.1 衍生育料（§54/§55）

`benchmarks/derived/`，与 corpus/01 同源：

- **同内容多受众**：`01-audience-ceo`（6 幕，结论先行、无实现术语）/ `02-audience-technical`（6 幕，集成·数据·接口·权限·运维）/ `03-audience-frontline`（5 幕，只说「对你有什么变化」）。
- **同内容多时长**：`04-duration-5min`（5 幕，只留决策链）/ `05-duration-15min`（10 幕，完整论证链 + 明细入附录）/ corpus/01（18 幕，≈20 分钟）。
- 结论完全一致，而**结构、密度、术语层次、论证深度与场景分配实际不同**——非换措辞或删页。

**总计：15 套 Deck / 144 幕，Evals 七维 15/15 通过。**

### 5.2 机制正反例（§20）

`evals/mechanisms/`：**25 条机制**，每条给出正例/反例对照、原则、**导出的渲染规则**与证据依据（数据源 `mechanisms.json` → `scripts/render_mechanisms.py` 渲染）。正/反例片段使用生产组件类名，画廊同时是组件契约的回归夹具。

---

## 6. 技术取舍（补丁 §4）

完整决议见 `audits/TECH_DECISIONS.md`。摘要：

- **ECharts → ACCEPT**：唯一进入生产的第三方（离线本地化，按需注入）。
- **GSAP → REJECT**：仅 S3 复杂编排有优势，代价 71 KB + **非 OSI 许可**；WAAPI 已覆盖本项目语义动效。
- **Three.js → REJECT**：594 KB，headless 44 fps；目标场景无「必须 3D」的信息结构（正反例已实测留档）。
- **Mermaid → DOWNGRADE**：3.26 MB 且默认主题与 Deck token 不统一；仅作草稿/中间表示，成品由语义组件输出。
- **D3 → CONDITIONAL**：确证存在 ECharts 明显劣势的定制叙事，按需引入且须带静态 fallback。
- **View Transition / Live Data → HOLD**。

---

## 7. Evals 与视觉回归（补丁 §22/§23）

- `run_evals.cjs`：每套 Deck 跑 **IR / Visual / Runtime / Browser（Chromium+WebKit） / Offline / Performance / Console** 七维门禁，输出 `evals_report.json`。
- 性能预算门禁：FCP ≤ 900ms、转场 FPS ≥ 45、资源数 ≤ 40。实测 25 套全部满足（FCP 36–88ms、FPS 60–62、资源 11–14）。
- `regression.cjs`：144 幕 8×8 感知哈希（aHash）基线 + 阈值比对，防止组件/主题改动引发跨 Deck 回归。
- 其余自动化：`verify_a11y.cjs`（对比度/字号/alt，25/25）、`adversarial_eval.cjs`（对抗守卫 6/6）、`strategy_audience_eval.cjs`（Strategy tested 10 / legacy 15 / fail 0 + Audience Adaptation 9 断言）、`live_scenarios.cjs`（§56 五剧本）。

---

## 8. 任务书 §70 十五问逐条回答

1. **哪些 Presentation Principles 有强研究依据？** — 多媒体学习（分段/冗余/时间临近/一致性）、认知负荷、工作记忆容量、图形感知编码排序、Assertion-Evidence（技术语境）等 11 个节点已升至 `partially_validated`，每个有 1–3 篇全文精读来源支撑（见 `knowledge/evidence_packages/`）。
2. **哪些只是专业实践经验？** — Reynolds / Duarte / Weissman / Minto / Tufte / Abela 的框架标 `practitioner_framework`；用户经验 6 条在 `knowledge/practitioner_hypotheses/registry.yaml`，其中 2 条 validated。
3. **哪些仍有争议？** — Tufte × Bateman（data-ink vs 修饰提升记忆）、Tufte × Doumont（密度）、Atkinson × Mayer（屏幕文字），均显式登记冲突证据并按 Presentation Mode 分层解决。
4. **每条核心规则来自哪些原始资料？** — `audits/TRACEABILITY_MATRIX.md` 与各 Evidence Package 的 `primary_sources` 字段；来源→节点→规则可回溯。
5. **哪些 Web 技术已经真实验证？** — 见上表 Track B：自研运行时全部 `tested`（Chromium + WebKit），ECharts `accepted`。
6. **哪些技术只停留在实验阶段？** — GSAP / Three.js（rejected）、Mermaid（downgraded）、D3（conditional）、View Transition / Live Data（hold），全部在 `experimental/`。
7. **每个高级技术解决什么传播问题？** — GSAP→长编排；Three.js→空间关系；Mermaid→结构草稿；D3→定制数据叙事；View Transition→状态连续性；Live Data→实时场景。逐条结论见 `TECH_DECISIONS.md`。
8. **核心 Runtime 在哪些浏览器和设备验证过？** — 三引擎：Chromium（Blink）与 WebKit（Playwright 内置）双引擎自动化实测，**真机 Safari 26.5.2 经 WebDriver 直连实测 25/25 通过**（双模式：设计画布 1920×1080 与原生窗口 800×652）；短屏适配经 1280×800 / 1366×768 / 800×652 三档验证，144 幕零溢出。设备为本机 macOS 桌面；Firefox 与移动端未验证并如实标注。
9. **断网能否运行？** — 能。10/10 套 file:// 离线加载，外部请求 0，图表与导航正常。
10. **Stage / Reader / Print 是否真实可用？** — 是。同源 IR 产出；Print 实测幕数 = 页数、16:9、图表保留色彩、导航控件不入档。
11. **非线性演示是否真正运行？** — 是。Presentation Graph 的分支/深潜/跳过/返回并恢复揭示进度，由 01/02 号 Deck 实际调用并通过端到端断言。
12. **是否使用真实中文复杂内容进行过压力测试？** — 是。**10 套真实世界材料全链路**（§53 十类全覆盖，71 幕）：统计公报 54,459 字 / 审计报告 16,963 字 / 数字经济规划 14,206 字 / CNNIC 60,705 字 / 数据基建指引 10,211 字 / 茅台年报 53,097 字 / 技能中国行动 12,746 字 / 家电以旧换新 2,390 字 / 西十高铁批复 1,693 字 / 政府工作报告 20,666 字——全部经 `validate_strategy.py` 逐字溯源命中原文，闸门多轮累计拦截 20+ 处通稿式转写并按原文修正。标题压力 6 类 × 2 分辨率 × 2 引擎 = 12/12 不溢出；**数据压力 8/8**（`evals/data_stress/`：20 分类长中文机构名、缺失值 null、正负混合、多单位双轴、小数百分比、极值跨度 1:145000）。
13. **同内容对不同 Audience 是否产生实质不同结果？** — **是**。`benchmarks/derived/` 的 CEO（6 幕）/技术（6 幕）/一线（5 幕）三版本同源，结构、密度、术语层次与判断标准实际不同（见 §5.1）。
14. **是否存在理论上正确但技术无法表达的机制？** — 未发现阻断性问题。§20 已产出 **25 条**机制正反例（`evals/mechanisms/`），每条均可在真实组件上呈现；若某机制无法在组件层表达，会在画廊中直接暴露——当前未出现。
15. **是否存在技术可以实现但不应该使用的表达方式？** — 是，且已显式拒绝：为炫技的 3D、无意义的复杂时间线、为丰富度引入的重型库（GSAP/Mermaid）。见 `TECH_DECISIONS.md` 与 `knowledge/anti_patterns/tech-abuse.md`。

---

## 9. Limitations（诚实清单）

1. **知识节点证据等级**：规模已达 53 节点 / 7 域（§20 画廊为 25 条机制建立正反例），但其中 22 个为 memory_based——需按证据包逐个完成全文精读后才能升级为 partially_validated（研究队列见 `knowledge/INDEX.md` 末节）。
2. **真实硬件分级（§32）**（iPad / iPhone / 低性能笔记本）与 **Firefox（§30）** 未验证（环境限制，如实标注）；真机 Safari 已于 2026-09-11 闭合。
3. **§56 剧本矩阵化**：`live_scenarios.cjs` 已覆盖 5 个剧本（时间不够跳段 / 证据深潜 / 技术深潜 / 合规分支 / 静帧直出），但「同一剧本跑遍全部 15 套 Deck」未做——各 Deck 场景 id 不同，需在 IR 中声明剧本锚点后方可矩阵化。
4. **`examples/demo/`** 仍为手写 HTML 产物，未回迁至渲染器（历史遗留；新 Deck 全部走渲染器）。

---

## 10. 完成度对照（强制补丁 §26）

| 条件 | 状态 |
|---|---|
| Research actually completed | 🟡 11 节点 partially_validated，其余如实标 memory_based；**13 证据包抽查 13/13 全覆盖**（累计拦截更正 5 处：1 错误归属 + 2 表述精确化 + 1 年份 + 1 图形读数口径；EP 级 0 矛盾） |
| Missing capabilities actually implemented | ✅ Renderer / Graph / Charts / Print / Offline |
| Runtime actually tested | ✅ Chromium + WebKit 双引擎，七维 Evals |
| Broken capabilities actually repaired | ✅ 动效首帧遮蔽、打印跨页、Reader 提示残留、图表缺图例、`<br>` 转义缺陷 |
| Skill actually rewritten | ✅ SKILL.md / schemas / runtime / components / workflows / audits / CHANGELOG |
| Real decks actually generated | ✅ 15 套合成（144 幕）+ **10 套真实世界材料全链路**（71 幕）；**§53 十类全覆盖达成** |
| Browsers actually tested | ✅ Blink + WebKit + **真机 Safari 26.5.2**（Firefox 未验证，已标注） |
| Offline actually tested | ✅ 10/10 零外部请求 |
| Evals actually run | 🟡 七维 × 25 + Strategy/Audience + a11y 25/25 + 对抗守卫 6/6 + 18 维 rubric 已打分（单评审局限如实记录）；**§67 案例级独立执行已落地（case_exec 100/100，mapped-deck focus eval 模式）**；「每案例全新生成」的 LLM 行为测试列 V1.0 |
| Regression actually passed | ✅ 144 幕 aHash 基线 |
| Live scenarios actually passed | ✅ §56 五剧本（跳段 / 证据 / 技术 / 合规 / 静帧） |

**结论（2026-09-13 Zcode 接力轮更新）：下游工程（渲染/运行时/三模式/三浏览器/自动验证）真实可靠；真实语料 §53 十类全覆盖达成，上游闸门（引文逐字溯源）经四轮实战拦截验证有效；证据链复核收官（13/13 包，拦截 5 处问题——派生层与引用细节是错误高发区）；§67 案例级执行落地（100/100）。剩余队列：每案例全新生成（LLM 行为测试）、Firefox/移动端（环境受限，如实标注）。**
