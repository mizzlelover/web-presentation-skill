# Workflow: Review Presentation — 评审与评测

## 输入
渲染完成的 dist/ + IR。

## 评审轮次
### 第 1 轮：策略层
- 情境判定是否仍成立？受众模型有没有漂移？
- Central Thesis 是否被每幕支撑？六查复跑。

### 第 2 轮：认知层
- 负荷曲线复画；连续 HIGH 检查。
- 每幕 Cognitive Job 是否单一且清晰？标题类型与 job 匹配？

### 第 3 轮：视觉 QA（§69）
overflow / contrast（≥4.5:1）/ font size / alignment / spacing / cropping / chart labels / overlap / safe area / responsive。

### 第 4 轮：Runtime QA（§70）
broken links / missing assets / JS errors（控制台零报错）/ animation failures / branch navigation 全路径 / presenter mode / keyboard navigation 全程 / offline load（断网重开）/ print mode（打印预览逐页）。

### 第 5 轮：评测打分
按 `evals/rubric.yaml` 18 维打分（1–5），任一维 ≤2 必须修复后复评。
总分与雷达图写入交付说明。

### 第 6 轮：浏览器矩阵
至少 Chromium + Safari；视情况 Firefox（§72）。

## 输出
- 评审报告（各轮结果 + 修复记录 + 18 维评分）
- 截图回归基线存入 `evals/visual/`（核心 Scene 截图，供后续修改对比）

## 交付门槛
- Runtime QA 全绿；视觉 QA 无 P0；18 维无 ≤2。
