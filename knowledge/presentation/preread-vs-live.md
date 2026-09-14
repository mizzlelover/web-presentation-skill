# KN-PRES-009 · Pre-read vs Live · 会前材料与现场演示是两种产物

- knowledge_type: practitioner_mechanism
- evidence_grade: D+
- rule_status: practitioner_framework
- verification: memory_based   # SRC-WEISSMAN-2003 / SRC-MINTO-1987 实践著作；EP 层面无实证
- evidence_package: （无——实践框架层）
- source_ids: [SRC-WEISSMAN-2003, SRC-MINTO-1987, SRC-TUFTE-2003]
- last_reviewed: 2026-09-11

## 证据状态（诚实声明）
实践共识：会前预读材料与现场演示的目标状态不同（自读无讲者 → 需自足；现场有讲者 → 可精简）。
无实证证据包；与 KN-COG-009（冗余）和 KN-COG-004（双通道）的已验证机制方向一致，
属"实践框架 + 已验证机制的推论"。

## Definition
会前材料是"无讲者的自足文档"，现场演示是"有讲者的认知脚手架"；两者不应是同一文件的两种导出。

## Core claim
把现场版直接当会前材料发出去（或反之），至少一边会失效——这正是 One Content Model
要求 stage/reader 双内容的原因。

## Mechanism
无讲者时文字必须承担全部解释（信息密度↑）；有讲者时文字承担结构、讲者承担解释（密度↓）。
同一段文字无法同时满足两个最优解。

## Boundary conditions
- 时间极紧的决策会可能要求"现场只讲材料里没有的结论"（5 分钟版的设计依据）。
- 留档（leave-behind）介于两者之间：无讲者，但读者有背景。

## Common misinterpretations
- ❌ "发材料 = 不用讲了"——预读改变的是演示的内容结构，不是取消演示。
- ❌ "一稿两用省事"——直接违反本系统 One Content Model 的分层设计。

## Presentation implications
corpus/01 的 `content.stage` 与 `content.reader` 字段、derived/ 的 5 分钟版（结论先行，
假设已读材料）都是本节点的实现。工程上由 R-MODE-SPLIT-CONTENT 强制。

## Related nodes
KN-COG-009 冗余效应、KN-COG-012 双通道、KN-PRES-010 留档设计
