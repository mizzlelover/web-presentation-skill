# Changelog

## [1.0.2] — 2026-09-14

**Briefing Gate：前置访谈固化为硬门槛（Codex 实测跳过访谈事故的流程加固）**

- 事故：在 Codex 中使用本 skill，请求"将改写稿生成演示页面"被直接执行到底——五问（受众/场合/时长/目标/材料）一个没问，假设先行。旧规则埋在 workflow 中段且措辞为"先合理假设并显式标注，关键项向用户确认"，假设是默认路径、确认可跳过；Codex 实际读的 `adapters/AGENTS.md` 更是只字未提访谈。
- **SKILL.md**：铁律新增「禁止跳过前置访谈直接生成（Briefing Gate）」；第 0 步改造为「前置访谈 + Situation First——先问后判」，定义五问清单与**仅有的两条跳过条件**（用户请求已给全五问答案 / 用户明示"直接生成"），仅缺一两问只追问缺项；禁止用"先假设、交付时再改"替代提问。
- **adapters/AGENTS.md（Codex/OpenCode）与 adapters/CLAUDE.md**：入口行直接内嵌 Briefing Gate 硬门禁——不再依赖"先读 SKILL.md"的软引用。
- **workflows/build_presentation_strategy.md**：新增第 0 步 Briefing Gate；受众建模缺信息时改"回到第 0 步追问"，假设兜底仅限 `user_opt_out`；禁止清单同步。
- **机器校验（validate_ir.py）**：`presentation.briefing` 缺失 → warning（历史 IR 兼容，文案直指纪律）；`source` 非法（允许值 `user_brief` / `interview` / `user_opt_out` / `corpus_spec`）→ error；`user_opt_out` 未在 notes 逐条列假设 → error。
- **schemas/presentation.yaml + workflows/build_presentation_ir.md**：briefing 字段入 schema，IR 组装必填项。
- 模拟验证（四场景）：①复现 Codex 请求 → warning 触发+门禁判定"必须先提问"✓；②非法 source → error ✓；③opt_out 无 notes → error ✓；④合法 interview → 0 error 0 warning ✓；typography-lint 28/28 套 266 幕无回归 ✓。

## [1.0.1] — 2026-09-14

**实测验证回灌：外部模型手写产物暴露的 runtime 根因修复（字体级联 / 标题断行 / 网格孤儿 / 短屏溢出 / reveal 节奏）**

- 背景：用外部模型（ChatGPT 5.6 terra）实测本 skill 产出 deck，其绕开 `render_ir.py` 手写 HTML，暴露 3 类 runtime 根因 + 5 类生成侧缺陷；两轮「修复→实测→再诊断」收敛后回灌主仓（留档：`DIST_R10.md`）。
- **字体契约根治**：`runtime/core/presentation.css` 不再在 `:root` 重声明 `--wp-font-display/--wp-font-body`——此前 28 套 benchmark 的主题字体全部被级联反杀、实渲 system-ui。runtime 只在使用处带兜底（`var(--wp-font-display, system-ui), sans-serif`），任意加载顺序生效；editorial/government 字体栈补跨平台衬线降级（Noto Serif SC / Source Han Serif SC）。
- **标题断行根治**：`max-inline-size: 24ch → 24em`（ch 对汉字仅半宽，24ch ≈ 12 汉字，是中文标题被任意劈开的根因）+ `text-wrap: balance`；`.wpk-lead` 同步 balance。
- **组件**：新增 `.wpk-grid.is-5`；卡片/步骤/对比/时间线/矩阵/架构正文最小字号 +1~1.5px 并挂 `text-wrap: pretty`；step 顶部间距加大（消编号压线）；短屏档收紧 matrix/navrow（治 1366×768 溢出裁切）；总览格 560→420px。
- **渲染器**：`r_compare` 两列补 `data-reveal`（此前 compare 幕 0 reveal 整幕直出，与 IR 声明的 progressive 不符）；`.wpk-navrow` 摘除 `data-reveal`（深潜入口不再被渐进揭示扣押）。
- **校验闸门**：`validate_ir.py` 新增 cards.cols 与 items 数一致性 error、source/kicker 全场同一句 warning——对实测暴露的 3 类缺陷负向捕获 3/3，修复后 IR 0 error 0 warning。
- **文档**：`workflows/render_html.md` 新增「标记契约」节（steps 的 link 交替平铺禁入 step 内部、网格列数纪律、标题/kicker/来源行/字体契约/加载顺序）。
- 验证：typography-lint 28/28 套 266 幕 0 违规；视觉基线 266 幕按新渲染刷新后 0 差异；同步后 IR 经 `render_ir.py` 全管线重渲染 11 幕零溢出零报错。

## [1.0.0] — 2026-09-13（重新发布）

**首个公开发布版本（以端到端行为测试与知识节点升级后的状态为准）**

- 初版 1.0.0 发布后按「对自己高要求」标准复核，判定当时材料不配 1.0 名号，补齐三项缺口后重新发布：
  1. **证据链复核无死角**：谢 2016（中文线索效应元分析）心理学报 OA 全文重取，5 组效应量与调节方向 6/6 逐字命中——18 条全文精读来源全部完成独立复核（`audits/EVIDENCE_SPOTCHECK.md` 抽查 16）。
  2. **知识节点升级 26 → 30 partially_validated**：来源可信度（EP-PERSUASION-ELM 全文级支撑）、论证架构（论证质量主效应实验支撑 + 方法层保持 practitioner 不虚标）、前注意属性（双全文级排序复核）、颜色与可访问性（Franconeri 全文 + WCAG 2.2 SC 1.4.3 官方规范原文核对）；生成加工/测试效应按纪律**不虚标升级**（Szpunar 2013 PNAS 全文付费墙，升级路径已具体化）。
  3. **端到端行为测试落地**：3 套系统从未见过的真实材料（WHO《2025 世界卫生统计》中文新闻稿 / UN 大会第 80/117 号决议中文政治宣言 / UN-IPCC 关键结论中文页——国际组织三类全新形态）走 spec→五工件→三道闸门→渲染全管线，共 27 幕。闸门实战再拦截 3 处（预处理 em-dash 伪影、材料出处头缺失、决议元数据引文失配 + 负荷曲线连续 HIGH），全部按真实来源修正。
- 回归全绿：**Evals 28/28 七维 · 真机 Safari 28/28 · a11y 全过 · 对抗守卫 6/6 · Strategy/Audience · 视觉回归基线 266 幕 0 差异**（regression 扫描范围修正为 corpus+derived+real 全量）。
- 此前的 V0.x 迭代为内部开发版本，不随公开仓库分发。

## [0.19.0] — 2026-09-13

**证据链复核收官（13/13 证据包全覆盖）+ §67 案例级独立执行落地（Zcode 接力轮）**

- **证据包抽查 13/13 全覆盖**（`audits/EVIDENCE_SPOTCHECK.md` 第三、四轮）：
  - working-memory（Cowan 2010，eutils 重取全文）5/5 命中；temporal-contiguity（Liu 2022，Europe PMC 重取全文）7/7 命中；Ginns 2006 摘要级 3/3；
  - graphical-perception（Cleveland 1986 + Heer 2010 双全文级）8/8 逐字命中；
  - persuasion-elm（Petty 1984 作者官网扫描件 pdftoppm 转图视觉核对）7/8，**拦截 1 处年份错误**（Heesacker 1983→1984，EP/节点/来源登记三处同步更正）；
  - educational-video（Guo 2014 + Brame 2016 双全文级）7/8，**1 处口径修正**（「9-12 分钟约 50%」标注为 Figure 2 图形读数，正文无此百分比）；
  - dataviz-communication（Franconeri 2021 全文级）9/9；assertion-evidence（Garner-Alley 2013 + Aippersbach 2013 + Garner 2009 三全文级）8/8。
  - 全季战绩：15 项核对拦截 5 处问题（1 错误归属 + 2 表述精确化 + 1 年份 + 1 图形读数口径），EP 级 0 矛盾。
- **§67 案例级独立执行落地**：新增 `evals/harness/case_exec.cjs`——100 条登记案例逐条在真实
  Chromium 中执行其 focus 维度专属断言（mapped-deck focus eval 模式），**100/100 PASS**
  （47.8s）；报告 `evals/case_exec_report.json`；`cases.yaml` 状态逐条写回；
  `CASE_MAPPING.md` 升级 v1.1。诚实边界：每案例全新生成 Deck 属 LLM 行为测试，仍列 V1.0。
  - 脚本调试中修正 3 处断言选择器（`.wpk-src`/`.wpk-chart__cap`/aria 语义）与 1 处路径
    缺陷（benchmarks/ 前缀）——断言修正均以真实 DOM 结构为准，非放宽标准。
- **FINAL_REPORT 文档债清理**：§5 标题与重复段落（真实语料仍写 1/10）、§7 Evals 数字、
  §8.12 压力测试回答、§10 完成度结论全部同步至当前状态。
- 回归：**Evals 25/25 · a11y 全过 · 对抗守卫 6/6 · Strategy/Audience 两项通过**。

## [0.18.1] — 2026-09-11

**视觉精修：数字/步骤组件与长标题断点（用户 Preview 复核发现）**

- 问题（用户复核）：①数字组件在词中断行（「4000 万+」「3000 万」折成两行，三列高矮不一）；
  ②nowrap 后右溢撞列；③步骤键位 9–11px 不可见、连接线抢戏成"悬浮线"；④新四套 Deck 长标题
  在浏览器任意点断行（如「占/就业」"1 级能/效"），对比 Kimi 老 Deck 明显不精细。
- 修复：
  1. `.wpk-num__v`：字号收敛（4.6cqi，max 68px）+ `nowrap` + 超宽省略（防撞列）；`.wpk-numbers`
     最小列宽 260px、容器放宽至 1080px、间隙收窄——三列齐平不撞列；
  2. `.wpk-step`：键位加大加重（accent）、标题 16–22px、连接线变短变细的居中连接段；
  3. 四套新 IR 标题按自然短语边界加 `<br>`（16 处），过长的「封顶 2000 元」移入步骤承载；
  4. 四套 spec 固化进各自 Deck 目录（spec.json），成为可复现工件。
- 复核：逐项截图对照 Kimi 老 Deck（corpus/01）——数字/步骤/标题断点达到同档精细度。
- 回归：Evals 25/25 · 真机 Safari 25/25 · a11y 全过。

## [0.18.0] — 2026-09-11

**真实语料 10/10 达成（§53 全类覆盖）+ 上游管线工具化**

- 新增四份真实世界语料，完成 §53 全部 10 类覆盖：
  - ⑦教育培训：人社部《“技能中国行动”实施方案》（人社部发〔2021〕48号，gov.cn 原样抓取 12,746 字）→ 8 幕（4000 万/30% 可考核目标 + 自主认定/学徒制两大企业窗口）；
  - ⑧销售：商务部等4部门《关于进一步做好家电以旧换新工作的通知》（mofcom.gov.cn 原样抓取 2,390 字）→ 8 幕（8 类/15%/+5%/2000 元上限 + 大数据合规红线——薄材料如实处理不注水）；
  - ⑨项目方案：国家发改委《关于新建西安至十堰高速铁路可行性研究报告的批复》（发改基础〔2020〕595号，1,693 字）→ 8 幕（批复四要素读法：必要性/内容标准/投资资金/建设安排）；
  - ⑩高管汇报：《政府工作报告》（2025-03-05，gov.cn 专题页原样抓取 20,666 字）→ 8 幕（汇报形态三特征解构：结论先行/数字锚点/任务到条）。
- **上游管线工具化（§54）**：新增 `scripts/build_real_deck.py`——spec JSON → 五工件（content-understanding/strategy/argument-map/scene-plan/IR）+ 三道闸门 + 渲染，一键完成；claims 引文预检失败即拒绝出工件。
- **引文收割器**：`/tmp/harvest_quotes.py`——按数字锚点回原文收割整句，解决「搜索快照措辞 ≠ 官方原文」的系统性引文失配（半角逗号 vs 全角、繁简体、通稿 vs 原文三类差异一次性解决）。
- 闸门实测：deck07 收割器曾把出处头块误当句子——已改为结构化遍历修正，全部引文逐字命中；deck08-10 首版即过或一轮修正。
- 全套回归：**Evals 25/25 · 真机 Safari 25/25 · a11y 25/25 · Strategy Eval tested 10 / legacy 15 / fail 0**。

## [0.17.0] — 2026-09-11

**真实语料 6/10（经营分析类：贵州茅台年报）+ 闸门 source_values 机制 + §68 行为协议**

- 新增第六份真实世界语料：贵州茅台 2024 年年度报告（巨潮资讯网官方 PDF 143 页，
  抽取前 45 页 53,097 字——附表未入语料并如实声明）→ `benchmarks/real/06-moutai-annual-report-2024/`
  → 9 幕经营分析 Deck《增长、渠道与现金分红》（营收 1,708.99 亿/+15.71%、经营现金流 924.64 亿/+38.85%、
  双渠道毛利率 95.33%/89.42%、分红 346.71 亿）。
- **闸门升级 ①（source_values 机制）**：图表可声明原文原值（如 170,899,152,276.34 元），
  数据值（1,708.99 亿）视为显示换算——原值仍逐字核对，显示单位自由；修复大数科学计数法与浮点精度两处格式缺陷。
- **闸门拦截实录**：deck06 首版 16 处失配——4 处全角/半角括号差异（PDF 用（元／股），我写(元/股)）、
  12 处亿元换算值。全部修正/声明后 0 error。**全角标点是真实 PDF 语料的高频陷阱。**
- **§68 行为协议**：`evals/ADVERSARIAL_PROTOCOL.md`——10 个对抗请求 × 要求行为 × 依据 ×
  机器防线 × 执行记录（单评审自评，局限声明）。防御纵深设计：机器守卫兜底、行为协议提升上限。
- 全套回归：Evals 21/21 · 真机 Safari 21/21 · a11y 全过 · Strategy Eval tested 5 / legacy 15 / fail 0。

## [0.16.1] — 2026-09-11

**修复：IR 中的 `<br>` 在渲染产物中显示为文字（用户反馈发现）**

- 根因：`render_ir.py` 的 `inline()` 先做 HTML 转义（`<br>` → `&lt;br&gt;`），
  但转义后未还原换行标记——凡在 IR 文本中写 `<br>` 的地方（quote/lead/headline 等 10+ 套 Deck）
  屏幕上显示的是字面 `<br>`。
- 修复：转义后按正则还原 `&lt;br&gt;`（含 `<br/>` 变体）为真实换行；`
` 与真实换行行为不变。
- 全量重渲染 20/20；扫描渲染产物 `&lt;br&gt;` 残留 = 0。
- **回归防线**：run_evals 新增「字面 `<br>` 出现在 DOM 文本即失败」检查（Chromium+WebKit 双端），
  防止同类问题复发。修复后 Evals 20/20 全部维度通过。
- 发现途径：**用户在预览中人工发现**——暴露此前 evals 未覆盖「转义类渲染缺陷」的盲区，已补。

## [0.16.0] — 2026-09-11

**真实语料 5/10：数据基建指引全链路（技术架构类）+ §67 映射 + Firefox 确认**

- 新增第五份真实世界语料：《国家数据基础设施建设指引》（国家发改委/国家数据局/工信部，
  2024-12，全文转载页原样抓取 10,211 字）→ `benchmarks/real/05-national-data-infra-guide/`
  → 10 幕技术架构解读 Deck（首个顶层文件/三阶段时间表/八大能力/三大统一/六类技术设施/集团接入参考）。
- **闸门第三次拦截**：opening 的引文「这是国内首个文件」出自通稿而非指引原文——已替换为指引原文
  「力争在当前情况下，说清楚数据基础设施的概念、发展愿景和建设目标」；另补 2 处 L3 render_rationale。
- **§67 100 案例正式映射**：`audits/CASE_MAPPING.md`——§67 全部 11 类配额已由 20 套语料覆盖
  （每类 ≥1 套），映射到 12 个自动化工具约 40+ 项断言/套；如实标注：案例级独立执行与
  LLM-in-loop 行为测试待做。
- **Firefox 确认不可用**：重试 2 次（含 25s launch 超时）均在沙箱内挂起——与此前记录一致，如实标注。
- 全套回归：Evals 20/20 · 真机 Safari 20/20（含 5 套真实语料 Deck）· a11y 20/20。

## [0.15.0] — 2026-09-11

**真实语料 4/10：CNNIC 第55次报告全链路（研究报告类）+ 全套验证通过**

- 新增第四份真实世界语料：CNNIC《第55次中国互联网络发展状况统计报告》（官方 PDF 75 页，
  全文抽取 60,705 字）→ `benchmarks/real/04-cnnic-report-55th/` → 9 幕 Deck
  《从接入到应用：数字社会的四个切面》（规模/底座/应用/生成式 AI，含分母口径标注）。
- **闸门价值实证（第二次）**：首版 14 处引文失配——我引用的是新闻通稿措辞而非官方 PDF 原文
  （如「使用率达77.6%」被我写成「占比达77.6%」，分母不同），已全部按原文修正；21/21 数字逐字命中。
- 全套验证：Evals 19/19 · 真机 Safari 19/19 · a11y 全过 · Strategy Eval tested 4 / legacy 15。
- 证据抽查累计 7/13 包（新增 VANLAER-2014 摘要级通过）。

## [0.14.1] — 2026-09-11

**证据包抽查第二轮：发现并更正 1 处派生节点错误归属**

- 抽查 3 个证据包（coherence-seductive-details / redundancy / attention-cueing，摘要级+原文结论句）。
- **发现并更正**：KN-MOT-002（动效三功能）把 DEKONING-2009 的三功能误写为
  「注意引导/激活先备知识/抑制误解」——原文实为 **selection / organization / integration**
  （选择/组织/整合），且原文结论为「选择型证据最稳，关系型需更多考量」。已按原文更正，
  并据此调整工程映射（CONNECT/TRACE 类 intent 需比 REVEAL 更强 rationale）。
- 确认：coherence EP 的「总体 g=-0.33 + 中文 -0.75 分组」声明结构与原文层次一致；
  redundancy EP 的两类冗余/四场景/效应方向与原文吻合——继承证据包质量高于预期。
- **规程升级**：抽查范围从「EP vs 原文」扩展到「EP → 派生节点」一致性——派生层才是错误高发区。

## [0.14.0] — 2026-09-11

**第三份真实语料（战略规划类）+ 可访问性修复 + 18 维打分 + 对抗守卫实跑**（剩余队列清理）

- **真实语料 3/10**：新增国务院《“十四五”数字经济发展规划》（国发〔2021〕29号，gov.cn 原样抓取 14,206 字）
  → `benchmarks/real/03-digital-economy-plan-14th/`，10 幕战略解读 Deck；
  首次以**程序化方式从 scene-plan 合成 IR**（IR↔scene-plan 同构由闸门保证）。
- **可访问性自动检查落地并发现真实缺陷**（§46/§69）：`verify_a11y.cjs`（对比度 ≥4.5:1 / 字号 ≥12px / alt）
  实测 18 套，**发现 7 套存在对比度缺口**——根因为 kicker 使用强调色原色、editorial/corporate 主题 muted 过浅。
  修复：kicker 改为 accent×fg 混合色（浅色主题变深、深色主题变浅）、两主题与三套 IR 内联 token 的 muted 加深。
  修复后 **18/18 全部通过**；Evals 18/18 回归无异常。
- **对抗测试机器守卫实跑**（§68）：`adversarial_eval.cjs` 六项守卫全部生效——
  L3+ 必带 rationale / motion_intent 白名单 / chart kind+caption / 打印隐藏交互 / SKILL.md 对抗式回应 / caption 告警。
- **18 维 rubric 打分完成**（§66/§22）：`evals/rubric_scores.md|json`——18 套 × 18 维，
  **无任何 ≤2 项**；真实语料 Deck 均分最高（4.61）；方法与局限（单评审、未外部校准）如实记录。

## [0.13.0] — 2026-09-11

**真实语料 2/10：审计工作报告全链路 + 真机 Safari 17/17**

- 新增第二份真实世界语料：审计署《国务院关于2024年度中央预算执行和其他财政收支的审计工作报告》
  （官方 PDF 27 页，pypdf 逐页抽取 16,963 字）→ `benchmarks/real/02-central-audit-report-2024/`
  → 13 幕 Deck《资金流向与问题地图》（面向纪检/财务/内审的场景，问题清单型材料的首次真实测试）。
- **53/53 拟引用数字经 validate_strategy.py 逐字命中原文**；闸门实测抓到 3 处转写错误
  （漏「举」字、引号形态「」vs“”）并修正——机械防线的价值得到实证。
- 真机 Safari 17/17 套全部通过（含两套真实语料 Deck）。
- Evals：17/17 套七维 + Strategy/Audience 两项全通过。

## [0.12.0] — 2026-09-11

**真实语料注入 + 上游工件化 + 两项 Evals 补齐 + 证据抽查**（SELF_CRITIQUE P0 全部落地）

- **真实世界语料（§53/§52 首次达成）**：国家统计局《中华人民共和国2024年国民经济和社会发展统计公报》
  （2025-02-28，curl 原样抓取 54,459 字，表格按行还原，出处与抓取时间入档）
  → `benchmarks/real/01-national-statistical-bulletin/source-material.md`。
- **上游工件链（§95 首次完整）**：`content-understanding.json → strategy.json → argument-map.json →
  scene-plan.json → presentation.ir.json → index.html`；新增闸门 `scripts/validate_strategy.py`：
  源材料出处校验、**引文逐字命中源材料**、argument-map 必须登记 overclaim 风险、
  认知负荷曲线校验、场景↔论证互锁、**IR 图表数值逐个溯源**（数字不在原文即报错——编造素材的机械防线）。
  实测抓到并修正 3 处「重构式引文」与 1 处表格转换缺陷（表格按行还原后修复）。
- **真实材料 Deck**：12 幕 / 4 图表（GDP 季度 V 型、新产品增速排名、装机增速、三大需求拉动）/ 3 处 source_refs 级引用，
  主动登记反例（水泥 -9.5%、粗钢 -1.7%、煤炭占比 53.2%）与语料限制声明（服务进出口小节未入语料故未引用）。
  validate_ir 0 error；浏览器实测 12 幕零溢出零错误；16 套 Deck 全构建。
- **§22 两项 Evals 补齐**：`strategy_audience_eval.cjs`——
  Strategy Eval（上游工件齐全性 + validate_strategy 闸门 + IR↔scene-plan 同构；real 1 tested / 15 legacy 如实标记）；
  Audience Adaptation Eval（同源三受众 9 项结构差异断言全通过：幕数/术语层次/密度/禁用词/收束差异）。
- **数据兜底（§3/§16）**：echarts 缺失时 chart 自动降级为语义表格（`.wpk-chart__table`），数据仍完整可读；实测通过。
- **证据包抽查（P1-1 首轮）**：`audits/EVIDENCE_SPOTCHECK.md`——REY-2019 摘要级 5/5 吻合；
  SWELLER-2019 **全文级 7/7 吻合**（OA PDF 重下并逐句抽取）；DEKONING-2009 书目级一致。
  无矛盾发现，无需降级；确立三级抽查规程与下轮队列。

## [0.11.0] — 2026-09-11

**真机 Safari 验证通过 + 短屏适配修复**（补丁 §30/§31/§72 收口）

- 用户新开启 Safari「允许远程自动化」后，新增 `evals/harness/safari_real.cjs`（WebDriver 直连）实测：
  **真机 Safari 26.5.2 · 15/15 套全部通过**（含分支/深潜/返回与揭示恢复），双模式验证：
  ①设计画布 1920×1080；②原生窗口 800×652。
- 首轮真机测试暴露**真实缺陷**：所有排版随宽度（cqi）缩放、不感知高度——短窗口下 7~18 幕纵向溢出
  （Chromium 同样复现，非 Safari 特有）。
- 修复：`presentation.css` / `components.css` / `charts.css` 增加**高度感知三档压缩**
  （≤900px / ≤820px / ≤740px，逐级收紧字号、间距、图表盒高度与组件内距）。
- 修复后：**1280×800 与 1366×768 下 144 幕全部零溢出**（修复前 7 幕 / 18 幕溢出）；
  Safari 原生窗口 800×652 亦 15/15 通过；设计画布 Evals 复跑 15/15 无回归。
- Safari 验证脚本支持 `SAFARI_CANVAS=native`（原生窗口）与默认（设计画布）两种模式。

## [0.10.0] — 2026-09-11

**理论藏书扩张：知识节点 14 → 53**（补丁 §15/§17 的核心缺口）

- 新增 32 个知识节点，覆盖 7 域：认知（双通道/分散注意/瞬息信息/专长反转/诱惑性细节/冗余/生成加工/情绪唤醒）、
  传播与说服（叙事传输/来源可信度/框架/承诺一致/修辞情境/金字塔原理）、演示（图表结论式标题/节奏与停顿/
  会前材料与现场/留档设计/结构路标/现场故障预案）、可视化（图表诚信/数据墨水之争/颜色与可访问性/
  前注意属性/图表动画）、动效（三功能/动效与负荷）、交互（交互成本/讲者控制模式）、反模式（模板优先/数据倾倒/伪精确）。
- 为 9 个旧节点补齐证据头字段；全部 53 节点现具备统一六项头字段。
- 新增 `knowledge/INDEX.md`：程序化生成的全量索引（含验证状态分布与研究队列）。
- **证据纪律不变**：26 partially_validated / 22 memory_based / 5 engineering_validated；
  无一虚标 VALIDATED；两条"学界常识但无证据包"的节点（生成加工、情绪唤醒）被显式降级。
- 新增真机 Safari 验证脚本 `evals/harness/safari_real.cjs`（WebDriver 直连，待用户授权后一键执行）。

## [0.9.0] — 2026-09-11

补齐最后两项可执行缺口：**§41 数据压力测试** 与 **§56 现场适应剧本**。

**§41 数据压力测试（先测后修）**
- 新增 `evals/data_stress/`（6 类压力：20 分类长中文机构名、缺失值 null、正负混合、**多单位双轴**、小数百分比、极值跨度 1:145000）+ `verify_data_stress.cjs`。
- 由压力测试驱动的 `charts.js` 能力补齐：
  - **双轴（secondary 系列）**：任一系列声明 `secondary: true` 时启用右轴，左右轴各自带单位；
  - **柱线组合**：次轴（不同量纲）自动渲染为折线叠加，避免「柱比柱」造成量纲误读；
  - **缺失值**：`connectNulls: false`，null 断线不补零；
  - **长标签**：分类轴标签限宽 + truncate，极值跨度下小值不消失；
  - 暴露 `WPCharts.toOption(cfg)` 供契约测试直接调用。
- 结果：**8/8 断言通过**（含 20 分类、双轴单位、null 保留、面板级无横向溢出、0 控制台错误）。

**§56 现场适应剧本**
- 新增 `evals/harness/live_scenarios.cjs`：以「真实现场会发生什么」为单位驱动同一套 Deck——
  ①时间不够 → 跳段直达决策页并回退（状态保持）；②被问证据 → 深潜附录 → Esc 返回（揭示进度恢复）；
  ③被问技术 → 深潜架构；④被质疑合规 → 分支异议；⑤现场用静帧（M）直出再恢复。
- 结果：**5/5 剧本通过**（含返回提示上下文化、reveal 记忆恢复）。

## [0.8.0] — 2026-09-11

完成补丁 §21 对 knowledge / workflows / presenter 的写回，闭环「研究→运行时→评审」链路。

**Presenter 双向控制（§34/§23 遗留项闭环）**
- `runtime/presenter/presenter-view.js` 新增「控制主画面」区：◀ 回退 / 推进 ▶ / 总览 / 静帧 / 回到首页，直接驱动主窗口引擎。
- 讲者台从「只显示」升级为「可操作的控制台」；`CAP-PRESENTER` 的遗留缺口（主→台单向）已闭合。
- 实测：讲者台点击推进/回退/总览/回首页，主画面的 Scene 与揭示步正确变化，0 控制台错误。

**knowledge/ 写回**
- 新增 `knowledge/scene_examples.yaml`：**25 条机制 → 知识节点 → 证据包 → 生产组件 → 渲染规则 ID** 的映射索引，使研究不再停留在知识库（§20 的节点侧写回）。
- `knowledge/research_log.md` 新增 2026-09-10 条目：记录由运行时实测反推的三条研究确认（一致性→装饰禁令、冗余→三层分流、图表必带口径），并把「空间临近域补全文」「叙事的商业情境效应量」等列入研究队列。

**workflows/ 写回**
- 新增 `workflows/README.md`：九个工作流的管线顺序、强制闸门（validate_ir / render_ir / build_corpus / run_evals / regression）与硬约束。
- `build_presentation_ir.md`：补 Renderer 扩展字段说明与「机制对照自检清单」。
- `review_presentation.md`：补自动化门禁（先脚本后人工）、包围盒溢出判定、三档分辨率、双引擎矩阵与「先修再评」原则。

## [0.7.0] — 2026-09-10

补齐强制执行补丁的衍生育料与机制对照：**§20 机制正反例 25 条**、**§54 同内容多受众**、**§55 同内容多时长**。

**§20 机制正反例画廊**
- `evals/mechanisms/mechanisms.json`（数据源）+ `scripts/render_mechanisms.py`（渲染器）→ `evals/mechanisms/index.html`。
- **25 条机制**，每条给出「正例 / 反例」对照 + 原则 + **导出的渲染规则** + 证据依据；覆盖一致性、线索、冗余、空间/时间临近、分段、通道、预训练、个性化、负荷曲线、工作记忆、注意线索、Assertion-Evidence、标题系统、信息密度、叙事、ELM、图形选择、图表诚信、语义动效、核心路径、讲者-屏幕分工，以及三条反模式。
- 正/反例片段使用**生产组件类名**，画廊本身即是组件契约的回归夹具。

**§54 同内容多受众（benchmarks/derived/）**
- `01-audience-ceo`（6 幕）：结论先行、极低密度、不出现实现细节；
- `02-audience-technical`（6 幕）：聚焦集成 / 数据 / 接口 / 权限 / 运维，省略财务叙事；
- `03-audience-frontline`（5 幕）：只说「对你有什么变化」，不出现架构与预算术语。
- 三者与 corpus/01 同源，**结构、密度、术语层次与判断标准均实际不同**（非同一套内容换措辞）。

**§55 同内容多时长**
- `04-duration-5min`（5 幕）：仅保留决策链（结论 / 一条依据 / 一条风险 / 三项请求）；
- `05-duration-15min`（10 幕）：保留完整论证链，把治理、里程碑、合规与财务明细移入附录；
- 对应 corpus/01（18 幕，≈20 分钟），构成 5 / 15 / 20 三个时长版本，结论完全一致而**论证深度与场景分配不同**。

**构建与验证**
- `scripts/build_corpus.py` 扩展为同时扫描 `benchmarks/corpus` 与 `benchmarks/derived`；**15/15 全部通过校验与渲染**。
- `evals/harness/run_evals.cjs` 扩展为扫描两个语料根目录。

## [0.6.0] — 2026-09-10

完成《强制执行补丁》剩余条款：**基准语料 10/10、技术取舍全部落地、Evals 与视觉回归实际执行**。

**基准语料 10/10（§7/§8/§53）**
- 新增 8 套真实中文 Deck：`03-tech-data-platform`（技术架构）、`04-data-quarterly-review`（数据分析）、`05-training-safety-induction`（教育培训）、`06-sales-content-service`（销售路演）、`07-research-industry-briefing`（研究报告）、`08-project-progress-review`（项目汇报）、`09-strategy-three-year-plan`（战略规划）、`10-narrative-bookstore`（复杂叙事）。
- **批量实测（Chromium，`verify_corpus.cjs`）：10 套 / 112 幕 / 幕内溢出 0 / 控制台错误 0。**
- `scripts/build_corpus.py`：一键校验 + 渲染全部语料。

**技术取舍全部落地（§4/§12/§13/§17/§18/§21）**
- 新增 `experimental/` 四个可运行原型：`motion-compare`（三场景 × CSS/WAAPI/ViewTransition/GSAP）、`threejs-cases`（正反用例）、`mermaid-vs-svg`（默认渲染 vs 定制 SVG）、`d3-narrative`（联合轨迹定制叙事）。
- 新增 `audits/TECH_DECISIONS.md`：**ECharts ACCEPT（生产）** / **GSAP REJECT**（71KB + 许可非 OSI，WAAPI 已覆盖） / **Three.js REJECT**（594KB，44fps，无必需 3D 场景） / **Mermaid DOWNGRADE**（3.26MB，降级为草稿工具） / **D3 CONDITIONAL**（按需，须带静态 fallback） / **View Transition HOLD** / **Live Data HOLD**。
- `MOTION_CAPABILITY_MATRIX.md` 更新为实测数据；`CAPABILITY_VERIFICATION.md` 状态改为 accepted/rejected/downgraded/conditional/hold。

**Evals 与视觉回归实际执行（§22/§23）**
- `evals/harness/run_evals.cjs`：每套 Deck 跑 **IR / Visual / Runtime / Browser（Chromium+WebKit 双引擎）/ Offline / Performance / 控制台洁净** 七维门禁，输出 `evals_report.json`。
- `evals/harness/regression.cjs`：逐幕截图 + 8×8 感知哈希（aHash）基线，支持 `--update` 重建与阈值比对，防止「修一个组件破坏十套 Deck」。

**修复**
- 图表多系列缺图例导致颜色无法对应（`charts.js` 增加 legend 与栅格避让）。

## [0.5.0] — 2026-09-10

依《研究补全、Runtime 验证与 Skill 强制升级补丁》执行"真正实现并写回 Skill"（不再以 Audit 交付）：

**新增：IR → HTML 渲染器（消除 Demo-only 架构，§5/§6/§14/§52）**
- `scripts/render_ir.py`：消费 `presentation.ir.json`，按 `visual_semantics` / `blocks[].type` / `motion_intent` 装配语义组件，产出**自包含 HTML**；Stage / Reader / Print 由同一份 IR 同源产出。兼容 canonical IR 字段（`content.stage` / `reader_content` / `evidence` / 深潜 `deep_dive`），向后兼容既有 Demo。
- `runtime/components/components.css`：语义组件库（cards / numbers / steps / compare / timeline / quote / matrix / risks / arch / actions / evidence / chart），全部走 design tokens + cqi 等比缩放。
- Schema 扩展：`schemas/scene.yaml` 增加 `blocks[]` / `nav_links{}` / kicker / topic / claim / source；`validate_ir.py` 同步校验 block.type、chart.kind、nav_links 目标存在性，并加入 `branch` 角色（旧 Demo 与新 Deck 均 0 error 0 warning）。

**运行时真实升级**
- **Presentation Graph 落地**（§6/§9/§33）：`scene-engine.branchTo()` 与 `graph()`；分支与深潜共用返回栈，Esc 回主线并恢复揭示进度；`data-skip` 跳段；返回提示对 `dive` 与 `branch` 两种进入方式生效。
- **修复动效致命缺陷**（§10）：语义动效注册后被 `pause + fill:both` 钉在首帧（opacity:0）却无时机播放，导致凡带 `data-motion-intent` 的内容**永久不可见**。现改为：reveal 步到达即播放（`onReveal` 钩子）、`data-motion="auto"` 入场即播、Reader/Print 全展开落终态。Demo 中的管线连接线同样被此修复救回。
- **可视化整合**（§11）：本地化 ECharts（`runtime/vendor/echarts.min.js`，离线无 CDN）+ `runtime/visualization/charts.js`（bar/hbar/line/area/pie/scatter/ranking，Stage/Reader/Print/reduced-motion 四态、随幕宽 resize）。
- **打印重构**（§15）：`@page` 改为**设计画布 1920×1080（16:9）**，Stage 与 Print 同源同尺寸 —— 舞台不溢出则打印不溢出，**每幕恰好一页**；图表保留印刷色彩（`print-color-adjust`），导航链接与控件不进入留档稿。

**新增真实 Deck 与验证**
- `benchmarks/corpus/01-executive-portal-decision/`：18 幕自适应决策汇报（核心路径 14 幕 + 技术/财务双深潜 + 合规异议分支 + 证据附录），含 2 张真实图表。
- 验证（Chrome/Chromium）：自适应导航端到端 **10/10 通过**（core path / 分支 / 深潜 / Esc 返回 / 揭示恢复 / 搜索 / 返回提示上下文）；**1920×1080 全 18 幕零溢出**；打印 PDF **18 页 16:9**；**离线 file:// 零外部请求、图表与导航正常**；0 控制台错误。
- harness 扩充：`adaptive_test.cjs`（自适应导航）、`deck_shots.cjs`（逐幕截图 + 包围盒溢出检测）。

## [0.4.0] — 2026-09-10

P1 运行时证据链补齐（Track B）——首次引入可复现的跨引擎验证 harness，用实测数据替换此前的 in-session 记录：

- **跨引擎实测**：Chromium 153 + **WebKit 26.6**（Playwright 内置，与 Safari 26.5.2 同代内核）双引擎各 **22/22 项通过、0 控制台错误、零资源失败**。补丁 §30 的 Firefox 因本机沙箱阻断内容进程（`launch()` 成功但 `newPage()` 挂起）**未验证，如实标记**；真机 Safari 26.5.2 需在「Safari → 设置 → 开发者」勾选「允许远程自动化」后方可补测。
- **验证 harness 入库**（dev-only，运行时仍零依赖）：`evals/harness/runtime_verify.cjs`（§32 初始态 · §34 键盘/搜索/总览 · §49 Reader · §39 静帧 · §23 讲者台 · §25 深潜返回状态恢复 · §50 打印 · §31 性能 · §30/§33 三档分辨率零溢出 · reduced-motion）+ `content_stress.cjs`（§39/§40 中文标题压力 + §27 Reader 清单）。全部可一键复现、可回归。
- **能力升级**（§13 状态阶梯）：现场搜索（命中/跳转）、讲者台（弹窗 + 计时走动 + 笔记）、Reader 完整性 由 `prototyped` 升 **`tested`**；跨浏览器证据由 `chromium-headless` 扩为 `chromium + webkit`。
- **性能预算初值（§31）**：FCP Chromium **136ms** / WebKit **264ms**；转场 **60 FPS**；JS 堆 **9.54MB**；主文档 32KB（8 资源）；三档分辨率 document/scene 双零溢出。
- **中文压力（§39/§40）**：6 类标题（短 / 26 字 / 31 字 / 机构全称 / 中英混排 / 中文数字标点）× 2 档分辨率 × 2 引擎 = **12/12 不溢出**（渲染器以 wrap/re-layout 处理，非溢出）；移动端 390×844 Reader 零横向溢出、正文 16px。
- **测试发现（登记待修，未擅改）**：Reader 模式下 `.wp-hints` 按键提示未隐藏，与正文重叠。

## [0.3.0] — 2026-09-08

应用《真实研究与技术验证强制补丁》，建立双轨证据制：

- **诚实降级**：37 条来源与 14 个知识节点全部重标 MEMORY_BASED（原 full_text 标记构成虚标，已纠正）；GSAP/ECharts/D3/Mermaid/Three.js/View Transition/Live Data 降级为 documentation_only，移入 `experimental/` 孵化区，未实测前禁止进入 Renderer Planner
- **五份审计基线**（`audits/`）：RESEARCH_AUDIT（含 §11 覆盖表）、RUNTIME_AUDIT、CORPUS_COVERAGE（真实中文基准语料 0/10）、CAPABILITY_VERIFICATION（§48 全字段登记）、GAP_REPORT（P0–P4 补齐计划），另立 MOTION_CAPABILITY_MATRIX 与 TRACEABILITY_MATRIX
- **当日真实验证**：打印到 PDF 10 页 16:9 实测；1366×768 / 1920×1080 投影截图无溢出；`--force-prefers-reduced-motion` 内容完整；全工程零外部 URL（离线门禁通过）；控制台 0 错误；runtime 64 KB / demo 56 KB
- **Schema 升级**：source.yaml 增加获取阶梯（PLANNED→…→DISTILLED）+ abstract_only 禁推断条款 + meta 分析提取模板 + practitioner_framework 分层；capability.yaml 落地 §48 运行时能力登记；knowledge_node.yaml 增加 rule_status 六级与 verification 字段
- **SKILL.md** 新增「真实证据双轨制」强制条款；项目状态更正为「工程管线可用、研究证据待补」，不宣称 COMPLETE

## [0.2.2] — 2026-09-07

- 键位卡生成器沉淀为 Skill 标准工具 `scripts/gen_keys_card.py`：零依赖纯标准库，默认输出与运行时 `?` 帮助一致的 10 键三组卡片；支持 `--keys` 自定义键位 JSON（`--print-keys` 导出默认版）、`--title/--brand/--site/--footer` 文案定制、`--bg/--ink/--ink2/--ink3/--cap/--cap-line/--stops` 全套主题参数（亮/暗主题均已截图验证）
- SKILL.md 交付环节接入：生成产物时可用该脚本一键产出配套键位卡；目录导航 scripts/ 说明同步更新

## [0.2.1] — 2026-09-07

- 新增键位速查视觉卡片 `assets/keys-card.svg`（纸上光谱风格，1200×630），嵌入 README「键位速查」一节：推进 / 视图 / 辅助三组十键，与运行时 `?` 帮助面板完全一致
- README 快速开始中的快捷键注释补齐 O 总览 / M 静帧 / ? 帮助

## [0.2.0] — 2026-09-07

展示层七项升级（全部落在 runtime/ 运行时层，所有产物自动继承）：

- **O 键总览模式**：全幕缩略平铺（等比缩放保真、点击跳转、当前幕高亮、Esc 退出），补传统 PPT 的页面预览列表能力
- **页码与锚点指示**：左下角常驻 `当前页 / 总页数 · 锚点主题`，演讲者与观众都能预期进度
- **隐晦键位提示**：右下角常驻 `→ 推进 · O 总览 · ? 快捷键`，6 秒无操作自动淡化；`?` 打开完整快捷键帮助面板
- **M 键静帧开关**：一键关闭全部动效，整幕直出（赶时间/录屏场景），sessionStorage 持久化
- **幕状态保持**：非线性深潜切出后再返回，原幕保持切出前的揭示进度，不再回到初始态
- **分支返回提示上下文化**：`Esc 返回主线` 等跳回提示仅在深潜进入时显示，线性浏览到该幕不出现
- **Speaker Notes 脚本化**：SKILL.md 明确讲稿必须是三层内容中最详细的可照读脚本（含动作/停顿/语气提示）；Demo 8 幕讲稿全量重写为照读级，讲者台同步显示揭示进度与主题锚点

质量：无头浏览器 18 项功能回归测试全部通过；IR 校验 0 error 0 warning；IR 与 HTML 讲稿一致

## [0.1.5] — 2026-09-07

- 启用中文品牌「文质 Wenzhi」：取《论语·雍也》"质胜文则野，文胜质则史。文质彬彬，然后君子"——质 = 内容/论证/策略，文 = 渲染/视觉/呈现
- 宣传页：导航 logo、页面标题、hero 新增《论语》原典句、作者区文案、页脚署名全量品牌化
- README 顶部改为品牌双标题 + 品牌释义；Demo 开场 kicker 与结尾签名行加入品牌

## [0.1.4] — 2026-09-07

- GitHub Pages 源从 /docs 切换到仓库根目录：宣传页移至根 index.html，Demo 现可在 https://wenzhi.mizzlelover.xyz/examples/demo/ 直接在线运行
- 宣传页「查看可运行 Demo」按钮由 GitHub 目录改链至在线 Demo 页面
- README 更新站点结构与在线 Demo 入口

## [0.1.3] — 2026-09-07

- 视觉改为原创「纸上光谱 · Spectral Paper」设计（非临摹任何官网）：暖纸底 #faf8f4 + 暖墨 #17150f + 蓝→紫→珊瑚光谱渐变（仅用于关键词、闸门节点、进度条等焦点）+ 低饱和漂移光晕 + SVG 噪点纸纹
- 宣传页新增学者衬线斜体跑马灯、幽灵章节编号、渐变标题文字动画、卡片光谱下划线扫边；进入动效带 1.8s 兜底，永不门控内容
- Demo 同步换肤：光谱高亮、闸门渐变文字、焦点大数字渐变、光谱进度条；全 8 幕 + 宣传页整页截图回归通过

## [0.1.2] — 2026-09-07

- 视觉全面改用 Kimi K3 亮色编辑美学（暖白纸感 #faf9f7 + 墨色排版 + 发丝级边框 + 白卡片浅阴影 + 单一克制强调色 #2b47e0），替换原深色星空/极光/玻璃拟态方案
- 宣传页（docs/）与可运行 Demo（examples/demo/）同步换新主题；修复两处 flex li 导致的内联加粗断行错位
- 全量截图回归：Demo 8 幕 + 宣传页整页逐段检查通过

## [0.1.1] — 2026-09-07

- 作者 IP 更正为「谁是专家」（README / LICENSE / FINAL_REPORT / 宣传页全量更新）
- 宣传页微信物料按 1710×624 原始比例显示，修复拉伸变形
- Demo 全面重做：选题改为本系统自我推介（"本演示即系统输出物"），视觉升级为 aurora 深色极光主题；修复 expand 交互的目标接线；IR 校验 0 error，全 8 幕截图验证

## [0.1.0] — 2026-09-07

首个公开版本。

- Skill 核心：SKILL.md 路由器（六步工作流 + 铁律 + 对抗性处理）
- 知识层：14 个机制/原则节点（认知/传播/演示/可视化/动效/交互）、3 个反模式、6 条经验假设登记、35 条 Seed Corpus 来源（A–E 证据分级）
- Schemas：source / knowledge_node / practitioner_hypothesis / presentation / scene / presentation_ir / capability
- Workflows：9 个标准工作流（分析→策略→论证→Scene→IR→渲染→优化→现场调整→评审）
- Runtime：零依赖 JS 实现（Scene 引擎/导航/动效控制/交互/演讲者台/Reader/Print），功能测试通过
- 组件库：6 个语义组件（HeroStatement/AssertionEvidence/Comparison/BigNumber/Decision/Timeline）
- 主题：minimal（内建）/ corporate / technology / government / editorial
- Evals：18 维 rubric、100 案例登记、10 条对抗测试
- 工具：scripts/validate_ir.py（IR 校验器）
- 示例：examples/demo（高管决策汇报，IR + HTML，校验 0 error，浏览器实测通过）
- Harness 适配：Claude Code / Codex / OpenCode / Kimi Code
