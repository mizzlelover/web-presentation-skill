# KN-ANTI-005 · Data Dump · 数据倾倒反模式

- knowledge_type: anti_pattern
- evidence_grade: B（机制层有实证）
- rule_status: anti_pattern
- verification: partially_validated   # 机制层：工作记忆上限与图形精度排序已验证；反模式本身无对照
- evidence_package: knowledge/evidence_packages/working-memory.yaml + graphical-perception.yaml
- source_ids: [SRC-FEW-2004, SRC-COWAN-2010, SRC-CLEVELAND-1986, SRC-DOUMONT-2005]
- last_reviewed: 2026-09-11

## 证据状态（诚实声明）
反模式本身无对照实验（不可能做），但其成立所依赖的两个机制均已验证：
①工作记忆中央容量 3–5 组块（COWAN-2010 全文）；②图形编码精度排序
（CLEVELAND-1986，EP graphical-perception 覆盖）。"把 20 列数据放上幻灯片"同时违反两者。

## Definition
把数据源原样搬上幻灯片（大表格、密集多系列图、无口径无结论），期望受众自己找重点。

## Core claim
幻灯片上的数据必须先经过"认知任务筛选"：这张图要回答什么问题？答不上来就不该出现。

## Mechanism
超出 3–5 组块的信息无法被同时加工；图形编码精度限制了多系列的分辨能力；
没有结论的数据表把"分析"工作全部转嫁给受众。

## Boundary conditions
- 备查附录（appendix）允许高密度——因为它的认知任务是"被查找"而非"被当场理解"。
- 决策受众有时**要求**看明细——正确做法是明细进附录/深潜，主线给结论。

## Common misinterpretations
- ❌ "数据多是严谨"——严谨在于口径与来源，不在于数量。
- ❌ "受众需要所有数据"——受众需要的是"支撑结论的数据 + 可核查的路径"。

## Presentation implications
corpus/07（行业研究）把明细全部放附录、主线只给三个发现；corpus/01 把财务明细做成
深潜幕（fin-model）而非主线——深潜 = "被查找"模式的正确用法。

## Related nodes
KN-COG-001 工作记忆、KN-VIS-006 前注意属性、KN-PRES-010 留档设计
