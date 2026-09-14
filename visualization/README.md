# Visualization Planner — 可视化选型指南（§40–§42）

## 选型决策树

```
有数据要表达？
├─ 先定 Cognitive Job（KN-VIS-001）：Comparison/Trend/Distribution/Relationship/
│   Composition/Ranking/Deviation/Flow/Network/Geography
├─ 常规商务图（bar/line/pie≤5类/散点/堆叠）→ ECharts（echarts/）
├─ 高度定制编码 / 叙事可视化 → D3 或手写 SVG（d3/、svg/）
├─ 流程/时序/状态/架构草稿 → Mermaid（mermaid/），成品视觉评估是否转定制 SVG
├─ 真实 3D 空间关系 → Three.js（spatial/three/），其余一律 2D
└─ 单一大数字 → 不要图，用 BigNumber 组件
```

## 硬性约束（诚信 §91–§93）
- 每张图必须有 source / unit / time / scope（ChartWithSource 容器强制）。
- Y 轴截断必须显式标注且服务真实认知任务；默认从零起。
- 禁止 3D 饼图/柱图（透视扭曲面积感知，KN-VIS-001）。
- 动画不得隐藏不利数据或夸大趋势。
- 数据必须提供文本等价（aria-label / 数据表），屏幕阅读器可读。

## ECharts 使用要点（echarts/）
- 本地引入 echarts.min.js（离线打包），禁 CDN。
- option 中关闭无意义动效之外的默认动画时保留 `animation: true` 但挂入 MotionController 节奏；Reader/Print 模式输出静态等价。
- 颜色走 `--wp-*` tokens，图内色板与主题一致。

## D3 / SVG 使用要点（d3/、svg/）
- 仅当 ECharts 表达能力不足时使用；SVG 输出加 `<title>`/`<desc>`。
- 手写 SVG 优先于重量级库——很多"定制图"其实 50 行 SVG 就够。

## Mermaid 使用要点（mermaid/）
- 用于快速表达 Flowchart / Sequence / State / Architecture 草稿。
- 交付前评估：视觉质量是否达标？不达标则把 Mermaid 当中间表示，转定制 SVG。

## 3D 门槛（spatial/three/）
仅在 Spatial Relationship / Architecture / Product / Geography / Scientific Structure / Digital Twin 场景允许；必须提供 2D 等价描述与静态降级图；现场性能无保障时降级为预渲染视频/图片。
