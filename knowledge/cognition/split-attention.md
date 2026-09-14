# KN-COG-005 · Split Attention · 分散注意效应

- knowledge_type: scientific_mechanism
- evidence_grade: A
- rule_status: strong_principle
- verification: partially_validated   # 依据 EP cognitive-load（SRC-SWELLER-2019 全文精读）
- evidence_package: knowledge/evidence_packages/cognitive-load.yaml
- source_ids: [SRC-SWELLER-2019, SRC-SWELLER-1988]
- last_reviewed: 2026-09-11

## 已验证条目（真实全文）
SWELLER-2019 将分散注意列为认知负荷理论的核心效应之一：当学习者必须在多个空间或时间上
分离的信息源之间来回对照才能理解时，工作记忆被迫用于"搜索与配对"而非"理解"，产生
外在认知负荷（extraneous load）。

## Definition
多个必须互相参照才能理解的信息源，若在空间或时间上分离，会显著增加外在认知负荷并降低学习效果。

## Core claim
需要对照阅读的内容必须彼此邻近（空间临近 / 时间临近），否则理解成本被浪费在"找"上。

## Mechanism
理解需要把多个信息源在工作记忆中整合成单一表征；整合的前提是它们能被同时注意到。
分离迫使用户记住一处内容再看另一处，占用工作记忆容量。

## Boundary conditions
- 只适用于"必须互相参照"的信息源；彼此独立的信息分开摆放不是分散注意。
- 有经验者可凭先备知识整合（expertise reversal，见 KN-COG-007）。

## Common misinterpretations
- ❌ "所有内容都要堆在一处"——是"需要对照的"内容要靠近，不是所有内容。
- ❌ "图例集中就是整洁"——集中式图注迫使读者来回对照，可能恰是分散注意。

## Presentation implications
本系统组件层的两条硬规则由此导出：**图表的口径/说明必须与其在同一容器内**（R-CAPTION-INLINE）；
**图与解释必须在同一幕内同步揭示**（R-FIGURE-EXPLANATION-SAME-SCENE）。参见机制画廊 M04/M05。

## Related nodes
KN-COG-002 认知负荷、KN-VIS-001 图形感知、KN-COG-007 专长反转
