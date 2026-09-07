# Workflow: Render HTML — 渲染

## 输入
通过校验的 `presentation.ir.json`。

## 渲染管线
1. **外壳**：复制 `runtime/` 运行时（零依赖原生 JS，可整目录打包离线运行）。
2. **逐幕渲染**：按 scene.visual_semantics 选 `components/` 中的语义组件，填入 stage 内容；reader 内容进入 `<details>`/reader 层；print_state 决定打印表现。
3. **布局**：CSS Grid/Flexbox/Container Queries + design tokens（CSS 变量）。禁止 `left/top` 固定像素模仿 PPT；特殊视觉场景允许 absolute 但需注释理由。
4. **图表**：按 KN-VIS-001 选图形；商务图 ECharts、定制度高用 SVG/D3、流程草稿 Mermaid（成品视觉需评估是否转定制 SVG）。图表必须带 source/unit/time/scope。
5. **动效**：按 motion_intent 映射到 `runtime/motion/motion-controller.js` 的 Intent；优先级 CSS → WAAPI → View Transition → GSAP。全部动效挂到控制器（可 pause/seek/skip）。
6. **交互**：按 interaction 定义挂接；Core Path 不得依赖交互。
7. **可访问性**：语义 HTML、键盘导航、焦点管理、ARIA、alt 文本、对比度 ≥4.5:1、reduced-motion 降级。
8. **离线**：全部资源本地化；`runtime/offline` 检查无外链 CDN（除用户明确要的 Live Data）。
9. **打印**：`runtime/print/print.css` + @page；冻结动画、展开关键内容、显示引用、分页。

## 输出
- `dist/` 目录：`index.html`（Stage）+ 内嵌 Reader/Print 模式 + assets/ + runtime/
- 浏览器打开 `index.html` 实测一遍（现场模拟：断网、键盘走全程、打印预览）

## 禁止
- 禁止交付未在真实浏览器打开过的文件。
- 禁止因 PDF 导出限制反向削弱 Web Runtime 能力（§3）。
