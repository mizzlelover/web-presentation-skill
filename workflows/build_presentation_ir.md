# Workflow: Build Presentation IR — 生成中间表示

## 输入
Scene Plan + 主题 tokens。

## 步骤
1. 按 `schemas/presentation_ir.yaml` 组装 IR：
   - `presentation` 段：来自 Strategy。
   - `scenes` 数组：来自 Scene Plan，补全 evidence（含 source/unit/time/scope）、print_state、accessibility。
   - `theme.tokens`：从 themes/ 选择并实例化。
   - `assets`：列出全部图片/字体/数据，标注 local: true（离线打包）与 alt 文本。
   - `runtime`：navigation / presenter_view / motion（respect_reduced_motion: true）/ offline / performance_budget。
   - `modes`：stage / reader（deep_links）/ print（expand_critical, show_citations）。
   - `qa`：列出本次必须通过的视觉与运行时检查项。
2. **校验**：运行 `python3 scripts/validate_ir.py <ir.json>`，修复全部 error，warning 逐一确认。
3. IR 存档为 `presentation.ir.json`，作为渲染的唯一输入。

## 输出
- 通过校验的 `presentation.ir.json`

## 禁止
- 禁止在 IR 之外夹带渲染逻辑（IR 是声明式的"是什么/为什么"，不是"怎么画"）。
- 禁止跳过 validate_ir.py。
