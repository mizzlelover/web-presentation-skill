# Workflow: Render HTML — 渲染

## 输入
通过校验的 `presentation.ir.json`。

## 渲染管线

0. **唯一出口 = 代码渲染器**（§52 禁止 Demo-only Architecture）：
   ```bash
   python3 scripts/validate_ir.py <ir.json>          # 先过闸门
   python3 scripts/render_ir.py <ir.json> [-o out.html]
   ```
   `scripts/render_ir.py` 会按 `visual_semantics` / `blocks[].type` / `motion_intent` 自动装配组件与动效意图，并写入三层内容与同源三模式。**禁止手写 HTML 绕开 IR**；若渲染不达预期，改组件或 Renderer 分支，而不是改产物 HTML。

1. **外壳**：产物只引用 `runtime/`（相对路径由渲染器自动推导）；运行时零依赖，可整目录打包离线运行。
2. **逐幕渲染**：`blocks[]` → 语义组件（cards / numbers / steps / compare / timeline / quote / matrix / risks / arch / actions / evidence / list / chart / text）；stage 内容进 `content.stage`，reader 内容进 `content.reader`，两者都写进产物（One Content Model）。
3. **布局**：CSS Grid/Flexbox/Container Queries + design tokens（CSS 变量）。禁止 `left/top` 固定像素模仿 PPT；特殊视觉场景允许 absolute 但需注释理由。
4. **图表**：先定 Cognitive Job；普通商务图用本地化 ECharts（`runtime/vendor/echarts.min.js`，禁止 CDN），`chart` block 的 `caption` 必须交代口径。图表须过 Stage/Reader/Print/reduced-motion 四态。
5. **动效**：按 motion_intent 映射到 `runtime/motion/motion-controller.js` 的 Intent；优先级 CSS → WAAPI → View Transition → GSAP。全部动效挂到控制器（可 pause/seek/skip），并在 reveal 步到达时播放（否则被 `fill:both` 钉在首帧而不可见）。
6. **交互**：按 interaction 定义挂接；Core Path 不得依赖交互。
7. **可访问性**：语义 HTML、键盘导航、焦点管理、ARIA、alt 文本、对比度 ≥4.5:1、reduced-motion 降级。
8. **离线**：全部资源本地化；产物与 `runtime/` 内不得出现外部 URL（除用户明确要的 Live Data）。
9. **打印**：`runtime/print/print.css`；`@page` = 设计画布（1920×1080），每幕恰好一页；冻结动画、展开关键内容、显示引用、保留图表色彩。
10. **分支/深潜**：出口写 `nav_links{deep_dive,branch,skip}`；运行时由 `scene-engine.branchTo/deepDive` 压栈，Esc 返回并恢复揭示进度。

## 输出
- 自包含 `index.html` + `assets/` + `runtime/`（可整目录离线打包）
- 浏览器打开实测一遍（现场模拟：断网、键盘走全程、分支/深潜、打印预览）

## 标记契约（手写 / 修复产物时必读）
唯一出口仍是 `render_ir.py`；本节是审查、修复与对抗手写错误的**判定基准**（实测验证：外部模型手写 HTML 绕开渲染器，引入下列全部错误）。

1. **steps**：`.wpk-steps` 的直接子节点 = `.wpk-step[data-reveal]` 与 `.wpk-link[data-reveal data-motion-intent="trace"]` **交替平铺**（step, link, step, …）。`.wpk-link` 只是步骤间的连接条，**禁止放进 step 内部**。每个 `data-reveal` 消耗一次现场按键：单幕 reveal 总数 ≤ 10（4 步 = 7，5 步 = 9）。
2. **cards 网格**：`.wpk-grid.is-{2,3,4,5}` 的列数必须**整除或等于** items 数（5 项配 `is-4` 必出孤儿行）。validate_ir.py 已设闸门。
3. **标题**：`<h1>/<h2>` 收缩宽度 `fit-content` + `text-wrap: balance`，无 `<br>` 标题自动平衡断行；需要精确断句时人工插 `<br>`（按语义不断词）。
4. **kicker**：每幕写**本幕 topic/阶段标签**（方位信息），禁止全场同一句占位。
5. **来源行 `.wpk-src`**：只出现在**有实质出处差异**的幕；全场同一来源收敛到结语/附录；禁止出现生产过程元信息（"用户提供""AI 改写"等）。深潜幕保留 `<span data-branch-return>Esc 返回主线</span>`。
6. **字体契约**：`runtime/core/presentation.css` **不在 `:root` 重声明 `--wp-font-display/--wp-font-body`**——主题字体是主题资产，runtime 只在使用处带兜底（`var(--wp-font-display, system-ui), sans-serif`），任意加载顺序均生效。新主题只需在自身 `:root` 定义两个字体变量。
7. **加载顺序**（手写产物）：`presentation.css → components.css →（charts.css）→ theme → IR tokens 内联 <style>`。颜色 token 必须走 IR 内联（最后压载），字体走主题。

## 验证（每次产出后必跑）
```bash
# 逐幕截图 + 幕内溢出（包围盒判定）
NODE_PATH=<pw> node evals/harness/deck_shots.cjs <url> <outDir>
# 自适应导航端到端
NODE_PATH=<pw> node evals/harness/adaptive_test.cjs <url>
```

## 禁止
- 禁止交付未在真实浏览器打开过的文件。
- 禁止因 PDF 导出限制反向削弱 Web Runtime 能力（§3）。

