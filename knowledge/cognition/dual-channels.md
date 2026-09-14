# KN-COG-012 · Dual Channels · 双通道假设

- knowledge_type: scientific_mechanism
- evidence_grade: A
- rule_status: strong_principle
- verification: partially_validated   # 依据 EP cognitive-load（SRC-SWELLER-2019 全文精读）；Mayer 2001 / Baddeley 1992 为 memory_based
- evidence_package: knowledge/evidence_packages/cognitive-load.yaml
- source_ids: [SRC-SWELLER-2019, SRC-MAYER-2001, SRC-BADDELEY-1992]
- last_reviewed: 2026-09-11

## 已验证条目（真实全文）
SWELLER-2019（认知负荷理论 20 年修订）确认工作记忆的加工通道部分独立：视觉/图示通道与
听觉/言语通道各有容量上限，分工处理可扩大总体加工容量；但**中央容量不随通道翻倍**
（与 KN-COG-001 的 3–5 组块上限一致，SRC-COWAN-2010）。

## Definition
人类通过视觉/图示与听觉/言语两条部分独立的通道加工信息；两条通道的容量各自有限。

## Core claim
图形配口头讲解优于图形配大段屏读文字——前者把负荷分到两条通道，后者把两条通道的负载都压在视觉上。

## Mechanism
图与文字若都进入视觉通道（阅读），视觉通道必须同时完成"识别图形"与"解码文字"；
语音通道空闲时是浪费，被占用时反而帮助图示加工。

## Boundary conditions
- 仅当图形与讲解**内容互补**时双通道才有收益；内容重复则触发冗余效应（KN-COG-009）。
- 听觉讲解需与图形**同时**呈现，否则是时间临近问题（KN-COG-003 多媒体学习原则）。
- 受众需阅读图形本身的能力（先备知识调节）。

## Common misinterpretations
- ❌ "语音永远比文字好"——内容重复时（讲者念屏幕文字）双通道反而有害。
- ❌ "两条通道 = 容量翻倍"——中央容量仍受 3–5 组块限制。

## Presentation implications
Stage 模式：屏幕给图形与关键词，解释交给讲者（这是本系统 `content.stage` 精简、
`speaker_notes` 独立分层的设计依据）。Reader 模式无讲者语音，文字必须自足——同一内容两种模式密度不同的理论根据。

## Related nodes
KN-COG-001 工作记忆、KN-COG-009 冗余效应、KN-PRES-003 信息密度、KN-PRES-009 会前材料 vs 现场演示
