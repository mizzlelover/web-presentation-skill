# RUNTIME — 运行时设计

## 渲染层级（§82）

| 级 | 名称 | 说明 | 默认? |
|---|---|---|---|
| L0 | Reader | 纯阅读文档（附录/Pre-read） | 附录默认 |
| L1 | Static | 静态幕 | **默认起点** |
| L2 | Progressive | 渐进揭示 | 需控制节奏时 |
| L3 | Animated Explanation | 动画解释因果/流程 | 需 Motion Intent |
| L4 | Interactive | 交互探索 | 需 purpose |
| L5 | Dynamic Data | 实时数据 | 用户明确要求 Live |
| L6 | Spatial / 3D | 3D 场景 | 仅空间关系类 |

升级必须写 `render_rationale`；validate_ir.py 强制检查 L3+。

## 运行时能力清单

- **导航**：键盘/触控/搜索跳转/hash 深链/总览（router.js, scene-engine.js）
- **Presenter View**：当前幕/下一幕/笔记/计时/分支/深潜返回（presenter-view.js）
- **Motion**：Intent 注册、pause/resume/reverse/seek/skip/replay、reduced-motion 降级（motion-controller.js）
- **Interaction**：expand/toggle/compare/drill + Core Path 完整性检查（interaction.js）
- **Reader Mode**：滚动、完整内容、深链（reader.js）
- **Print Mode**：分页、动画冻结、引用显示、黑白可读（print.css）
- **离线**：整目录打包，零 CDN 依赖（§48）
- **性能**：Performance Budget 字段入 IR；Stable > Fancy（§47/§83）

## 技术选型政策（§79/§80）

- 优先 Native Web Platform；有明确价值才引入第三方库。
- Reveal.js / Slidev / Spectacle 是 Runtime Reference，不是依赖；知识层不得引用其 API。
- 动效优先级：CSS → WAAPI → View Transition → Motion → GSAP。
- 字体：webfont / 本地打包 / system fallback，注意授权（§85）。

## 可访问性（§46）

键盘导航、焦点管理、语义 HTML、ARIA、reduced-motion、对比度 ≥4.5:1、alt 文本。Print/Reader 是交互内容的静态等价退路。
