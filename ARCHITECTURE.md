# ARCHITECTURE — 系统架构

## 分层

```
┌─────────────────────────────────────────────────────────┐
│ SKILL.md（路由器）                                        │
│ Task Detection → Context Detection → Workflow Selection  │
└─────────────────────────────────────────────────────────┘
        │ 读取（progressive disclosure）
┌─────────────────────────────────────────────────────────┐
│ Knowledge Layer（方法论，框架无关）                        │
│ knowledge/  · 机制节点（证据分级 A–E）· 经验假设层 · 反模式 │
│ schemas/    · 知识节点 / 来源 / IR / Scene Schema         │
└─────────────────────────────────────────────────────────┘
        │ 产出
┌─────────────────────────────────────────────────────────┐
│ Presentation IR（唯一中间表示，声明式）                     │
│ schemas/presentation_ir.yaml · scripts/validate_ir.py   │
└─────────────────────────────────────────────────────────┘
        │ 渲染
┌─────────────────────────────────────────────────────────┐
│ Runtime Layer（技术实现，可替换）                          │
│ runtime/  · Scene引擎/导航/动效/交互/演讲者/读者/打印      │
│ components/ · 语义组件（信息结构）                         │
│ themes/   · design tokens                                │
│ visualization/ · ECharts/D3/SVG/Mermaid                  │
└─────────────────────────────────────────────────────────┘
        │ 验证
┌─────────────────────────────────────────────────────────┐
│ Evals（评测与回归）                                       │
│ evals/rubric.yaml · benchmark/cases.yaml · adversarial   │
└─────────────────────────────────────────────────────────┘
```

## 关键架构决策

1. **方法论与技术隔离（§78）**：Knowledge Layer 不引用任何框架 API；Runtime 可整体替换（Reveal.js/Slidev/自研）而知识层不变。
2. **IR 是唯一耦合点**：策略层产出 IR，渲染层消费 IR。禁止 Input→HTML 直通（§55）。
3. **One Content Model**：Stage/Reader/Print 是同一 Scene 模型的三个视图（stage/reader/print_state 字段），不是三套内容（§9/§57）。
4. **Presentation Graph 优于线性序列**：core_path + optional_paths + deep_dives + evidence_appendix（§33/§35）。
5. **Minimum Sufficient Rendering**：渲染层级 L0–L6 逐幕选择，L≥3 必须写 rationale（§81/§82）。
6. **Evidence-Aware**：知识节点带证据分级；实践经验隔离在 hypothesis 层（§15/§16）。

## 数据流

```
源材料 + 用户目标
  → workflows/analyze_source_content
  → build_presentation_strategy（受众模型/情境/目标）
  → build_argument_map（论证树 + 六查）
  → build_scene_plan（Cognitive Job / 负荷曲线 / Graph）
  → build_presentation_ir（IR JSON，validate_ir.py 校验）
  → render_html（runtime + components + themes）
  → review_presentation（18 维评测 + QA + 回归）
  → 交付 dist/（离线包）
```
