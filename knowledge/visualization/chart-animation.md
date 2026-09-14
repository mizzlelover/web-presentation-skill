# KN-VIS-007 · Chart Animation · 图表动画

- knowledge_type: scientific_mechanism（应用）
- evidence_grade: C+
- rule_status: contextual_heuristic
- verification: memory_based   # FRANCONERI-2021 综述提及动态图表的认知权衡；缺演示情境直接实证
- evidence_package: （无——待建包）
- source_ids: [SRC-FRANCONERI-2021, SRC-HEER-2010, SRC-REY-2019]
- last_reviewed: 2026-09-11

## 证据状态（诚实声明）
图表动画的"过渡保持对象连续性"（transition + 对象追踪）在可视化研究中被广泛采用（Heer &
Bostock 的图表变换研究），但其对**理解**的净效应证据不足，且与瞬息信息效应（KN-COG-006）
方向相反。标 CONTEXTUAL HEURISTIC。

## Definition
图表动画有用例（数据变化时保持对象连续）也有风险（延长加工时间、遮蔽终态）。

## Core claim
动画只在"表达数据如何从 A 变到 B"时有认知价值；入场动画（fade-in everywhere）是负资产。

## Mechanism
对象连续性帮助受众把前后状态理解为同一实体的变化；无意义的入场动画只增加时间而不增加信息。

## Boundary conditions
- 打印/Reader/静帧模式下动画必须落到终态（否则内容不可读）。
- reduced-motion 用户与低性能设备上必须可关闭。

## Common misinterpretations
- ❌ "图表出现时飞入更专业"——无信息增量，且推迟数据可见时间。
- ❌ "动画能让数据更易懂"——只有**保持连续性的变换**有此作用。

## Presentation implications
本系统的实现：图表动画时长 600ms 仅用于首次渲染（数据从 0 生长到值，属"出现"而非"变换"），
`reduced-motion` 与 print 模式下关闭并直接绘制终态；`WPCharts.printAll()` 在打印前强制重绘终态。

## Related nodes
KN-MOT-001 语义动效、KN-COG-006 瞬息信息、KN-VIS-001 图形选择
