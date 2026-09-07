# KN-MOT-001 · Semantic Motion · 语义动效

- knowledge_type: presentation_principle
- evidence_grade: C（动画理解研究混合；实践强约定）
- source_ids: [SRC-MAYER-HANDBOOK-2014, SRC-WEBANIM-W3C]
- last_reviewed: 2026-09

## Core claim
动画不是装饰，是表达手段。每个动效必须声明 Motion Intent；无 Intent 的动效删除。

## Motion Intent 词汇表
| Intent | 表达任务 | 典型实现 |
|---|---|---|
| REVEAL | 控制信息流节奏 | 渐进出现（Segmenting） |
| FOCUS | 引导注意 | 其余降透明度/当前高亮 |
| CONNECT | 表达关联 | 元素间连线/移动 |
| TRANSFORM | A 变成 B | 形变/补间 |
| TRACE | 时间/路径演化 | 路径描画 |
| ACCUMULATE | 累积构成 | 逐项堆叠 |
| COMPARE | 并置对比 | 分屏/翻转 |
| CAUSE | 因果传递 | 沿因果链的传播动画 |
| CONTINUITY | 跨幕保持同一对象身份 | 共享元素过渡（View Transition） |
| REMOVE | 消除无关项 | 淡出（Coherence 原则） |

## Minimum Sufficient Motion（§37）
静态能表达就不用动画。需要：时间变化/状态转化/因果/流程/注意引导，才使用。

## Runtime 约束
- 全部动效必须可 pause/resume/reverse/seek/skip/replay（讲者控制节奏）。
- 技术优先级：CSS → Web Animations API → View Transition → Motion → GSAP（仅复杂 timeline）。
- prefers-reduced-motion：动效策略必须降级为静态/淡入。
- 禁止动画隐藏不利数据或误导趋势（Animation Integrity, §93）。

## Related nodes
KN-COG-004、KN-INT-001、KN-ANTI-003
