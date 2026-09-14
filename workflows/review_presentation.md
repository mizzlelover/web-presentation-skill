# Workflow: Review Presentation — 评审与评测

## 自动化门禁（先跑脚本，再人工评审）

```bash
python3 scripts/validate_ir.py <ir.json>                      # IR 闸门：0 error
python3 scripts/build_corpus.py                               # 批量校验 + 渲染
NODE_PATH=<pw> node evals/harness/run_evals.cjs               # 七维门禁（IR/Visual/Runtime/Browser/Offline/Performance/Console）
NODE_PATH=<pw> node evals/harness/regression.cjs              # 视觉回归（与 evals/baselines 比对）
NODE_PATH=<pw> node evals/harness/regression.cjs --update      # 有意变更后重建基线
```

`run_evals.cjs` 的门禁阈值：FCP ≤ 900ms、转场 FPS ≥ 45、资源数 ≤ 40、幕内溢出 0、控制台错误 0、离线外部请求 0。
任一项失败即**先修再评**，不得以「已记录」代替修复（补丁 §17/§18/§19）。

## 输入
渲染完成的 Deck（由 `scripts/render_ir.py` 产出）+ 对应 IR。

## 评审轮次
### 第 1 轮：策略层
- 情境判定是否仍成立？受众模型有没有漂移？
- Central Thesis 是否被每幕支撑？六查复跑。

### 第 2 轮：认知层
- 负荷曲线复画；连续 HIGH 检查。
- 每幕 Cognitive Job 是否单一且清晰？标题类型与 job 匹配？
- 对照 `evals/mechanisms/`：本 Deck 是否触犯任一条反例？（尤其「装饰优先」「技术滥用」「普适规则谬误」）

### 第 3 轮：视觉 QA（§69）
overflow / contrast（≥4.5:1）/ font size / alignment / spacing / cropping / chart labels / overlap / safe area / responsive。
**溢出判定须用子元素包围盒 vs 幕框**（`scrollHeight` 对非滚动容器不可靠），并覆盖 1920×1080 / 1366×768 / 1600×1000 三档。

### 第 4 轮：Runtime QA（§70）
broken links / missing assets / JS errors（控制台零报错）/ animation failures / branch navigation 全路径（含返回与揭示恢复）/ presenter mode / keyboard navigation 全程 / offline load（断网重开）/ print mode（打印预览逐页，**幕数应为页数**）。

### 第 5 轮：评测打分
按 `evals/rubric.yaml` 18 维打分（1–5），任一维 ≤2 必须修复后复评。
总分与雷达图写入交付说明。

### 第 6 轮：浏览器矩阵
**以 Chromium / Blink（Chrome）为主要验证环境**，WebKit 引擎补充回归（`run_evals.cjs` 已双引擎执行）；Firefox 与真机 Safari 受环境限制时须显式标注未验证，不得虚标（§30/§72）。

## 输出
- 评审报告（各轮结果 + 修复记录 + 18 维评分）
- 视觉回归基线：`evals/baselines/screens.json`（逐幕 aHash，`regression.cjs --update` 生成）

## 交付门槛
- `validate_ir.py` 0 error；`run_evals.cjs` 全维度 PASS。
- Runtime QA 全绿；视觉 QA 无 P0；18 维无 ≤2；视觉回归无超阈值差异。
