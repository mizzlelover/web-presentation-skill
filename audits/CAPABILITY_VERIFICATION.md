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
    tested_browsers: [chromium-153, webkit-26.6]
    tested_devices: [macbook-dev-machine]
    performance_cost: low
    accessibility: 键盘全程可操作；aria-hidden 同步
    offline_support: yes
    presentation_use_cases: [线性讲演, 深潜证据, 现场跳页]
    avoid_when: []
    fallback: 静态全文（Reader/Print）
    demo_path: examples/demo/
    test_results: 18 项无头浏览器回归全过；状态保持 revealStep=2 恢复实测
    last_verified: 2026-09-10

  - capability_id: CAP-OVERVIEW
    name: Overview 总览模式
    technology: 自研（transform 等比缩放 + 注入样式表）
    purpose: 全幕缩略平铺与自由跳转
    status: tested
    tested_browsers: [chromium-153, webkit-26.6]
    tested_devices: [macbook-dev-machine]
    performance_cost: low
    accessibility: 编号徽标 + 点击目标 ≥ 44px
    offline_support: yes
    presentation_use_cases: [重新选页, 进度把握]
    avoid_when: [Reader 模式下自动禁用]
    fallback: Home/End 键 + 线性导航
    demo_path: examples/demo/
    test_results: 开关/跳转/当前幕高亮实测；缩略图等比保真截图验收
    last_verified: 2026-09-10

  - capability_id: CAP-MOTION-WAAPI
    name: 语义动效控制器
    technology: CSS + Web Animations API（runtime/motion/）
    purpose: REVEAL/FOCUS/CONNECT 等可 pause/seek/skip 动效
    status: tested
    tested_browsers: [chromium-153, webkit-26.6]
    tested_devices: [macbook-dev-machine]
    performance_cost: low
    accessibility: prefers-reduced-motion 实测内容完整可见；M 键静帧开关
    offline_support: yes
    presentation_use_cases: [逐步揭示, 因果链, 强调]
    avoid_when: [复杂编排 timeline —— 属 experimental]
    fallback: wp-motion-final 静态终态
    demo_path: examples/demo/
    test_results: skipAll/register 回归通过；2026-09-10 修复「注册后 pause+fill:both 钉在首帧致内容不可见」缺陷（reveal 到达即播放 / auto 入场即播 / 展开落终态），跨引擎复测内容可见
    last_verified: 2026-09-10

  - capability_id: CAP-BRANCH-NAV
    name: 自适应演示图（Presentation Graph：分支 / 深潜 / 跳过 / 返回）
    technology: 自研（runtime/core/scene-engine.js branchTo/graph + runtime/navigation/）
    purpose: 现场非线性导航：技术/财务/异议横向分支，向下钻取证据，跳段走短路径，返回主线并恢复揭示进度
    status: tested
    tested_browsers: [chromium-153, webkit-26.6]
    tested_devices: [macbook-dev-machine]
    performance_cost: low
    accessibility: 键盘 Esc 返回；返回提示仅在分支/深潜进入时显示
    offline_support: yes
    presentation_use_cases: [Q&A 应对, 技术分支, 财务分支, 时间不足短路径]
    avoid_when: [线性审计/合规读本（无分支需求时保持 core path）]
    fallback: 线性 next/prev
    demo_path: benchmarks/corpus/01-executive-portal-decision/
    test_results: adaptive_test.cjs 端到端 10/10：core path 遍历 / 分支进入返回 / 深潜进入返回 / Esc 返回 / revealStep 恢复 / 搜索跳转 / 返回提示上下文
    last_verified: 2026-09-10

  - capability_id: CAP-CHART-ECHARTS
    name: 数据可视化（ECharts 本地化）
    technology: ECharts 5（vendored，runtime/vendor/echarts.min.js）+ runtime/visualization/charts.js
    purpose: 商务图表：bar / hbar / line / area / pie / scatter / ranking
    status: tested
    tested_browsers: [chromium-153]
    tested_devices: [macbook-dev-machine]
    performance_cost: medium（库 ~1.0MB，仅含图表的 Deck 加载；离线本地文件）
    accessibility: caption 交代口径；打印保留色彩；reduced-motion 关闭动画
    offline_support: yes（本地 vendor，无 CDN）
    presentation_use_cases: [投入产出, 趋势与目标, 结构占比, 排名]
    avoid_when: [纯定性幕（无量化认知任务）；为炫技而加图]
    fallback: 文字/表格（数据源仍可读）
    demo_path: benchmarks/corpus/01-executive-portal-decision/（financial / metrics 两幕）
    test_results: financial/metrics 两幕图表 canvas 已实际绘制（55,572 非透明像素，getImageData 校验）；离线 file:// 加载正常；打印 PDF 保留图表色彩，18 幕 18 页无截断
    last_verified: 2026-09-10

  - capability_id: CAP-PRINT
    name: Print 模式
    technology: CSS @media print + beforeprint 全展开
    purpose: 打印/PDF 交付
    status: tested
    tested_browsers: [chromium-153, webkit-26.6]
    tested_devices: [macbook-dev-machine]
    performance_cost: low
    accessibility: 打印态完整展开
    offline_support: yes
    presentation_use_cases: [会前预读, 留存材料]
    avoid_when: []
    fallback: 自身即 fallback
    demo_path: examples/demo/
    test_results: 真实打印导出 PDF：@page = 设计画布 1920×1080（16:9），18 幕恰好 18 页、零跨页；图表保留色彩、导航链接与控件不入档
    last_verified: 2026-09-10

  - capability_id: CAP-READER
    name: Reader 自读模式
    technology: 自研（runtime/reader/）
    purpose: 纵向完整阅读 + hash 深链
    status: tested   # 2026-09-10：§27 清单（锚点/引用/展开/移动端）跨引擎逐项通过
    tested_browsers: [chromium-153, webkit-26.6]
    tested_devices: [macbook-dev-machine]
    performance_cost: low
    accessibility: 完整内容无交互门控
    offline_support: yes
    presentation_use_cases: [会后自读, 分享链接]
    avoid_when: []
    fallback: 打印态
    demo_path: examples/demo/
    test_results: 跨引擎实测：开关切换；§27 清单全幕展开/来源 .wp-source 可见/展开控件在位/移动端 390×844 零溢出 12/12
    last_verified: 2026-09-10

  - capability_id: CAP-PRESENTER
    name: Presenter View 讲者台
    technology: 自研（runtime/presenter/）
    purpose: 笔记/计时/下一幕/跳转
    status: tested   # 2026-09-10：弹窗/计时走动/笔记跨引擎实测；仅「反向控制主窗口」未测
    tested_browsers: [chromium-153, webkit-26.6]
    tested_devices: [macbook-dev-machine]
    performance_cost: low
    accessibility: 键盘 P 键唤起
    offline_support: yes
    presentation_use_cases: [现场讲演]
    avoid_when: []
    fallback: Speaker Notes 打印
    demo_path: examples/demo/
    test_results: 跨引擎实测：独立弹窗打开、计时器走动（mm:ss）、Speaker Notes 与分支按钮渲染
    last_verified: 2026-09-10

  - capability_id: CAP-SEARCH
    name: 现场搜索（/ 键）
    technology: 自研（runtime/navigation/router.js WPSearch）
    purpose: 场景/论点/证据检索跳转
    status: tested   # 2026-09-10：命中与跳转跨引擎实测
    tested_browsers: [chromium-153, webkit-26.6]
    tested_devices: [macbook-dev-machine]
    performance_cost: low
    accessibility: 键盘唤起
    offline_support: yes
    presentation_use_cases: [Q&A 现场定位]
    avoid_when: []
    fallback: Overview 总览
    demo_path: examples/demo/
    test_results: 跨引擎实测：/ 唤起 → 命中 1 条 → 点击跳至 pipeline
    last_verified: 2026-09-10

  # ── 以下为 2026-09-10 完成 Prototype→Test→Compare→Accept/Reject 的技术（补丁 §4）──
  # 详表见 audits/TECH_DECISIONS.md；原型在 experimental/，不得进入 Production Runtime

  - capability_id: CAP-ECHARTS
    name: ECharts（数据可视化）
    technology: ECharts 5（vendored）
    purpose: 商务图表
    status: accepted
    tested_browsers: [chromium-153]
    offline_support: yes（本地 vendor）
    performance_cost: 1.01 MB（按需注入）
    demo_path: runtime/visualization/charts.js（生产）+ runtime/vendor/echarts.min.js
    test_results: 10 套 Deck 共 13 张图表实际绘制；离线 file:// 正常；打印 PDF 保留色彩
    last_verified: 2026-09-10

  - capability_id: CAP-GSAP
    name: GSAP
    technology: JS 库（71 KB，GreenSock 标准许可·非 OSI）
    purpose: 复杂时间线编排
    status: rejected
    tested_browsers: [chromium-153]
    offline_support: yes（本地 vendor）
    demo_path: experimental/motion-compare/（S1/S2/S3 三场景实测通过）
    test_results: 三场景均通过；仅 S3 明显优于 WAAPI；体积 +71 KB 且许可非 OSI → Reject（保留实验）
    last_verified: 2026-09-10

  - capability_id: CAP-VIEW-TRANSITION
    name: View Transition API
    technology: 原生 API
    purpose: 跨状态对象连续性
    status: hold
    tested_browsers: [chromium-153]
    offline_support: n/a
    demo_path: experimental/motion-compare/（S2 实测：最贴近语义）
    test_results: S2 表现最好；仅同文档状态切换、不可 seek → HOLD（须 Chromium+WebKit 双测与降级验证）
    last_verified: 2026-09-10

  - capability_id: CAP-MERMAID
    name: Mermaid
    technology: JS 库（3.26 MB）
    purpose: 结构草稿 / 中间表示（**非成品视觉**）
    status: downgraded
    tested_browsers: [chromium-153]
    offline_support: yes（本地 vendor）
    demo_path: experimental/mermaid-vs-svg/
    test_results: 渲染 32ms 可用，但体积为 ECharts 3 倍、默认主题与 Deck token 不统一 → 降级为草稿工具；成品由语义组件输出定制 SVG/HTML
    last_verified: 2026-09-10

  - capability_id: CAP-THREEJS
    name: Three.js / WebGL
    technology: JS 库（594 KB，MIT）
    purpose: 3D 空间关系
    status: rejected
    tested_browsers: [chromium-153]
    offline_support: yes（本地 vendor）
    demo_path: experimental/threejs-cases/（正向空间关系 + 反向 2D 更优）
    test_results: 正例可跑；headless 44 fps（无 GPU）；目标场景无必需 3D 的信息结构 → Reject（保留实验）
    last_verified: 2026-09-10

  - capability_id: CAP-D3
    name: D3.js
    technology: JS 库（273 KB，ISC）
    purpose: 定制数据叙事
    status: conditional
    tested_browsers: [chromium-153]
    offline_support: yes（本地 vendor）
    demo_path: experimental/d3-narrative/（联合轨迹 + 直接标注 + 注释带）
    test_results: 渲染 3ms，确证存在 ECharts 明显劣势的定制叙事场景 → 条件引入（按需、须带静态 fallback）
    last_verified: 2026-09-10

  - capability_id: CAP-SAFARI-REAL
    name: 真机 Safari 验证（WebDriver 直连）
    technology: safaridriver（Safari 26.5.2 自带）
    purpose: 在真实 Safari 上逐 Deck 验证引擎启动、幕内溢出、分支/深潜返回
    status: tested
    tested_browsers: [safari-26.5.2]
    tested_devices: [macbook-dev-machine]
    performance_cost: low
    accessibility: 与其他引擎一致
    offline_support: yes
    presentation_use_cases: [真机现场放映]
    avoid_when: []
    fallback: Playwright WebKit（同内核）
    demo_path: evals/harness/safari_real.cjs
    test_results: 15/15 套通过（双模式：设计画布 1920×1080 与原生窗口 800×652）；分支/深潜/返回正常；短屏修复后原生窗口零溢出
    last_verified: 2026-09-11

  - capability_id: CAP-SHORT-VIEWPORT
    name: 短屏适配（高度感知压缩）
    technology: CSS media (max-height) 三档（≤900/≤820/≤740）
    purpose: 投影仪/小窗口/分屏场景下内容不溢出
    status: tested
    tested_browsers: [chromium-153, safari-26.5.2]
    offline_support: yes
    performance_cost: none
    presentation_use_cases: [笔记本小窗, 分屏放映, 投影仪低分辨率]
    avoid_when: []
    fallback: 设计画布 1920×1080
    demo_path: runtime/core/presentation.css + runtime/components/components.css + runtime/visualization/charts.css（末段）
    test_results: 修复前 1280×800 溢出 7 幕 / 1366×768 溢出 18 幕；修复后 **144 幕全部零溢出**（两档）；Safari 原生 800×652 15/15
    last_verified: 2026-09-11

  - capability_id: CAP-LIVE-DATA
    name: WebSocket / Live Data
    technology: Web 标准
    status: hold
    demo_path: 未构建（无受众场景要求实时数据；离线优先为硬约束）
    test_results: 未实测；必须有静态快照 fallback
    last_verified: never
```
