# Workflow: Build Presentation Strategy — 演示策略

## 输入
analyze_source_content 的输出。

## 步骤
1. **Situation First**：按 `knowledge/presentation/situation-taxonomy.md` 判定情境（含 Hybrid 判断）。记录判定理由。
2. **受众建模**：填 `schemas/presentation.yaml` 的 audience 全字段。缺信息时：先合理假设并显式标注，关键项（decision_power / attitude / time_budget）向用户确认。
3. **沟通目标**：从 15 个目标动词中选择（可多选但需排序）。禁止"做好 PPT"式目标。
4. **Mode 决策**：需要 Stage / Reader / Print 中哪些？（默认 Stage+Reader；有留存/打印需求加 Print。）
5. **信息密度策略**：按 KN-PRES-003 的七因素定密度基调并写明理由。
6. **风格方向**：从 Minimal/Editorial/Corporate/Government/Technology/Academic/Luxury/Data-heavy/Narrative/Futuristic 中选，匹配 Audience/Brand/Topic/Context（§53）。映射到 themes/ 中的 design tokens。
7. **成功标准**：这场演示怎样算成功？（受众会做什么决定/记住什么/改变什么行为）写成可检验语句。

## 输出（Presentation Strategy 文档，交付给用户确认）
- 情境判定 + 理由
- 受众模型
- 沟通目标（排序）
- Central Thesis
- Mode 组合与密度策略
- 风格方向 + 主题选择
- 成功标准
- 风险与假设

## 禁止
- 禁止跳过本步直接做 Scene 规划。
- 禁止在用户未提供受众信息时编造关键受众属性而不标注假设。
