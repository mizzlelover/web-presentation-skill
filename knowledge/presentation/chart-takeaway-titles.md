# KN-PRES-007 · Chart Takeaway Titles · 图表标题写结论

- knowledge_type: practitioner_mechanism
- evidence_grade: C+
- rule_status: contextual_heuristic
- verification: memory_based   # FRANCONERI-2021 / BATEMAN-2010 已登记未全文精读；与 KN-PRES-001 的断言标题系统同源
- evidence_package: knowledge/evidence_packages/dataviz-communication.yaml（部分覆盖）
- source_ids: [SRC-FRANCONERI-2021, SRC-BATEMAN-2010, SRC-KNAFLIC-2015]
- last_reviewed: 2026-09-11

## 证据状态（诚实声明）
"图表标题应写结论而非主题"是数据可视化实践的高度共识（KNAFLIC/FEW/FRANCONERI 均主张），
但缺乏演示情境的对照实验。与 Assertion-Evidence（KN-PRES-004，有实验证据）同构，
故规则状态为 CONTEXTUAL HEURISTIC，待与 KN-PRES-004 的证据链合并后可升级。

## Definition
图表的标题/说明应陈述"这张图说明了什么"，而不是"这张图是什么"。

## Core claim
"三季度增长全部来自老客复购"（结论式）优于"三季度营收与客群构成"（主题式）——
它直接压缩了受众的解读路径。

## Mechanism
与断言标题同理：给出预期结论，受众把图当作证据核对，而非从图形反推结论（降低工作记忆需求）。

## Boundary conditions
- 探索式/审计式场合（需要受众自行找模式）应使用中性主题式标题——结论式标题会锚定注意。
- 结论必须是图能支持的；图与结论不符是最严重的诚信问题。

## Common misinterpretations
- ❌ "所有图表标题都写结论"——备查附录、探索分析用主题式。
- ❌ "写结论就不用交代口径"——口径（caption）是另一条强制规则（R-CHART-CAPTION-REQUIRED）。

## Presentation implications
本系统的 chart block 强制带 `caption`（口径），headline 承担结论——两者分工：
headline 是断言，caption 是口径与限定。corpus/04 与 corpus/07 全部按此实现。

## Related nodes
KN-PRES-004 断言-证据、KN-VIS-003 图表诚信、KN-VIS-001 图形选择
