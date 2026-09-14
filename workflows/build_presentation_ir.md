# Workflow: Build Presentation IR — 生成中间表示

## 输入
Scene Plan + 主题 tokens。

## 步骤
1. 按 `schemas/presentation_ir.yaml` 组装 IR：
   - `presentation` 段：来自 Strategy（**briefing（Briefing Gate 记录，source 四值之一）** / situation / communication_goal / audience / central_thesis / graph）。
   - `scenes` 数组：来自 Scene Plan，补全 evidence（含 source/unit/time/scope）、print_state、accessibility，以及 Renderer 扩展（`kicker / topic / claim / source / blocks[] / nav_links{}`）。
   - `theme.tokens`：从 themes/ 选择并实例化。
   - `assets`：列出全部图片/字体/数据，标注 local: true（离线打包）与 alt 文本。
   - `runtime`：navigation / presenter_view / motion（respect_reduced_motion: true）/ offline / performance_budget。
   - `modes`：stage / reader（deep_links）/ print（expand_critical, show_citations）。
   - `qa`：列出本次必须通过的视觉与运行时检查项。
2. **校验**：运行 `python3 scripts/validate_ir.py <ir.json>`，修复全部 error，warning 逐一确认。
3. IR 存档为 `presentation.ir.json`，作为渲染的唯一输入。
4. **渲染**（交接给 render_html 工作流）：`python3 scripts/render_ir.py <ir.json>`。

## 机制对照（写作时的自检清单）
写每幕时对照 `evals/mechanisms/`（25 条正反例）：
- 本幕是否触犯任一反例（装饰优先 / 到处强调 / 屏幕念稿 / 话题式标题 / 冗长并排）？
- 本幕是否已把「导出的渲染规则」体现出来（如强调上限 1 处、图注同容器、图表必带口径）？
- 机制 → 节点 → 组件的对应关系见 `knowledge/scene_examples.yaml`。

## 输出
- 通过校验的 `presentation.ir.json`
- （可选）渲染产物 `index.html`

## 禁止
- 禁止在 IR 之外夹带渲染逻辑（IR 是声明式的"是什么/为什么"，不是"怎么画"）。
- 禁止跳过 validate_ir.py。
- 禁止手写 HTML 绕开渲染器（§52）。
