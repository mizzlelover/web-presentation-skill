# RUNTIME_AUDIT.md — Track B 运行时证据链审计

> 依据补丁 §12–§34、§66、§67 执行。审计日期：2026-09-07。
> 核心原则：**A library feature is not a verified capability.**
> 审计环境：本机 macOS，headless Chromium（file:// 直开），Safari/Firefox 实测待补。

## 0. 总体结论

核心自研运行时（零依赖 runtime/，64 KB）的关键能力**已在真实浏览器内核上实测通过**；所有第三方库能力（GSAP/ECharts/D3/Mermaid/Three.js/Live Data）此前仅为文档级指导，**从未集成、从未实测**，按 §47 全部移入 `experimental/` 语义区，未验证前不得进入 Production Renderer。

## 1. 能力重新分类（§67）

### TESTED（有当日或当轮实测记录）

| 能力 | 证据 | 日期 |
|---|---|---|
| Scene 引擎 / 线性导航 / 键盘映射 | 无头 Chromium 18 项功能回归全过 | 2026-09-07 |
| Overview 总览（等比缩略图/点击跳转/ Esc） | 回归测试 + 截图验收 | 2026-09-07 |
| 深潜 Deep Dive / 返回主线 / 幕状态保持 | 回归测试（revealStep 恢复验证） | 2026-09-07 |
| 分支返回提示上下文化 | 线性到达隐藏 / 深潜到达显示，实测 | 2026-09-07 |
| 静帧开关（M）/ reduced-motion 降级 | 回归测试 + `--force-prefers-reduced-motion` 截图：内容完整可见 | 2026-09-07 |
| Print 模式 | 真实打印到 PDF：10 页、16:9 页面、无截断 | 2026-09-07 |
| Offline-first | 全工程零外部 URL 引用（grep 实测）；file:// 运行 0 控制台错误 | 2026-09-07 |
| 投影分辨率 1366×768 / 1920×1080 / 1600×1000 | 三档截图实测：无溢出、页码与提示可见 | 2026-09-07 |
| 控制台错误门禁 | 注入错误采集：ERRS:0 | 2026-09-07 |
| Container Queries / Grid 布局 | Demo 全幕多分辨率截图实测 | 2026-09-07 |
| WAAPI 动效控制器（register/skipAll） | 回归测试覆盖 | 2026-09-07 |

### PROTOTYPED_ONLY（实现了但实测覆盖不全）

| 能力 | 缺口 |
|---|---|
| Presenter View 讲者台（计时/下一幕/笔记完整矩阵） | 仅基础打开与进度显示被测；计时器、独立窗口同步未实测 |
| 搜索 UI（/ 键） | 实现存在，未做搜索命中/跳转实测 |
| Reader Mode 完整清单（锚点/引用/展开/移动端） | 开关与滚动已测，§27 清单未逐项过 |
| 中文长标题压力（20–35 字） | Demo 标题最长 14 字，未做 §40 压力测试 |

### DOCUMENTATION_ONLY / UNVERIFIED（补丁前误标为可用指导）

| 能力 | 纠正 |
|---|---|
| View Transition API | 运行时尚未实现，登记降级为 documented |
| GSAP | 未集成未实测 → experimental/ |
| ECharts | 未集成未实测 → experimental/ |
| D3.js | 未集成未实测 → experimental/ |
| Mermaid | 未集成未实测 → experimental/ |
| Three.js / WebGL | 未集成未实测 → experimental/ |
| WebSocket / Live Data | 未集成未实测 → experimental/ |

## 2. 未覆盖的补丁硬性项（进入 GAP_REPORT）

- §30 跨浏览器：Safari / Firefox 真实运行未做（本机可补 Safari）
- §31 Performance：FPS/内存未采集，Performance Budget 未立数值
- §32 真实硬件分级测试：未做（当前机即开发机）
- §24 15–20 幕自适应测试 Deck：未做（现有 Demo 8 幕，含 1 深潜分支）
- §58 视觉回归基线库：未建立
- §59 Playwright 自动化：未引入（现用无头 Chromium 脚本代替，覆盖 18 项）

## 3. 性能实测初值（§31 起步数据）

| 指标 | 实测值 | 方法 |
|---|---|---|
| runtime/ 体积 | 64 KB（全部 JS+CSS，零依赖） | du |
| Demo 整包 | 56 KB（HTML+IR） | du |
| 首屏渲染 | file:// 即时渲染，截图灰度 (22,248) 分布正常 | headless 截图 |
| 外部请求 | 0 | 全工程 grep |

FPS / 内存 / WebGL 成本：待采集（GAP P3）。
