# KN-ANTI-002 · Decoration First · 装饰优先

- knowledge_type: anti_pattern
- last_reviewed: 2026-09

## 表现
- 拿到内容先选模板/配色/字体，再往里塞内容。
- "为了高级感"使用 3D、粒子、视差。
- 所有页面加动画以防"太素"。

## 为什么是反模式
违反 Communication before Decoration 与 Visual Meaning before Visual Beauty。装饰不与 Cognitive Job 绑定时，制造的是外在负荷（KN-COG-002）与注意竞争（KN-COG-004）。

## 处理规程
形式决策必须在 Strategy → IR 之后：先知道这一幕要让观众完成什么认知任务，再决定它长什么样。美观（§51–53）通过 design_tokens 与主题系统统一实现，服从信息结构。

## 对抗测试锚点
T-03（每页加炫酷动画）、T-04（所有数据做 3D）。
