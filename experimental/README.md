# experimental/ — 未验证/未采纳技术的孵化区（补丁 §47）

> **禁止 Technology Showcase 污染核心系统。** 此目录下的技术**一律不得进入 Production Runtime**，
> 仅用于 `Prototype → Test → Compare → Accept / Reject` 的证据留档（§4）。
> 完整决议见 [`../audits/TECH_DECISIONS.md`](../audits/TECH_DECISIONS.md)。

规则：①未验证技术不得进入 `runtime/` 与 Renderer Planner；②入孵必须带**最小可运行 Demo**，只写 README 不算数（§14）；③达到 `tested` 并完成 accept/reject 后才允许进入正式渲染规划。

## 原型清单（2026-09-10 实测，Chromium，0 控制台错误）

| 目录 | 目的 | 覆盖条款 | 实测 | 决议 |
|---|---|---|---|---|
| `motion-compare/` | 同一组场景用 CSS / WAAPI / View Transition / GSAP 实现并比较控制力 | §21 | 12/12 场景完成 | 生产维持 **CSS + WAAPI**；GSAP **Reject** |
| `threejs-cases/` | Three.js 正向（空间关系）+ 反向（同内容 2D 更优）用例 | §13 / §20 | 正例可跑；headless 44 fps；594 KB | **Reject**（暂） |
| `mermaid-vs-svg/` | Mermaid 默认渲染 vs 组件风格定制 SVG | §12 / §19 | 渲染 32ms；库 3.26 MB | **降级为草稿工具** |
| `d3-narrative/` | ECharts 难以表达的定制数据叙事（联合轨迹 + 直接标注 + 注释带） | §18 | 渲染 3ms；273 KB | **条件引入**（按需，须带静态 fallback） |

## 状态更新（相对入孵时）

- **ECharts**：✅ **出孵**——已实测（图表实际绘制、离线可跑、打印保留色彩、四态适配），进入生产，落在 `runtime/vendor/` + `runtime/visualization/`（见 `runtime/vendor/NOTICE.md`）。
- **GSAP / Three.js**：已完成正反例与对照实测，**决议 Reject**（非能力不足，而是对本项目目标场景无收益且引入体积/许可代价）；保留原型作为决策证据。
- **Mermaid**：判定默认渲染品质不足以作为正式演示视觉，**降级为草稿/中间表示工具**。
- **D3**：确认存在 ECharts 明显劣势的场景，**条件引入**。
- **View Transition / WebSocket Live Data**：保持 HOLD，未进入生产。

## vendor/

上述原型所用第三方库（本地化、无 CDN）：

| 文件 | 体积 | 许可 |
|---|---|---|
| `gsap.min.js` | 71 KB | GreenSock 标准许可（**非 OSI**） |
| `three.min.js` | 594 KB | MIT |
| `mermaid.min.js` | 3.26 MB | MIT |
| `d3.min.js` | 273 KB | ISC |

> 生产运行时的**唯一**第三方是 `runtime/vendor/echarts.min.js`（Apache-2.0，1.01 MB）。

## 运行与验证

```bash
python3 -m http.server 8765 --bind 127.0.0.1        # 仓库根起静态服务
# http://127.0.0.1:8765/experimental/motion-compare/index.html
NODE_PATH=<playwright-node_modules> node evals/harness/verify_experimental.cjs   # 批量验证
```
