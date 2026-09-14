# CORPUS_COVERAGE.md — 真实基准语料覆盖审计

> 依据补丁 §39–§41、§52–§56。初次审计 2026-09-07；**整改完成 2026-09-10**。
> 验证入口：`scripts/build_corpus.py`（批量校验+渲染）、`evals/harness/verify_corpus.cjs`（批量实测+截图）。
> 报告：`evals/harness/_artifacts/corpus_report.json`。

## 0. 总体结论（2026-09-11 深度检讨后更正）

**覆盖：类型 10/10，但「真实世界材料」0/10。**

- 15 套 Deck（112+32 幕）全部经 validate_ir → render_ir → Chromium/WebKit/真机 Safari 实测——**工程验证是真实的**。
- 但语料来源是**自撰合成样例**（本 Skill 作者本人撰写 IR），不是 §53 原文要求的「真实复杂中文材料」，
  也未满足 §52「给系统一份**从未见过的**真实内容」的测试条件。
- 连锁缺口：§95 要求每组产出的 **Strategy / Argument Map / Scene Plan 工件缺失**（仅有 IR）；
  第一份文档 §94 能力 A（原始 Word/长文→HTML）与 C（提纲→演示）属**未验证**。
- 详见 `audits/SELF_CRITIQUE.md` 与下方 §5.1 修复计划。

**汇总实测：15 套 Deck / 幕内溢出 0 / 控制台错误 0 / Evals 七维 15/15 通过。**

## 1. 十类复杂中文材料覆盖（§53）——类型达成，来源性质未达成

| 类型 | Deck | 幕数 | 图表 | 分支/深潜 |
|---|---|---:|---:|---|
| 高管汇报 | `01-executive-portal-decision` | 18 | 2 | 分支 3 / 深潜 6 |
| 政府/国企项目 | `02-government-waterfront` | 15 | 1 | 分支 1 / 深潜 6 |
| 技术架构 | `03-tech-data-platform` | 12 | 0 | — |
| 数据分析 | `04-data-quarterly-review` | 10 | 3 | — |
| 教育培训 | `05-training-safety-induction` | 9 | 0 | — |
| 销售/路演 | `06-sales-content-service` | 10 | 1 | — |
| 研究报告 | `07-research-industry-briefing` | 9 | 3 | — |
| 项目汇报 | `08-project-progress-review` | 9 | 1 | — |
| 战略规划 | `09-strategy-three-year-plan` | 10 | 0 | — |
| 复杂叙事 | `10-narrative-bookstore` | 10 | 2 | — |

覆盖：**类型 10/10；「真实世界来源」0/10**（全部为自撰合成样例；`examples/demo/` 8 幕属管线自检不计入）。

### 修复计划（P0-1，见 SELF_CRITIQUE.md §五）
1. 引入 ≥3 份**真实材料**（用户实际项目文档脱敏版 / 真实年报或政府公开文件 / 真实技术白皮书）；
2. 为每份产出完整工件链 `content-understanding → strategy → argument-map → scene-plan → IR → HTML`；
3. 新增 `validate_strategy.py` 校验上游工件结构；
4. 成功判据：**换一份从未参与撰写的真实材料，不改 Renderer/组件 CSS，产出合格 Deck**。

## 1.5 真实世界语料（§53/§52）——2026-09-11 起 6/10

- `benchmarks/real/01-national-statistical-bulletin/`：国家统计局《2024年国民经济和社会发展统计公报》
  （curl 原样抓取 54,459 字，表格按行还原，URL 与抓取时间入档）。
- 完整工件链：`source-material.md → content-understanding.json → strategy.json → argument-map.json →
  scene-plan.json → presentation.ir.json → index.html`（12 幕 / 4 图表）。
- 闸门：`scripts/validate_strategy.py`（引文逐字命中 + 图表数值溯源 + overclaim 登记 + 负荷曲线）0 error；
  validate_ir 0 error；浏览器实测 12 幕零溢出零错误。
- `benchmarks/real/02-central-audit-report-2024/`：审计署《国务院关于2024年度中央预算执行和其他财政收支的审计工作报告》
  （官方 PDF 27 页，pypdf 逐页抽取 16,963 字）→ 13 幕 Deck（问题地图五线索）。
  53/53 拟引用数字经溯源闸门逐字命中原文；闸门实测抓到 3 处转写错误并修正。
- `benchmarks/real/03-digital-economy-plan-14th/`：国务院《“十四五”数字经济发展规划》（gov.cn 原样抓取 14,206 字）
  → 10 幕战略解读 Deck；首次以程序化方式从 scene-plan 合成 IR。
- `benchmarks/real/04-cnnic-report-55th/`：CNNIC《第55次中国互联网络发展状况统计报告》
  （官方 PDF 75 页，全文抽取 60,705 字）→ 9 幕研究报告解读 Deck（四个切面：规模/底座/应用/生成式 AI）。
  闸门实测抓到 14 处「通稿式引文」失配（我引的是新闻稿措辞而非官方 PDF 原文，如「使用率达77.6%」
  被我写成「占比达77.6%」——分母不同）——已全部按原文修正，21/21 数字逐字命中。
- `benchmarks/real/05-national-data-infra-guide/`：《国家数据基础设施建设指引》（广东政数局全文转载页
  原样抓取 10,211 字）→ 10 幕技术架构解读 Deck（首个顶层文件/三阶段/八大能力/三大统一/六类设施）。
  闸门实测拦截 1 处通稿引文（「首个文件」定性句出自通稿而非指引原文——已替换为指引原文）+ 2 处 L3 缺 rationale。
- `benchmarks/real/06-moutai-annual-report-2024/`：贵州茅台 2024 年年度报告（巨潮官方 PDF 143 页，
  抽取前 45 页 53,097 字，附表未入语料如实声明）→ 9 幕经营分析 Deck（增长/渠道/现金流/分红）。
  闸门实测抓到 4 处全角括号差异（PDF 用（元／股））+ 12 处亿元换算值——闸门新增 source_values
  声明机制（原值逐字核对、显示单位自由）后 0 error。
- 诚实声明：公报「服务进出口」与报告通稿「蝇贪蚁腐」不在对应原文中，均未引用；剩余 4 类真实材料待引入。

## 2. 中文压力项（§39–§40）

| 压力项 | 现状 |
|---|---|
| 短 / 长标题 | ✅ 已系统测试：短 / 26 字 / 31 字 / 机构全称 / 中英混排 / 中文数字标点，6 类 × 2 分辨率 × 2 引擎 = 12/12 不溢出（`content_stress.cjs`） |
| 中文数字 / 标点 / 中英混排 | ✅ 纳入上表用例；10 套 Deck 内广泛使用 |
| 机构全称 / 政府项目名 / 长术语 | ✅ `02`（政府项目全称）、`03`（组件与系统名）、`08`（里程碑术语）实际使用 |
| 长标题处理策略 | ✅ 组件以 `cqi` 等比缩放 + `max-inline-size` 换行实现 re-layout（非溢出）；渲染器按 `information_density` 输出紧凑/宽松修饰 |

## 3. 数据压力项（§41）

ECharts 已整合（`runtime/visualization/`）。10 套 Deck 共 13 张图表，覆盖 `bar / line / hbar(ranking) / pie / stacked-bar`，含**负值**（`04` 同比增量贡献 −5pp）、**百分比**、**多系列**与**长中文标签**。

**专项数据压力测试（`evals/data_stress/` + `verify_data_stress.cjs`）：8/8 通过，并驱动 charts.js 补齐双轴 / 柱线组合 / 缺失值能力**

| 压力项 | 结果 |
|---|---|
| 20 分类 + 长中文机构全称（ranking） | ✅ 标签限宽截断，面板无横向溢出 |
| 缺失值（line 含 null） | ✅ `connectNulls:false`，断线不补零 |
| 正负混合（含参照零轴） | ✅ 方向清晰 |
| 多单位双轴（万元 vs %） | ✅ 右轴独立单位；次轴自动渲染为折线（柱线组合） |
| 小数百分比（1.24–3.05%） | ✅ 不取整 |
| 极值跨度（1 : 145000） | ✅ 小值不消失 |
| 面板横向溢出 / 控制台错误 | ✅ 0 / 0 |

## 4. 衍生基准（§54–§56）—— ✅ 已完成

`benchmarks/derived/`，与 `benchmarks/corpus/01` 共用同一源材料（数字化门户项目立项）。

**§54 同内容多受众**

| 版本 | 幕数 | 结构差异 | 密度 | 术语层次 |
|---|---:|---|---|---|
| `01-audience-ceo` | 6 | 结论 → 价值框架 → 投入 → 最坏情况 → 请求 → 收束 | 极低 | 无实现术语 |
| `02-audience-technical` | 6 | 边界 → 集成 → 数据模型 → 接口清单 → 权限 → 上线策略 | 高 | 架构/接口/权限 |
| `03-audience-frontline` | 5 | 三个变化 → 操作步骤 → 过渡 → 对你的好处 → 求助渠道 | 低 | 无架构与预算术语 |

**§55 同内容多时长**

| 版本 | 幕数 | 时长 | 取舍 |
|---|---:|---|---|
| `04-duration-5min` | 5 | 5 分钟 | 只保留决策链（结论 / 一条依据 / 一条风险 / 三项请求），删除背景与方案比较 |
| `05-duration-15min` | 10 | 15 分钟 | 保留完整论证链，治理·里程碑·合规·财务明细移入附录 |
| `corpus/01-executive-portal-decision` | 18 | ≈20 分钟 | 全量（含双深潜、分支、合规与治理明细） |

三个时长版本**结论完全一致**，而论证深度、证据取舍与场景分配不同——非「删页式」压缩。

**§56 现场适应剧本**：`evals/harness/live_scenarios.cjs` **5/5 通过**（①时间不够 → 跳段直达决策页并回退；②被问证据 → 深潜附录 → Esc 返回；③被问技术 → 深潜架构；④被质疑合规 → 分支异议；⑤现场静帧直出），含返回提示上下文化与揭示记忆恢复。

## 5. 门禁与验收（每套 Deck 均通过）

1. ✅ Strategy→IR→Renderer 全管线；**禁止手调 CSS**（§52）——10 套均由 IR 渲染产出。
2. ✅ `validate_ir.py` 0 error 0 warning。
3. ✅ 截图验收（§57）+ 逐幕幕内溢出（子元素包围盒判定）。
4. ✅ 零控制台错误门禁（§60）。
5. ✅ 打印导出 PDF（§15）：01 = 18 页、02 = 15 页，**幕数 = 页数**，16:9。
6. ✅ 离线 file:// 零外部请求（§16）。
