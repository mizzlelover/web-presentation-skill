# KN-MOT-002 · Functional Motion Functions · 动效的三种认知功能

- knowledge_type: scientific_mechanism
- evidence_grade: B+
- rule_status: supported_principle
- verification: partially_validated   # 依据 EP attention-cueing（SRC-DEKONING-2009 三功能综述全文精读）
- evidence_package: knowledge/evidence_packages/attention-cueing.yaml
- source_ids: [SRC-DEKONING-2009, SRC-MAYER-2001]
- last_reviewed: 2026-09-11

## 已验证条目（真实全文）
DEKONING-2009（Attention Cueing 框架综述，Springer OA）把**线索（cueing）**的功能分为三类——
①**selection 选择**（线索把注意引向特定位置）；②**organization 组织**（线索强调结构）；
③**integration 整合**（线索外显元素之间与内部的关系）。
原文结论：**selection 线索可促进动画中的信息选择、有时改善学习；organization 与
integration（关系型）线索则需要更多关于如何促进理解的考量**——即选择型证据最稳，
关系型证据混合（与 KN-COG-004/attention-fluency 节点记录一致）。
> 更正记录（2026-09-11 抽查）：本节点此前把该文三功能误写为「注意引导/激活先备知识/抑制误解」，
> 系与其他文献框架混淆，已按原文更正——这正是 EVIDENCE_SPOTCHECK 机制存在的理由。

## Definition
动效的认知价值来自它能承担的功能；不承担功能的动效是装饰，且常为负资产。

## Core claim
每一个动效必须能回答"它属于哪一类功能、替代的静态方案为什么不够"。

## Mechanism
动态与静态的差异在"过程"信息的表达上：静态图无法表达时序因果与状态迁移。

## Boundary conditions
- 选择型（selection）动效的有效性依赖与讲解的**时间同步**（不同步 = 分散注意）。
- 组织型/整合型（organization/integration）动效证据混合，设计与验证成本更高——对应本系统
  CONNECT/TRACE 类 intent 须给出比 REVEAL 更强的 rationale。

## Common misinterpretations
- ❌ "动效让演示更生动"——生动是副产品，不是功能。
- ❌ "能做的动效都做"——与诱惑性细节同构（KN-COG-008）。

## Presentation implications
本系统的 10 类语义动效（REVEAL/FOCUS/CONNECT/TRANSFORM/TRACE/ACCUMULATE/COMPARE/CAUSE/
CONTINUITY/REMOVE）即按功能分类；`motion_intent` 必填且只能取这 10 类（validate_ir 强制），
并要求能回答"为什么静态不够"。

## Related nodes
KN-MOT-001 语义动效、KN-MOT-003 动效与负荷、KN-COG-004 注意线索
