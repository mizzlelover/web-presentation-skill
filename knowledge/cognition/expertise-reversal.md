# KN-COG-007 · Expertise Reversal · 专长反转效应

- knowledge_type: scientific_mechanism
- evidence_grade: B+
- rule_status: supported_principle
- verification: partially_validated   # 依据 EP cognitive-load（SRC-SWELLER-2019）与 EP segmenting 的调节作用分析
- evidence_package: knowledge/evidence_packages/cognitive-load.yaml
- source_ids: [SRC-SWELLER-2019, SRC-REY-2019]
- last_reviewed: 2026-09-11

## 已验证条目（真实全文）
SWELLER-2019 系统论述专长反转：对新手有效的支撑手段（详细指导、强线索、临近呈现），
随着先备知识增长会**逐渐变成冗余**，反而损害学习。REY-2019 发现一处方向相反的调节：
高先验知识者在分段中获益更多——原文解释为高知识者有余裕资源把分段用于自我调控；
但该调节变异受限（仅 1 项真专家研究），EP 明确禁止写成"新手更受益"的军规。

## Definition
同一教学手段的效果随受众先备知识水平反向变化：对新手的帮助可能是对专家的干扰。

## Core claim
设计必须依受众专业度选择支撑强度；对专家要撤掉对新手的支撑。

## Mechanism
新手缺组块，需要外部支撑把元素组织起来；专家已有组块，外部支撑与他们的内部表征重复，
成为必须处理的冗余。

## Boundary conditions
- 转折点难以从外部判断；"专家"与"新手"在同一场受众里常常并存。
- 证据多来自教学情境；演讲语境属类比应用。

## Common misinterpretations
- ❌ "给专家看也一样有效"——冗余效应随专长增强。
- ❌ "新手永远更受益"——REY-2019 的反例表明方向并不总是一致。

## Presentation implications
这是本系统**受众建模字段 `expertise` 必填**的直接依据：同一内容生成多受众版本
（benchmarks/derived/ 的 CEO / 技术 / 一线三版本）时，差异必须在支撑强度上体现——
专家版删教学性铺垫与过度引导，新手版保留分段、术语预训练与操作级说明。

## Related nodes
KN-COG-009 冗余效应、KN-PRES-001 受众建模、KN-COG-006 瞬息信息
