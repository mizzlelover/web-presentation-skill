# Rubric Scores — 18 维评分（§66/§22）

> 评分方法：**单评审（LLM）**，未做外部校准（已知局限）。runtime_stability / performance /
> presenter_usability / reader_usability / accessibility 五维以机器实测为据（run_evals、verify_a11y、
> live_scenarios）；evidence_quality：真实语料 5 分依据 validate_strategy.py 溯源闸门，合成语料 3 分
> 依据「结构完整但内容自撰」。任一维 ≤2 即为不合格——当前 18 套无 ≤2 项。

| Deck | audience_fit | goal_clarity | argument_quality | cognitive_load | information_density | scene_purpose | visual_hierarchy | evidence_quality | narrative_coherence | data_visualization | motion_utility | interaction_utility | runtime_stability | accessibility | performance | presenter_usability | reader_usability | aesthetic_quality | 均分 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 01-executive-portal-decision | 5 | 5 | 5 | 4 | 4 | 4 | 4 | 3 | 5 | 5 | 4 | 4 | 5 | 5 | 5 | 5 | 5 | 5 | **4.56** |
| 02-government-waterfront | 4 | 4 | 5 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 5 | 5 | 5 | 5 | 5 | 5 | **4.39** |
| 03-tech-data-platform | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 3 | 4 | 4 | 4 | 4 | 5 | 5 | 5 | 5 | 5 | 4 | **4.22** |
| 04-data-quarterly-review | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 3 | 4 | 5 | 4 | 4 | 5 | 5 | 5 | 5 | 5 | 4 | **4.28** |
| 05-training-safety-induction | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 3 | 4 | 4 | 4 | 4 | 5 | 5 | 5 | 5 | 5 | 4 | **4.22** |
| 06-sales-content-service | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 3 | 4 | 4 | 4 | 4 | 5 | 5 | 5 | 5 | 5 | 4 | **4.22** |
| 07-research-industry-briefing | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 3 | 4 | 4 | 4 | 4 | 5 | 5 | 5 | 5 | 5 | 4 | **4.22** |
| 08-project-progress-review | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 3 | 4 | 4 | 4 | 4 | 5 | 5 | 5 | 5 | 5 | 4 | **4.22** |
| 09-strategy-three-year-plan | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 3 | 4 | 4 | 4 | 4 | 5 | 5 | 5 | 5 | 5 | 4 | **4.22** |
| 10-narrative-bookstore | 5 | 4 | 4 | 4 | 4 | 4 | 4 | 3 | 5 | 4 | 4 | 4 | 5 | 5 | 5 | 5 | 5 | 4 | **4.33** |
| 01-audience-ceo | 5 | 5 | 4 | 4 | 5 | 4 | 4 | 3 | 4 | 4 | 4 | 4 | 5 | 5 | 5 | 5 | 5 | 4 | **4.39** |
| 02-audience-technical | 5 | 4 | 4 | 4 | 5 | 4 | 4 | 3 | 4 | 4 | 4 | 4 | 5 | 5 | 5 | 5 | 5 | 4 | **4.33** |
| 03-audience-frontline | 5 | 4 | 4 | 4 | 4 | 4 | 4 | 3 | 4 | 4 | 4 | 4 | 5 | 5 | 5 | 5 | 5 | 4 | **4.28** |
| 04-duration-5min | 4 | 5 | 4 | 4 | 5 | 4 | 4 | 3 | 4 | 4 | 4 | 4 | 5 | 5 | 5 | 5 | 5 | 4 | **4.33** |
| 05-duration-15min | 4 | 4 | 4 | 5 | 4 | 4 | 4 | 3 | 4 | 4 | 4 | 4 | 5 | 5 | 5 | 5 | 5 | 4 | **4.28** |
| 01-national-statistical-bulletin | 5 | 5 | 5 | 4 | 4 | 5 | 4 | 5 | 4 | 5 | 4 | 4 | 5 | 5 | 5 | 5 | 5 | 4 | **4.61** |
| 02-central-audit-report-2024 | 5 | 5 | 5 | 4 | 4 | 5 | 4 | 5 | 4 | 5 | 4 | 4 | 5 | 5 | 5 | 5 | 5 | 4 | **4.61** |
| 03-digital-economy-plan-14th | 4 | 5 | 5 | 4 | 4 | 5 | 4 | 4 | 4 | 5 | 4 | 4 | 5 | 5 | 5 | 5 | 5 | 4 | **4.5** |

## 低于 4 分的维度说明

- **corpus/01-executive-portal-decision**：evidence_quality（合成语料 evidence_quality 受「内容自撰」限制，真实语料已达 5）
- **corpus/03-tech-data-platform**：evidence_quality（合成语料 evidence_quality 受「内容自撰」限制，真实语料已达 5）
- **corpus/04-data-quarterly-review**：evidence_quality（合成语料 evidence_quality 受「内容自撰」限制，真实语料已达 5）
- **corpus/05-training-safety-induction**：evidence_quality（合成语料 evidence_quality 受「内容自撰」限制，真实语料已达 5）
- **corpus/06-sales-content-service**：evidence_quality（合成语料 evidence_quality 受「内容自撰」限制，真实语料已达 5）
- **corpus/07-research-industry-briefing**：evidence_quality（合成语料 evidence_quality 受「内容自撰」限制，真实语料已达 5）
- **corpus/08-project-progress-review**：evidence_quality（合成语料 evidence_quality 受「内容自撰」限制，真实语料已达 5）
- **corpus/09-strategy-three-year-plan**：evidence_quality（合成语料 evidence_quality 受「内容自撰」限制，真实语料已达 5）
- **corpus/10-narrative-bookstore**：evidence_quality（合成语料 evidence_quality 受「内容自撰」限制，真实语料已达 5）
- **derived/01-audience-ceo**：evidence_quality（合成语料 evidence_quality 受「内容自撰」限制，真实语料已达 5）
- **derived/02-audience-technical**：evidence_quality（合成语料 evidence_quality 受「内容自撰」限制，真实语料已达 5）
- **derived/03-audience-frontline**：evidence_quality（合成语料 evidence_quality 受「内容自撰」限制，真实语料已达 5）
- **derived/04-duration-5min**：evidence_quality（合成语料 evidence_quality 受「内容自撰」限制，真实语料已达 5）
- **derived/05-duration-15min**：evidence_quality（合成语料 evidence_quality 受「内容自撰」限制，真实语料已达 5）

## 均分排名

- 4.61 real/01-national-statistical-bulletin
- 4.61 real/02-central-audit-report-2024
- 4.56 corpus/01-executive-portal-decision
- 4.5 real/03-digital-economy-plan-14th
- 4.39 corpus/02-government-waterfront
- 4.39 derived/01-audience-ceo
- 4.33 corpus/10-narrative-bookstore
- 4.33 derived/02-audience-technical
- 4.33 derived/04-duration-5min
- 4.28 corpus/04-data-quarterly-review
- 4.28 derived/03-audience-frontline
- 4.28 derived/05-duration-15min
- 4.22 corpus/03-tech-data-platform
- 4.22 corpus/05-training-safety-induction
- 4.22 corpus/06-sales-content-service
- 4.22 corpus/07-research-industry-briefing
- 4.22 corpus/08-project-progress-review
- 4.22 corpus/09-strategy-three-year-plan