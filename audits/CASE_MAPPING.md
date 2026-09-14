# CASE_MAPPING.md — §67 100 案例与实际执行的映射（正式映射 v1.1，案例级执行已落地）

> 目的：把「100 个测试案例登记」与「实际执行的验证」对应起来，消除"登记 ≠ 执行"的缺口。
> 方法：§67 的 11 类配额（100 案例按类别）× 当前验证资产（25 套 Deck 与 13 个 evals 工具）
> 逐类映射。**声明**：映射表达"该类案例的关键断言已被哪条自动化验证覆盖"。
> **v1.1 更新（2026-09-13）**：`evals/harness/case_exec.cjs` 已落地案例级独立执行——100 条登记
> 案例逐条在真实浏览器中执行其 focus 维度专属断言，**100/100 PASS**（报告
> `evals/case_exec_report.json`；cases.yaml 状态已逐条写回）。

## 一、配额对照（§67）

| §67 类别（配额） | 对应基准语料 | 覆盖该类的自动验证 |
|---|---|---|
| Executive（15） | corpus/01（18 幕）+ derived/01-ceo、04/05-duration | run_evals 七维 × live_scenarios S1 × **case_exec 逐案例（15/15）** |
| Government（10） | corpus/02（15 幕）+ real/02 审计报告（13 幕） | run_evals 七维 × live_scenarios S2/S4 × **case_exec 逐案例（10/10）** |
| Project Report（10） | corpus/08（9 幕） | run_evals 七维 × **case_exec 逐案例（10/10）** |
| Sales（10） | corpus/06（10 幕） | run_evals 七维 × **case_exec 逐案例（10/10）** |
| Pitch（10） | derived/03-frontline（一线路演向） | run_evals 七维 × audience_eval × **case_exec 逐案例（10/10）** |
| Teaching（10） | corpus/05（9 幕） | run_evals 七维 × content_stress × **case_exec 逐案例（10/10）** |
| Technical（10） | corpus/03（12 幕）+ derived/02-technical + real/05 数据基建指引 | run_evals 七维 × audience_eval × **case_exec 逐案例（10/10）** |
| Data（10） | corpus/04（10 幕）+ real/01 统计公报 + real/04 CNNIC + real/06 茅台年报 | run_evals 七维 × data_stress × **case_exec 逐案例（10/10）** |
| Research（5） | corpus/07（9 幕）+ real/03 数字经济规划 | run_evals 七维 × **case_exec 逐案例（5/5）** |
| Story（5） | corpus/10（10 幕） | run_evals 七维 × **case_exec 逐案例（5/5）** |
| Document/Reader（5） | 真实语料 Deck 的 Reader/Print 模式 | run_evals（Reader/Print 项）× 打印 PDF 实测 × **case_exec 逐案例（5/5）** |

## 二、覆盖统计

- **语料侧**：25 套 Deck（合成 15 + 真实 10）、215 幕，覆盖 §67 全部 11 类（每类 ≥1 套）。
- **执行侧**：13 个自动化工具，对每套 Deck 执行的断言合计约 40+ 项/套。
- **案例侧（v1.1）**：100 条登记案例逐条执行（mapped-deck focus eval，每条案例有独立断言
  组合与执行记录，见 `case_exec_report.json`）。

## 三、执行边界（如实）

1. **案例级独立执行（v1.1 已落地，模式 = mapped_deck_focus_eval）**：每条案例的 focus 维度
   断言在映射 Deck 的真实浏览器运行上独立执行并记录。诚实边界：案例 brief 的场景内容
   由同类真实材料 Deck 承载，**「为每条案例全新生成 Deck 并走全管线」属于 LLM-in-loop
   行为测试，仍列 V1.0 前工作**——这是本轮如实声明的剩余缺口，不得标注为已完成。
2. **对抗测试的人工判断部分**：机器守卫 6/6 已跑；"用户说 X 时 Skill 如何回应"的 LLM-in-loop
   行为测试未自动化（协议已在 adversarial_eval.cjs 注释中）。
3. **移动端与 Firefox**：Firefox 在本沙箱启动挂起（重试 2 次确认）；移动端无真机。

## 四、结论

§67 的验收意图（按类别建立真实复杂材料的可执行基准）已达成**类别级 + 案例级执行**
（mapped-deck focus eval 模式）；剩余缺口仅「每案例全新生成」的 LLM 行为测试。
