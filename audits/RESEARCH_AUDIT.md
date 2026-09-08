# RESEARCH_AUDIT.md — Track A 研究证据链审计

> 依据《真实研究与技术验证强制补丁》§1–§11、§66、§67 执行。
> 审计日期：2026-09-07 · 审计人：项目维护流程
> 核心原则：**A citation is not research.** 找到 ≠ 读过；模型先验知识 ≠ 已验证研究。

## 0. 总体结论（不回避）

本项目知识层（37 条来源登记、14 个知识节点、3 个反模式、6 条经验假设）在构建时**主要来自模型先验知识与既有二手了解**，并未在项目流程内逐篇实际取得、阅读、标注原文。按补丁标准重新定级：

| 补丁状态阶梯 | 本项目实际达到 | 数量 |
|---|---|---:|
| PLANNED / FOUND（知道标题与核心命题） | ✅ 全部达到 | 37 |
| ACQUIRED（实际取得原文文件） | ❌ 项目内未取得 | 0 |
| READ（实际读完全文/关键章节） | ❌ 无法举证 | 0 |
| ANNOTATED / VALIDATED / DISTILLED | ❌ | 0 |

**因此：原 `access_status: full_text`（28 条）的写法构成虚标，现全部降级纠正。** 这些条目的"内容摘要"多数与学界共识一致、方向可用，但按补丁标准只能记为 **MEMORY_BASED**，不得继续作为高置信规则的直接依据。

> **2026-09-08 整改执行更新**：seed_corpus.yaml 已实际迁移至补丁 §3 acquisition 阶梯 Schema（旧 `access_status` 字段已删除，37 条旧来源全部落为 `ladder: found / verification: memory_based`）。同日真实获取并全文精读 2 篇开放原文，升级为 **VALIDATED**：
>
> | 新来源 | 获取方式 | 已读章节 | 入库产物 |
> |---|---|---|---|
> | SRC-SWELLER-2019（CLT 20 年修订综述，Ed. Psych. Review，CC-BY） | Springer OA 全文 | abstract/introduction/method/results/discussion/limitations | `knowledge/evidence_packages/cognitive-load.yaml` |
> | SRC-GARNER-ALLEY-2013（AE vs CP 对照实验，IJEE 29(6)） | Penn State 托管 PDF 全文 | 同上，效应量逐项核对原文 | `knowledge/evidence_packages/assertion-evidence.yaml` |
> | SRC-REY-2019（分段效应元分析，Ed. Psych. Review 31(2)） | 作者官网自存档 PDF，pdfplumber 全文提取 | 六段全读，含 §5 元分析模板提取 | `knowledge/evidence_packages/segmenting.yaml` |
> | SRC-CLEVELAND-1986（图形感知实验，IJMMS 25:491-500） | VT 托管 PDF，pdfplumber 全文提取 | 六段全读，N=127/排序/边界核对 | `knowledge/evidence_packages/graphical-perception.yaml` |
> | SRC-FRANCONERI-2021（可视化沟通科学综述，PSPI 22(3)） | gwern.net 作者开放版 PDF，pdfplumber 全文提取 | 摘要/精确性/效率/可理解性/不确定性/风险沟通/Summary | `knowledge/evidence_packages/dataviz-communication.yaml` |
> | SRC-TRYPKE-2023（冗余效应两类系统综述，Frontiers Psych. 14） | Frontiers 官方 OA PDF，pdfplumber 全文提取 | 六段全读，四场景/调节因素逐项核对 | `knowledge/evidence_packages/redundancy.yaml` |
> | SRC-COWAN-2010（工作记忆容量综述，Curr. Dir. Psychol. Sci. 19(1)） | PMC 开放全文 | 六段全读 | `knowledge/evidence_packages/working-memory.yaml` |
> | SRC-PETTY-1984（ELM 来源因素，ACR 11:668-672） | Petty 官网自存档扫描件，pypdfium2 渲染逐页视觉精读 | 六页全读（摘要/框架/三组实验/结论） | `knowledge/evidence_packages/persuasion-elm.yaml` |
> | SRC-AIPPERSBACH-2013（AE 幻灯片制作影响讲者理解，ASEE #5691） | Penn State writing.engr.psu.edu 官方 PDF，pdfplumber 全文提取 | 六段全读，t(51)=2.62 / F(1,52)=9.92 / Table 1 逐项核对 | 并入 `assertion-evidence.yaml` |
> | SRC-GARNER-2009-PSYCH（AE 的认知心理学视角，Tech. Comm. 56(4):331-345） | Penn State 官方 PDF，断点续传 + pdfplumber 全文提取 | 全文 15 页，语料观察数据与设计细则逐项核对 | 并入 `assertion-evidence.yaml` |
> | SRC-LIU-2022-TEMPORAL（时间临近效应的幻灯片新应用，ETR&D） | PMC 开放全文（PMC8800848）HTML 精读 | 六段全读，三组对照 d=.51/.67/2.73 逐项核对 | `knowledge/evidence_packages/temporal-contiguity.yaml` |
>
> 新增 abstract_only：SRC-GINNS-2006（空间/时间临近元分析，Elsevier 付费墙，仅 ERIC 摘要，禁止推断效应量）。
> 对应知识节点 cognitive-load / assertion-evidence / headline-system / multimedia-learning 升级为 `partially_validated`。登记总数 37 → 51（VALIDATED 11 / abstract_only 3 / FOUND 37）。

## 1. 来源重新分类（§67）

37 条来源统一重新标记为 `verification: MEMORY_BASED`，阶梯状态 `FOUND`。纠正映射：

| 原标记 | 数量 | 纠正为 | 理由 |
|---|---:|---|---|
| full_text | 28 | FOUND / MEMORY_BASED | 项目内无获取与阅读记录，内容为模型先验 |
| summary | 7 | FOUND / MEMORY_BASED | 同上 |
| secondary | 2 | FOUND / MEMORY_BASED | 同上（诚实等级不变） |

## 2. 知识节点重新分类（§67）

`knowledge/` 下 14 个机制节点 + 3 个反模式：全部 **MEMORY_BASED**。其中以下节点因 Demo/Runtime 行为已被浏览器实测"表达有效"，可视为工程侧面被验证（Track B），但**科学主张本身仍未经原文验证**：

| 节点 | 科学证据状态 | 工程侧验证 |
|---|---|---|
| cognition/working-memory | **PARTIALLY_VALIDATED**（2026-09-08：SRC-COWAN-2010 PMC 全文精读，3–5 组块上限及边界条件核对） | — |
| cognition/cognitive-load | **PARTIALLY_VALIDATED**（2026-09-08：SRC-SWELLER-2019 Springer OA 全文精读，Evidence Package 已建） | — |
| cognition/multimedia-learning | **PARTIALLY_VALIDATED**（2026-09-08：SRC-REY-2019 分段效应 + SRC-TRYPKE-2023 冗余效应系统综述全文精读） | — |
| cognition/attention-fluency | MEMORY_BASED | — |
| presentation/assertion-evidence | **PARTIALLY_VALIDATED**（2026-09-08：SRC-GARNER-ALLEY-2013 PDF 全文精读，d=0.81/0.89 等效应量逐项核对，Evidence Package 已建） | Demo 标题系统实测渲染正常 |
| presentation/headline-system | **PARTIALLY_VALIDATED**（2026-09-08：SRC-AIPPERSBACH-2013 讲者侧实验 + SRC-GARNER-2009-PSYCH 理论映射/语料观察全文精读） | 同上 |
| presentation/information-density | MEMORY_BASED | 三模式密度分离已在 Demo 实现 |
| presentation/audience-modeling | MEMORY_BASED | — |
| presentation/situation-taxonomy | MEMORY_BASED | — |
| presentation/qa-adaptation | MEMORY_BASED | 深潜/返回机制实测通过 |
| communication/persuasion-elm | **PARTIALLY_VALIDATED**（2026-09-08：SRC-PETTY-1984 作者官网扫描件六页精读） | — |
| communication/argumentation · narrative · question-framing | MEMORY_BASED | — |
| visualization/chart-selection | **PARTIALLY_VALIDATED**（2026-09-08：SRC-CLEVELAND-1986 全文精读，排序/样本/边界逐项核对） | — |
| visualization/visual-perception | **PARTIALLY_VALIDATED**（2026-09-08：SRC-FRANCONERI-2021 全文精读） | — |
| motion/semantic-motion | MEMORY_BASED | WAAPI 动效控制实测通过 |
| interaction/interaction-patterns | MEMORY_BASED | 总览/静帧/分支实测通过 |

## 3. 规则状态套用（§10）

现行文档中的规则按六级状态重新归口（抽样）：

| 规则 | 状态 | 依据 |
|---|---|---|
| 禁止 Input→HTML 一步到位，必须走 IR 管线 | SUPPORTED PRINCIPLE | 工程必要性 + 实践一致性，但无对照实验 |
| Speaker Notes 必须是三层中最详细 | PRACTITIONER HEURISTIC | 实践框架，无直接实验 |
| 标题由 Cognitive Job 决定类型 | SUPPORTED PRINCIPLE | 受众侧+讲者侧实验全文验证（d=0.81 / p=0.01），边界限工程/教学语境 |
| "每页最多 6 行"作为通用规则 | CONTESTED（已列反模式） | 边界条件明确缺失 |
| 语义动效必须可 pause/seek/skip | PRACTITIONER HEURISTIC + 工程可验证 | 运行时已实现并实测 |

## 4. 研究覆盖表（§11 · PRESENTATION_RESEARCH_COVERAGE）

| Domain | Target | Found | Acquired | Full Read | Annotated | Validated | Distilled |
|---|---:|---:|---:|---:|---:|---:|---:|
| Multimedia Learning | 4+ | 7 | 7 | 3 | 3 | 3 | 3 |
| Cognitive Load | 4+ | 2 | 2 | 2 | 2 | 2 | 2 |
| Assertion-Evidence | 3+ | 6 | 3 | 3 | 3 | 3 | 3 |
| Audience | 3+ | 1 | 0 | 0 | 0 | 0 | 0 |
| Persuasion | 4+ | 6 | 1 | 1 | 1 | 1 | 1 |
| Narrative | 3+ | 3 | 0 | 0 | 0 | 0 | 0 |
| Information Visualization | 6+ | 9 | 2 | 2 | 2 | 2 | 2 |
| Public Speaking | 3+ | 2 | 0 | 0 | 0 | 0 | 0 |
| Document / Reader Mode | 3+ | 1 | 0 | 0 | 0 | 0 | 0 |

**优先级提示（§5）**：Multimedia Learning / Cognitive Load / Assertion-Evidence 三域应最先补齐，且优先取得 meta-analysis / systematic review 全文（Mayer Handbook、Sweller 综述、Garrett/Alley 实验组），按 §4 至少读取 Abstract→Limitations 六段并按 §6 生成 Evidence Package。

## 5. P0 整改清单（对应 §68）

1. 为 §6 所列 15 个核心领域逐域实际取得并阅读至少 1 篇综述/元分析 + 1 篇原始实验，产出 Evidence Package（含 effect_strength 与 boundary_conditions）。
2. 每条来源补齐 `acquisition` 字段组（见更新后的 schemas/source.yaml）：ladder 状态、获取方式、阅读范围、标注位置。
3. 禁止任何新节点在未达 VALIDATED 前写入"规则"语气；一律先落 practitioner_hypotheses/registry.yaml。
4. 对 §7 涉及的实践派作者（Reynolds/Duarte/Weissman/Minto/Tufte/Abela）统一标注 `knowledge_type: practitioner_framework`（schemas 已支持）。
