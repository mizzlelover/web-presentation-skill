# KN-COM-006 · Source Credibility · 来源可信度

- knowledge_type: scientific_mechanism
- evidence_grade: B+
- rule_status: supported_principle
- verification: partially_validated   # 2026-09-13 升级：核心主张（来源线索在高涉入下不能替代论据质量、低涉入下作为简单线索有效、弱论证配专家反而更差）由 EP-PERSUASION-ELM 全文级复核直接支撑（Petty 1984 扫描件视觉核对，含 Goldman 1981 / Hovland & Weiss 1951 重析 / Heesacker 1984）；「善意（benevolence）维度」的细化保持 memory_based
- evidence_package: knowledge/evidence_packages/persuasion-elm.yaml
- source_ids: [SRC-PETTY-1984, SRC-PETTY-1986, SRC-CIALDINI-1984, SRC-ARISTOTLE-BC350]
- last_reviewed: 2026-09-13

## 已验证条目（2026-09-13 全文级视觉核对，EP-PERSUASION-ELM）
- **低个人相关主题**：来源专业度不论论证强弱均提升同意（Petty, Cacioppo & Goldman 1981）——来源作为简单线索。
- **高涉入受众**：仅论证强度影响态度，来源线索无效（Petty, Cacioppo & Schumann 1983）。
- **弱论证配专家反而更差**（Heesacker, Petty & Cacioppo 1984，J. Personality 52:291-296）——高涉入下来源触发更深加工，弱论证被识破。
- **可信度效应边界**（Hovland & Weiss 1951 重析）：可信度效应在低个人相关主题上强、高相关主题上弱。

## 证据状态（诚实声明）
ELM 框架的来源线索实验证据已于 2026-09-13 经作者官网扫描件逐页视觉核对（7/8 逐字命中 + 1 处年份更正）；
「专业性/可靠性/善意」三维度框架的细化（PETTY-1986 手册章）未精读，善意维度保持 memory_based。

## Definition
受众对信息来源的专业性、可靠性与善意的感知，独立于论据质量地影响态度改变。

## Core claim
同一论证，来源可信度不同，效果不同；但对高涉入受众，来源线索不能替代论据质量。

## Mechanism
低涉入时来源作为启发式线索被直接使用；高涉入时来源影响"论据是否被认真对待"的阈值。

## Boundary conditions
- 可信度是感知而非事实：错引数据会摧毁它，且不可逆（与伦理条款联动）。
- 来源过多可能分散（每条证据都标权威 = 数据倾倒）。

## Common misinterpretations
- ❌ "挂个大牌机构名就行"——高涉入受众会核查来源与主张的匹配度。
- ❌ "引用越多越可信"——不相关引用是来源噪音。

## Presentation implications
证据块（`evidence[]`）强制带 `source` 字段（R-EVIDENCE-SOURCE-REQUIRED）即是本节点的工程化：
来源必须可见、可核对，而非仅可感知。留档稿（Print）显示来源行。

## Related nodes
KN-COMM-001 说服双路径、KN-VIS-003 图表诚信、KN-PRES-010 留档设计
