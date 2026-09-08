# CAPABILITY_VERIFICATION.md — 运行时能力验证登记

> 按补丁 §13/§48 Schema 登记。只有 `tested` 及以上状态的能力允许进入正式 Renderer Planner。
> last_verified 为真实执行日期；test_results 记录可复核的验证方法。

```yaml
capabilities:

  - capability_id: CAP-SCENE-ENGINE
    name: Scene 引擎与线性/非线性导航
    technology: 自研零依赖 JS（runtime/core/scene-engine.js）
    purpose: 幕管理、揭示步进、深潜/返回、状态保持
    status: tested
    tested_browsers: [chromium-headless]
    tested_devices: [macbook-dev-machine]
    performance_cost: low
    accessibility: 键盘全程可操作；aria-hidden 同步
    offline_support: yes
    presentation_use_cases: [线性讲演, 深潜证据, 现场跳页]
    avoid_when: []
    fallback: 静态全文（Reader/Print）
    demo_path: examples/demo/
    test_results: 18 项无头浏览器回归全过；状态保持 revealStep=2 恢复实测
    last_verified: 2026-09-07

  - capability_id: CAP-OVERVIEW
    name: Overview 总览模式
    technology: 自研（transform 等比缩放 + 注入样式表）
    purpose: 全幕缩略平铺与自由跳转
    status: tested
    tested_browsers: [chromium-headless]
    tested_devices: [macbook-dev-machine]
    performance_cost: low
    accessibility: 编号徽标 + 点击目标 ≥ 44px
    offline_support: yes
    presentation_use_cases: [重新选页, 进度把握]
    avoid_when: [Reader 模式下自动禁用]
    fallback: Home/End 键 + 线性导航
    demo_path: examples/demo/
    test_results: 开关/跳转/当前幕高亮实测；缩略图等比保真截图验收
    last_verified: 2026-09-07

  - capability_id: CAP-MOTION-WAAPI
    name: 语义动效控制器
    technology: CSS + Web Animations API（runtime/motion/）
    purpose: REVEAL/FOCUS/CONNECT 等可 pause/seek/skip 动效
    status: tested
    tested_browsers: [chromium-headless]
    tested_devices: [macbook-dev-machine]
    performance_cost: low
    accessibility: prefers-reduced-motion 实测内容完整可见；M 键静帧开关
    offline_support: yes
    presentation_use_cases: [逐步揭示, 因果链, 强调]
    avoid_when: [复杂编排 timeline —— 属 experimental]
    fallback: wp-motion-final 静态终态
    demo_path: examples/demo/
    test_results: skipAll/register 回归通过；--force-prefers-reduced-motion 截图验收
    last_verified: 2026-09-07

  - capability_id: CAP-PRINT
    name: Print 模式
    technology: CSS @media print + beforeprint 全展开
    purpose: 打印/PDF 交付
    status: tested
    tested_browsers: [chromium-headless]
    tested_devices: [macbook-dev-machine]
    performance_cost: low
    accessibility: 打印态完整展开
    offline_support: yes
    presentation_use_cases: [会前预读, 留存材料]
    avoid_when: []
    fallback: 自身即 fallback
    demo_path: examples/demo/
    test_results: 真实打印 PDF 10 页、16:9、动效终态冻结
    last_verified: 2026-09-07

  - capability_id: CAP-READER
    name: Reader 自读模式
    technology: 自研（runtime/reader/）
    purpose: 纵向完整阅读 + hash 深链
    status: prototyped   # 开关/滚动已测；§27 清单（锚点/引用/展开/移动端）未逐项过
    tested_browsers: [chromium-headless]
    tested_devices: [macbook-dev-machine]
    performance_cost: low
    accessibility: 完整内容无交互门控
    offline_support: yes
    presentation_use_cases: [会后自读, 分享链接]
    avoid_when: []
    fallback: 打印态
    demo_path: examples/demo/
    test_results: 切换实测；子项清单待补
    last_verified: 2026-09-07

  - capability_id: CAP-PRESENTER
    name: Presenter View 讲者台
    technology: 自研（runtime/presenter/）
    purpose: 笔记/计时/下一幕/跳转
    status: prototyped   # 基础信息与揭示进度已测；计时器与窗口同步未实测
    tested_browsers: [chromium-headless]
    tested_devices: [macbook-dev-machine]
    performance_cost: low
    accessibility: 键盘 P 键唤起
    offline_support: yes
    presentation_use_cases: [现场讲演]
    avoid_when: []
    fallback: Speaker Notes 打印
    demo_path: examples/demo/
    test_results: 打开与进度显示实测；完整矩阵待补
    last_verified: 2026-09-07

  - capability_id: CAP-SEARCH
    name: 现场搜索（/ 键）
    technology: 自研（runtime/navigation/router.js WPSearch）
    purpose: 场景/论点/证据检索跳转
    status: prototyped
    tested_browsers: [chromium-headless]
    tested_devices: [macbook-dev-machine]
    performance_cost: low
    accessibility: 键盘唤起
    offline_support: yes
    presentation_use_cases: [Q&A 现场定位]
    avoid_when: []
    fallback: Overview 总览
    demo_path: examples/demo/
    test_results: 存在性实测；命中/跳转用例待补
    last_verified: 2026-09-07

  # ── 以下全部 DOCUMENTATION_ONLY，移入 experimental/，未实测前禁止进 Renderer Planner ──
  - capability_id: CAP-VIEW-TRANSITION
    name: View Transition API
    technology: 原生 API
    purpose: 跨幕共享元素过渡
    status: documented
    tested_browsers: []
    offline_support: n/a
    fallback: 普通切换
    demo_path: experimental/（待建）
    test_results: 未实测
    last_verified: never

  - capability_id: CAP-GSAP
    name: GSAP
    technology: JS 库
    status: documented   # 补丁 §15 九项测试全部待做
    demo_path: experimental/（待建）
    test_results: 未集成、未实测
    last_verified: never

  - capability_id: CAP-ECHARTS
    name: ECharts
    technology: JS 库
    status: documented   # 补丁 §17 九项场景待做
    demo_path: experimental/（待建）
    test_results: 未集成、未实测
    last_verified: never

  - capability_id: CAP-D3
    name: D3.js
    technology: JS 库
    status: documented   # 补丁 §18：须先产出 ECharts 难做的定制叙事用例
    demo_path: experimental/（待建）
    test_results: 未集成、未实测
    last_verified: never

  - capability_id: CAP-MERMAID
    name: Mermaid
    technology: JS 库
    status: documented   # 补丁 §19：默认渲染品质是否达演示标准待判
    demo_path: experimental/（待建）
    test_results: 未集成、未实测
    last_verified: never

  - capability_id: CAP-THREEJS
    name: Three.js / WebGL
    technology: WebGL
    status: documented   # 补丁 §20：正/反两个用例待做
    demo_path: experimental/（待建）
    test_results: 未集成、未实测
    last_verified: never

  - capability_id: CAP-LIVE-DATA
    name: WebSocket / Live Data
    technology: Web 标准
    status: documented
    demo_path: experimental/（待建）
    test_results: 未实测；必须有静态快照 fallback
    last_verified: never
```
