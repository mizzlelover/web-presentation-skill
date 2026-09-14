# KN-VIS-003 · Chart Integrity · 图表诚信

- knowledge_type: scientific_mechanism（伦理规范）
- evidence_grade: B
- rule_status: strong_principle
- verification: memory_based   # SRC-CAIRO-2016 / SRC-TUFTE-1983 已登记未全文精读；截断轴与比例失真的误导性是领域共识
- evidence_package: （无——伦理规范层，属本 Skill 不可协商条款）
- source_ids: [SRC-CAIRO-2016, SRC-TUFTE-1983, SRC-FEW-2004]
- last_reviewed: 2026-09-11

## 证据状态（诚实声明）
"截断坐标轴夸大差异、双轴误用、面积与数值不成比例"具有误导性——这是可视化领域的共识性
规范（Cairo 称之为"图表诚信"），但误导的**量级**是实证问题且随情境变化。本 Skill 将其列为
不可协商的伦理条款，证据状态如实标注。

## Definition
图表诚信 = 数据、比例、参照点与口径四者共同决定图表的真实含义；任一被操纵即为欺骗。

## Core claim
误导性图表不是风格问题，是伦理问题——本 Skill 禁止交付。

## Mechanism
受众默认坐标轴从零起、比例与面积对应数值、参照点是"正常水平"；违反默认即制造错误推断。

## Boundary conditions
- 截断轴在**明确标注**且量级差异需要分辨时有正当用途（如折线图展示趋势形态）——条件是标注。
- 双轴允许存在，但两系列量纲差异极大时禁止（本系统强制次轴用折线并标单位）。

## Common misinterpretations
- ❌ "加了数据来源就诚信"——来源真实不等于呈现不误导。
- ❌ "观众不会注意轴"——恰恰因为不注意才有误导效果。

## Presentation implications
R-CHART-CAPTION-REQUIRED（validate_ir 已实现：chart 缺 caption 报 warning）；
print 模式强制显示口径与来源；renderer 对 chart.kind 与 caption 的组合做存在性校验。

## Related nodes
KN-VIS-004 数据墨水之争、KN-VIS-001 图形选择、KN-COM-006 来源可信度
