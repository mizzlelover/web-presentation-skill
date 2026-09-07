# KN-ANTI-003 · Tech Abuse & PPT Cosplay · 技术滥用与 PPT 扮演

- knowledge_type: anti_pattern
- last_reviewed: 2026-09

## 表现 A：技术滥用
- 默认 L6（3D/WebGL），默认 GSAP，默认粒子背景。
- dependency explosion：为简单淡入引入三个动画库。
- 现场演示依赖 CDN/网络字体，会议室断网即崩。

## 表现 B：PPT 扮演（Web-decorated）
- 用 `left: 428px; top: 216px` 绝对定位复刻 PowerPoint 版式。
- 用 HTML 实现"翻页器"，却没有 Reader/Print/深链/可访问性。
- 把 HTML 当作"更炫的 PPT"，而不是一个 Presentation Application。

## 处理规程
- 渲染层级按 Minimum Sufficient Rendering 逐幕选择并记录 render_rationale。
- 布局优先 Grid/Flexbox/Container Queries；绝对定位仅限特殊视觉场景。
- 现场交付默认 offline bundle（local assets/fonts/js/css）。
- Performance Budget 先行：Stable > Fancy。

## 对抗测试锚点
T-04、T-06。
