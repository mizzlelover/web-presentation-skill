# KN-ANTI-004 · Template-first · 模板优先反模式

- knowledge_type: anti_pattern
- evidence_grade: D（实践判断，方向由已验证机制支撑）
- rule_status: anti_pattern
- verification: memory_based   # REYNOLDS-2008 / DUARTE-2008 实践著作；机制层由 COG-008 / COG-002 支撑
- evidence_package: （无——反模式层）
- source_ids: [SRC-REYNOLDS-2008, SRC-DUARTE-2008, SRC-ATKINSON-2005]
- last_reviewed: 2026-09-11

## 证据状态（诚实声明）
反模式层的证据形态是"实践共识 + 已验证机制的推论"：选模板 → 内容被塞进既定版式 →
版式与内容不匹配 → 触发分散注意（KN-COG-005）或冗余（KN-COG-009）。机制已验证，
反模式本身无对照实验（也不可能有：反模式无法随机分配）。

## Definition
从"选一个好看的模板"开始做演示，然后把内容塞进模板的既定结构。

## Core claim
模板决定结构，内容被迫迁就结构——这是本 Skill 禁止 Input → HTML 一步到位的同源问题。

## Mechanism
模板预设了版式、层级与信息密度；当内容是三类对比而模板是四格图时，要么删内容要么凑格子——
两者都损害传播（分别对应信息缺失与虚假对称）。

## Boundary conditions
- 模板作为**主题 tokens**（颜色/字体/间距）是安全且必要的——本系统 themes/ 就是这么做的。
- 反模式针对的是"版式结构模板"，不是"设计系统"。

## Common misinterpretations
- ❌ "不用模板就是随便设计"——本系统用 design tokens + 语义组件替代模板，约束更强而非更弱。
- ❌ "模板效率高"——省下的时间会在内容迁就结构时加倍还回去。

## Presentation implications
管线强制 Strategy → IR → Renderer：先定认知任务与信息结构（visual_semantics），
再由组件承载（wpk-cmp / wpk-time / wpk-grid…）。主题只提供 tokens，不提供版式。

## Related nodes
KN-ANTI-002 装饰优先、KN-COG-005 分散注意、KN-PRES-005 情境分类
