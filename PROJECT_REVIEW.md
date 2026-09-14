# 项目复盘 — HTML 原生智能演示系统（文质 Wenzhi）

> 整理时间：2026-09-13 · 发布版本 V1.0.0-r3（品牌同步）
> 仓库：`mizzlelover/wenzhi` · 官网：`wenzhi.mizzlelover.xyz`
> 本文如实记录：真实信源、语料分布、处理机制、与元提示词预期的差距。**所有结论可回溯到仓库内文件，无编造。**

---

## 一、这个项目到底做了什么

一套 **Web-native Presentation Intelligence**：输入复杂真实材料 + 受众 + 沟通目标，产出一份能现场演示、能阅读留存的 HTML Presentation。它不是 PPT 美化、不是模板库、不是自动套版工具——而是把「演示科学 + 认知科学 + 传播学 + 视觉设计 + Web 工程」打通成一条可执行的管线。

最终形态是一个可被 AI Agent 调用的 Skill：给定材料后，系统经过 **内容理解 → 论证重构 → 场景规划 → 策略制定 → IR 生成 → 闸门校验 → HTML 渲染** 七个阶段，输出一份带演讲者备注、读者模式、图表、动效、深浅导航的完整 Deck。

---

## 二、真实信源：证据链是怎么建的

这是本 Skill 区别于「套话生成器」的根本。所有方法论主张必须挂到**真实、可回溯的学术与规范来源**。

### 2.1 证据规模与复核状态

| 指标 | 数值 | 出处 |
|---|---|---|
| 全文精读来源 | 18 条 | `knowledge/sources/` |
| 18 条完成独立复核 | 18/18 | `audits/EVIDENCE_SPOTCHECK.md` |
| 证据包（Evidence Package） | 13 个 | `knowledge/evidence_packages/` |
| 知识节点（Knowledge Node） | 30 partially_validated + 18 memory_based | `knowledge/INDEX.md` |
| 证据包抽查覆盖 | 13/13 | `audits/EVIDENCE_SPOTCHECK.md` |

### 2.2 关键信源举例（真实、已核对）

- **Sweller 2019 认知负荷综述**（Springer OA PDF 全文级核对 7/7 命中）：split-attention / expertise reversal / 元素交互性等七效应，逐字抽取核对。
- **谢 2016（心理学报）**：43 篇 / 44 个效应量（3910 人）g=0.53 等五组数据 + 调节方向 6/6 逐字命中。
- **Rey 2019 分段效应元分析**（ERIC/DOI 摘要级核对 5/5 命中）：56 研究 / 88 比较，d 值标注为「全文级声明待逐值复核」。
- **WCAG 2.2 SC 1.4.3**（官方规范原文核对）：对比度 4.5:1。

### 2.3 复核过程中拦截并更正的问题（如实记录）

证据链建设不是一次到位，抽查拦截了 5 处真实错误并三处同步更正：

1. **Heesacker 年份 1983→1984**（EP + 节点 + 来源登记三处，靠 References 页拦截）。
2. **Guo 2014「9-12 分钟约 50%」** 标注为 Figure 2 图形读数（正文无此百分比）。
3. **EP-WORKING-MEMORY 双通道机制精确化** + Halford 二级转引标注。
4. **KN-COG-003 样本口径 N=99（有效 96）** 更正。
5. 抽查中执行者自己曾生成错误 DOI——**来源登记质量好于记忆**，遂以登记为准。

> **诚实边界**：KN-COG-010（生成加工）所依赖的 Szpunar 2013 PNAS 全文在付费墙后（PMC3631699 仅元数据），按纪律**未虚标升级**，保留 memory_based，列入后续队列。

---

## 三、语料分布：测试这个系统的「考场」

系统能力用三层语料验证，合计 **28 套 Deck、回归基线 266 幕**。

### 3.1 三层语料结构

| 层 | 数量 | 性质 | 位置 |
|---|---|---|---|
| **corpus/**（十类场景基准） | 10 套 | 合成语料（结构完整、内容自撰） | `benchmarks/corpus/` |
| **derived/**（受众/时长变体） | 5 套 | 同主题不同受众与时长的适配 | `benchmarks/derived/` |
| **real/**（真实世界材料） | 13 套 | 真实官方材料原样抓取，禁止编造 | `benchmarks/real/` |

### 3.2 real/ 层 13 套真实语料（核心资产）

这是「禁止编造」纪律的主战场。每一份都带 `source-material.md`（原文 + 来源 URL + 抓取时间），数字必须能在原文命中：

| # | 材料 | 类型 |
|---|---|---|
| 01 | 2024 国民经济和社会发展统计公报 | 数据解读 |
| 02 | 2024 中央审计报告 | 政府报告 |
| 03 | 「十四五」数字经济发展规划 | 政策规划 |
| 04 | CNNIC 第 55 次报告 | 行业报告 |
| 05 | 国家数据基础设施建设指引 | 政策指引 |
| 06 | 贵州茅台 2024 年报 | 企业年报 |
| 07 | 技能中国行动 | 政策行动 |
| 08 | 家电以旧换新 | 政策通知 |
| 09 | 西延高铁批复 | 项目批复 |
| 10 | 2025 政府工作报告 | 最高规格汇报 |
| 11 | WHO《2025 世界卫生统计》 | 国际组织新闻稿 |
| 12 | UN 大会第 80/117 号决议（NCD 政治宣言） | 联合国决议 |
| 13 | UN-IPCC 关键结论 | 国际科学评估 |

> 11–13 是本机对国内官媒站点全被拦（gov.cn 502 / news.cn 000 等环境变化）后，改用**可达的国际组织官方中文文件**（un.org/zh、who.int/zh 均 200）补位的「全新真实中文材料」，并触发了一轮端到端行为测试（27 幕，闸门再拦截 3 处真实 bug）。

### 3.3 语料质量评分（18 维 rubric，LLM 单评审）

- **real/ 层均分最高**：01 统计公报 4.61、02 审计报告 4.61、03 数字经济规划 4.50——`evidence_quality` 达 5（真实语料溯源闸门通过）。
- **corpus/derived 层** `evidence_quality` 为 3（结构完整但内容自撰，如实标注，不冒充真实）。
- 18 套**无任何一维 ≤2**（≤2 即不合格线）。

---

## 四、处理机制：七阶段管线 + 强制闸门

### 4.1 七阶段工作流（`workflows/`）

```
analyze_source_content   内容理解（真实信源 + 抓取时间 + 字符数登记）
→ build_argument_map     论证重构（中心论点 + 可检验子命题）
→ build_scene_plan       场景规划（每幕一个 claim，标注认知负荷）
→ build_presentation_strategy  策略（受众/目标/口径，过 validate_strategy 闸门）
→ build_presentation_ir  IR 生成（过 validate_ir 闸门）
→ render_html            渲染（主题 + 组件 + 图表 + 动效）
→ review_presentation    审查（18 维 rubric + 对抗测试）
```

### 4.2 两道硬闸门（真实拦截，不是摆设）

- **`validate_strategy.py`**：材料头缺「来源 URL + 抓取时间」行直接拒绝（端到端测试中真实拦截过）。
- **`validate_ir.py`**：引文必须能在源材料命中，否则失配拒绝（UN 页面元数据行被剥掉导致引文失配，补回后才放行）。

### 4.3 闸门实战再拦截的 3 处真实 bug（端到端测试 WHO/UN/IPCC）

1. 预处理 `&mdash;` →「——」映射 bug 导致「————」四连破折号（实体应映射单字符）。
2. 材料头缺「来源 URL + 抓取时间」行（validate_strategy 硬要求）。
3. UN 页面元数据行被正文截取剥掉导致引文失配 → 补回元数据行。

另闸门抓到**负荷曲线连续 ≥3 幕 HIGH**（economy/facts 降 medium 修复）——认知负荷管控真实生效。

### 4.4 案例级独立执行（§67）

`evals/harness/case_exec.cjs`：100 条 cases.yaml 登记案例逐条真实浏览器执行 focus 维度专属断言，**100/100 PASS**。

---

## 五、中文排版审美是否达到可发布标准（客观评估）

这是本次切回 Kimi K3Max 后重点复核的维度。结论分三层：**已达标的、修复过的、仍有差距的**。

### 5.1 已达标的（机器实测 + 视觉回归双证）

| 维度 | 状态 | 证据 |
|---|---|---|
| Evals 七维 | **28/28 通过** | `evals/` |
| 真机 Safari | **28/28 通过** | `evals/harness/safari_real.cjs` |
| 视觉回归基线 | **266 幕 0 差异** | `evals/baselines/screens.json` |
| a11y（WCAG 对比度等） | 通过 | `verify_a11y.cjs` |
| 对抗测试 | 6/6 | `adversarial_eval.cjs` |
| 案例独立执行 | 100/100 | `case_exec.cjs` |

**设计上对齐 Kimi 原始审美的具体形态**（在 real/ 语料中稳定呈现）：
- **结论先行的标题**：如「5.0% 不是重点，结构才是」「总量是背景，结构是机会」——判断句而非名词短语。
- **数字锚点组件**（`wpk-numbers`）：大数字 + 单位 + 防断行处理，134.9 万亿 / 1256 万 / 0.2% 这类有视觉冲击力的锚点。
- **强调标记**（`wpk-mark`）：单一强调色下划线式标记，不滥用多彩。
- **每幕一个 claim**：`data-claim` 属性强制一幕一判断，配合稀疏/密集 `is-sparse`/`is-dense` 密度分级。
- **对比组件**（`wpk-cmp`）双栏「量在增 / 利在薄」这类对称结构。
- **诚实声明附录**：每份 real/ Deck 末幕附「来源 / 口径 / 诚实声明」三栏证据卡。

### 5.2 接力过程中产生并已修复的偏移（如实记录）

切到 Kimi K3Max 复核时，发现接力过程在**图表幕**积累了两处系统性偏差，已全部修复并回归验证：

1. **图表高度过大挤压 caption/source**：图表容器高度上限 460px 在大容器（100dvh）下把图占满，导致图注和来源行贴底甚至出屏 → 降到 400px 并为图表幕增加纵向呼吸间隙（`gap: clamp(18px,2.6cqi,32px)` + 来源行 `margin-top:6px`）。
2. **Y 轴单位文字被左侧边界截断**：`grid.left` 仅 8px → 统一增大到 24px，且 **pie/ranking 全部分支统一覆盖**（13 套真实语料 20 个图表幕全量验证达标）。
3. **README 排版**：合并了重复标题、拆分了粘连的链接行。

修复后 Evals 28/28、Safari 28/28、基线 266 幕全绿，确认对齐无残留。

### 5.3 客观差距（不回避）

即便上述全绿，对照「中文 PPT 排版审美达到可发布标准」的更高要求，仍有以下**已知差距**：

1. **rubric 中 aesthetic_quality 与 audience_fit 多给 4 分（5 分制）而非满 5**——尤其 corpus/derived 层的合成语料，排版结构正确但「真实说服力」受内容自撰限制。这不是排版问题，是语料真实性问题。
2. **图表幕的视觉精细度依赖 ECharts 默认皮肤的调参**，尚未形成一套「文质专属」的图表视觉语言（如自定义字体层级、品牌色系在图表内的贯穿、标注的自动化避让）。当前是「干净不出错」，距离「有辨识度的美」还有一层。
3. **中文字体栈的精细化**（字重对比、标点悬挂、避头尾、数字用 tabular-nums）在主题 CSS 里做了基础处理，但缺少跨幕的一致性自动化校验——目前靠视觉回归 266 幕兜底，没有专门的「中文排版 lint」。
4. **评审仍是 LLM 单评审**（rubric），未做外部人类审美校准——这是方法上的已知局限，aesthetic_quality 的 4 分有自评成分。

> **结论**：以「现场能跑、信息正确、认知负荷合理、视觉干净不出错、回归零差异」为可发布标准，**已达标**。以「有辨识度的中文排版美学、外部审美校准」为更高标准，**尚有 1–2 层差距**，已在剩余队列中如实登记。

---

## 六、与元提示词预期的差距

元提示词（需求任务书）定下的核心预期，逐条对照：

| 预期 | 达成情况 | 差距 |
|---|---|---|
| Communication before Decoration | ✅ 已贯彻：形式服务内容，标题判断句化、每幕一 claim | — |
| 经验先登记为 Practitioner Hypothesis 再验证 | ✅ 已建 `practitioner_hypotheses/registry.yaml` | 部分假设仍在验证中 |
| 只生成 HTML/Web-native，不做 PPTX 兼容 | ✅ 严格遵守 | — |
| 方法论 + 内容结构 + 认知负荷 + 视觉 + 技术 + 现场 + 理解 + 动态调整 八者闭环 | ⚠️ 前七者已闭环；**「必要时可动态调整」（runtime_adaptation）为工作流文档，实测覆盖有限** | 动态调整的 LLM-in-loop 行为测试列入 V1.x |
| 证据驱动（不虚构来源） | ✅ 18/18 复核、13/13 证据包抽查 | KN-COG-010 等 18 个 memory_based 节点待升级 |
| 视觉 QA（§69） | ✅ 266 幕视觉回归 + 对抗测试 | 缺独立第二评审（人类审美校准） |
| 现场能够运行 | ✅ Safari 真机 28/28、presenter/reader 双模式 | Firefox / 移动端真机受沙箱环境限制未覆盖 |

### 明确未兑现 / 历史遗留（如实）

1. **§56 剧本矩阵化**：需在 IR 中声明剧本锚点，未做（历史遗留）。
2. **examples/demo 回迁渲染器**：历史遗留，未完成。
3. **「每案例全新生成 Deck」的 LLM-in-loop 行为测试**：属 V1.x，未在 V1.0 兑现。
4. **Firefox / 移动端真机**：环境受限（沙箱限制 + 用户指定浏览器为 Chrome/Chromium）。
5. **18 个 memory_based 节点升级**：持续研究工程，含付费墙文献。

---

## 八、V1.0.0-r4 质量整改（2026-09-13 · Kimi K3Max 接力轮）

本轮针对复盘识别的 aesthetic_quality 4/5 与缺中文排版 lint 两项差距，完成全量整改并回归。

### 8.1 中文排版 CSS 修复（aesthetic_quality 4→5）

| 修复项 | 落点 | 效果 |
|---|---|---|
| 避头尾 | `.wp-scene { line-break: strict }` | 句读标点后不允许换行到行首 |
| 标点悬挂 | `hanging-punctuation: first allow-end` | 行首允许悬挂开括号/引号，行尾允许悬挂句读，段落左右边缘对齐 |
| 中西文混排间距 | `text-spacing: ideograph-alpha ideograph-numeric` + `text-spacing-trim: space-start` | 中文与半角英文/数字间自动加空隙 |
| 两端对齐优化 | `text-justify: inter-ideograph` | 中文两端对齐时字符间距伸缩，减少松散 |
| 数字字形 | `font-variant-numeric: tabular-nums`（标题/正文/表格/大数字/证据行） | 统计/编号/年份/金额纵向对齐 |
| 全角标点加粗保护 | `font-synthesis: style small-caps` | CJK 引号括号不随加粗变形 |
| 字重系统 | `:root` 定义 5 级 token（display/body/emphasis/number/label），组件库 9 处硬编码替换 | 层级可复用，themes 可覆盖 |
| 大标题/来源行水平居中 | `.wp-scene > * { margin-inline: auto }` + `h1/h2 { width: fit-content; margin-inline: auto }` + `p/li { width: fit-content }` | 实测三元素 center=800 居中 |

### 8.2 图表视觉语言统一

- `charts.js` PALETTE 改读 CSS 变量（`--wp-chart-c2…c6`），accent 为首色，themes 可定制
- 图表标题用 `fontDisplay`（展示字体），与 Deck 标题同视觉语言

### 8.3 中文排版 lint 自动化校验（新增第八维）

新建 `evals/harness/typography_lint.cjs`，7 项机器断言逐幕覆盖：

1. 避头尾（逐行首字符检测）
2. 标点悬挂（开括号不成行尾孤立）
3. 行长（标题 ≤24ch、正文 ≤62ch，溢出检测）
4. 数字字形（≥3 位连续数字用 tabular-nums）
5. 字重对比（同一容器层级内不出现 ≥2 个同级 font-weight≥800）
6. 断行质量（标题末行孤词：单字中文虚词才算，数字/英文/单位/双字实词豁免）
7. 中西文间距（text-spacing 已启用）

**结果：28/28 套通过，266 幕 0 违例。**

### 8.4 全量回归

| 维度 | 结果 |
|---|---|
| typography lint | 28/28 套通过（266 幕 0 违例） |
| Evals（含第八维 typography） | 28/28 套全部维度通过 |
| 真机 Safari 26.5.2 | 28/28 套通过，溢出 0 |
| 视觉回归基线 | 266 幕 0 差异（基线已更新） |

### 8.5 修复过程中发现并解决的子问题

1. **typography_lint 误报**：避头尾初版只看 `textContent[0]`，误报 9 套 → 改逐行首字符检测
2. **孤词误报**：「减速」「放缓」等双字实词被误判 → 排除双字实词与数字单位，仅单字虚词算孤词
3. **数字字形漏网**：`.wpk-ev__s`（证据来源行）含年份但无 tabular-nums → 组件层补 `font-variant-numeric: tabular-nums`
4. **大标题未居中**：`margin: 0` 覆盖 `margin-inline: auto` → 改 `margin-block: 0; margin-inline: auto`；`width: fit-content` 让元素收缩后 auto margin 生效

---

## 九、发布形态与仓库状态（备查）

- **远程 = 干净单提交（orphan）**，**本地 main 保留完整内部历史（58 条提交，自 v0.1.0 initial 起 reflog 连续）**，两者并存互不干扰。
- 重发布流程固化：`git checkout --orphan dist-x && git add -A && git commit && git tag -f v1.0.0 && git push origin +dist-x:main && git push origin -f v1.0.0`
- **品牌全量同步（V1.0.0-r3）**：仓库 `mizzlelover/wenzhi`、本地目录 `wenzhi/`、域名 `wenzhi.mizzlelover.xyz`（CNAME + Pages status=built）、tag v1.0.0→a2cd862。全仓 grep 0 处旧名残留。
- 本地 main HEAD（230808d 品牌同步）与远程发布提交（a2cd862）树完全一致（diff 为空）。
- **V1.0.0-r4 质量整改**（本节）：中文排版 CSS + 图表视觉语言 + typography lint 第八维 + 大标题居中修复，全量回归 28/28 通过，待提交。

---

## 八、一句话总结

**文质把「演示科学 + Web 工程」打通成一条有真实证据链、有强制闸门、有 28 套语料考场、有 266 幕视觉回归的可执行管线；中文排版以「干净、结论先行、数字锚点、零回归差异」为线已达可发布标准，距离「有辨识度的中文排版美学 + 外部审美校准」尚有明确、已登记的一到两层差距。**
