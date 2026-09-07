# DESIGN SYSTEM — 视觉设计系统

## 原则
视觉服从信息结构（§51）。美观不是固定风格，而是与 Audience / Brand / Topic / Context 匹配（§53）。

## Design Tokens（§52）

所有视觉决策通过 tokens 落地（CSS 变量），禁止每个 Scene 随意写 CSS：

```yaml
font:     # display / body / mono 字族、字阶（clamp 流式）
color:    # bg / fg / accent / muted（对比度 ≥4.5:1）
spacing:  # 流式间距阶梯（clamp）
radius:   # 圆角
shadow:   # 阴影层级
motion:   # 时长/缓动基准
grid:     # 栅格与容器规则
```

## 主题（themes/）

| 主题 | 适用 | 气质 |
|---|---|---|
| minimal | 通用/学术 | 极干 |
| corporate | 高管/决策 | 稳重高对比 |
| technology | 技术/发布 | 深色荧光 |
| government | 政务/机构 | 浅色克制 |
| editorial | 叙事/演讲 | 杂志排版 |

新增主题 = 新增一份 tokens CSS，不改组件。

## 版式规则

- 布局：CSS Grid / Flexbox / Container Queries；禁止 `left:428px` 式 PPT 模仿定位（§29）。
- 层级：每幕一处最强视觉权重（KN-VIS-002）；尺寸 > 粗细 > 颜色饱和度的次序建立层级。
- 分组即论证：物理邻近 = 逻辑相关（Gestalt）。
- 字号：流式 `clamp()`；投影正文经验下限 18–24pt 等效（D 级启发，按场地调整）。
- 节奏：间距阶梯一致；对齐优先于装饰。

## 10 种风格方向（§53）

Minimal / Editorial / Corporate / Government / Technology / Academic / Luxury / Data-heavy / Narrative / Futuristic —— 由 tokens 组合表达，选择时记录与受众/品牌/主题的匹配理由。
