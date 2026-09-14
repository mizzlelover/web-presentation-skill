# KN-INT-002 · Interaction Cost · 交互成本

- knowledge_type: practitioner_mechanism
- evidence_grade: C+
- rule_status: contextual_heuristic
- verification: memory_based   # SRC-GARRETT-2016《用户体验要素》已登记未全文精读；交互成本是 UX 领域共识概念
- evidence_package: （无——实践框架层）
- source_ids: [SRC-GARRETT-2016, SRC-NIELSEN-NORMAN-N/A]
- last_reviewed: 2026-09-11

## 证据状态（诚实声明）
交互成本（用户为达成目标付出的认知与操作代价）是 UX 领域的基础概念（Garrett 2016），
但"演示场景中多少交互是可接受的"没有实证阈值。标 CONTEXTUAL HEURISTIC，
以工程约束（R-INTERACTION-PURPOSE）代替数值阈值。

## Definition
每一次交互都要受众付出认知成本（理解可交互性）与操作成本（执行）；演示场景的成本被现场放大。

## Core claim
演示中的交互必须"去掉之后损失信息"才值得存在；纯展示型演示的交互是负资产。

## Mechanism
（实践解释）受众不知道什么可以点——可交互性必须被发现（视觉暗示）或被告知（讲者说明），
两者都消耗现场资源；交互失败（点了没反应/不知道点什么）在投影现场的代价远高于阅读场景。

## Boundary conditions
- 培训/工作坊类演示交互价值高（受众参与即目标）；决策汇报类交互价值趋近于零。
- 讲者必须能预判并演示每一次交互。

## Common misinterpretations
- ❌ "加交互就是高科技"——没有信息增量的交互是装饰（KN-ANTI-002）。
- ❌ "交互让受众参与"——参与的是点击，不是思考；生成加工（KN-COG-010）才是思考。

## Presentation implications
R-INTERACTION-PURPOSE 与 R-CORE-PATH-NO-INTERACTION：`interaction[]` 必填 `purpose`，
Core Path 的结论不得藏进交互层；主结论在静态层可见，交互只承载补充信息。

## Related nodes
KN-INT-001 交互模式、KN-COG-010 生成加工、KN-ANTI-003 技术滥用
