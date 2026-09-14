# KN-VIS-004 · Data-Ink Controversy · 数据墨水之争（显式冲突）

- knowledge_type: contested_debate
- evidence_grade: B（双方均有实证）
- rule_status: contested
- verification: memory_based   # 双方原始文献已登记未全文精读；冲突本身已在 seed_corpus 显式登记
- evidence_package: knowledge/evidence_packages/graphical-perception.yaml（感知层）；装饰效应见 EP coherence-seductive-details
- source_ids: [SRC-TUFTE-1983, SRC-BATEMAN-2010, SRC-DOUMONT-2005]
- last_reviewed: 2026-09-11

## 证据状态（诚实声明）
这是本 Skill 显式登记的**三大冲突证据之一**：Tufte 的"数据墨水比最大化"（删除一切非数据墨水）
与 Bateman-2010 的"图表修饰（visual embellishment）提升记忆与认同"（"Useful Junk?" 实验）
方向相反。Doumont 则批评 Tufte 的密度主张。双方文献均已登记、未全文精读——
按纪律，本节点只陈述冲突，不裁决。

## Definition
图表应删到只剩数据（Tufte），还是适度修饰可提升记忆与投入（Bateman）——这是未决的实证问题。

## Core claim
不存在"图表越素越好"的普适规则；正确答案依赖任务（核查 vs 记忆 vs 传播）与受众。

## Mechanism
（两种机制并存）删除装饰减少无关加工（KN-COG-008 的逻辑）；但"不寻常的图形"形成
独特记忆痕迹（distinctiveness），提升再认——两者的净效应取决于任务指标。

## Boundary conditions
- 任务是**准确读数** → 素净占优；任务是**记忆与传播** → 适度修饰可能占优。
- 修饰不得损害编码准确性（Bateman 的实验亦确认读数精度下降）。

## Common misinterpretations
- ❌ "Tufte 说了算"——他的主张在记忆任务上被实证反驳。
- ❌ "Bateman 说明装饰无害"——读数精度受损是同篇结论。

## Presentation implications
本系统的处理：默认素净（服务读数与核查），把"装饰"显式留给 `brand.constraints` 与
主题 tokens，且要求 justify——把冲突降级为**可配置的语境选择**，而非二选一的教条。

## Related nodes
KN-COG-008 诱惑性细节、KN-VIS-003 图表诚信、KN-PRES-003 信息密度
