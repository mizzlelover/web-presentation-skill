# RUNTIME_AUDIT.md — Track B 运行时证据链审计

> 依据补丁 §12–§34、§66、§67 执行。审计日期：2026-09-07；**跨引擎复测：2026-09-10**。
> 核心原则：**A library feature is not a verified capability.**
> 审计环境：本机 macOS；Playwright 驱动真实浏览器内核（Chromium 153 / WebKit 26.6 / Firefox 155）。Firefox 因沙箱阻断未验证；真机 Safari 待授权。

## 0.5 跨引擎复测（2026-09-10，Track B 补齐）

harness：`evals/harness/runtime_verify.cjs` + `content_stress.cjs`（`_artifacts/runtime_verify.json`）。

| 引擎 | 功能断言 | 控制台错误 | 三档分辨率溢出 | 备注 |
|---|---|---|---|---|
| Chromium 153 | **22 / 22 PASS** | 0 | 0（document/scene 双零） | — |
| **WebKit 26.6** | **22 / 22 PASS** | 0 | 0 | 与 Safari 26.5.2 同代内核 |
| Firefox 155 | — | — | — | `launch()` 成功但 `newPage()` 挂起（沙箱阻断内容进程），**未验证** |
| Safari.app 26.5.2 | 待授权 | — | — | 需勾选「允许远程自动化」 |

覆盖断言：初始仅首幕可见 / 揭示先于翻页 / Home·End / 搜索命中跳转 / 总览开关 / 帮助开关 / Reader 开关 / 静帧整幕直出 / 讲者台弹窗·计时·笔记 / 深潜返回 revealStep 恢复 / 打印全展开 / reduced-motion 内容完整 / 三档分辨率零溢出。

**性能预算实测（§31）**

| 指标 | Chromium | WebKit | 方法 |
|---|---|---|---|
| FCP | 136 ms | 264 ms | PerformanceObserver（本地 http） |
| DOMContentLoaded / load | 129 / 129 ms | 281 / 284 ms | Navigation Timing |
| 转场 FPS | 60.5 | 59.9 | rAF 采样（8 次 ArrowRight） |
| JS 堆 | 9.54 MB | — | performance.memory（仅 Chromium） |
| 主文档传输 | 32,123 B | 32,123 B | Navigation Timing |
| 资源数 | 8 | 8 | resource timing |

**中文内容压力（§39/§40）**：短 / 26 字 / 31 字 / 机构全称 / 中英混排 / 中文数字标点 × 2 档分辨率 × 2 引擎 = **12/12 不溢出**。
**Reader 清单（§27）**：全幕展开 ✓ / 来源 `.wp-source` 可见 ✓ / 展开控件在位 ✓ / 移动端 390×844 零横向溢出、正文 16px ✓ / hash 深链 `#/proof` ✓。
**测试发现**：Reader 模式下 `.wp-hints` 未隐藏，与正文重叠（登记待修）。

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

> **2026-09-10 更新**：下列前三项已改为跨引擎实测并通过（见 §0.5），移入 TESTED。当前仅剩「讲者台独立窗口与主窗口的双向实时同步」为边缘待测项。

| 能力 | 更新后状态 |
|---|---|
| Presenter View（弹窗/计时走动/笔记） | ✅ **tested**（2026-09-10·chromium+webkit） |
| 搜索 UI（命中/跳转） | ✅ **tested**（2026-09-10） |
| Reader Mode §27 清单（锚点/引用/展开/移动端） | ✅ **tested**（2026-09-10） |
| 中文长标题压力（20–35 字） | ✅ **tested**（2026-09-10·12/12 不溢出） |
| Presenter 独立窗口 ↔ 主窗口双向同步 | prototyped（主→台单向已测，反向控制未测） |

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

- §30 跨浏览器：**Chromium ✅ + WebKit 26.6 ✅**（2026-09-10）；真机 Safari 待授权、Firefox 受沙箱阻断 → 两者均**未验证**
- §31 Performance：✅ 已采集 FCP / FPS / 堆（见 §0.5），Performance Budget 初值已立
- §32 真实硬件分级测试：未做（当前机即开发机）
- §24 15–20 幕自适应测试 Deck：未做（现有 Demo 8 幕，含 1 深潜分支）
- §40 中文长标题压力：✅ 已做（2026-09-10，见 §0.5）
- §58 视觉回归基线库：初建（`evals/harness/_artifacts/` 三档分辨率 + 总览 + Reader + 移动端截图）
- §59 Playwright 自动化：✅ 已引入（`evals/harness/`，dev-only，22 项功能 + 12 项中文压力）

## 3. 性能实测初值（§31 起步数据）

| 指标 | 实测值 | 方法 |
|---|---|---|
| runtime/ 体积 | 64 KB（全部 JS+CSS，零依赖） | du |
| Demo 整包 | 56 KB（HTML+IR） | du |
| 首屏渲染 | file:// 即时渲染，截图灰度 (22,248) 分布正常 | headless 截图 |
| 外部请求 | 0 | 全工程 grep |

FPS / 内存 / WebGL 成本：待采集（GAP P3）。
