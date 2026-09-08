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
>
> 对应知识节点 cognitive-load / assertion-evidence 升级为 `partially_validated`。登记总数 37 → 43（VALIDATED 5 / FOUND 38，其中 SRC-SCHNEIDER-2018 付费墙仅摘要级 abstract_only）。

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
| cognition/working-memory | MEMORY_BASED | — |
| cognition/cognitive-load | **PARTIALLY_VALIDATED**（2026-09-08：SRC-SWELLER-2019 Springer OA 全文精读，Evidence Package 已建） | — |
| cognition/multimedia-learning | **PARTIALLY_VALIDATED**（2026-09-08：SRC-REY-2019 分段效应元分析全文精读，d 值逐项核对） | — |
| cognition/attention-fluency | MEMORY_BASED | — |
| presentation/assertion-evidence | **PARTIALLY_VALIDATED**（2026-09-08：SRC-GARNER-ALLEY-2013 PDF 全文精读，d=0.81/0.89 等效应量逐项核对，Evidence Package 已建） | Demo 标题系统实测渲染正常 |
| presentation/headline-system | MEMORY_BASED | 同上 |
| presentation/information-density | MEMORY_BASED | 三模式密度分离已在 Demo 实现 |
| presentation/audience-modeling | MEMORY_BASED | — |
| presentation/situation-taxonomy | MEMORY_BASED | — |
| presentation/qa-adaptation | MEMORY_BASED | 深潜/返回机制实测通过 |
| communication/argumentation · narrative · persuasion-elm · question-framing | MEMORY_BASED | — |
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
| 标题由 Cognitive Job 决定类型 | CONTEXTUAL HEURISTIC | Alley 系主张，原文未读 |
| "每页最多 6 行"作为通用规则 | CONTESTED（已列反模式） | 边界条件明确缺失 |
| 语义动效必须可 pause/seek/skip | PRACTITIONER HEURISTIC + 工程可验证 | 运行时已实现并实测 |

## 4. 研究覆盖表（§11 · PRESENTATION_RESEARCH_COVERAGE）

| Domain | Target | Found | Acquired | Full Read | Annotated | Validated | Distilled |
|---|---:|---:|---:|---:|---:|---:|---:|
| Multimedia Learning | 4+ | 2 | 0 | 0 | 0 | 0 | 0 |
| Cognitive Load | 4+ | 2 | 0 | 0 | 0 | 0 | 0 |
| Assertion-Evidence | 3+ | 3 | 0 | 0 | 0 | 0 | 0 |
| Audience | 3+ | 1 | 0 | 0 | 0 | 0 | 0 |
| Persuasion | 4+ | 6 | 0 | 0 | 0 | 0 | 0 |
| Narrative | 3+ | 3 | 0 | 0 | 0 | 0 | 0 |
| Information Visualization | 6+ | 9 | 0 | 0 | 0 | 0 | 0 |
| Public Speaking | 3+ | 2 | 0 | 0 | 0 | 0 | 0 |
| Document / Reader Mode | 3+ | 1 | 0 | 0 | 0 | 0 | 0 |

**优先级提示（§5）**：Multimedia Learning / Cognitive Load / Assertion-Evidence 三域应最先补齐，且优先取得 meta-analysis / systematic review 全文（Mayer Handbook、Sweller 综述、Garrett/Alley 实验组），按 §4 至少读取 Abstract→Limitations 六段并按 §6 生成 Evidence Package。

## 5. P0 整改清单（对应 §68）

1. 为 §6 所列 15 个核心领域逐域实际取得并阅读至少 1 篇综述/元分析 + 1 篇原始实验，产出 Evidence Package（含 effect_strength 与 boundary_conditions）。
2. 每条来源补齐 `acquisition` 字段组（见更新后的 schemas/source.yaml）：ladder 状态、获取方式、阅读范围、标注位置。
3. 禁止任何新节点在未达 VALIDATED 前写入"规则"语气；一律先落 practitioner_hypotheses/registry.yaml。
4. 对 §7 涉及的实践派作者（Reynolds/Duarte/Weissman/Minto/Tufte/Abela）统一标注 `knowledge_type: practitioner_framework`（schemas 已支持）。
