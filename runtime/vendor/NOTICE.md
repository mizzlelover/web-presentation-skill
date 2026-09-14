# runtime/vendor — 本地化第三方依赖（Dependency Audit，补丁 §49）

本项目运行时（`runtime/core`）保持**零依赖**。此处仅存放经实测、且为满足"离线优先"而必须本地化的库。

| 依赖 | 版本 | 许可 | 体积 | 维护状态 | 用途 | 替代性 | 降级 |
|---|---|---|---|---|---|---|---|
| `echarts.min.js` | ECharts 5.x | Apache-2.0 | ~1.0 MB | 活跃（Apache 基金会） | 商务图表（bar/hbar/line/area/pie/scatter/ranking） | 高：可替换为自研 SVG 图表（覆盖基础图形） | `charts.js` 在 `echarts` 未定义时静默不渲染，页面其余内容完整可用 |

**装载策略**：仅在 Deck 含 `chart` block 时由 `render_ir.py` 注入 `<script>`，纯文字 Deck 不加载，不进入首屏预算。

**为何不引 CDN**：补丁 §16 要求断网可用、基础功能不得依赖外部 CDN。故 vendor 到仓库内以保证 `file://` 打开即用。

**许可合规**：ECharts 采用 Apache-2.0；`echarts.min.js` 顶部保留了 ASF 许可头。分发本仓库产物时该文件需一并保留其许可声明。

**未纳入 vendor 的技术**：GSAP / D3 / Mermaid / Three.js / View Transition / Live Data —— 均未通过实测，按 §47 停留 `experimental/`，不得进入 Production Runtime。
