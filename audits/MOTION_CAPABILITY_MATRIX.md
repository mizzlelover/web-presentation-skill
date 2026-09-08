# MOTION_CAPABILITY_MATRIX.md — 动效技术能力矩阵

> 依据补丁 §21。统一测试场景：S1 simple reveal · S2 object continuity · S3 complex explanatory sequence。
> 状态：✅ 实测通过 · ⚠️ 部分实测 · ❌ 未实测 · ⛔ 不适用。审计日期：2026-09-07。

| 技术 | S1 simple reveal | S2 object continuity | S3 complex sequence | pause/seek/skip | reduced-motion | 离线 | 结论 |
|---|---|---|---|---|---|---|---|
| CSS Animation | ✅（Demo 实测） | ⛔ 不擅长 | ⛔ | ❌ 控制弱 | ✅ 实测 | ✅ | 简单揭示首选 |
| Web Animations API | ✅（回归测试） | ⚠️ 需手写 | ⚠️ 可编排但繁琐 | ✅ 原生支持 | ✅ 实测 | ✅ | 默认动效层 |
| View Transition | ❌ 未实现 | ❌ | ❌ | ❌ | 待测 | ✅ | experimental，见 CAPABILITY_VERIFICATION |
| Motion (库) | ❌ 未集成 | ❌ | ❌ | ❌ | 待测 | 需打包 | experimental |
| GSAP | ❌ 未集成 | ❌ | ❌（§15 九项待测） | 文档称支持，未实测 | 待测 | 需打包 | experimental；仅复杂 timeline 场景考虑引入 |

## 决议

1. Production Runtime 维持 **CSS + WAAPI** 双轨（均已实测），这是当前唯一允许进入 Renderer Planner 的动效技术。
2. 任何引入 GSAP/Motion 的提议必须先完成补丁 §15 全部九项实测并在 `experimental/` 留存 demo。
3. View Transition 的 CONTINUITY 场景需在 Chromium + Safari 双测通过后才排期。
