# KN-PRES-012 · Live Failure Planning · 现场故障预案

- knowledge_type: practitioner_mechanism
- evidence_grade: D
- rule_status: practitioner_framework
- verification: engineering_validated   # 本条为工程实践：运行时的降级路径已实测（离线/静帧/无动效/打印兜底）
- evidence_package: （工程证据，见 audits/CAPABILITY_VERIFICATION）
- source_ids: [SRC-GALLO-2010, SRC-REYNOLDS-2008]
- last_reviewed: 2026-09-11

## 证据状态（诚实声明）
"现场会出事"是实践共识，无对照实验可言。但本 Skill 的独特贡献是**把预案做成可实测的
工程能力**：以下四条降级路径全部通过自动化验证（Chromium + WebKit + 真机 Safari 待授权）。

## Definition
现场故障预案 = 已实测的降级路径清单，而不是"到时候随机应变"。

## Core claim
一个演示运行时的成熟度，取决于它坏了以后还剩多少可用——Stable > Fancy。

## Mechanism
（工程解释）故障的常见根因是外部依赖（网络/字体/插件/分辨率）；消除依赖即消除主要故障面。

## Boundary conditions
- 预案不能替代彩排；它只是把"最坏的赌注"变成"最坏的结果"。
- 降级路径本身也要测试（未测的降级 = 未知的故障）。

## Common misinterpretations
- ❌ "自带设备就没风险"——分辨率、色彩管理、字体仍是变量。
- ❌ "出事就切打印版"——打印版必须真的能出（本系统实测 18 幕 = 18 页）。

## Presentation implications
四级降级路径（全部实测）：①断网运行（file:// 零外部请求）→ ②静帧直出（M 键，动效全关）
→ ③Reader 模式（逐幕可读、无动画）→ ④打印 PDF（每幕一页、保留口径与来源）。

## Related nodes
KN-INT-002 交互成本、KN-PRES-011 结构路标、KN-ANTI-003 技术滥用
