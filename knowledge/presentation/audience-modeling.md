# KN-PRES-001 · Audience Modeling · 受众建模

- knowledge_type: presentation_principle
- evidence_grade: B
- rule_status: supported_principle
- verification: partially_validated   # SRC-PETTY-1984（ELM 涉入度×论证质量×来源线索交互）全文已验证 2026-09-08；Bitzer/Weissman/Lucas 仍 practitioner/memory_based
- evidence_package: knowledge/evidence_packages/persuasion-elm.yaml
- source_ids: [SRC-BITZER-1968, SRC-WEISSMAN-2003, SRC-LUCAS-SPEAKING, SRC-PETTY-1986, SRC-PETTY-1984]
- last_reviewed: 2026-09-08

## 已验证条目（真实全文）
**受众涉入度决定什么信息有效**（SRC-PETTY-1984，ELM 来源因素综述逐页精读）：
高涉入受众只对论证质量敏感，来源专业度作为线索无效；低涉入受众对来源/名人线索敏感，
无论论证强弱；中等涉入下来源线索决定"要不要认真想"（偏向加工）。
含义：受众建模的 expertise/motivation 字段不是人口统计装饰——它决定同一页内容应走
"论证深度路线"还是"线索/可信度路线"；attitude=hostile/skeptical 时证据深度优先于叙事包装。

## 必填模型（缺项时必须向用户追问或显式假设）
```yaml
audience:
  role:               # 角色
  expertise:          # novice | intermediate | expert | mixed
  prior_knowledge:    # 已知道什么
  decision_power:     # decider | influencer | executor | observer
  attitude:           # supportive | neutral | skeptical | hostile | unknown
  motivation:         # 为什么来听
  concerns: []        # 担心什么
  objections: []      # 会反对什么
  time_budget:        # 愿意给多少时间
  cognitive_load_tolerance:  # low | medium | high
  expected_detail:    # headline | summary | full
  likely_questions: []
```

## Core claim
演示必须回答"为什么这个人要听"（WIIFY），而不是"我有什么想讲"。受众模型驱动：情境判定、目标选择、密度策略、标题类型、分支设计、证据深度。

## 受众差异的最小证明（§97）
同一份材料：CEO 关注 Decision/Risk/ROI；技术团队关注 Architecture/Feasibility；一线员工关注 Workflow/Action。三份演示必须在 thesis、密度、scene 序列、证据深度上明显不同。

## Related nodes
KN-COMM-001（ELM）、KN-PRES-005（情境分类）
