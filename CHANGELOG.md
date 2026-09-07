# Changelog

## [0.1.2] — 2026-09-07

- 视觉全面改用 Kimi K3 亮色编辑美学（暖白纸感 #faf9f7 + 墨色排版 + 发丝级边框 + 白卡片浅阴影 + 单一克制强调色 #2b47e0），替换原深色星空/极光/玻璃拟态方案
- 宣传页（docs/）与可运行 Demo（examples/demo/）同步换新主题；修复两处 flex li 导致的内联加粗断行错位
- 全量截图回归：Demo 8 幕 + 宣传页整页逐段检查通过

## [0.1.1] — 2026-09-07

- 作者 IP 更正为「谁是专家」（README / LICENSE / FINAL_REPORT / 宣传页全量更新）
- 宣传页微信物料按 1710×624 原始比例显示，修复拉伸变形
- Demo 全面重做：选题改为本系统自我推介（"本演示即系统输出物"），视觉升级为 aurora 深色极光主题；修复 expand 交互的目标接线；IR 校验 0 error，全 8 幕截图验证

## [0.1.0] — 2026-09-07

首个公开版本。

- Skill 核心：SKILL.md 路由器（六步工作流 + 铁律 + 对抗性处理）
- 知识层：14 个机制/原则节点（认知/传播/演示/可视化/动效/交互）、3 个反模式、6 条经验假设登记、35 条 Seed Corpus 来源（A–E 证据分级）
- Schemas：source / knowledge_node / practitioner_hypothesis / presentation / scene / presentation_ir / capability
- Workflows：9 个标准工作流（分析→策略→论证→Scene→IR→渲染→优化→现场调整→评审）
- Runtime：零依赖 JS 实现（Scene 引擎/导航/动效控制/交互/演讲者台/Reader/Print），功能测试通过
- 组件库：6 个语义组件（HeroStatement/AssertionEvidence/Comparison/BigNumber/Decision/Timeline）
- 主题：minimal（内建）/ corporate / technology / government / editorial
- Evals：18 维 rubric、100 案例登记、10 条对抗测试
- 工具：scripts/validate_ir.py（IR 校验器）
- 示例：examples/demo（高管决策汇报，IR + HTML，校验 0 error，浏览器实测通过）
- Harness 适配：Claude Code / Codex / OpenCode / Kimi Code
