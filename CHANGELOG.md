# Changelog

## [0.2.1] — 2026-09-07

- 新增键位速查视觉卡片 `assets/keys-card.svg`（纸上光谱风格，1200×630），嵌入 README「键位速查」一节：推进 / 视图 / 辅助三组十键，与运行时 `?` 帮助面板完全一致
- README 快速开始中的快捷键注释补齐 O 总览 / M 静帧 / ? 帮助

## [0.2.0] — 2026-09-07

展示层七项升级（全部落在 runtime/ 运行时层，所有产物自动继承）：

- **O 键总览模式**：全幕缩略平铺（等比缩放保真、点击跳转、当前幕高亮、Esc 退出），补传统 PPT 的页面预览列表能力
- **页码与锚点指示**：左下角常驻 `当前页 / 总页数 · 锚点主题`，演讲者与观众都能预期进度
- **隐晦键位提示**：右下角常驻 `→ 推进 · O 总览 · ? 快捷键`，6 秒无操作自动淡化；`?` 打开完整快捷键帮助面板
- **M 键静帧开关**：一键关闭全部动效，整幕直出（赶时间/录屏场景），sessionStorage 持久化
- **幕状态保持**：非线性深潜切出后再返回，原幕保持切出前的揭示进度，不再回到初始态
- **分支返回提示上下文化**：`Esc 返回主线` 等跳回提示仅在深潜进入时显示，线性浏览到该幕不出现
- **Speaker Notes 脚本化**：SKILL.md 明确讲稿必须是三层内容中最详细的可照读脚本（含动作/停顿/语气提示）；Demo 8 幕讲稿全量重写为照读级，讲者台同步显示揭示进度与主题锚点

质量：无头浏览器 18 项功能回归测试全部通过；IR 校验 0 error 0 warning；IR 与 HTML 讲稿一致

## [0.1.5] — 2026-09-07

- 启用中文品牌「文质 Wenzhi」：取《论语·雍也》"质胜文则野，文胜质则史。文质彬彬，然后君子"——质 = 内容/论证/策略，文 = 渲染/视觉/呈现
- 宣传页：导航 logo、页面标题、hero 新增《论语》原典句、作者区文案、页脚署名全量品牌化
- README 顶部改为品牌双标题 + 品牌释义；Demo 开场 kicker 与结尾签名行加入品牌

## [0.1.4] — 2026-09-07

- GitHub Pages 源从 /docs 切换到仓库根目录：宣传页移至根 index.html，Demo 现可在 https://present.mizzlelover.xyz/examples/demo/ 直接在线运行
- 宣传页「查看可运行 Demo」按钮由 GitHub 目录改链至在线 Demo 页面
- README 更新站点结构与在线 Demo 入口

## [0.1.3] — 2026-09-07

- 视觉改为原创「纸上光谱 · Spectral Paper」设计（非临摹任何官网）：暖纸底 #faf8f4 + 暖墨 #17150f + 蓝→紫→珊瑚光谱渐变（仅用于关键词、闸门节点、进度条等焦点）+ 低饱和漂移光晕 + SVG 噪点纸纹
- 宣传页新增学者衬线斜体跑马灯、幽灵章节编号、渐变标题文字动画、卡片光谱下划线扫边；进入动效带 1.8s 兜底，永不门控内容
- Demo 同步换肤：光谱高亮、闸门渐变文字、焦点大数字渐变、光谱进度条；全 8 幕 + 宣传页整页截图回归通过

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
