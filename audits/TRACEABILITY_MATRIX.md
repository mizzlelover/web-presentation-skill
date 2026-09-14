# TRACEABILITY_MATRIX.md — 理论到场景可追溯矩阵

> 依据补丁 §44：确保理论不停在知识库里。Evidence 列在来源达 VALIDATED 前一律标 (memory)。
> 审计日期：2026-09-07。

| Principle | Evidence | Scene Pattern | Component | Runtime | Eval |
|---|---|---|---|---|---|
| 标题承载断言而非话题 | Alley (memory) | assertion headline | hero-statement / assertion-evidence | ✅ Demo 全幕实测 | 标题类型审查 |
| 信息密度由 Mode×受众决定 | Mayer/Sweller (memory) | stage 精简 / reader 完整 | 全部 | ✅ 三模式实测 | 密度审查 |
| 逐步揭示降低一次性负荷 | Cognitive load (memory) | reveal_strategy | data-reveal | ✅ 步进+静帧实测 | 负荷曲线审查 |
| 动效必须有认知意图 | Semantic motion (memory) | motion_intent | motion/ | ✅ WAAPI 实测 | 动效审查 |
| 深潜处理现场质疑 | Q&A adaptation (memory) | deep_dive 分支 | 分支链接 | ✅ 深潜/返回实测 | 非线性测试 |
| 证据分级可追溯 | 补丁 §9/§10 | evidence 字段 | assertion-evidence | ⚠️ IR 字段在，展示待加强 | 来源审查 |
| 同一内容模型多模式 | One Model 原则 | stage/reader/print 分离 | 全部 | ✅ 打印+自读实测 | 三模式审查 |
| 中文排版真实约束 | 补丁 §39/§40 | 长标题/混排 | typography tokens | ⚠️ 部分实测 | 中文压力测试（待建） |

## 用法

- 新增原则时必须补全六个列；Evidence 列为空或 (memory) 的原则不得进入"规则"语气。
- 每行 Eval 列指向 evals/ 中的具体检查项；Runtime 列必须有实测记录链接（audits/）。
