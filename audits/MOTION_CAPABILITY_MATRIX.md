# MOTION_CAPABILITY_MATRIX.md — 动效技术能力矩阵

> 依据补丁 §21。统一测试场景：S1 simple reveal · S2 object continuity · S3 complex explanatory sequence。
> **实测更新：2026-09-10**，原型 `experimental/motion-compare/`，报告 `evals/harness/_artifacts/experimental/experimental_report.json`。
> 状态：✅ 实测通过 · ⚠️ 可做但成本高 · ⛔ 不适用/不擅长 · ❌ 未实现。

| 技术 | S1 simple reveal | S2 object continuity | S3 complex sequence | pause/seek/reverse | reduced-motion | 体积 | 结论 |
|---|---|---|---|---|---|---|---|
| CSS Animation | ✅ 0ms（切 class） | ⛔ 布局位置替换，非真连续 | ⚠️ 逐条 setTimeout，时序难控 | ❌ 控制弱 | ✅ 实测 | 0 | 简单揭示首选 |
| **Web Animations API** | ✅ 413ms | ⚠️ 需自维护状态 | ✅ 每元素一条 Animation，可统一控制 | ✅ 原生支持 | ✅ 实测 | 0 | **生产默认动效层** |
| View Transition API | ✅ 2ms（大材小用） | ✅ **最贴近语义**（同文档自动衔接） | ⛔ 仅状态切换，不适合分步序列 | ❌ 不可 seek | ⚠️ 需自行降级 | 0（原生） | 仅 CONTINUITY 场景，且需双引擎验证 |
| GSAP | ✅ 412ms | ⚠️ 需自维护状态 | ✅ **最自然**（timeline + stagger） | ✅ 完整支持 | ⚠️ 需自行降级 | **71 KB** | 仅复杂编排时考虑；**许可非 OSI** |

## 决议（2026-09-10，基于实测）

1. **Production Runtime 维持 CSS + WAAPI 双轨**：三种场景全部可完成，且 WAAPI 原生支持 pause/seek/reverse/skip（本项目语义动效的硬要求），体积为 0。
2. **GSAP 不进入生产**（补丁 §4「Prototype → Test → Compare → Accept / Reject」的 Reject）：
   - 优势仅在 S3 复杂编排，而本项目语义动效（REVEAL/FOCUS/…）均为单步或少量序列，WAAPI 已覆盖；
   - 代价是 +71 KB 与**非 OSI 许可**（GreenSock 标准许可），对一个强调零依赖、可离线交付的运行时不可接受。
   - 保留在 `experimental/`，若未来出现真正的复杂时间线需求（如 L5 动态模拟）再评估。
3. **View Transition 保持 experimental**：S2 表现最好，但仅限同文档状态切换、不可 seek；进入生产前须完成 Chromium + WebKit 双测与降级验证。
4. **所有动效必须注册到 `runtime/motion/motion-controller.js`** 并可 pause/seek/skip；`prefers-reduced-motion` 下与「M 静帧」下必须落到终态（本版已修「注册即被钉在首帧」缺陷）。
