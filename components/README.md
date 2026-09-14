# Semantic Component Library — 语义组件库（§27/§28）

**这些是 Information Structures（信息结构），不是模板。** 每个组件绑定一个或多个 Cognitive Job，由 IR 的 `visual_semantics` 字段选用。所有组件必须：semantic / reusable / responsive（Container Queries）/ themeable（只吃 design tokens）/ accessible / animation-ready（可挂 motion intent）。

## 组件目录

### content/ 内容组件
| 组件 | Cognitive Job | 结构要点 | 文件 |
|---|---|---|---|
| HeroStatement | Orient / Decision | 单一核心陈述 + 可选副题，每幕唯一最强权重 | `hero-statement.html` |
| AssertionEvidence | Answer / Prove | 断言标题 + 视觉证据区 + 来源脚注 | `assertion-evidence.html` |
| Comparison | Compare | 2–4 列并行结构，行维度对齐 | `comparison.html` |
| BeforeAfter | Compare / Prove | 双态对比，基线必须标注 | `comparison.html` |
| BigNumber | Quantify | 单一巨号数字 + 单位 + 一句话解释 | `big-number.html` |
| Decision | Decide | 明确选项 + 每项后果 + 下一步 | `decision.html` |
| Timeline | Trace / Explain | 时间轴/甘特，泳道可选 | `timeline.html` |
| Summary | Summarize | 回收 Central Thesis + 关键 Claim | `hero-statement.html`（variant） |

### data/ 数据组件
- DataInsight：Question→Data→Insight→Meaning 四段式（§63）。
- ChartWithSource：任何图表外层容器，强制渲染 source/unit/time/scope 脚注（§92）。
- 实现依赖 `visualization/` 选型（ECharts 优先）。

### diagrams/ 结构组件
- Process / Architecture / Network / Hierarchy / Matrix / Roadmap / RiskMap。
- 草稿可用 Mermaid，成品按视觉质量转定制 SVG（§42）。

### narrative/ 叙事组件
- CaseStudy（Character→Goal→Conflict→Change→Meaning）。
- Quote（引语 + 归属，禁止伪造引用 §91）。

### layout/ 布局组件
- SceneShell（幕容器，container-type: inline-size）。
- Grid（auto-fit minmax 响应式栅格，禁固定像素）。

## 使用规则
1. 先选 Cognitive Job，再选组件——禁止反序。
2. 组件样式只引用 `var(--wp-*)` tokens；禁止组件内写死颜色/字号。
3. 交互内容必须有静态等价（Print/Reader 退化）。
4. 新增组件须登记到本目录并写清适用 Cognitive Job 与边界。
