# KN-VIS-006 · Preattentive Attributes · 前注意属性

- knowledge_type: scientific_mechanism
- evidence_grade: A-
- rule_status: supported_principle
- verification: partially_validated   # 2026-09-13 升级：编码精度排序（位置>长度>角度/斜率>面积）由 EP-GRAPHICAL-PERCEPTION 双全文级复核直接支撑（Cleveland 1986 8 项 + Heer 2010 复现 8 项逐字命中）；「前注意并行加工」的教科书层（Ware）保持 memory_based
- evidence_package: knowledge/evidence_packages/graphical-perception.yaml
- source_ids: [SRC-WARE-2012, SRC-FRANCONERI-2021, SRC-CLEVELAND-1986, SRC-HEER-2010]
- last_reviewed: 2026-09-13

## 已验证条目（2026-09-13 双全文级复核）
**编码精度排序**（EP-GRAPHICAL-PERCEPTION，两轮全文级复核 8/8 命中）：位置（共同尺度）>位置（非对齐）>长度>角度≈斜率>面积；间距增大误差上升；技术训练不影响精度（知觉系统属性）；正方形面积比较最差（p<0.05）；图高 40px 误差显著升高、80px 平台期、网格线 ≥8px、alpha 0.2 安全默认——全部逐字命中原文。

## 证据状态（诚实声明）
「前注意并行加工」的机制表述出自 Ware 教材与 Franconeri 综述的机制讨论（后者已全文级复核其串行/并行对比结论：整体统计快提取、子集比较串行数百毫秒）；
**排序结论层已双全文验证，机制描述层的教科书细节保持 memory_based。**

## Definition
部分视觉属性（位置、长度、角度、面积、颜色深浅、运动）在注意分配之前即被并行加工，
精度与速度存在稳定排序。

## Core claim
图形编码的选择决定受众能从图中"免费"读出什么——要比较量级就用位置/长度（条形），不要用面积（饼图）。

## Mechanism
视觉系统对不同属性的加工精度不同：位置判断最准，面积与颜色饱和度判断最粗。

## Boundary conditions
- 排序针对"精度"；识别类别（哪些点属于一组）时颜色是高效编码。
- 前注意加工只对**少量**差异项有效；全场高亮等于没有高亮（signaling 的约束）。

## Common misinterpretations
- ❌ "饼图不专业"——饼图的问题仅在于精度差；展示"部分与整体"的单一构成时它是可选项（两项时无争议）。
- ❌ "3D 增强表现力"——3D 投影同时破坏位置与长度的精度（本系统 Reject Three.js 的依据之一）。

## Presentation implications
chart.kind 由认知任务推导（R-CHART-KIND-BY-TASK）：Comparison→bar、Trend→line、
Ranking→hbar、Composition（少类目）→pie。renderer 不得为美观更换图形类型。

## Related nodes
KN-VIS-001 图形选择、KN-VIS-003 图表诚信、KN-COG-004 注意线索
