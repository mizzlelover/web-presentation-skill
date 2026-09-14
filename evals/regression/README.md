# 回归测试说明

## IR 校验规则回归
`scripts/validate_ir.py` 的规则与 `schemas/` 一一对应；修改 schema 或校验器后，用以下夹具回归：

- `examples/demo/presentation.ir.json` — 必须 0 error（正例）
- 负例构造：删 headline.rationale → 必须报 error；render_level=L3 无 rationale → 必须报 error；interaction 无 purpose → 必须报 error；连续 3 幕 high 负荷 → 必须报 warning。

## 运行时功能回归
在无头 Chrome 中验证（`--headless=new --dump-dom`）：
1. 初始化后仅首幕可见，其余 `hidden + aria-hidden`。
2. `next()` 先消费本幕 reveal 步骤再翻页。
3. `deepDive()` 压栈、`returnFromDive()` 恢复 reveal 进度。
4. `search()` 按 id/topic/claim/文本命中。
5. `snapshot()/restore()` 往返一致。
6. 打印模式（`@media print`）下全部 Scene 展开、控件隐藏。
7. reduced-motion 下动效直接呈现终态。

参考会话内的实测记录：2026-09-07 全部通过。
