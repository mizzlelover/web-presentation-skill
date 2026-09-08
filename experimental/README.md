# experimental/ — 实验技术孵化区（补丁 §47）

这里放置**尚未通过运行时验证**的高级技术。规则：

1. **未验证技术不得进入 Production Runtime**（`runtime/`）与 Renderer Planner。
2. 进入这里的技术必须带最小可运行 Demo（`runtime-demos/` 或本目录），只写 README 不算数（补丁 §14）。
3. 达到 `tested`（真实浏览器验证 + 性能/无障碍/降级记录，见 `audits/CAPABILITY_VERIFICATION.md` Schema）后才允许进入正式渲染规划。

## 当前孵化清单（全部为 documentation_only，禁止宣传为可用能力）

| 技术 | 入孵原因 | 出孵条件（补丁条款） |
|---|---|---|
| GSAP | 复杂时间线编排 | §15 九项实测（timeline/pause/resume/reverse/seek/skip/replay/stagger/sequence） |
| ECharts | 商务图表 | §17 九场景实测（含 stage/reader/print 三模式） |
| D3.js | 定制数据叙事 | §18 先产出 ECharts 难做的用例 |
| Mermaid | 结构草稿 | §19 默认渲染品质判定 |
| Three.js | 3D 空间关系 | §20 正/反用例 + 性能/可读性 |
| View Transition API | 跨幕延续 | §16 同文档过渡/状态保持/双浏览器 |
| WebSocket Live Data | 实时场景 | 必须有静态快照 fallback |

## 当前 Production 允许的动效/渲染技术

CSS Animation + Web Animations API（均已实测，见 `audits/MOTION_CAPABILITY_MATRIX.md`）。
