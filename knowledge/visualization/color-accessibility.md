# KN-VIS-005 · Color & Accessibility · 颜色与可访问性

- knowledge_type: scientific_mechanism
- evidence_grade: B+
- rule_status: supported_principle
- verification: partially_validated   # 2026-09-13 升级：核心主张「色相不得为唯一编码」由 SRC-FRANCONERI-2021 全文级复核支撑（"avoid using hue as the only encoding channel"）；4.5:1 阈值经 WCAG 2.2 官方规范原文核对（SC 1.4.3 Contrast (Minimum)，w3.org/TR/WCAG22）；流行病学比例（约 8% 男性）为公开共识、原始统计未直接核对，使用时标注
- evidence_package: knowledge/evidence_packages/dataviz-communication.yaml（色盲可达性部分覆盖）
- source_ids: [SRC-WARE-2012, SRC-WILLIAMS-1994, SRC-FRANCONERI-2021]
- last_reviewed: 2026-09-13

## 已验证条目（2026-09-13 真实全文/规范核对）
- **双编码原则**（SRC-FRANCONERI-2021 全文级复核）：「让可视化对色盲受众可用的最简单方法是避免把色相作为唯一编码通道，或允许切换调色板」——Core claim 逐句支撑；protanopia（红绿色盲）为最常见形式亦命中。
- **对比度阈值 4.5:1**（WCAG 2.2 官方规范，w3.org/TR/WCAG22）：SC 1.4.3 Contrast (Minimum) 规范原文「contrast ratio of at least 4.5:1, except for: Large Text…」逐字核对——本系统 a11y 门禁（verify_a11y ≥4.5:1）即此条款的工程化。

## 证据状态（诚实声明）
Ware《Information Visualization: Perception for Design》是领域标准教材（感知机制），
未全文精读。**核心主张与工程阈值已于 2026-09-13 经真实来源核对升级 partially_validated**；
色觉缺陷流行病学比例（约 8% 男性 / 0.5% 女性）为公开共识数字，原始统计未直接核对，引用时须标注。

## Definition
颜色编码必须考虑：色觉缺陷人群、投影衰减、对比度阈值，以及颜色承载语义时的歧义风险。

## Core claim
颜色不能是承载关键信息的唯一通道；关键差异必须有第二编码（形状/位置/标签）。

## Mechanism
约 8% 男性无法区分某些红绿组合；投影设备压缩色域并抬升黑位；低对比度文字在强光下不可读。

## Boundary conditions
- 主题色（accent）用于强调是安全的（它同时有位置与粗细冗余）。
- 数据系列 >6 时颜色编码必然失效，需换编码或分面。

## Common misinterpretations
- ❌ "加个色盲模式就行"——正确的做法是从一开始就不依赖单一颜色。
- ❌ "对比度是设计品味"——4.5:1 是可读性阈值，本系统在 QA 轮强制检查。

## Presentation implications
主题 tokens 全部经 CSS 变量注入（themes/），保证全 Deck 一致；图表调色板固定 6 色
（PALETTE），系列超 6 个时 renderer 不再新增颜色（由数据设计层解决）。
本主题（暖纸底 + 深墨字）对比度按 4.5:1 校验通过。

## Related nodes
KN-VIS-006 前注意属性、KN-VIS-001 图形选择、KN-PRES-003 信息密度
