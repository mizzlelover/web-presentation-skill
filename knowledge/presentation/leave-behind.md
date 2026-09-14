# KN-PRES-010 · Leave-behind Design · 留档设计

- knowledge_type: practitioner_mechanism
- evidence_grade: D+
- rule_status: practitioner_framework
- verification: memory_based   # SRC-TUFTE-2003 / SRC-WEISSMAN-2003 实践著作；工程上由打印模式实测支撑
- evidence_package: （无——实践框架层）
- source_ids: [SRC-TUFTE-2003, SRC-WEISSMAN-2003]
- last_reviewed: 2026-09-11

## 证据状态（诚实声明）
实践框架。Tufte 的"幻灯片吞吐量低"批评与 Weissman 的留档主张都属实践判断；
本系统用**工程实测**部分支撑了它的可实现性（打印 18 幕 = 18 页、显示引用、保留图表色彩），
但不构成对"留档更有效"的实证。

## Definition
留档是会议后独立流通的文档：无讲者、可批注、可存档、可被断章取义。

## Core claim
留档稿必须能在无讲者条件下自足，并承受"被单独截取传播"的考验——它需要比现场版更完整的口径与来源。

## Mechanism
（实践解释）留档的读者缺上下文，缺来源的数字不可核查；被截取传播的风险要求每页自带限定语。

## Boundary conditions
- 某些演示明确不做留档（现场保密内容）——应显式声明而非默认。
- 留档不等于把所有附录塞进去；是"自足 + 可核查"，不是"更多"。

## Common misinterpretations
- ❌ "打印版就是现场版的缩小"——需要不同的信息组织（本系统 print_state 字段的依据）。
- ❌ "留档要好看"——可核查性优先于观感（来源行、口径、限定条件）。

## Presentation implications
运行时 print 模式的三条硬规则由此而来：显示来源行（`.wpk-src`）、保留图表印刷色彩、
隐藏交互控件与导航链接（留档稿不应出现"点这里"）。

## Related nodes
KN-PRES-009 会前材料与现场、KN-VIS-003 图表诚信、KN-COM-006 来源可信度
