# KN-MOT-003 · Motion & Cognitive Load · 动效与认知负荷

- knowledge_type: scientific_mechanism
- evidence_grade: A-
- rule_status: strong_principle
- verification: partially_validated   # 依据 EP cognitive-load（SRC-SWELLER-2019）与 EP segmenting（SRC-REY-2019）
- evidence_package: knowledge/evidence_packages/cognitive-load.yaml
- source_ids: [SRC-SWELLER-2019, SRC-REY-2019, SRC-MAYER-2001]
- last_reviewed: 2026-09-11

## 已验证条目（真实全文）
两个已验证机制共同约束动效：①**瞬息信息效应**（REY-2019）——动态内容转瞬即逝，
迫使受众追赶；②**外在负荷**（SWELLER-2019）——与任务无关的运动持续吸引注意（运动是
强前注意刺激），直接消耗加工容量。两者的推论一致：**动效必须有终点、可暂停、可跳过**。

## Definition
运动是最强的前注意刺激之一：屏幕上任何持续运动都会被视觉系统强制捕获。

## Core claim
动效的默认状态是"静止"；运动是短暂事件而非持续状态——一切持续运动的 UI 元素（闪烁、循环动画）都是负荷源。

## Mechanism
视觉系统对运动的检测先于有意识注意；持续运动无法被"决定不看"，因此不可关断的动画是强制负荷。

## Boundary conditions
- 运动作为**引导**（一次性的、指向即将讲解元素）是有效信号。
- `prefers-reduced-motion` 用户的系统级偏好必须被尊重（本系统强制）。

## Common misinterpretations
- ❌ "动效只在切换瞬间有负荷"——循环动画（呼吸灯、粒子背景）是持续负荷。
- ❌ "观众看惯了"——前注意捕获不因习惯而消失。

## Presentation implications
本系统三条工程规则：①动效注册到统一控制器，必须可 pause/seek/skip/replay；
②Reader 与 Print 模式动效落到终态（否则内容被首帧遮蔽——本次修复的致命缺陷）；
③静帧开关（M 键）一键关闭全部动效。**注册后不播放的动画比没有动画更糟**
（`fill:both` + pause 会把元素钉在首帧）。

## Related nodes
KN-MOT-001 语义动效、KN-MOT-002 动效功能、KN-COG-006 瞬息信息
