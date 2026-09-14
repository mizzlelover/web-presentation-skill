# Workflows — 标准工作流（管线顺序）

管线：**Input → Strategy → Argument Map → Scene Plan → Presentation IR → Renderer → Runtime → Review**

| 顺序 | 工作流 | 职责 | 产出 |
|---|---|---|---|
| 1 | `analyze_source_content.md` | 理解原始材料、抽取主张与证据 | 内容清单 |
| 2 | `build_presentation_strategy.md` | 情境判定（20 类）+ 受众建模（12 字段）+ 沟通目标 | strategy |
| 3 | `build_argument_map.md` | Central Thesis → Claim → Evidence，六查 | 论证树 |
| 4 | `build_scene_plan.md` | 每幕一个认知任务 + 负荷曲线 | Scene Plan |
| 5 | `build_presentation_ir.md` | 组装 IR（含 `blocks[]` / `nav_links{}`）+ 机制对照自检 | `presentation.ir.json` |
| 6 | `render_html.md` | `scripts/render_ir.py` 渲染为自包含 HTML（唯一出口） | `index.html` |
| 7 | `optimize_presentation.md` | 压缩、密度、精炼 | 修订后的 IR |
| 8 | `review_presentation.md` | 七维门禁 + 18 维评分 + 视觉回归 | 评审报告 |
| 9 | `runtime_adaptation.md` | 现场分支 / 深潜 / 跳段 / 短路径 | 现场预案 |

## 强制闸门

- **IR 闸门**：`python3 scripts/validate_ir.py <ir.json>` 必须为 0 error。
- **渲染**：`python3 scripts/render_ir.py <ir.json>`；禁止手写 HTML 绕开 IR（§52）。
- **批量**：`python3 scripts/build_corpus.py` 同时构建 `benchmarks/corpus` 与 `benchmarks/derived`。
- **验证**：`evals/harness/run_evals.cjs`（IR / Visual / Runtime / Browser / Offline / Performance / Console 七维）、`evals/harness/regression.cjs`（逐幕 aHash 视觉回归）。
- **机制自检**：`evals/mechanisms/`（25 条正反例）；机制 → 节点 → 组件的映射见 `knowledge/scene_examples.yaml`。

## 硬约束（违反即返工）

- 禁止 Input → HTML 一步到位（§55）。
- 禁止手写 HTML 绕开渲染器；效果不满意改组件或 Renderer 分支（§52）。
- 禁止交付未经真实浏览器验证的产物（§70）。
- 禁止以「已记录问题」代替「已修复」（强制执行补丁 §1）。
