# Research Log — 研究日志（§76）

记录新理论、冲突、弱证据、技术变化。新增条目置顶部。

## 2026-09-11 · 理论藏书扩张：14 → 53 节点（诚实分级）
- **新增 32 个节点**（cognition +8 / communication +6 / presentation +6 / visualization +5 / motion +2 / interaction +2 / anti_patterns +3），
  并为 9 个旧节点补齐证据头字段；总计 **53 节点**，全部具备
  `knowledge_type / evidence_grade / rule_status / verification / source_ids / last_reviewed` 六项头字段。
- **验证状态分布（如实）**：partially_validated 26（有全文精读证据包）· memory_based 22（来源已登记未逐篇精读，
  **不得作为 STRONG 规则依据**）· engineering_validated 5（工程实测）。
- **显式冲突入库**：KN-VIS-004 数据墨水之争（Tufte vs Bateman vs Doumont）以 CONTESTED 状态建立节点，
  只陈述冲突不裁决——这是本 Skill 第一次把"未决问题"作为一等公民写入知识库。
- **诚实降级示例**：KN-COG-010（生成加工/测试效应）与 KN-COG-011（情绪唤醒）虽为学界常识，
  因证据包缺失一律标 memory_based / CONTESTED——"常识"不能替代"已读"。
- **新增总索引**：`knowledge/INDEX.md`（从节点头字段程序化生成，53 节点全量可审计）。
- **研究队列更新**（INDEX.md 末节）：空间临近补全文、生成加工实证、情绪唤醒测量、
  中文阅读参数、A-E 迁移、不确定性可视化。

## 2026-09-10 · 研究→运行时双向验证（含强制升级补丁执行）
- **新增写回索引**：`knowledge/scene_examples.yaml` —— 把 25 条机制映射到「知识节点 / 证据包 / 生产组件 / 渲染规则 ID」，避免研究停在知识库里（§20）。
- **机制正反例画廊**：`evals/mechanisms/`（25 条），每条导出可执行渲染规则；片段使用生产组件类名，兼作组件契约回归夹具。
- **新增确认（来自运行时实测）**：
  1. **一致性（Coherence）在渲染层的落点**：不是「少画图」，而是 Renderer 不得自动添加装饰元素 —— 已定为 R-DECORATION-FORBIDDEN。
  2. **冗余（Redundancy）的工程解**：Stage 屏幕承载结论/结构、Reader 承载完整文本，`speaker_notes` 永不进屏幕 —— 三个时长与三个受众版本实测有效。
  3. **图表必须交代口径**：10 套语料中凡缺 caption 的 chart 被 validate_ir 判 warning，已固化为 R-CHART-CAPTION-REQUIRED。
- **技术取舍结论入库**（`audits/TECH_DECISIONS.md`）：GSAP / Three.js **Reject**、Mermaid **Downgrade**、D3 **Conditional**、ECharts **Accept**、View Transition / Live Data **Hold**。此结论属**工程证据**，不构成对相应研究结论的判断。
- **遗留研究队列（更新）**：
  - [ ] 中文阅读速度/字号研究（屏幕汉字最佳行宽）。
  - [ ] Assertion-Evidence 在非科研受众中的迁移研究（当前证据限工程/教学语境）。
  - [ ] reduced-motion 用户比例的公开数据。
  - [ ] 叙事在商业演示中的因果效应量（现有为叙事传输总体效应，非商业演示情境）。
  - [ ] 空间临近域补全文（Ginns 2006 现为 abstract_only，禁止推断效应量）。

## 2026-09-07 · 初始化
- 建立 Seed Corpus Registry（35 来源，authority S/A/B/C 分级）。
- 已知冲突登记：
  1. **Tufte vs Bateman(2010)**：极简 data-ink vs 修饰提升记忆——结论：区分"分析型图表"（极简）与"传播型图表"（允许适度修饰），见 KN-VIS-001。
  2. **Tufte vs Doumont**：低密度批评 vs 技术沟通自足性——结论：按 Presentation Mode 分层解决（KN-PRES-003）。
  3. **Atkinson BBP vs Mayer Redundancy**：屏幕零句子 vs 冗余超载——兼容解读：Stage Mode 屏幕视觉+断言句，Reader Mode 完整文字。
  4. **"字越少越好" vs Reader Mode**：已通过 One Content Model 双内容层解决。
- 弱证据区（待补研究）：叙事在商业演示中的因果效应量；发布会式演示的最佳密度；中文演示语境的专门研究稀缺。
- 技术观察：View Transition API 的 Firefox 支持状态需跟踪；ECharts/D3 大版本升级需登记。

## 待办研究队列
- [ ] 中文阅读速度/字号研究（屏幕汉字最佳行宽）。
- [ ] Assertion-Evidence 在非科研受众中的迁移研究。
- [ ] reduced-motion 用户比例的公开数据。
